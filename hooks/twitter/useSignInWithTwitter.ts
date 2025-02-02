import Axios from "axios";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { Alert, Linking } from "react-native";

const CONSUMER_KEY = process.env.EXPO_PUBLIC_TWITTER_CLIENT_ID as string;
const CONSUMER_SECRET = process.env.CLIENT_SECRET as string;
const TWITTER_OAUTH2_AUTHORIZE_URL = "https://twitter.com/i/oauth2/authorize";
const TWITTER_OAUTH2_TOKEN_URL = "https://api.twitter.com/2/oauth2/token";
const OAUTH_CALLBACK_URL = "https://auth.expo.io/@brijeshagal/wallet";

// Generate a secure random code verifier
const generateCodeVerifier = (length: number): string => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  return Array.from({ length }, () =>
    possible.charAt(Math.floor(Math.random() * possible.length))
  ).join("");
};

// Generate code challenge from code verifier
const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier,
    { encoding: Crypto.CryptoEncoding.BASE64 }
  );
  return digest.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const useSignInWithTwitter = () => {
  const signInWithTwitter = async () => {
    try {
      const codeVerifier = generateCodeVerifier(128);
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Securely store the code verifier
      await SecureStore.setItemAsync("twitter_code_verifier", codeVerifier);

      // Generate random state for CSRF protection
      const state = generateCodeVerifier(32);
      await SecureStore.setItemAsync("twitter_oauth_state", state);

      const authUrl = `${TWITTER_OAUTH2_AUTHORIZE_URL}?${new URLSearchParams({
        response_type: "code",
        client_id: CONSUMER_KEY,
        redirect_uri: OAUTH_CALLBACK_URL,
        scope: "tweet.read users.read", // Adjust required scopes
        state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      })}`;

      Linking.openURL(authUrl);
    } catch (error) {
      Alert.alert("Error", "Failed to initialize authentication");
    }
  };

  useEffect(() => {
    const handleOAuthRedirect = async (url: string | null) => {
      if (!url) return;

      const params = new URLSearchParams(url.split("?")[1]);
      const code = params.get("code");
      const state = params.get("state");
      const error = params.get("error");

      if (error) {
        Alert.alert("Authorization Failed", error);
        return;
      }

      // Validate state parameter
      const savedState = await SecureStore.getItemAsync("twitter_oauth_state");
      if (state !== savedState) {
        Alert.alert("Security Error", "Invalid state parameter");
        return;
      }

      if (!code) {
        Alert.alert("Error", "Authorization code missing");
        return;
      }

      try {
        const codeVerifier = await SecureStore.getItemAsync(
          "twitter_code_verifier"
        );
        if (!codeVerifier) throw new Error("Missing code verifier");

        // Prepare Basic Authentication header
        const basicAuth = Buffer.from(
          `${CONSUMER_KEY}:${CONSUMER_SECRET}`
        ).toString("base64");

        // Exchange code for access token
        const response = await Axios.post(
          TWITTER_OAUTH2_TOKEN_URL,
          new URLSearchParams({
            code,
            grant_type: "authorization_code",
            redirect_uri: OAUTH_CALLBACK_URL,
            code_verifier: codeVerifier,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${basicAuth}`,
            },
          }
        );
        console.log({ response });
        const { access_token, refresh_token, expires_in } = response.data;

        Alert.alert(
          "Authentication Success",
          `Access Token: ${access_token.slice(0, 10)}...`
        );

        // Clear stored security parameters
        await SecureStore.deleteItemAsync("twitter_code_verifier");
        await SecureStore.deleteItemAsync("twitter_oauth_state");
      } catch (err) {
        console.error("Token exchange error:", err);
        Alert.alert("Error", "Failed to complete authentication");
      }
    };

    // Listen for incoming links
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleOAuthRedirect(url);
    });

    // Handle cold starts (app launched from URL)
    Linking.getInitialURL().then((url) => handleOAuthRedirect(url));

    return () => subscription.remove();
  }, []);

  return { signInWithTwitter };
};
