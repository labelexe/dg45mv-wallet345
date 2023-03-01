import React from 'react';

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

import BaseScreen from './BaseScreen';
import Dropdown from '../components/Dropdown';
import TextView from '../components/TextView';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DropdownValue } from '../components/Dropdown';

// Image Assets
import IMAGE_QR from '../../assets/images/qr_code.jpg';

import type { RootStackParamList } from '../App';

export interface GeneratePasswordScreenInterface {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GeneratePasswordScreen'>;
}

const GeneratePasswordScreen: React.FC<GeneratePasswordScreenInterface> = ({ navigation }) => {
  const [selectedValue, setSelectedValue] = React.useState<DropdownValue>('');

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
    <BaseScreen style={styles.container}>
      <View style={styles.innerViewPadding}>
        <TextView style={styles.dropdownHeading}>Generate Password For:</TextView>
        <Dropdown
          items={items}
          value={selectedValue}
          onChange={(value: DropdownValue) => setSelectedValue(value)}
        />

        <TextView style={{ marginTop: 24, marginBottom: 15 }}>
          Scan/Receive with DGMV ID App.
        </TextView>

        <TouchableOpacity
          onPress={() => navigation.navigate('CodeGeneratorScreen')}
        >
          <Image
            style={styles.qrCodeImage}
            source={IMAGE_QR}
          />
        </TouchableOpacity>

        <View style={[styles.horizontalView, { marginTop: 30 }]}>
          <View style={[styles.circleShape, { backgroundColor: '#f06060', marginTop: 6 }]} />
          <TextView style={{ color: '#f06060' }}>Automatic Logic Disable</TextView>
        </View>

        <View style={[styles.horizontalView, { marginTop: 15 }]}>
          <View style={[styles.circleShape, { backgroundColor: '#37ff66', marginTop: 6 }]} />
          <TextView style={{ color: '#37ff66' }}>Automatic Mode</TextView>
        </View>
      </View>
    </BaseScreen>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dropdownHeading: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 12,
  },

  qrCodeImage: {
    width: 300,
    height: 300,
    alignSelf: 'center'
  },

  horizontalView: {
    height: 25,
    flexDirection: 'row',
    alignSelf: 'center'
  },

  circleShape: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    backgroundColor: '#FF9800',
    marginRight: 10,
    marginTop: 2
  },

  innerViewPadding: {

  },
});

export default GeneratePasswordScreen;

