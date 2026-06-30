import React, { useState, useEffect } from 'react';
import { View, Pressable, useColorScheme, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useAuthStore } from '@/hooks/use-auth-store';

export default function ProfileScreen() {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  
  const { 
    profileName, 
    profilePhone, 
    profileMomo, 
    profileLocation, 
    updateProfile, 
    refreshFromDb 
  } = useAuthStore();

  const [name, setName] = useState(profileName);
  const [phone, setPhone] = useState(profilePhone);
  const [momo, setMomo] = useState(profileMomo);
  const [location, setLocation] = useState(profileLocation);

  useEffect(() => {
    refreshFromDb();
  }, []);

  // Update component states once the db finishes refreshing
  useEffect(() => {
    setName(profileName);
    setPhone(profilePhone);
    setMomo(profileMomo);
    setLocation(profileLocation);
  }, [profileName, profilePhone, profileMomo, profileLocation]);

  const handleSave = () => {
    if (!name || !phone || !momo || !location) {
      Alert.alert('Required Fields', 'Please complete all profile details.');
      return;
    }
    updateProfile(name, phone, momo, location);
    Alert.alert('Success', 'Profile details updated successfully.', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="flex-row items-center gap-3">
          <Pressable 
            onPress={() => router.back()} 
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 active:opacity-75"
          >
            <Ionicons name="arrow-back" size={20} color={isDark ? '#FFFFFF' : '#0F172A'} />
          </Pressable>
          <Animated.Text className="text-xl font-extrabold text-slate-900 dark:text-white">
            Edit Profile
          </Animated.Text>
        </View>

        {/* Profile Avatar Card */}
        <Animated.View 
          entering={FadeInDown.duration(600).springify()}
          className="p-6 rounded-3xl items-center gap-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/30"
        >
          <View className="w-20 h-20 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 items-center justify-center border border-emerald-500/30">
            <Ionicons name="person" size={40} color="#10B981" />
          </View>
          <View className="items-center">
            <Animated.Text className="text-base font-bold text-slate-900 dark:text-white">
              {profileName || 'User Account'}
            </Animated.Text>
            <Animated.Text className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              {profilePhone || 'No Phone Number'}
            </Animated.Text>
          </View>
        </Animated.View>

        {/* Inputs Group */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} className="gap-5">
          <View className="gap-2">
            <Animated.Text className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              Full Name
            </Animated.Text>
            <TextInput
              placeholder="Full Name"
              placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
              value={name}
              onChangeText={setName}
              className="p-3.5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold"
            />
          </View>

          <View className="gap-2">
            <Animated.Text className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              Phone Number
            </Animated.Text>
            <TextInput
              placeholder="e.g. 055 123 4567"
              placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              className="p-3.5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold"
            />
          </View>

          <View className="gap-2">
            <Animated.Text className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              Mobile Money Wallet (MoMo Number)
            </Animated.Text>
            <TextInput
              placeholder="e.g. 055 123 4567"
              placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
              keyboardType="phone-pad"
              value={momo}
              onChangeText={setMomo}
              className="p-3.5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold"
            />
          </View>

          <View className="gap-2">
            <Animated.Text className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              Location / Area Address
            </Animated.Text>
            <TextInput
              placeholder="e.g. Nima Lane 4, Accra"
              placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
              value={location}
              onChangeText={setLocation}
              className="p-3.5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold"
            />
          </View>
        </Animated.View>

        {/* Save button */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Pressable 
            onPress={handleSave}
            className="w-full py-4 items-center rounded-2xl bg-emerald-500 active:opacity-90"
          >
            <Animated.Text className="text-white text-base font-bold">
              Save Changes
            </Animated.Text>
          </Pressable>
        </Animated.View>

      </ScrollView>
    </View>
  );
}
