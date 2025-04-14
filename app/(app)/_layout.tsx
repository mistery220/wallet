import { usePassStore } from "@/store/auth/password";
import { Redirect, Slot } from "expo-router";

export default function AppLayout() {
  const { isAuthenticated, hasPassword } = usePassStore();

  if (isAuthenticated) {
    return <Slot />;
  } else {
    if (hasPassword) {
      return <Redirect href="/validate-password" />;
    } else {
      return <Redirect href="/set-password" />;
    }
  }
}
