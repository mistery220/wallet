import { InputSrc } from "@/enums/form/input";
import { Actions } from "@/enums/notification/response";
import { useFormStore } from "@/store/form";
import { RequestActionNotification } from "@/types/notification/actions";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";

export default function useNotificationHandler() {
  const { setToToken, setInputSrc, setRecipient } = useFormStore();
  function handleReceive(notification: Notifications.NotificationResponse) {
    const data = notification.notification.request.content.data;
    const { type, backRoute, screenRoute } = data;
    switch (type) {
      case Actions.Request: {
        const { toToken, recipient } = data as RequestActionNotification;
        setToToken(toToken);
        setInputSrc(InputSrc.From);
        setRecipient(recipient);
        break;
      }
    }
    router.push(backRoute); // add a back route to be safe
    router.replace(screenRoute);
  }
  return { handleReceive };
}
