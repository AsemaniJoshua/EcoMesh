import React, { useState } from 'react';
import { View, Pressable, useColorScheme, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function CollectorScanner() {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1); // Step 1: Scan QR, Step 2: Weight Verification
  const [weight, setWeight] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulateScan = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
    }, 1500);
  };

  const handleCompleteTransaction = () => {
    if (!weight || parseFloat(weight) <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight from the digital scale.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Transaction Successful',
        `Disbursing payouts:\n\n• GHS ${(parseFloat(weight) * 1.5).toFixed(2)} to Kofi Mensah (MoMo)\n• ${(parseFloat(weight) * 10).toFixed(0)} EcoPoints to Household (Akosua Mensah)`,
        [
          { 
            text: 'Return to Feed', 
            onPress: () => {
              router.replace('/collector' as any);
            } 
          }
        ]
      );
    }, 2000);
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <View className="flex-1 p-6 justify-center">
        
        {step === 1 ? (
          // Step 1: Simulated Camera Scanning View
          <View className="items-center gap-4">
            <Animated.Text className="text-xl font-extrabold text-slate-900 dark:text-white text-center">
              Scan Household QR
            </Animated.Text>
            <Animated.Text className="text-sm text-center text-slate-500 dark:text-slate-400 leading-relaxed px-5 mb-2">
              Align the household profile QR code within the frame to verify pickup.
            </Animated.Text>
            
            {/* Mock Camera Viewfinder */}
            <View className="w-64 h-64 rounded-3xl items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/30">
              {isProcessing ? (
                <View className="items-center justify-center">
                  <Animated.Text className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    Verifying QR Code...
                  </Animated.Text>
                </View>
              ) : (
                <>
                  <Ionicons name="qr-code-outline" size={120} color={isDark ? '#475569' : '#94A3B8'} />
                  {/* Viewfinder Corners */}
                  <View className="absolute w-6 h-6 border-2 top-5 left-5 border-r-0 border-b-0 border-sky-500" />
                  <View className="absolute w-6 h-6 border-2 top-5 right-5 border-l-0 border-b-0 border-sky-500" />
                  <View className="absolute w-6 h-6 border-2 bottom-5 left-5 border-r-0 border-t-0 border-sky-500" />
                  <View className="absolute w-6 h-6 border-2 bottom-5 right-5 border-l-0 border-t-0 border-sky-500" />
                  
                  {/* Scanning Animation bar placeholder */}
                  <View className="absolute top-1/4 left-[10%] right-[10%] h-0.5 bg-sky-500 opacity-60" />
                </>
              )}
            </View>

            <Pressable 
              onPress={handleSimulateScan}
              disabled={isProcessing}
              className="w-full flex-row items-center justify-center gap-2 p-4 rounded-2xl mt-3 bg-sky-500 active:opacity-90"
            >
              <Ionicons name="scan-outline" size={20} color="#FFFFFF" />
              <Animated.Text className="text-white font-bold text-base">
                Simulate QR Scan
              </Animated.Text>
            </Pressable>
          </View>
        ) : (
          // Step 2: Weight Verification and Disbursal
          <Animated.View entering={FadeInDown.duration(500)} className="gap-5">
            <Animated.Text className="text-xl font-extrabold text-slate-900 dark:text-white text-center">
              Weigh Recyclables
            </Animated.Text>
            <Animated.Text className="text-sm text-center text-slate-500 dark:text-slate-400 leading-relaxed px-5 mb-2">
              Input the verified weight from the digital scale for Akosua Mensah.
            </Animated.Text>

            <View className="p-4 rounded-2xl gap-3 bg-slate-50 dark:bg-slate-800/50">
              <View className="flex-row items-center gap-3">
                <Ionicons name="person-circle-outline" size={48} color="#0EA5E9" />
                <View>
                  <Animated.Text className="text-base font-bold text-slate-900 dark:text-white">
                    Akosua Mensah
                  </Animated.Text>
                  <Animated.Text className="text-xs text-slate-500 dark:text-slate-400">
                    Nima Lane 4, Accra
                  </Animated.Text>
                </View>
              </View>
              
              <View className="h-[1px] bg-slate-200 dark:bg-slate-700/50" />
              
              <View className="flex-row justify-between">
                <Animated.Text className="text-xs text-slate-500 dark:text-slate-400">
                  Requested Type
                </Animated.Text>
                <Animated.Text className="text-xs font-bold text-slate-900 dark:text-white">
                  PET Plastics
                </Animated.Text>
              </View>
            </View>

            <View className="gap-2">
              <Animated.Text className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Measured Weight (kg)
              </Animated.Text>
              <View className="flex-row items-center gap-3">
                <TextInput
                  placeholder="0.0"
                  placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                  className="flex-1 text-2xl font-black px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-right"
                />
                <Animated.Text className="text-lg font-bold text-slate-900 dark:text-white">
                  kg
                </Animated.Text>
              </View>
              <Animated.Text className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                Scale payout: GHS 1.50 per kg
              </Animated.Text>
            </View>

            <Pressable 
              onPress={handleCompleteTransaction}
              disabled={isProcessing}
              className="w-full flex-row items-center justify-center gap-2 p-4 rounded-2xl mt-3 bg-emerald-500 active:opacity-90"
            >
              <Ionicons name="wallet-outline" size={20} color="#FFFFFF" />
              <Animated.Text className="text-white font-bold text-base">
                {isProcessing ? 'Processing Payment...' : 'Confirm & Disburse Pay'}
              </Animated.Text>
            </Pressable>

            <Pressable 
              onPress={() => setStep(1)}
              className="items-center py-3"
            >
              <Animated.Text className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
                Re-scan QR Code
              </Animated.Text>
            </Pressable>
          </Animated.View>
        )}

      </View>
    </View>
  );
}
