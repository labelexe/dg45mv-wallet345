import React from 'react';

import {View} from 'react-native';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Self defined components
import BaseScreen from './BaseScreen';
import OnboardingHScrollview from '../components/OnboardingHScrollview';
import DigicorpLogo from '../components/DigicorpLogo';

// Image Assets
import IMAGE_WALLET from '../../assets/images/wallet.png';

import type {RootStackParamList} from '../App';

export interface OnboardingScreenInterface {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OnboardingScreen'>
}

export interface Item {
  id: number
  imageURI: HTMLImageElement
  title: string
  subtitle: string
}

const OnboardingScreenContent: Array<Item> = [
  {
    id: 1,
    imageURI: IMAGE_WALLET,
    title: 'IMPORT EXISTING WALLET1',
    subtitle: 'ENTER SECRET RECOVERY PHRASE',
  },

  {
    id: 2,
    imageURI: IMAGE_WALLET,
    title: 'IMPORT EXISTING WALLET2',
    subtitle: 'ENTER SECRET RECOVERY PHRASE',
  },

  {
    id: 3,
    imageURI: IMAGE_WALLET,
    title: 'IMPORT EXISTING WALLET3',
    subtitle: 'ENTER SECRET RECOVERY PHRASE',
  },

  {
    id: 4,
    imageURI: IMAGE_WALLET,
    title: 'IMPORT EXISTING WALLET4',
    subtitle: 'ENTER SECRET RECOVERY PHRASE',
  },
];

const OnboardingScreen: React.FC<OnboardingScreenInterface> = ({
  navigation,
}) => {
  return (
    <BaseScreen hideHeader={true} scrollViewProps={{scrollEnabled: true}} scrollViewInnerViewStyle={{ paddingHorizontal: 0, paddingLeft: 0, paddingRight: 0 }}>
      <View style={{ flex: 1 }}>
        <DigicorpLogo />
        <OnboardingHScrollview
          itemsPerInterval={1}
          items={OnboardingScreenContent}
          navigation={navigation}
        />
      </View>
    </BaseScreen>
  );
};

export default OnboardingScreen;
