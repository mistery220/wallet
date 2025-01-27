// components/RequestInfoSection.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface InfoSectionProps {
  type: 'initial' | 'twitter-not-found' | 'address-not-found';
  twitterHandle?: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ type, twitterHandle }) => {
  const renderContent = () => {
    switch (type) {
      case 'initial':
        return (
          <View style={styles.infoContainer}>
            <MaterialCommunityIcons name="information" size={20} color="#007AFF" />
            <Text style={styles.infoText}>
              Enter a Twitter handle with '@' or blockchain address from any supported network
            </Text>
          </View>
        );
      case 'twitter-not-found':
        return (
          <View style={styles.warningContainer}>
            <MaterialCommunityIcons name="twitter" size={20} color="#FFB800" />
            <Text style={styles.warningText}>
              {`@${twitterHandle} is not on the app yet. We'll send them a DM about your request.`}
            </Text>
          </View>
        );
      case 'address-not-found':
        return (
          <View style={styles.warningContainer}>
            <MaterialCommunityIcons name="alert-circle-outline" size={20} color="#FFB800" />
            <View style={styles.warningContent}>
              <Text style={styles.warningText}>
                This address is not on the app yet. They'll be notified of your request once they join.
              </Text>
              <Text style={styles.suggestionText}>
                Alternatively, enter their Twitter handle for immediate notification.
              </Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  infoContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  warningContainer: {
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  warningContent: {
    flex: 1,
    gap: 8,
  },
  infoText: {
    color: '#007AFF',
    flex: 1,
    fontSize: 14,
  },
  warningText: {
    color: '#FFB800',
    flex: 1,
    fontSize: 14,
  },
  suggestionText: {
    color: '#999',
    fontSize: 13,
  },
});

export default InfoSection;