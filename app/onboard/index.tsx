import React from 'react';
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { 
  FadeInDown,
  FadeInUp 
} from 'react-native-reanimated';

export default function Onboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1A1A1A', '#121212']}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
          style={styles.headerContainer}
        >
          <LinearGradient
            colors={['#333333', '#262626']}
            style={styles.iconContainer}
          >
            <MaterialIcons name="account-balance-wallet" size={40} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.title}>Welcome to Wallet</Text>
          <Text style={styles.subtitle}>
            Manage your digital assets securely and easily
          </Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(400).springify()}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/onboard/new")}
          >
            <LinearGradient
              colors={['#2A2A2A', '#232323']}
              style={styles.buttonGradient}
            >
              <MaterialIcons name="add" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Create New Wallet</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push("/onboard/existing")}
          >
            <View style={styles.buttonGradient}>
              <MaterialIcons name="vpn-key" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Import Existing Wallet</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.Text 
          entering={FadeInUp.delay(500).springify()}
          style={styles.securityText}
        >
          Secured by industry-leading protocols
        </Animated.Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  securityText: {
    color: '#999999',
    textAlign: 'center',
    fontSize: 14,
  },
});