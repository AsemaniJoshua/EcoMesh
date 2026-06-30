import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

export default function CorporateLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
        },
        headerTintColor: isDark ? '#FFFFFF' : '#0F172A',
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'EPR Dashboard',
        }}
      />
    </Stack>
  );
}
