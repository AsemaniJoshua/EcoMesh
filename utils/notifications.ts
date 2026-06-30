import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Set notification handler to display alerts in-app
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions() {
  if (Platform.OS === 'web') return false;
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch (e) {
    console.error('Error requesting notification permissions:', e);
    return false;
  }
}

export async function sendLocalNotification(title: string, body: string) {
  if (Platform.OS === 'web') {
    console.log(`[Mock Notification] ${title}: ${body}`);
    return;
  }
  
  // Ensure permission is granted
  await requestNotificationPermissions();
  
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // Send immediately
    });
  } catch (e) {
    console.warn('Could not schedule local notification:', e);
  }
}
