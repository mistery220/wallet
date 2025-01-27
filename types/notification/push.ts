export interface NotificationData {
    [key: string]: any;
  }
  
  export interface NotificationTrigger {
    seconds?: number;
    repeats?: boolean;
    date?: Date;
  }
  
  export interface PushMessage {
    to: string;
    sound: 'default' | string;
    title: string;
    body: string;
    data?: NotificationData;
  }