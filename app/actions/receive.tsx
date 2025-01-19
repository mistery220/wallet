import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Network {
  id: string;
  name: string;
  icon: ImageSourcePropType;
  address: string;
}

interface NetworkItemProps {
  network: Network;
  selected: boolean;
  onSelect: (network: Network) => void;
}

interface RequestSectionProps {
  selectedNetwork: Network;
}

type RequestType = 'address' | 'twitter';

const networks: Network[] = [
  {
    id: 'solana',
    name: 'Solana',
    icon: require('../../assets/images/favicon.png'),
    address: 'JCwB...w5hi',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    icon: require('../../assets/images/favicon.png'),
    address: '0xc1fE...FBd9',
  },
  {
    id: 'base',
    name: 'Base',
    icon: require('../../assets/images/favicon.png'),
    address: '0xc1fE...FBd9',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    icon: require('../../assets/images/favicon.png'),
    address: '0xc1fE...FBd9',
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    icon: require('../../assets/images/favicon.png'),
    address: 'bc1q...l42u',
  },
];

const RequestSection: React.FC<RequestSectionProps> = ({ selectedNetwork }) => {
  const [requestType, setRequestType] = useState<RequestType>('address');
  const [inputValue, setInputValue] = useState<string>('');

  const handleRequest = (): void => {
    // Implement request handling logic here
    console.log('Request sent to:', inputValue);
  };

  return (
    <View style={styles.requestSection}>
      <Text style={styles.requestTitle}>Request Payment</Text>
      
      <View style={styles.requestTypeToggle}>
        <TouchableOpacity 
          style={[
            styles.toggleButton,
            requestType === 'address' && styles.toggleButtonActive
          ]}
          onPress={() => setRequestType('address')}
        >
          <Text style={[
            styles.toggleButtonText,
            requestType === 'address' && styles.toggleButtonTextActive
          ]}>Wallet Address</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.toggleButton,
            requestType === 'twitter' && styles.toggleButtonActive
          ]}
          onPress={() => setRequestType('twitter')}
        >
          <Text style={[
            styles.toggleButtonText,
            requestType === 'twitter' && styles.toggleButtonTextActive
          ]}>Twitter Handle</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={requestType === 'address' ? `Enter ${selectedNetwork.name} Address` : 'Enter Twitter Handle'}
          placeholderTextColor="#666"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <TouchableOpacity 
          style={styles.requestButton}
          onPress={handleRequest}
        >
          <Text style={styles.requestButtonText}>Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const NetworkItem: React.FC<NetworkItemProps> = ({ network, selected, onSelect }) => {
  const handleCopy = (): void => {
    // Implement copy functionality
    console.log('Copying address:', network.address);
  };

  const handleQRCode = (): void => {
    // Implement QR code functionality
    console.log('Showing QR code for:', network.address);
  };

  return (
    <TouchableOpacity
      style={[styles.networkItem, selected && styles.networkItemSelected]}
      onPress={() => onSelect(network)}
    >
      <View style={styles.networkInfo}>
        <Image source={network.icon} style={styles.networkIcon} />
        <View style={styles.networkText}>
          <Text style={styles.networkName}>{network.name}</Text>
          <Text style={styles.networkAddress}>{network.address}</Text>
        </View>
      </View>
      <View style={styles.networkActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleQRCode}>
          <Ionicons name="qr-code" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
          <Ionicons name="copy-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const ReceiveScreen: React.FC = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(networks[0]);

  return (
    <ScrollView style={styles.container}>
      <RequestSection selectedNetwork={selectedNetwork} />
      
      <Text style={styles.sectionTitle}>Your Addresses</Text>
      
      <View style={styles.networksList}>
        {networks.map((network) => (
          <NetworkItem
            key={network.id}
            network={network}
            selected={selectedNetwork.id === network.id}
            onSelect={setSelectedNetwork}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginVertical: 16,
  },
  networksList: {
    gap: 12,
  },
  networkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
  },
  networkItemSelected: {
    backgroundColor: '#333',
  },
  networkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  networkIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  networkText: {
    marginLeft: 12,
  },
  networkName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  networkAddress: {
    color: '#999',
    fontSize: 14,
  },
  networkActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3A3A3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestSection: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  requestTypeToggle: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#3A3A3A',
  },
  toggleButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
  },
  requestButton: {
    backgroundColor: '#7C4DFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ReceiveScreen;