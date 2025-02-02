import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Button, Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://twitter.com/i/oauth2/authorize",
  tokenEndpoint: "https://twitter.com/i/oauth2/token",
  revocationEndpoint: "https://twitter.com/i/oauth2/revoke",
};

export default function App() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_TWITTER_CLIENT_ID as string,
      redirectUri: "https://auth.expo.io/@brijeshagal/app",
      usePKCE: true,
      scopes: ["tweet.read"],
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
    }
  }, [response]);

  console.log({ response });

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
