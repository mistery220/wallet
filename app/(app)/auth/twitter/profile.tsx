import useSignInWithTwitter from "@/hooks/twitter/useSignInWithTwitter";
import { useCurrentStore } from "@/store/current";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const TwitterProfile = () => {
  const { verifyTwitterUser } = useSignInWithTwitter();
  const { code, state } = useLocalSearchParams();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState("");
  const { setTwitter, twitterUsername } = useCurrentStore();

  useEffect(() => {
    async function authorizeUser() {
      try {
        const userData = await verifyTwitterUser(
          state as string,
          code as string
        );
        setIsLoadingProfile(false);

        console.log(userData)
        if (userData) {
          setTwitter(userData.id, userData.username);
          setTimeout(() => {
            router.push("/(tabs)");
          }, 3000);
        } else {
          setError("Authorization failed. Please try again.");
        }
      } catch (err) {
        setIsLoadingProfile(false);
        setError("Something went wrong. Please try again.");
      }
    }
    authorizeUser();
  }, []);

  return (
    <LinearGradient colors={["#1DA1F2", "#14171A"]} style={styles.container}>
      <View style={styles.content}>
        {isLoadingProfile ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>
              Authenticating and getting you ready...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.messageContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : twitterUsername ? (
          <View style={styles.messageContainer}>
            <Text style={styles.successText}>Welcome, @{twitterUsername}!</Text>
            <Text style={styles.redirectText}>
              Successfully authorized, redirecting in 3 seconds...
            </Text>
          </View>
        ) : null}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  messageContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxWidth: 400,
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 15,
    textAlign: "center",
  },
  successText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  redirectText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 16,
    textAlign: "center",
  },
});

export default TwitterProfile;
