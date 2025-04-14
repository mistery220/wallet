import { useEffect } from "react";
import { useRouter } from "expo-router";
import { usePassStore } from "@/store/auth/password";

export default function AuthEntry() {
  const { hasPassword } = usePassStore();
  const router = useRouter();

  useEffect(() => {
    if (hasPassword) {
      router.replace("/validate-password");
    } else {
      router.replace("/set-password");
    }
  }, [hasPassword]);

  return null; // or a loading spinner if needed
}
