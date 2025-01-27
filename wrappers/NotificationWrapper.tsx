import { NotificationService } from "@/clients/notification/NotificationService";
import { NotificationData } from "@/types/notification/push";
import { FC, PropsWithChildren, useEffect } from "react";

interface TransactionNotification extends NotificationData {
  transactionId: string;
  amount: string;
  type: "send" | "receive";
}

const NotificationWrapper: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    // Register for push notifications
    const registerForPushNotificationsAsync = async () => {
      const token = await NotificationService.registerForPushNotifications();
      if (token) {
        console.log("Push token:", token.data);
        // Send token to your backend
      }
    };

    // Set up notification listeners
    const receivedListener =
      NotificationService.addNotificationReceivedListener((notification) => {
        const transactionData = notification.request.content
          .data as TransactionNotification;
        console.log("Transaction received:", transactionData);
      });

    const responseListener =
      NotificationService.addNotificationResponseReceivedListener(
        (response) => {
          const transactionData = response.notification.request.content
            .data as TransactionNotification;
          console.log("User responded to notification:", transactionData);
        }
      );

    registerForPushNotificationsAsync();

    // Cleanup
    return () => {
      receivedListener.remove();
      responseListener.remove();
    };
  }, []);
  return children;
};

export default NotificationWrapper;
