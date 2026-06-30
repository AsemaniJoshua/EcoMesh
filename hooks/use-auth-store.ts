import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../utils/db';
import { sendLocalNotification } from '../utils/notifications';

export type UserRole = 'household' | 'collector' | 'corporate' | null;

export interface PickupRequest {
  id: string;
  date: string;
  weight: string;
  type: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  location: string;
}

export interface Transaction {
  id: string;
  type: 'Earned' | 'Redeemed';
  points: string;
  amount: string;
  date: string;
  description: string;
}

interface AuthState {
  role: UserRole;
  isLoggedIn: boolean;
  setRole: (role: UserRole) => void;
  logout: () => void;

  // SQLite Synchronized States
  pointsBalance: number;
  totalRecycledKg: number;
  dailyEarnings: number;
  jobsDone: number;
  pickups: PickupRequest[];
  transactions: Transaction[];

  // Profile details
  profileName: string;
  profilePhone: string;
  profileMomo: string;
  profileLocation: string;

  // Database Methods
  refreshFromDb: () => void;
  addPickupRequest: (weight: string, type: string) => void;
  completePickupRequest: (id: string, actualWeight: string) => void;
  redeemPoints: (service: string, pointsCost: number, moneyValue: string) => void;
  updateProfile: (name: string, phone: string, momo: string, location: string) => void;
}

// Helper to query single stat value
const getStatValue = (key: string, defaultValue: string): string => {
  try {
    const row = db.getFirstSync<{ value: string }>('SELECT value FROM stats WHERE key = ?', key);
    return row ? row.value : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

// Helper to update/insert stat value
const setStatValue = (key: string, value: string) => {
  db.runSync('INSERT OR REPLACE INTO stats (key, value) VALUES (?, ?)', key, value);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      role: null,
      isLoggedIn: false,
      setRole: (role) => set({ role, isLoggedIn: role !== null }),
      logout: () => set({ role: null, isLoggedIn: false }),

      // SQLite Initial Mock values (will be loaded on refresh)
      pointsBalance: 250,
      totalRecycledKg: 34.8,
      dailyEarnings: 42.50,
      jobsDone: 4,
      pickups: [],
      transactions: [],
      profileName: '',
      profilePhone: '',
      profileMomo: '',
      profileLocation: '',

      refreshFromDb: () => {
        try {
          const points = parseFloat(getStatValue('pointsBalance', '250'));
          const recycled = parseFloat(getStatValue('totalRecycledKg', '34.8'));
          const earnings = parseFloat(getStatValue('dailyEarnings', '42.50'));
          const jobs = parseInt(getStatValue('jobsDone', '4'), 10);

          const pickupsList = db.getAllSync<any>('SELECT * FROM pickups ORDER BY id DESC');
          const mappedPickups = pickupsList.map((row: any) => ({
            id: String(row.id),
            date: row.date,
            weight: row.weight,
            type: row.type,
            status: row.status,
            location: row.location,
          }));

          const txList = db.getAllSync<any>('SELECT * FROM transactions ORDER BY id DESC');
          const mappedTx = txList.map((row: any) => ({
            id: String(row.id),
            type: row.type,
            points: row.points,
            amount: row.amount,
            date: row.date,
            description: row.description,
          }));

          const activeRole = get().role || 'household';
          const profileRow = db.getFirstSync<any>('SELECT * FROM profiles WHERE role = ?', activeRole);
          const pName = profileRow ? profileRow.name : 
            (activeRole === 'household' ? 'Akosua Mensah' : 
             activeRole === 'collector' ? 'Kofi Mensah' : 'Coca-Cola Ghana Ltd');
          const pPhone = profileRow ? profileRow.phone : 
            (activeRole === 'household' ? '0551234567' : 
             activeRole === 'collector' ? '0249876543' : '0302123456');
          const pMomo = profileRow ? profileRow.momoNumber : 
            (activeRole === 'household' ? '0551234567' : 
             activeRole === 'collector' ? '0249876543' : 'N/A');
          const pLoc = profileRow ? profileRow.location : 
            (activeRole === 'household' ? 'Nima Lane 4, Accra' : 
             activeRole === 'collector' ? 'Accra Central' : 'Tema Industrial Area, Accra');

          set({
            pointsBalance: points,
            totalRecycledKg: recycled,
            dailyEarnings: earnings,
            jobsDone: jobs,
            pickups: mappedPickups,
            transactions: mappedTx,
            profileName: pName,
            profilePhone: pPhone,
            profileMomo: pMomo,
            profileLocation: pLoc,
          });
        } catch (e) {
          console.error('Error refreshing from SQLite DB:', e);
        }
      },

      addPickupRequest: (weight, type) => {
        try {
          db.runSync(
            'INSERT INTO pickups (date, weight, type, status, location) VALUES (?, ?, ?, ?, ?)',
            'Today',
            `${weight} kg`,
            type,
            'Pending',
            'Nima Lane 4, Accra'
          );
          get().refreshFromDb();
          sendLocalNotification(
            'Pickup Scheduled',
            `A collector will pick up your ${type} request shortly.`
          );
        } catch (e) {
          console.error('Error adding pickup to SQLite DB:', e);
        }
      },

      completePickupRequest: (id, actualWeight) => {
        try {
          const numericWeight = parseFloat(actualWeight);
          if (isNaN(numericWeight)) return;

          // 1. Update the pickup status
          db.runSync(
            'UPDATE pickups SET status = ?, weight = ? WHERE id = ?',
            'Completed',
            `${actualWeight} kg`,
            parseInt(id, 10)
          );

          // 2. Fetch current stats
          const currentPoints = parseFloat(getStatValue('pointsBalance', '250'));
          const currentRecycled = parseFloat(getStatValue('totalRecycledKg', '34.8'));
          const currentEarnings = parseFloat(getStatValue('dailyEarnings', '42.50'));
          const currentJobs = parseInt(getStatValue('jobsDone', '4'), 10);

          // Payout Calculation
          const addedPoints = Math.round(numericWeight * 10);
          const addedEarnings = numericWeight * 1.50;

          // 3. Save new stats
          setStatValue('pointsBalance', String(currentPoints + addedPoints));
          setStatValue('totalRecycledKg', String(currentRecycled + numericWeight));
          setStatValue('dailyEarnings', String(currentEarnings + addedEarnings));
          setStatValue('jobsDone', String(currentJobs + 1));

          // 4. Record transaction log for the points ledger
          db.runSync(
            'INSERT INTO transactions (type, points, amount, date, description) VALUES (?, ?, ?, ?, ?)',
            'Earned',
            `+${addedPoints} pts`,
            `GHS ${addedEarnings.toFixed(2)}`,
            'Today',
            `Plastic Collection (${actualWeight} kg)`
          );

          get().refreshFromDb();
          
          // Send notification to the collector
          sendLocalNotification(
            'Payment Disbursed',
            `GHS ${addedEarnings.toFixed(2)} has been successfully sent to your Mobile Money account.`
          );

          // Send notification to the household
          sendLocalNotification(
            'EcoPoints Credited',
            `You earned +${addedPoints} EcoPoints for recycling PET Plastics!`
          );
        } catch (e) {
          console.error('Error completing pickup in SQLite DB:', e);
        }
      },

      redeemPoints: (service, pointsCost, moneyValue) => {
        try {
          const currentPoints = parseFloat(getStatValue('pointsBalance', '250'));
          if (currentPoints < pointsCost) return;

          // 1. Deduct points
          setStatValue('pointsBalance', String(currentPoints - pointsCost));

          // 2. Insert transaction log
          db.runSync(
            'INSERT INTO transactions (type, points, amount, date, description) VALUES (?, ?, ?, ?, ?)',
            'Redeemed',
            `-${pointsCost} pts`,
            moneyValue,
            'Today',
            `${service} Redemption`
          );

          get().refreshFromDb();
        } catch (e) {
          console.error('Error redeeming points in SQLite DB:', e);
        }
      },

      updateProfile: (name, phone, momo, location) => {
        try {
          const activeRole = get().role || 'household';
          db.runSync(
            'INSERT OR REPLACE INTO profiles (role, name, phone, momoNumber, location) VALUES (?, ?, ?, ?, ?)',
            activeRole,
            name,
            phone,
            momo,
            location
          );
          get().refreshFromDb();
          sendLocalNotification(
            'Profile Saved',
            'Your profile details have been successfully updated.'
          );
        } catch (e) {
          console.error('Error updating profile in SQLite DB:', e);
        }
      },
    }),
    {
      name: 'ecomesh-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        role: state.role,
        isLoggedIn: state.isLoggedIn,
      }), // only persist auth session credentials in AsyncStorage; database handles others!
    }
  )
);
