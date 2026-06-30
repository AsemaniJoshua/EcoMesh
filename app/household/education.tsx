import React, { useState, useEffect } from 'react';
import { View, Pressable, useColorScheme, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

import { useAuthStore } from '@/hooks/use-auth-store';

interface GuideItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  colorClass: string;
  iconColor: string;
  description: string;
  steps: string[];
}

interface LeaderboardUser {
  name: string;
  weight: number;
  isCurrentUser?: boolean;
}

export default function EducationScreen() {
  const isDark = useColorScheme() === 'dark';
  const { profileName, totalRecycledKg, refreshFromDb } = useAuthStore();
  
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    refreshFromDb();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Compile leaderboard list dynamically and sort by weight
  const rawLeaderboard: LeaderboardUser[] = [
    { name: 'Ama Serwaa (Airport Residential)', weight: 48.2 },
    { name: 'Kwame Osei (East Legon)', weight: 38.5 },
    { name: 'Yaw Mensah (Nima Lane 1)', weight: 12.4 },
    { name: `${profileName || 'Akosua Mensah'} (You)`, weight: totalRecycledKg, isCurrentUser: true }
  ];

  const sortedLeaderboard = [...rawLeaderboard].sort((a, b) => b.weight - a.weight);

  const guides: GuideItem[] = [
    {
      id: '1',
      title: 'PET Plastics (Type 1)',
      icon: 'water-outline',
      colorClass: 'bg-sky-500/10 dark:bg-sky-500/20',
      iconColor: '#0EA5E9',
      description: 'Commonly used for water bottles, soft drinks, and food containers. Highly recyclable.',
      steps: [
        'Rinse thoroughly to remove remaining liquids.',
        'Crush or compress the bottle to save collection volume.',
        'Keep the caps on or separate them if required by hubs.'
      ]
    },
    {
      id: '2',
      title: 'HDPE Plastics (Type 2)',
      icon: 'cube-outline',
      colorClass: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      iconColor: '#10B981',
      description: 'Used for milk jugs, shampoo bottles, and detergent containers. Heavy-duty plastic.',
      steps: [
        'Wash out all soapy residue to prevent chemical contamination.',
        'Remove any pump dispensers (they contain non-recyclable metal springs).',
        'Flatten jugs to optimize storage bins.'
      ]
    },
    {
      id: '3',
      title: 'Prevent Contamination',
      icon: 'warning-outline',
      colorClass: 'bg-amber-500/10 dark:bg-amber-500/20',
      iconColor: '#F59E0B',
      description: 'Dirty materials ruin whole batches of plastic feedstock. Quality control is key.',
      steps: [
        'Never mix organic food waste with plastic bags.',
        'Dry cleaned containers before packaging them for the collector.',
        'Discard heavily stained plastics (like oily food take-away boxes).'
      ]
    }
  ];

  const renderGuide = ({ item }: { item: GuideItem }) => {
    const isExpanded = expandedId === item.id;
    return (
      <Animated.View layout={Layout.springify()} className="rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/30">
        <Pressable 
          onPress={() => toggleExpand(item.id)}
          className="p-5 flex-row items-center justify-between active:opacity-90"
        >
          <View className="flex-row items-center gap-3.5 flex-1">
            <View className={`w-10 h-10 rounded-2xl items-center justify-center ${item.colorClass}`}>
              <Ionicons name={item.icon} size={20} color={item.iconColor} />
            </View>
            <View className="flex-1">
              <Animated.Text className="text-sm font-bold text-slate-900 dark:text-white">
                {item.title}
              </Animated.Text>
            </View>
          </View>
          <Ionicons 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={18} 
            color={isDark ? '#94A3B8' : '#64748B'} 
          />
        </Pressable>
        {isExpanded && (
          <Animated.View entering={FadeInDown.duration(300)} className="px-5 pb-5 pt-1 gap-3">
            <Animated.Text className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {item.description}
            </Animated.Text>
            <View className="gap-2 mt-1">
              {item.steps.map((step, idx) => (
                <View key={idx} className="flex-row gap-2.5 items-start">
                  <View className="w-5 h-5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 items-center justify-center mt-0.5">
                    <Animated.Text className="text-[10px] font-extrabold text-emerald-500">
                      {idx + 1}
                    </Animated.Text>
                  </View>
                  <Animated.Text className="flex-1 text-xs text-slate-600 dark:text-slate-300 leading-normal">
                    {step}
                  </Animated.Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }} showsVerticalScrollIndicator={false}>
        
        {/* Leaderboard Card */}
        <Animated.View 
          entering={FadeInDown.duration(600).springify()}
          className="p-5 rounded-3xl gap-4 bg-emerald-500"
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Animated.Text className="text-white text-base font-extrabold">
                Neighborhood Cleanliness Leaderboard
              </Animated.Text>
              <Animated.Text className="text-emerald-100 text-[10px] font-semibold mt-0.5">
                Accra Central District Rankings
              </Animated.Text>
            </View>
            <Ionicons name="trophy-outline" size={24} color="#FFFFFF" />
          </View>

          {/* List ranks */}
          <View className="gap-2.5">
            {sortedLeaderboard.map((user, idx) => {
              const rank = idx + 1;
              return (
                <View 
                  key={idx} 
                  className={`flex-row justify-between items-center p-3 rounded-2xl ${
                    user.isCurrentUser ? 'bg-white/20 border border-white/20' : 'bg-white/5'
                  }`}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-6 h-6 rounded-full bg-white/25 items-center justify-center">
                      <Animated.Text className="text-white text-[10px] font-bold">
                        #{rank}
                      </Animated.Text>
                    </View>
                    <Animated.Text className={`text-xs font-bold text-white ${user.isCurrentUser ? 'font-black' : ''}`}>
                      {user.name}
                    </Animated.Text>
                  </View>
                  <Animated.Text className="text-xs font-extrabold text-white">
                    {user.weight.toFixed(1)} kg
                  </Animated.Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Collapsible Guides */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(600)} 
          className="gap-3"
        >
          <Animated.Text className="text-base font-bold text-slate-900 dark:text-white">
            Segregation & Sorting Guides
          </Animated.Text>
          
          <FlatList
            data={guides}
            keyExtractor={(item) => item.id}
            renderItem={renderGuide}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 12 }}
          />
        </Animated.View>

      </ScrollView>
    </View>
  );
}
