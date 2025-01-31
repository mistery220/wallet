import { TwitterAuthService } from '@/clients/twitter/TwitterAuth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';

interface TwitterConnectProps {
  onConnect?: (userData: any) => void;
  onDisconnect?: () => void;
}

const TwitterConnect: React.FC<TwitterConnectProps> = ({ onConnect, onDisconnect }) => {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const { success, user } = await TwitterAuthService.getInstance().connectTwitter();
      
      if (success && user) {
        setConnected(true);
        setUserData(user);
        onConnect?.(user);
      }
    } catch (error) {
      console.error('Error connecting Twitter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      const success = await TwitterAuthService.getInstance().disconnectTwitter();
      if (success) {
        setConnected(false);
        setUserData(null);
        onDisconnect?.();
      }
    } catch (error) {
      console.error('Error disconnecting Twitter:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ width: '100%', maxWidth: 350, padding: 16 }}>
      {!connected ? (
        <TouchableOpacity
          onPress={handleConnect}
          disabled={loading}
          style={{
            backgroundColor: '#1DA1F2',
            padding: 12,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: loading ? 0.7 : 1,
          }}
        >
          <MaterialCommunityIcons name="twitter" size={20} color="white" />
          <View style={{ width: 8 }} />
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={{ color: 'white', fontWeight: '500' }}>
              Connect Twitter
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={{ gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {userData?.profile_image_url && (
              <Image
                source={{ uri: userData.profile_image_url }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                }}
              />
            )}
            <View>
              <Text style={{ fontWeight: '500' }}>{userData?.name}</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>
                @{userData?.username}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            onPress={handleDisconnect}
            disabled={loading}
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              padding: 12,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: loading ? 0.7 : 1,
            }}
          >
            <MaterialIcons 
              name="link-off" 
              size={20} 
              color="#666"
              style={{ marginRight: 8 }}
            />
            {loading ? (
              <ActivityIndicator color="#666" size="small" />
            ) : (
              <Text style={{ color: '#666' }}>
                Disconnect Twitter
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TwitterConnect;