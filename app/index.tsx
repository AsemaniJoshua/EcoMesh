import React, { useEffect } from 'react';
import { View, Pressable, useColorScheme, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

import { useAuthStore, UserRole } from '@/hooks/use-auth-store';

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { role, setRole } = useAuthStore();

  // If the user already has a saved role, redirect them directly
  useEffect(() => {
    if (role) {
      if (role === 'household') {
        router.replace('/household' as any);
      } else if (role === 'collector') {
        router.replace('/collector' as any);
      } else if (role === 'corporate') {
        router.replace('/corporate' as any);
      }
    }
  }, [role]);

  const selectRole = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  // Card component with scale animation on press
  const RoleCard = ({ 
    type, 
    title, 
    description, 
    icon, 
    colorClass, 
    iconColor,
    delay 
  }: { 
    type: UserRole, 
    title: string, 
    description: string, 
    icon: keyof typeof Ionicons.glyphMap, 
    colorClass: string,
    iconColor: string,
    delay: number 
  }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    const handlePressIn = () => {
      scale.value = withSpring(0.97, { damping: 10 });
    };

    const handlePressOut = () => {
      scale.value = withSpring(1, { damping: 10 });
    };

    return (
      <Animated.View 
        entering={FadeInDown.delay(delay).duration(600).springify()}
        style={[animatedStyle]}
        className="w-full"
      >
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => selectRole(type)}
          className="flex-row items-center p-4 rounded-2xl border bg-white/95 dark:bg-slate-800/70 border-slate-200/80 dark:border-slate-700/30 shadow-sm active:border-emerald-500 dark:active:border-emerald-400"
        >
          <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${colorClass}`}>
            <Ionicons name={icon} size={28} color={iconColor} />
          </View>
          <View className="flex-1">
            <Animated.Text className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {title}
            </Animated.Text>
            <Animated.Text className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {description}
            </Animated.Text>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDark ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.5)'} 
          />
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-slate-900">
      <StatusBar style="auto" />
      
      {/* Background patterns */}
      <View className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-10 bg-emerald-500 dark:bg-emerald-600" />
      
      <View className="flex-1 w-full max-w-md px-6 justify-between pt-20 pb-10">
        {/* Brand Header */}
        <Animated.View 
          entering={FadeInUp.duration(800).springify()}
          className="items-center"
        >
          <Image
            source={require('@/assets/images/icon.png')}
            className="w-20 h-20 rounded-2xl mb-4"
          />
          <Animated.Text className="text-3xl font-extrabold tracking-wide text-slate-900 dark:text-white">
            EcoMesh
          </Animated.Text>
          <Animated.Text className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-semibold">
            Circular Economy Network
          </Animated.Text>
        </Animated.View>

        {/* Selection Instructions */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(600)}
          className="mt-8 items-center"
        >
          <Animated.Text className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Get Started
          </Animated.Text>
          <Animated.Text className="text-sm text-center text-slate-500 dark:text-slate-400 leading-relaxed px-4">
            Select your profile to join the recycling loop in your neighborhood.
          </Animated.Text>
        </Animated.View>

        {/* Cards list */}
        <View className="flex-1 justify-center space-y-4 mt-6">
          <RoleCard
            type="household"
            title="Household & Retail"
            description="Sort waste, request pickups, and earn EcoPoints redeemable for cash or utilities."
            icon="leaf"
            colorClass="bg-emerald-500/10 dark:bg-emerald-500/20"
            iconColor="#10B981"
            delay={200}
          />
          
          <RoleCard
            type="collector"
            title="Waste Collector"
            description="Find nearby pickup requests, optimize your routes, and receive instant payouts."
            icon="bicycle"
            colorClass="bg-sky-500/10 dark:bg-sky-500/20"
            iconColor="#0EA5E9"
            delay={300}
          />

          <RoleCard
            type="corporate"
            title="Recycler & Partner"
            description="Source high-volume clean feedstock and track Extended Producer Responsibility (EPR) compliance."
            icon="business"
            colorClass="bg-indigo-500/10 dark:bg-indigo-500/20"
            iconColor="#6366F1"
            delay={400}
          />
        </View>
      </View>
    </View>
  );
}
