import { deleteSecureData } from "@/encryption/storage/delete";
import { retrieveSecureData } from "@/encryption/storage/retrieve";
import { saveSecureData } from "@/encryption/storage/save";
import { useCurrentStore } from "@/store/current";
import axios from "axios";

export default function useSignInWithTwitter() {
  const { userId } = useCurrentStore();
  /**
 Example userdata ressponse after doing `.data.data`
 id =
'1303145656819671040'
name =
'Brijesh Agal'
profile_image_url =
'https://pbs.twimg.com/profile_images/1779888926179856384/y7aYrCW0_normal.jpg'
username =
'brijeshagal
 */

  async function verifyTwitterUser(state: string, code: string) {
    try {
      const code_verifier = await retrieveSecureData("twitterCodeVerifier");
      if (!code_verifier) return;
      const tokenResponse = await axios.post(
        "https://api.twitter.com/2/oauth2/token",
        new URLSearchParams({
          code: code,
          grant_type: "authorization_code",
          client_id: process.env.EXPO_PUBLIC_TWITTER_CLIENT_ID as string,
          redirect_uri: `${process.env.EXPO_PUBLIC_SERVER}/auth/callback`,
          code_verifier,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token } = tokenResponse.data;

      const userResponse = await axios.get(
        "https://api.twitter.com/2/users/me",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          params: {
            "user.fields": "id,name,username,profile_image_url",
          },
        }
      );

      const userData = userResponse.data.data;
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER}/user/add/twitter`,
        {
          userId,
          twitterUserId: userData.id,
          twitterUsername: userData.username,
        }
      );
      console.log("received data: ", { res: res.data });
      await saveSecureData("twitter-username", userData.username);
      deleteSecureData("twitterCodeVerfier");

      return userData;
    } catch (error: any) {
      console.error(
        "Twitter OAuth Error:",
        error.response?.data || error.message
      );
    }
  }

  return { verifyTwitterUser };
}
