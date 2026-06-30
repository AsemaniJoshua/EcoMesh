import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CollectorLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0EA5E9', // Sky Blue for collectors
        tabBarInactiveTintColor: isDark ? '#94A3B8' : '#64748B',
        tabBarStyle: {
          backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        },
        headerStyle: {
          backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
        },
        headerTintColor: isDark ? '#FFFFFF' : '#0F172A',
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pickup Jobs',
          tabBarLabel: 'Jobs Feed',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scan & Weigh',
          tabBarLabel: 'Verify',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'qr-code' : 'qr-code-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
