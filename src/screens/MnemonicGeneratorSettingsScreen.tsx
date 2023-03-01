import React from 'react';
import {StyleSheet, View} from 'react-native';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import TextView from '../components/TextView';
import Switch from '../components/Switch';

import events, { Events } from '../events';

// Self defined components
import BaseScreen from './BaseScreen';
import {HeaderButtonType} from '../components/Header';
import Spacer from '../components/Spacer';

import type {RootStackParamList} from '../App';
import MnemonicGenerator, {
  BIP39_WORDS,
  MnemonicGeneratorSettings,
} from '../crypto/MnemonicGenerator';

export interface MnemonicGeneratorSettingsScreenInterface {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'MnemonicGeneratorSettingsScreen'
  >
}

const MnemonicGeneratorSettingsScreen: React.FC<
  MnemonicGeneratorSettingsScreenInterface
> = ({navigation}) => {
  const initialSettings: MnemonicGeneratorSettings = MnemonicGenerator.getSettings();

  const [isSeedEncrypted, setIsSeedEncrypted] = React.useState(
    initialSettings.isSeedEncrypted,
  );

  const [seedPassphrase, setSeedPassphrase] = React.useState(
    initialSettings.seedPassphrase,
  );

  const [numberOfWords, setNumberOfWords] = React.useState(
    initialSettings.numberOfWords,
  );

  const headerProps = {
    leftButtonType: HeaderButtonType.BACK, 
  };

  const scrollViewProps = {
    scrollEnabled: true,
  };

  const showSeedPassphraseModal = (val: boolean) => {
    if (val) {
      // Show modal and ask for seed passphrase
      navigation.navigate('MnemonicPassphraseModal');
    } else {
      // Clear passphrase on disable
      setIsSeedEncrypted(false);
      setSeedPassphrase('');
    }
  };

  React.useEffect(() => {
    const onPassphraseSelected = (passphrase: string) => {
      setIsSeedEncrypted(true);
      setSeedPassphrase(passphrase);
    };

    const subscription = events.addListener(
      Events.PASSPHRASE_SELECTED,
      onPassphraseSelected,
    );
    
    return () => subscription.remove();
  }, []);

  React.useEffect(() => {
    MnemonicGenerator.updateSettings({
      isSeedEncrypted,
      seedPassphrase,
      numberOfWords,
    });
  }, [isSeedEncrypted, seedPassphrase, numberOfWords]);

  return (
    <BaseScreen scrollViewProps={scrollViewProps} headerProps={headerProps}>
      <View style={{flex: 1}}>
        <View style={styles.flex_wrapper}>
          <Switch isOn={isSeedEncrypted} onToggle={showSeedPassphraseModal} />
          <View style={styles.switch_wrapper}>
            <TextView style={styles.switch_title}>
              ENCRYPT SEED WITH PASSPHRASE
            </TextView>
            <TextView style={styles.switch_text}>
              Encrypting your seed with a passphrase will provide an additional
              layer of security.
            </TextView>
          </View>
        </View>

        <Spacer type={2} />

        <View style={styles.flex_wrapper}>
          <Switch
            isOn={numberOfWords === BIP39_WORDS.N24}
            onToggle={(newValue) =>
              setNumberOfWords(newValue ? BIP39_WORDS.N24 : BIP39_WORDS.N12)
            }
          />
          <View style={styles.switch_wrapper}>
            <TextView style={styles.switch_title}>MAXIMUM SECURITY</TextView>
            <TextView style={styles.switch_text}>
              24 words yield 256 bits of entropy, which is considered more
              secure.
            </TextView>
          </View>
        </View>
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  flex_wrapper: {
    display: 'flex',
    flexDirection: 'row',
  },

  switch_wrapper: {
    marginLeft: 20,
    width: '80%',
    alignItems: 'flex-start',
  },

  switch_title: {
    color: '#00fb99',
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 12,
    width: '100%',
    marginBottom: 2,
  },

  switch_text: {
    color: '#aaa',
    fontWeight: 'bold',
    textAlign: 'justify',
    fontSize: 12,
    width: '100%',
  },

  switch_text_minor: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#888',
    textAlign: 'left',
  },

  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },

  advancedHeading: {
    textAlign: 'center',
    color: '#00fb99',
    fontWeight: 'bold',
    fontSize: 12,
  },

  advancedButton: {
    padding: 4,
  },
});

export default MnemonicGeneratorSettingsScreen;
