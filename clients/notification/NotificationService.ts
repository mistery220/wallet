import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";

interface NotificationData {
  [key: string]: any;
}

interface PushMessage {
  to: string;
  sound: string;
  title: string;
  body: string;
  data: NotificationData;
}

class NotificationService {
  private static instance: NotificationService;
  private constructor() {
    // Private constructor to prevent direct construction calls with 'new'
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async scheduleLocalNotification(
    title: string,
    body: string,
    trigger?: Notifications.NotificationTriggerInput,
    data?: NotificationData
  ): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: trigger || null,
    });
  }

  async sendPushNotification({
    body,
    data = {},
    expoPushToken,
    title,
  }: {
    expoPushToken?: Notifications.ExpoPushToken;
    title: string;
    body: string;
    data?: NotificationData;
  }): Promise<void> {
    if (!expoPushToken) return;

    const message: PushMessage = {
      to: expoPushToken.data,
      sound: "default",
      title,
      body,
      data,
    };

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }
}

// Usage example:
export default NotificationService.getInstance();
