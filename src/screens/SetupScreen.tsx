import React from 'react';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Self defined components
import BaseScreen from './BaseScreen';
import {HeaderButtonType} from '../components/Header';
import Spacer from '../components/Spacer';
import TextView from '../components/TextView';
import {DefaultFont} from '../styles/fonts';
import type {RootStackParamList} from '../App';

// Images
import IMAGE_WALLET from '../../assets/images/wallet.png';

export interface SetupScreenInterface {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SetupScreen'>
}

const SetupScreen: React.FC<SetupScreenInterface> = ({navigation}) => {
  const headerProps = {
    leftButtonType: HeaderButtonType.SETTINGS,
  };

  const scrollViewProps = {
    scrollEnabled: true,
  };

  const recoverExistingWallet = () => {
    navigation.navigate('ImportMnemonicScreen');
  };

  const createNewWallet = () => {
    navigation.navigate('MnemonicGeneratorScreen');
  };  

  return (
    <BaseScreen scrollViewProps={scrollViewProps} headerProps={headerProps}>
      <View style={styles.titleWrapper}>
        <TextView style={styles.title}>SETUP YOUR PERSONAL WALLET</TextView>
      </View>

      <Spacer type={4} />

      <Image source={IMAGE_WALLET} style={styles.walletImage} />

      <Spacer type={4} />

      <View>
        <TouchableOpacity
          onPress={createNewWallet}
          style={[styles.actionButton, styles.filled]}>
          <TextView style={styles.filledText}>CREATE NEW WALLET</TextView>
        </TouchableOpacity>

        <Spacer type={2} />

        <TouchableOpacity
          onPress={recoverExistingWallet}
          style={[styles.actionButton, styles.outlined]}>
          <TextView style={styles.outlinedText}>
            ENTER SECRET RECOVERY PHRASE
          </TextView>
        </TouchableOpacity>
      </View>

      <Spacer type={2} />
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  titleWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  title: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 32,
  },

  filled: {
    backgroundColor: '#00fb99',
  },

  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 3,
  },

  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00fb99',
  },

  outlinedText: {
    color: '#00fb99',
    fontFamily: DefaultFont.light,
  },

  filledText: {
    color: '#01071B',
    fontFamily: DefaultFont.bold,
  },

  walletImage: {
    resizeMode: 'contain',
    height: '50%',
    width: '100%',
    minHeight: 220,
  },
});

export default SetupScreen;
