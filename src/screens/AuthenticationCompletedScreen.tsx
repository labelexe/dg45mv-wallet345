
import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, } from 'react-native';

import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import BaseScreen from './BaseScreen';

// Image Assets
import IMAGE_COMPLETED from '../../assets/images/completed.png';
import IMAGE_UP_ARROW from '../../assets/images/up_arrow.png';
import TextView from '../components/TextView';

type AuthenticationCompletedScreenParamList = {
  AuthenticationCompletedScreen: undefined;
};

export interface AuthenticationCompletedScreenInterface {
  navigation: NativeStackNavigationProp<AuthenticationCompletedScreenParamList, 'AuthenticationCompletedScreen'>;
}

const AuthenticationCompletedScreen: React.FC<AuthenticationCompletedScreenInterface> = ({navigation}) => { // eslint-disable-line @typescript-eslint/no-unused-vars
  return (
    <BaseScreen style={styles.container}>
      <TextView style={{ fontSize: 30, fontWeight: 'bold' }}>
        AUTHENTICATION
        {'\n'}
        <TextView style={{ color: '#34ff66' }}>
          COMPLETED
        </TextView>
      </TextView>

      <Image
        style={[styles.centerImage, { marginTop: 24 }]}
        source={IMAGE_COMPLETED}
      />

      <View style={[styles.horizontalView, { marginTop: 48 }]}>
        <View style={[styles.CircleShape, { backgroundColor: '#f06060', marginTop: 6 }]} />
        <TextView style={{ color: '#f06060' }}>
          Automatic Logic Disable
        </TextView>
      </View>

      <View style={[styles.horizontalView, { marginTop: 12 }]}>
        <View style={[styles.CircleShape, { backgroundColor: '#37ff66', marginTop: 6 }]} />
        <TextView style={{ color: '#37ff66' }}>
          Automatic Mode
        </TextView>
      </View>

      <TouchableOpacity
        style={{ alignItems: 'center', marginTop: 24 }}
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            source={IMAGE_UP_ARROW}
          />
          <TextView style={{ marginTop: -24 }}>
            CONTINUE
          </TextView>
        </View>
      </TouchableOpacity>
    </BaseScreen>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dropdown: {
    width: 300,
    margin: 20,
    height: 50,
    borderColor: 'gray',
    backgroundColor: '#0e1428',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
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
    height: 25,
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

export default AuthenticationCompletedScreen;
