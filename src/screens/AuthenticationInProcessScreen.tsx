
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
import IMAGE_BOTTOM_LOGO from '../../assets/images/digithree.png';
import IMAGE_PROGRESS_BAR from '../../assets/images/process_bar.png';
import TextView from '../components/TextView';

import type { RootStackParamList } from '../App';

export interface AuthenticationInProcessScreenInterface {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AuthenticationInProcessScreen'>;
};


const AuthenticationInProcessScreen: React.FC<AuthenticationInProcessScreenInterface> = ({navigation}) => {
  return (
    <BaseScreen style={styles.container}>
      <View style={{ margin: 20 }}>

        <TextView style={{ marginTop: 30, marginBottom: 15 }}> Scan/Receive with DGMV ID App.</TextView>


        <TouchableOpacity
          onPress={() => navigation.navigate('AuthenticatorScreen')}
        >
          <TextView style={{ marginTop: 40, marginBottom: 15, fontSize: 100, color: '#03ffff' }}>00:49</TextView>
        </TouchableOpacity>

        <TextView style={{ marginTop: 15, marginBottom: 15 }}>
          Authentication In Process.
        </TextView>

        <Image
          style={{ width: 300, height: 100, alignItems: 'center', alignSelf: 'center' }}
          source={IMAGE_PROGRESS_BAR}
          resizeMode='contain'
        />
      </View>

      <Image
        style={{ width: 200, height: 50, position: 'absolute', bottom: 200, alignItems: 'center', alignSelf: 'center' }}
        source={IMAGE_BOTTOM_LOGO}
        resizeMode='contain'
      />
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default AuthenticationInProcessScreen;

