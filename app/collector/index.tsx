import React, { useState, useEffect } from 'react';
import { View, Pressable, useColorScheme, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { useAuthStore, PickupRequest } from '@/hooks/use-auth-store';

export default function CollectorDashboard() {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { pickups, dailyEarnings, jobsDone, profileName, refreshFromDb } = useAuthStore();

  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);

  useEffect(() => {
    refreshFromDb();
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/' as any);
  };

  const pendingPickups = pickups.filter(p => p.status === 'Pending');

  const toggleSelectJob = (id: string) => {
    if (selectedJobIds.includes(id)) {
      setSelectedJobIds(selectedJobIds.filter(item => item !== id));
    } else {
      setSelectedJobIds([...selectedJobIds, id]);
    }
  };

  const activeJobCount = selectedJobIds.length;

  const renderJob = ({ item }: { item: PickupRequest }) => {
    const isSelected = selectedJobIds.includes(item.id);
    const numericWeight = parseFloat(item.weight);
    const payoutStr = isNaN(numericWeight) ? 'GHS 0.00' : `GHS ${(numericWeight * 1.5).toFixed(2)}`;
    const distanceStr = `${(parseInt(item.id || '1', 10) * 0.4).toFixed(1)} km away`;
    return (
      <View className={`p-4 rounded-2xl flex-row items-center justify-between bg-slate-50 dark:bg-slate-800/50 border ${
        isSelected ? 'border-sky-500' : 'border-transparent'
      }`}>
        <View className="flex-1 mr-4 gap-1">
          <View className="flex-row justify-between items-center">
            <Animated.Text className="text-sm font-bold text-slate-900 dark:text-white">
              {item.type}
            </Animated.Text>
            <Animated.Text className="text-sm font-bold text-sky-500 dark:text-sky-400">
              {payoutStr}
            </Animated.Text>
          </View>
          <Animated.Text className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {distanceStr} • {item.weight}
          </Animated.Text>
          <Animated.Text className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
            {item.location}
          </Animated.Text>
        </View>
        <Pressable 
          onPress={() => toggleSelectJob(item.id)}
          className={`w-10 h-10 rounded-full items-center justify-center ${
            isSelected ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-700'
          }`}
        >
          <Ionicons 
            name={isSelected ? 'checkbox' : 'add-circle-outline'} 
            size={20} 
            color={isSelected ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B')} 
          />
        </Pressable>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <View className="flex-1 p-6 gap-5">
        
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <View>
            <Animated.Text className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Collector Mode
            </Animated.Text>
            <Animated.Text className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {profileName || 'Kofi Mensah'}
            </Animated.Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Pressable 
              onPress={() => router.push('/profile' as any)} 
              className="p-3 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 active:opacity-70"
            >
              <Ionicons name="person-circle-outline" size={22} color="#0EA5E9" />
            </Pressable>
            <Pressable 
              onPress={handleLogout} 
              className="p-3 rounded-2xl bg-red-500/10 dark:bg-red-500/20 active:opacity-70"
            >
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            </Pressable>
          </View>
        </View>

        {/* Mock Map View using Svg to show paths */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(600)} 
          className="h-44 rounded-3xl overflow-hidden relative bg-slate-100 dark:bg-slate-800/40"
        >
          <Svg height="100%" width="100%" viewBox="0 0 100 100">
            {/* Grid Map Background Roads */}
            <Path d="M 0,20 L 100,20 M 0,50 L 100,50 M 0,80 L 100,80 M 30,0 L 30,100 M 70,0 L 70,100" stroke={isDark ? '#334155' : '#CBD5E1'} strokeWidth="4" fill="none" />
            
            {/* Active Route Path */}
            {activeJobCount > 0 && (
              <Path d="M 30,50 L 70,50 L 70,80" stroke="#0EA5E9" strokeWidth="4" fill="none" strokeDasharray="3,3" />
            )}

            {/* Collector Position Pin */}
            <Circle cx="30" cy="50" r="6" fill="#0EA5E9" stroke="#FFFFFF" strokeWidth="2" />
            
            {/* Job Location Pins */}
            <Circle cx="70" cy="50" r="4" fill="#EF4444" />
            <Circle cx="70" cy="80" r="4" fill="#EF4444" />
            <Circle cx="30" cy="20" r="4" fill="#F59E0B" />
          </Svg>
          <View className="absolute bottom-2 left-2 bg-slate-900/80 flex-row items-center px-2 py-1 rounded-md gap-1">
            <Ionicons name="location" size={14} color="#0EA5E9" />
            <Animated.Text className="text-white text-[10px] font-semibold">
              Active pickup route shown in blue
            </Animated.Text>
          </View>
        </Animated.View>

        {/* Active stats */}
        <View className="flex-row gap-4">
          <View className="flex-1 p-3 rounded-2xl items-center gap-1 bg-slate-50 dark:bg-slate-800/50">
            <Animated.Text className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Daily Pay
            </Animated.Text>
            <Animated.Text className="text-lg font-extrabold text-slate-900 dark:text-white">
              GHS {dailyEarnings.toFixed(2)}
            </Animated.Text>
          </View>
          <View className="flex-1 p-3 rounded-2xl items-center gap-1 bg-slate-50 dark:bg-slate-800/50">
            <Animated.Text className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Jobs Done
            </Animated.Text>
            <Animated.Text className="text-lg font-extrabold text-slate-900 dark:text-white">
              {jobsDone} pickups
            </Animated.Text>
          </View>
        </View>

        {/* Jobs Feed List */}
        <View className="flex-1 gap-3">
          <View className="flex-row justify-between items-center">
            <Animated.Text className="text-base font-bold text-slate-900 dark:text-white">
              Available Pickups ({pendingPickups.length})
            </Animated.Text>
            {activeJobCount > 0 && (
              <Pressable 
                onPress={() => router.push(`/collector/scanner?jobId=${selectedJobIds[0]}` as any)}
                className="bg-sky-500 py-1.5 px-3 rounded-xl active:opacity-90"
              >
                <Animated.Text className="text-white text-xs font-bold">
                  Start ({activeJobCount})
                </Animated.Text>
              </Pressable>
            )}
          </View>

          <FlatList
            data={pendingPickups}
            keyExtractor={(item) => item.id}
            renderItem={renderJob}
            contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center py-10 gap-3">
                <Ionicons name="checkmark-circle-outline" size={48} color={isDark ? '#334155' : '#CBD5E1'} />
                <Animated.Text className="text-slate-400 dark:text-slate-500 text-center px-6 text-xs">
                  No pending pickups in your area. Switch to Household and request a pickup!
                </Animated.Text>
              </View>
            }
          />
        </View>

      </View>
    </View>
  );
}
