import React, { useState } from 'react';
import { View, Pressable, useColorScheme, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Transaction {
  id: string;
  type: 'Earned' | 'Redeemed';
  points: string;
  amount: string;
  date: string;
  description: string;
}

export default function HouseholdRewards() {
  const isDark = useColorScheme() === 'dark';
  const [balance, setBalance] = useState(250);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'Earned', points: '+84 pts', amount: 'GHS 8.40', date: 'June 28, 2026', description: 'Plastic Collection (8.4 kg)' },
    { id: '2', type: 'Earned', points: '+120 pts', amount: 'GHS 12.00', date: 'June 20, 2026', description: 'Plastic Collection (12.0 kg)' },
    { id: '3', type: 'Redeemed', points: '-100 pts', amount: 'GHS 10.00', date: 'June 15, 2026', description: 'MTN Mobile Money Cashout' },
  ]);

  const handleRedeem = (service: string, pointsCost: number, moneyValue: string) => {
    if (balance < pointsCost) {
      Alert.alert('Insufficient Balance', 'You need more EcoPoints to redeem this reward.');
      return;
    }

    Alert.alert(
      'Confirm Redemption',
      `Are you sure you want to redeem ${pointsCost} EcoPoints for ${moneyValue} ${service}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            setBalance(balance - pointsCost);
            const newTx: Transaction = {
              id: String(transactions.length + 1),
              type: 'Redeemed',
              points: `-${pointsCost} pts`,
              amount: moneyValue,
              date: 'Today',
              description: `${service} Redemption`,
            };
            setTransactions([newTx, ...transactions]);
            Alert.alert('Success', `Successfully redeemed! Your account will be credited via Mobile Money shortly.`);
          }
        }
      ]
    );
  };

  const renderTx = ({ item }: { item: Transaction }) => (
    <View className="flex-row items-center p-3 rounded-2xl gap-3 bg-slate-50 dark:bg-slate-800/50">
      <View className={`w-10 h-10 rounded-xl items-center justify-center ${
        item.type === 'Earned' ? 'bg-emerald-500/10' : 'bg-red-500/10'
      }`}>
        <Ionicons 
          name={item.type === 'Earned' ? 'arrow-down-outline' : 'arrow-up-outline'} 
          size={18} 
          color={item.type === 'Earned' ? '#10B981' : '#EF4444'} 
        />
      </View>
      <View className="flex-1">
        <Animated.Text className="text-sm font-bold text-slate-900 dark:text-white">
          {item.description}
        </Animated.Text>
        <Animated.Text className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
          {item.date}
        </Animated.Text>
      </View>
      <View className="items-end">
        <Animated.Text className={`text-sm font-bold ${
          item.type === 'Earned' ? 'text-emerald-500' : 'text-red-500'
        }`}>
          {item.points}
        </Animated.Text>
        <Animated.Text className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-semibold">
          {item.amount}
        </Animated.Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <View className="flex-1 p-6 gap-6">
        
        {/* Balance Display Card */}
        <Animated.View 
          entering={FadeInDown.duration(600).springify()} 
          className="p-6 rounded-3xl items-center gap-2 bg-emerald-500"
        >
          <Animated.Text className="text-emerald-100 text-sm font-semibold">
            Current Balance
          </Animated.Text>
          <Animated.Text className="text-white text-4xl font-extrabold">
            {balance} pts
          </Animated.Text>
          <View className="flex-row items-center gap-1.5 mt-1">
            <Ionicons name="wallet-outline" size={16} color="rgba(255, 255, 255, 0.8)" />
            <Animated.Text className="text-white text-sm font-semibold">
              Estimated Value: GHS {(balance * 0.1).toFixed(2)}
            </Animated.Text>
          </View>
        </Animated.View>

        {/* Redeem Options */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(600)} 
          className="gap-3"
        >
          <Animated.Text className="text-base font-bold text-slate-900 dark:text-white">
            Redeem Your EcoPoints
          </Animated.Text>
          
          <View className="flex-row gap-3">
            <Pressable 
              onPress={() => handleRedeem('Mobile Money', 100, 'GHS 10.00')}
              className="flex-1 p-4 rounded-2xl items-center gap-2 bg-slate-50 dark:bg-slate-800/50 active:scale-95"
            >
              <Ionicons name="phone-portrait-outline" size={24} color="#10B981" />
              <Animated.Text className="text-xs font-extrabold text-slate-900 dark:text-white">
                MoMo Cashout
              </Animated.Text>
              <Animated.Text className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                100 pts = GHS 10
              </Animated.Text>
            </Pressable>

            <Pressable 
              onPress={() => handleRedeem('Airtime', 50, 'GHS 5.00')}
              className="flex-1 p-4 rounded-2xl items-center gap-2 bg-slate-50 dark:bg-slate-800/50 active:scale-95"
            >
              <Ionicons name="call-outline" size={24} color="#3B82F6" />
              <Animated.Text className="text-xs font-extrabold text-slate-900 dark:text-white">
                Airtime
              </Animated.Text>
              <Animated.Text className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                50 pts = GHS 5
              </Animated.Text>
            </Pressable>

            <Pressable 
              onPress={() => handleRedeem('Electricity Token', 200, 'GHS 20.00')}
              className="flex-1 p-4 rounded-2xl items-center gap-2 bg-slate-50 dark:bg-slate-800/50 active:scale-95"
            >
              <Ionicons name="flash-outline" size={24} color="#F59E0B" />
              <Animated.Text className="text-xs font-extrabold text-slate-900 dark:text-white">
                Electricity
              </Animated.Text>
              <Animated.Text className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                200 pts = GHS 20
              </Animated.Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Transaction History */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600)} 
          className="flex-1 gap-3"
        >
          <Animated.Text className="text-base font-bold text-slate-900 dark:text-white">
            Recent Transactions
          </Animated.Text>
          
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={renderTx}
            contentContainerStyle={{ gap: 12 }}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>

      </View>
    </View>
  );
}
