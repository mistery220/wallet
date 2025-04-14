import { saveSecureData } from "@/encryption/storage/save";
import { useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Button } from "react-native";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://twitter.com/i/oauth2/authorize",
  tokenEndpoint: "https://twitter.com/i/oauth2/token",
  revocationEndpoint: "https://twitter.com/i/oauth2/revoke",
};

export default function App() {
  const [request, , promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_TWITTER_CLIENT_ID as string,
      redirectUri: `${process.env.EXPO_PUBLIC_SERVER}/auth/callback`,
      usePKCE: true,
      scopes: ["tweet.read", "users.read"],
    },
    discovery
  );

  if (request) {
    saveSecureData("twitterCodeVerifier", request?.codeVerifier || "");
  }

  return (
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}
