import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';

import Dropdown from '../components/Dropdown';

// Image Assets
import IMAGE_BOTTOM_LOGO from '../../assets/images/digithree.png';
import TextView from '../components/TextView';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DropdownValue } from '../components/Dropdown';

import IMAGE_QR from '../../assets/images/qr_code.jpg';

import type { RootStackParamList } from '../App';

export interface ScanQRCodeScreenInterface {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ScanQRCodeScreen'>;
}

const ScanQRCodeScreen: React.FC<ScanQRCodeScreenInterface> = ({ navigation }) => {
  const [selectedValue, setSelectedValue] = React.useState<DropdownValue>();

  const items = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];

  return (
    <View style={styles.container}>
      <View style={{ margin: 50 }}>

        <Dropdown
          items={items}
          value={selectedValue}
          onChange={(value: DropdownValue) => setSelectedValue(value)}
        />

        <TextView style={{ marginTop: 20, marginBottom: 15, fontSize: 15 }}>
          <Text>Scan QR Code with DGMV Authenticator.</Text>
        </TextView>
        <TouchableOpacity
          onPress={() => navigation.navigate('ScanQRCodeScreen')}
        >
          <Image
            style={styles.qrCodeImage}
            source={IMAGE_QR}
          />
        </TouchableOpacity>
      </View>

      <Image
        style={{ width: 200, height: 100, position: 'absolute', bottom: 80, alignItems: 'center', alignSelf: 'center' }}
        source={IMAGE_BOTTOM_LOGO}
        resizeMode='contain'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  placeholderStyle: {
    fontSize: 16,
    color: '#fff'
  },

  selectedTextStyle: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },

  qrCodeImage: {
    width: 300,
    height: 300,
    alignSelf: 'center'
  },

  horizontalView: {
    height: 20,
    flexDirection: 'row',
    alignSelf: 'center'
  },

  CircleShape: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    backgroundColor: '#FF9800',
    marginRight: 10,
    marginTop: 2
  },
});

export default ScanQRCodeScreen;
