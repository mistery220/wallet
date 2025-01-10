import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Onboard() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to Onboarding!</Text>
      <Button
        title="Go to New User"
        onPress={() => router.push("/onboard/new")}
      />
      <Button
        title="Go to Existing User"
        onPress={() => router.push("/onboard/existing")}
      />
    </View>
  );
}
