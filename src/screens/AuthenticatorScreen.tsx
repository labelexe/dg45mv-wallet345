
import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';

import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import BaseScreen from './BaseScreen';

// Image Assets
import IMAGE_INTRO_HELMET from '../../assets/images/intro_helmet.png';
import DIGITHREE_LABS from '../../assets/images/digithree.png';
import IMAGE_UP_ARROW from '../../assets/images/up_arrow.png';
import IMAGE_LOGO from '../../assets/images/logo.png';
import TextView from '../components/TextView';

import type { RootStackParamList } from '../App';
import CredentialProviderRequest from '../modules/CredentialProviderRequest';

export interface AuthenticatorScreenScreenInterface {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AuthenticatorScreen'>;
};

const AuthenticatorScreen: React.FC<AuthenticatorScreenScreenInterface> = ({ navigation }) => {
  return (
    <BaseScreen hideHeader={true}>
      <View>
        {/* <Text style={[styles.textView, {fontSize:30, fontWeight:'bold'}]}>AUTHENTICATION</Text>
              <Text style={[styles.textView, {fontSize:30, fontWeight:'bold', color:'#34ff66'}]}>COMPLETED</Text> */}

        <Image
          style={[styles.logoImage, {}]}
          source={IMAGE_LOGO}
        />

        <Image
          style={[styles.centerImage, { marginTop: 24 }]}
          source={IMAGE_INTRO_HELMET}
        />

        <TouchableOpacity onPress={() => CredentialProviderRequest.askForPermissions()} style={{ marginTop: 36 }}>
          <TextView style={{ color: '#37ff66', fontWeight: 'bold' }}>
            <Text>AUTHENTICATOR</Text>
          </TextView>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <TouchableOpacity
          style={{ alignItems: 'center', marginTop: 48 }}
          onPress={() => navigation.navigate('GeneratePasswordScreen')}
        >
          <View style={{ alignItems: 'center' }}>
            <Image source={IMAGE_UP_ARROW} />
            <TextView style={{ marginTop: -24 }}>
              <Text>ENTER</Text>
            </TextView>
          </View>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginTop: 48 }}>
          <Image source={DIGITHREE_LABS} />
        </View>
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  spacer: {
    flex: 1,
  },

  textView: {
    color: '#fff',
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
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

  logoImage: {
    width: 300,
    height: 100,
    alignSelf: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    marginTop: 12,
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

export default AuthenticatorScreen;

