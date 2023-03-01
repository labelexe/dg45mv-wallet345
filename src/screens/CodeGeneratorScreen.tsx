import React from 'react';

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import BaseScreen from './BaseScreen';

// Image Assets
import IMAGE_LOCK from '../../assets/images/lock_shine.png';
import TextView from '../components/TextView';

import type { RootStackParamList } from '../App';

export interface CodeGeneratorScreenInterface {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CodeGeneratorScreen'>;
}

const CodeGeneratorScreen: React.FC<CodeGeneratorScreenInterface> = ({ navigation }) => {
  return (
    <BaseScreen style={styles.container}>
      <TextView style={{ fontSize: 30, fontWeight: 'bold' }}>DGMV 2FA</TextView>
      <TextView style={{ fontSize: 30, fontWeight: 'bold' }}>Generator</TextView>

      <Image
        style={[styles.centerImage, { marginLeft: -45, marginTop: 50 }]}
        source={IMAGE_LOCK}
      />

      <View style={{ marginTop: 30 }}>
        <TextView style={{ fontSize: 50, fontWeight: 'bold', color: '#34ff66' }}>351577</TextView>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('AuthenticationCompletedScreen')}
      >
        <View style={{ marginTop: 15, marginBottom: 30 }}>
          <TextView style={{ color: '#2aa5d9' }}>COPY CODE</TextView>
        </View>
      </TouchableOpacity>

      <TextView style={{ fontSize: 14 }}>Updating in 4 Seconds</TextView>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

  centerImage: {
    width: 330,
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

export default CodeGeneratorScreen;

