// services/TwitterAuthService.ts
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
}

export class TwitterAuthService {
  private static instance: TwitterAuthService;
  private clientId: string;
  private redirectUri: string;

  private constructor() {
    // Get these from your Twitter Developer Portal
    this.clientId = Constants.expoConfig?.extra?.twitterClientId ?? "";
    this.redirectUri = AuthSession.makeRedirectUri({
      scheme: "your-app-scheme",
    });
  }

  public static getInstance(): TwitterAuthService {
    if (!TwitterAuthService.instance) {
      TwitterAuthService.instance = new TwitterAuthService();
    }
    return TwitterAuthService.instance;
  }

  async connectTwitter(): Promise<{ success: boolean; user?: TwitterUser }> {
    try {
      const authRequest = new AuthSession.AuthRequest({
        clientId: this.clientId,
        scopes: ["tweet.read", "users.read"],
        redirectUri: this.redirectUri,
      });

      const discovery = {
        authorizationEndpoint: "https://twitter.com/i/oauth2/authorize",
        tokenEndpoint: "https://api.twitter.com/2/oauth2/token",
        revocationEndpoint: "https://api.twitter.com/2/oauth2/revoke",
      };

      const result = await authRequest.promptAsync(discovery);

      if (result.type === "success") {
        const { access_token } = result.params;

        // Get user details using the access token
        const userResponse = await fetch(
          "https://api.twitter.com/2/users/me?user.fields=profile_image_url",
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        const userData = await userResponse.json();

        if (userData.data) {
          return {
            success: true,
            user: userData.data as TwitterUser,
          };
        }
      }

      return { success: false };
    } catch (error) {
      console.error("Twitter auth error:", error);
      return { success: false };
    }
  }

  async disconnectTwitter(): Promise<boolean> {
    try {
      // Implement logout/disconnection logic
      // You might want to revoke the token and clear local storage
      return true;
    } catch (error) {
      console.error("Error disconnecting Twitter:", error);
      return false;
    }
  }
}

export default TwitterAuthService.getInstance();
