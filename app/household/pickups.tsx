import React, { useState, useEffect } from 'react';
import { View, Pressable, useColorScheme, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthStore, PickupRequest } from '@/hooks/use-auth-store';

export default function HouseholdPickups() {
  const isDark = useColorScheme() === 'dark';
  const { pickups, addPickupRequest, refreshFromDb } = useAuthStore();

  const [weight, setWeight] = useState('');
  const [type, setType] = useState('PET Plastics');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    refreshFromDb();
  }, []);

  const handleAddPickup = () => {
    if (!weight) return;
    addPickupRequest(weight, type);
    setWeight('');
    setIsAdding(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-emerald-500';
      case 'Pending': return 'text-amber-500';
      default: return 'text-red-500';
    }
  };

  const renderItem = ({ item }: { item: PickupRequest }) => (
    <View className="p-4 rounded-2xl gap-3 bg-slate-50 dark:bg-slate-800/50">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="cube-outline" size={16} color="#10B981" />
          <Animated.Text className="text-sm font-bold text-slate-900 dark:text-white">
            {item.type}
          </Animated.Text>
        </View>
        <Animated.Text className={`text-xs font-bold ${getStatusColor(item.status)}`}>
          {item.status}
        </Animated.Text>
      </View>

      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          <Ionicons name="calendar-outline" size={14} color={isDark ? '#94A3B8' : '#64748B'} />
          <Animated.Text className="text-xs text-slate-500 dark:text-slate-400">
            {item.date}
          </Animated.Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Ionicons name="scale-outline" size={14} color={isDark ? '#94A3B8' : '#64748B'} />
          <Animated.Text className="text-xs text-slate-500 dark:text-slate-400">
            {item.weight}
          </Animated.Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Ionicons name="location-outline" size={14} color={isDark ? '#94A3B8' : '#64748B'} />
          <Animated.Text className="text-xs text-slate-500 dark:text-slate-400">
            {item.location}
          </Animated.Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <View className="flex-1 p-6 gap-5">
        
        {/* Toggle add pickup form */}
        {!isAdding ? (
          <Pressable 
            onPress={() => setIsAdding(true)}
            className="flex-row items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-500 active:opacity-90"
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Animated.Text className="text-white font-bold text-sm">
              Request New Pickup
            </Animated.Text>
          </Pressable>
        ) : (
          <Animated.View entering={FadeInDown.duration(400)} className="p-5 rounded-2xl gap-4 bg-slate-50 dark:bg-slate-800/50">
            <Animated.Text className="text-base font-bold text-slate-900 dark:text-white">
              Schedule Pickup
            </Animated.Text>
            
            <View className="gap-1.5">
              <Animated.Text className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Estimated Weight (kg)
              </Animated.Text>
              <TextInput
                placeholder="e.g. 5.5"
                placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                className="p-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </View>

            <View className="gap-1.5">
              <Animated.Text className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Plastic Type
              </Animated.Text>
              <View className="flex-row gap-2">
                {['PET Plastics', 'HDPE Plastics', 'Mixed'].map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => setType(t)}
                    className={`flex-1 py-2 items-center rounded-xl border ${
                      type === t 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Animated.Text 
                      className={`text-xs font-semibold ${
                        type === t ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {t}
                    </Animated.Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="flex-row justify-end gap-3 mt-2">
              <Pressable onPress={() => setIsAdding(false)} className="py-2 px-4">
                <Animated.Text className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
                  Cancel
                </Animated.Text>
              </Pressable>
              <Pressable onPress={handleAddPickup} className="bg-emerald-500 py-2 px-5 rounded-xl active:opacity-90">
                <Animated.Text className="text-white font-bold text-sm">
                  Request
                </Animated.Text>
              </Pressable>
            </View>
          </Animated.View>
        )}

        {/* History Header */}
        <Animated.Text className="text-base font-bold text-slate-900 dark:text-white mt-2">
          Pickup History
        </Animated.Text>

        <FlatList
          data={pickups}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center py-10 gap-3">
              <Ionicons name="trash-outline" size={48} color={isDark ? '#334155' : '#CBD5E1'} />
              <Animated.Text className="text-slate-400 dark:text-slate-500">
                No pickups scheduled yet.
              </Animated.Text>
            </View>
          }
        />

      </View>
    </View>
  );
}
