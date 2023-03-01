import React from 'react';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';

import {useWindowDimensions} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import MnemonicGenerator from '../crypto/MnemonicGenerator';

// Self defined components
import BaseScreen from './BaseScreen';
import {HeaderButtonType} from '../components/Header';
import TextView from '../components/TextView';
import OutlinedButton from '../components/OutlinedButton';
import WarningModal from './WarningModal';
import Spacer from '../components/Spacer';

// Image Assets
import BLUR_VIEW_12 from '../../assets/images/blurredWords12.png';
import BLUR_VIEW_24 from '../../assets/images/blurredWords24.png';

import type {RootStackParamList} from '../App';

export interface MnemonicScreenInterface {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MnemonicScreen'>
}

const MnemonicScreen: React.FC<MnemonicScreenInterface> = ({navigation}) => {
  const {height} = useWindowDimensions();

  const [showWords, setShowWords] = React.useState(false);

  const headerProps = {
    leftButtonType: HeaderButtonType.BACK,
  };

  const scrollViewProps = {
    scrollEnabled: true,
  };

  const onShowScreen = React.useCallback(() => {
    // ToDo: onShow
  }, []);

  const onSubmit = () => {
    navigation.navigate('CreatePasswordScreen');

    // Hide the words. The below useMemo will make sure the
    // words are not rendered, not even in memory (shadow DOM).
    setShowWords(false);
  };

  useFocusEffect(onShowScreen);

  const words = React.useMemo(() => {
    const mnemonic = MnemonicGenerator.lastKnownMnemonic;
    if (!mnemonic) return null;

    return mnemonic.split(' ').map((word, i) => (
      <View key={`word_${i}`} style={styles.wordItem}>
        <TextView style={styles.wordText}>
          {/* Do not render the word in component, if not visible */}
          {i + 1}. {showWords ? word : word.replace(/./g, 'x')}
        </TextView>
      </View>
    ));
  }, [showWords]);

  const showSeed = () => {
    setShowWords(!showWords);
  };

  const blurImage = (words?.length ?? 24) == 12 ? BLUR_VIEW_12 : BLUR_VIEW_24;

  const blurredWords = (
    <View style={styles.blurredWordsContainer}>
      <Image source={blurImage} style={styles.blurredWords} />

      <TextView style={styles.blurredWordsLabel} fontWeight={'bold'}>
        Tap to show your secret words
      </TextView>
    </View>
  );

  return (
    <BaseScreen scrollViewProps={scrollViewProps} headerProps={headerProps}>
      <WarningModal />

      <View style={{height: height - 65}}>
        <View style={styles.title_wrapper}>
          <TextView style={styles.title}>YOUR MASTER SEED</TextView>
        </View>

        <TouchableOpacity style={styles.wordContainer} onPress={showSeed}>
          <View
            style={[
              styles.wordContainerInner,
              {opacity: showWords ? 1.0 : 0.0},
            ]}>
            {words}
          </View>
          {showWords ? null : blurredWords}
        </TouchableOpacity>

        <Spacer type={4} />

        <OutlinedButton title={'Complete Setup'} onPress={onSubmit} />
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  title_wrapper: {
    height: '10%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  title: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
  },

  wordContainer: {},

  wordContainerInner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },

  wordItem: {
    backgroundColor: '#00ffff',
    padding: 6,
    borderRadius: 6,
    margin: 4,
  },

  wordText: {
    color: 'black',
  },

  blurredWordsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
  },

  blurredWords: {
    resizeMode: 'contain',
    height: '100%',
    width: '100%',
    transform: [{scale: 1.1}],
  },

  blurredWordsLabel: {
    padding: 8,
    position: 'absolute',
    top: '45%',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
});

export default MnemonicScreen;
