import React, { useEffect } from 'react';
import { View, Pressable, useColorScheme, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useAuthStore } from '@/hooks/use-auth-store';

interface LogItem {
  id: string;
  material: string;
  weight: string;
  date: string;
  verificationKey: string;
  status: 'Verified' | 'Auditing';
}

export default function CorporateDashboard() {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { profileName, totalRecycledKg, pickups, refreshFromDb } = useAuthStore();

  useEffect(() => {
    refreshFromDb();
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/' as any);
  };

  const completedPickups = pickups.filter(p => p.status === 'Completed');

  const logs: LogItem[] = completedPickups.length > 0 ? completedPickups.map((p) => ({
    id: p.id,
    material: p.type,
    weight: p.weight,
    date: p.date,
    verificationKey: `EPR-GH-00${p.id}`,
    status: 'Verified'
  })) : [
    { id: '1', material: 'Bulk PET Clean Flakes', weight: '42.5 kg', date: 'June 29, 2026', verificationKey: 'EPR-GH-7892-A2', status: 'Verified' },
    { id: '2', material: 'HDPE Raw Pellets', weight: '25.0 kg', date: 'June 25, 2026', verificationKey: 'EPR-GH-4829-C9', status: 'Verified' },
    { id: '3', material: 'Mixed Flakes Raw', weight: '18.0 kg', date: 'June 18, 2026', verificationKey: 'EPR-GH-1029-B1', status: 'Auditing' },
  ];

  const MetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    colorClass, 
    iconColor 
  }: { 
    title: string, 
    value: string, 
    subtitle: string, 
    icon: keyof typeof Ionicons.glyphMap, 
    colorClass: string, 
    iconColor: string 
  }) => (
    <View className="flex-1 p-4 rounded-3xl gap-3 bg-slate-50 dark:bg-slate-800/50">
      <View className="flex-row justify-between items-center">
        <Animated.Text className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
          {title}
        </Animated.Text>
        <View className={`w-8 h-8 rounded-lg items-center justify-center ${colorClass}`}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
      </View>
      <Animated.Text className="text-lg font-extrabold text-slate-900 dark:text-white">
        {value}
      </Animated.Text>
      <Animated.Text className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
        {subtitle}
      </Animated.Text>
    </View>
  );

  const renderLog = ({ item }: { item: LogItem }) => (
    <View className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
      <View className="gap-1.5">
        <View className="flex-row justify-between items-center">
          <Animated.Text className="text-sm font-bold text-slate-900 dark:text-white">
            {item.material}
          </Animated.Text>
          <View className={`px-2 py-0.5 rounded-md ${
            item.status === 'Verified' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
          }`}>
            <Animated.Text className={`text-[9px] font-bold ${
              item.status === 'Verified' ? 'text-emerald-500' : 'text-amber-500'
            }`}>
              {item.status}
            </Animated.Text>
          </View>
        </View>
        <Animated.Text className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {item.date} • {item.weight}
        </Animated.Text>
        <View className="flex-row items-center gap-1.5 mt-0.5">
          <Ionicons name="shield-checkmark" size={12} color="#6366F1" />
          <Animated.Text className="text-[11px] font-semibold text-indigo-500 dark:text-indigo-400 tracking-wider">
            {item.verificationKey}
          </Animated.Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.duration(600).springify()} 
          className="flex-row justify-between items-center"
        >
          <View>
            <Animated.Text className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Enterprise Client
            </Animated.Text>
            <Animated.Text className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {profileName || 'Coca-Cola Ghana Ltd'}
            </Animated.Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Pressable 
              onPress={() => router.push('/profile' as any)} 
              className="p-3 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 active:opacity-70"
            >
              <Ionicons name="person-circle-outline" size={22} color="#6366F1" />
            </Pressable>
            <Pressable 
              onPress={handleLogout} 
              className="p-3 rounded-2xl bg-red-500/10 dark:bg-red-500/20 active:opacity-70"
            >
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            </Pressable>
          </View>
        </Animated.View>

        {/* Target Progress Bar */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(600)} 
          className="p-5 rounded-3xl gap-3 bg-slate-50 dark:bg-slate-800/50"
        >
          <View className="flex-row justify-between items-center">
            <Animated.Text className="text-sm font-bold text-slate-900 dark:text-white">
              Annual EPR Recycling Target
            </Animated.Text>
            <Animated.Text className="text-sm font-extrabold text-indigo-500">
              {Math.min(Math.round((totalRecycledKg / 100) * 100), 100)}% Met
            </Animated.Text>
          </View>
          
          {/* Progress Bar Track */}
          <View className="h-2.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700/80">
            <View style={{ width: `${Math.min(Math.round((totalRecycledKg / 100) * 100), 100)}%` }} className="h-full rounded-full bg-indigo-500" />
          </View>
          
          <Animated.Text className="text-xs text-slate-500 dark:text-slate-400">
            {totalRecycledKg.toFixed(1)} of 100.0 kg recovered this year.
          </Animated.Text>
        </Animated.View>

        {/* Metrics Grid */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600)} 
          className="flex-row gap-4"
        >
          <MetricCard 
            title="Carbon Offset" 
            value={`${(totalRecycledKg * 1.5).toFixed(1)} kg CO2e`} 
            subtitle={`Equiv. ${(totalRecycledKg / 25).toFixed(1)} trees planted`} 
            icon="leaf" 
            colorClass="bg-emerald-500/10 dark:bg-emerald-500/20"
            iconColor="#10B981" 
          />
          <MetricCard 
            title="Platform Audits" 
            value={`${logs.length} logs`} 
            subtitle="100% DVaaS verified" 
            icon="shield-checkmark" 
            colorClass="bg-indigo-500/10 dark:bg-indigo-500/20"
            iconColor="#6366F1" 
          />
        </Animated.View>

        {/* Compliance list */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(600)} 
          className="gap-3"
        >
          <Animated.Text className="text-base font-bold text-slate-900 dark:text-white">
            Verification & Compliance Logs
          </Animated.Text>
          
          <FlatList
            data={logs}
            keyExtractor={(item) => item.id}
            renderItem={renderLog}
            scrollEnabled={false} // nested in ScrollView
            contentContainerStyle={{ gap: 12 }}
          />
        </Animated.View>

      </ScrollView>
    </View>
  );
}
