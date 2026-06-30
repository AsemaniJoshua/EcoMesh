import React, { useEffect } from 'react';
import { View, Pressable, useColorScheme, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useAuthStore } from '@/hooks/use-auth-store';

export default function HouseholdDashboard() {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { pointsBalance, totalRecycledKg, profileName, refreshFromDb } = useAuthStore();

  useEffect(() => {
    refreshFromDb();
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/' as any);
  };

  const MetricCard = ({ 
    title, 
    value, 
    icon, 
    colorClass, 
    iconColor 
  }: { 
    title: string, 
    value: string, 
    icon: keyof typeof Ionicons.glyphMap, 
    colorClass: string, 
    iconColor: string 
  }) => (
    <View className="flex-1 p-4 rounded-2xl flex-row items-center gap-3 bg-slate-50 dark:bg-slate-800/50">
      <View className={`w-11 h-11 rounded-xl items-center justify-center ${colorClass}`}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View className="flex-1">
        <Animated.Text className="text-lg font-extrabold text-slate-900 dark:text-white">
          {value}
        </Animated.Text>
        <Animated.Text className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          {title}
        </Animated.Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }} showsVerticalScrollIndicator={false}>
        
        {/* Welcome Header */}
        <Animated.View 
          entering={FadeInDown.duration(600).springify()} 
          className="flex-row justify-between items-center"
        >
          <View>
            <Animated.Text className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Welcome back,
            </Animated.Text>
            <Animated.Text className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {profileName || 'Akosua Mensah'}
            </Animated.Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Pressable 
              onPress={() => router.push('/profile' as any)} 
              className="p-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 active:opacity-70"
            >
              <Ionicons name="person-circle-outline" size={22} color="#10B981" />
            </Pressable>
            <Pressable 
              onPress={handleLogout} 
              className="p-3 rounded-2xl bg-red-500/10 dark:bg-red-500/20 active:opacity-70"
            >
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            </Pressable>
          </View>
        </Animated.View>

        {/* Metrics Grid */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(600)} 
          className="flex-row gap-4"
        >
          <MetricCard 
            title="EcoPoints Balance" 
            value={`${pointsBalance} pts`} 
            icon="gift" 
            colorClass="bg-emerald-500/10 dark:bg-emerald-500/20"
            iconColor="#10B981" 
          />
          <MetricCard 
            title="Total Recycled" 
            value={`${totalRecycledKg.toFixed(1)} kg`} 
            icon="leaf" 
            colorClass="bg-blue-500/10 dark:bg-blue-500/20"
            iconColor="#3B82F6" 
          />
        </Animated.View>

        {/* Call to Action Card */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600)} 
          className="rounded-3xl overflow-hidden"
        >
          <Pressable 
            onPress={() => router.push('/household/pickups' as any)}
            className="p-5 flex-row items-center justify-between bg-emerald-500 active:opacity-90"
          >
            <View className="flex-1 mr-4">
              <Animated.Text className="color-white text-lg font-bold mb-1">
                Schedule a Pickup
              </Animated.Text>
              <Animated.Text className="color-emerald-100 text-xs leading-relaxed font-medium">
                Request a collector to pick up your sorted plastic bags.
              </Animated.Text>
            </View>
            <View className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-sm">
              <Ionicons name="add" size={28} color="#10B981" />
            </View>
          </Pressable>
        </Animated.View>

        {/* Guidelines section */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(600)} 
          className="gap-3"
        >
          <Animated.Text className="text-base font-bold text-slate-900 dark:text-white">
            Sorting Guide
          </Animated.Text>
          
          <View className="flex-row items-center p-3.5 rounded-2xl border-l-4 border-red-500 bg-slate-50 dark:bg-slate-800/40">
            <Ionicons name="flame-outline" size={20} color="#EF4444" className="mr-3" />
            <View className="flex-1">
              <Animated.Text className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                PET Bottles (Type 1)
              </Animated.Text>
              <Animated.Text className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                Soda, water bottles. Rinse and compress before bagging.
              </Animated.Text>
            </View>
          </View>

          <View className="flex-row items-center p-3.5 rounded-2xl border-l-4 border-blue-500 bg-slate-50 dark:bg-slate-800/40">
            <Ionicons name="water-outline" size={20} color="#3B82F6" className="mr-3" />
            <View className="flex-1">
              <Animated.Text className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                HDPE Plastics (Type 2)
              </Animated.Text>
              <Animated.Text className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                Milk jugs, shampoo bottles, detergent tubs.
              </Animated.Text>
            </View>
          </View>

          <View className="flex-row items-center p-3.5 rounded-2xl border-l-4 border-amber-500 bg-slate-50 dark:bg-slate-800/40">
            <Ionicons name="warning-outline" size={20} color="#F59E0B" className="mr-3" />
            <View className="flex-1">
              <Animated.Text className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                Non-Recyclables
              </Animated.Text>
              <Animated.Text className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                Organic food waste, paper cups, thin plastics.
              </Animated.Text>
            </View>
          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}
