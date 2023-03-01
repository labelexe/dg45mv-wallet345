import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  TextInputProps,
  Alert,
} from 'react-native';

import {useWindowDimensions} from 'react-native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Bar as ProgressBar} from 'react-native-progress';
import { passwordStrength } from 'check-password-strength';

// Self defined components
import BaseScreen from './BaseScreen';
import {HeaderButtonType} from '../components/Header';
import TextView from '../components/TextView';
import Spacer from '../components/Spacer';
import CheckBox from '../components/CheckBox';
import { DefaultFont } from '../styles/fonts';

// Classes
import MnemonicGenerator from '../crypto/MnemonicGenerator';
import Biometrics from '../device/biometrics';

// Hooks
import { useEncryptedStorage } from '../hooks/useEncryptedStorage';

// Image Assets
import IMAGE_UP_ARROW from '../../assets/images/up_arrow.png';

import type {RootStackParamList} from '../App';

const MIN_PASSWORD_STRENGTH = 0;

export interface CreatePasswordScreenInterface {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'CreatePasswordScreen'
  >
}

const CreatePasswordScreen: React.FC<CreatePasswordScreenInterface> = ({
  navigation,
}) => {
  const {height} = useWindowDimensions();
  const [checkedAnn, setCheckedAnn] = useState(false);
  const [checkedTerms, setCheckedTerms] = useState(false);
  const [checkedBiometrics, setCheckedBiometrics] = useState(false);

  const [passwordStrengthLevel, setPasswordStrengthLevel] = React.useState(0);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [continueUnlocked, setContinueUnlocked] = useState(false);

  const storage = useEncryptedStorage();

  // Unlock button
  React.useEffect(() => {
    setContinueUnlocked(
      checkedAnn &&
      checkedTerms &&
      password !== '' &&
      password === confirmPassword &&
      passwordStrengthLevel >= MIN_PASSWORD_STRENGTH
    );
  }, [password, confirmPassword, passwordStrengthLevel, checkedAnn, checkedTerms]);  

  const headerProps = {
    leftButtonType: HeaderButtonType.BACK,
  };

  const scrollViewProps = {
    scrollEnabled: true,
  };

  const textInputProps: TextInputProps = {
    autoCapitalize: 'none',
    autoComplete: 'off',
    autoCorrect: false,
    clearTextOnFocus: true,
    secureTextEntry: true,
  };

  const updatePassword = (isConfirmPassword = false) => {
    return (e: { nativeEvent: { text: string; }; }) => {
      const newValue = e?.nativeEvent?.text;

      if (!isConfirmPassword) { // First password box
        // Calculate password strength
        const strength = passwordStrength(newValue);
        setPasswordStrengthLevel(strength.id);
        setPassword(newValue);

      } else {
        // Second password box
        setConfirmPassword(newValue);
      }
    };
  };

  const continueButtonStyle = {
    opacity: continueUnlocked ? 1.0 : 0.3,
  };

  const continuePressed = () => {
    const execute = async () => {
      const mnemonic = MnemonicGenerator.lastKnownMnemonic;
      const seedPassphrase = MnemonicGenerator.getSettings().seedPassphrase;

      if (!mnemonic || storage == null) {
        return Alert.alert('Unexpected Error', 'There was an error setting up the wallet! Please try again or contact support.');
      }

      const isSetup = await storage.setup(password, mnemonic, seedPassphrase, checkedBiometrics);
      if (!isSetup) {
        return Alert.alert('Unexpected Error', 'There was an error setting up the wallet. Please try again or contact support.');
      }

      MnemonicGenerator.reset();
      navigation.navigate('SuccessScreen');
    };

    execute().catch((e: Error) => {
      Alert.alert(`Unexpected error: ${e.message}`);
    });
  };

  const passwordStrengthInfo = React.useMemo(() => {
    switch (passwordStrengthLevel) {
    case 1: return {
      description: 'weak',
      level: 0.316,
    };

    case 2: return {
      description: 'medium',
      level: 0.633,
    };

    case 3: return {
      description: 'strong',
      level: 100,
    };

    case 0:
    default:
      return {
        description: 'very weak',
        level: 0.05,
      };    
    }
  }, [passwordStrengthLevel]);

  const updateCheckedBiometrics = React.useCallback((newState) => {
    if (!newState) return setCheckedBiometrics(false);

    Biometrics.testBiometrics().then(success => {
      if (success === true) {
        setCheckedBiometrics(true);
      } else {
        setCheckedBiometrics(false);
        Alert.alert('Biometrics Error', `Could not utilize ${Biometrics.getSensorName()} sensor.`);
      }
    }).catch(() => null); // Does not throw
  }, []);

  return (
    <BaseScreen scrollViewProps={scrollViewProps} headerProps={headerProps}>
      <View style={{height: height - 65}}>
        <View style={styles.titleWrapper}>
          <TextView style={styles.title}>CREATE A WALLET PASSWORD</TextView>
        </View>

        <Spacer type={1} />
        
        <View style={styles.titleWrapper}>
          <TextView style={styles.subTitle}>
            Choose a strong password to unlock your wallet.
          </TextView>
        </View>

        <Spacer type={3} />

        <TextInput
          style={styles.passwordInput}
          placeholder={'Input Password'}
          placeholderTextColor={'#585C68'}
          onChange={updatePassword(false)}
          {...textInputProps}
        />
        <TextInput
          style={styles.passwordInput}
          placeholder={'Confirm Password'}
          placeholderTextColor={'#585C68'}
          onChange={updatePassword(true)}
          {...textInputProps}
        />

        <View style={styles.passwordStrength}>
          <Text style={styles.text}>Password Strength:{'\n'}{passwordStrengthInfo.description.toUpperCase()}</Text>
          <View style={styles.progressbarWrapper}>
            <ProgressBar
              progress={passwordStrengthInfo.level}
              color="rgba(21, 238, 255, 1)"
              width={150}
            />
          </View>
        </View>

        <Spacer type={3} />

        { Biometrics.supportsBiometricAuthentication() && (
          <View style={styles.checkboxWrapper}>
            <CheckBox checked={checkedBiometrics} onPress={() => updateCheckedBiometrics(!checkedBiometrics)}/>
            <View style={styles.checkboxText}>
              <Text style={[styles.text, styles.greenText]}>USE BIOMETRICS</Text>
              <Text style={styles.text}>Use biometrics to unlock the app instead of entering the wallet password.</Text>
            </View>
          </View>
        )}

        <View style={styles.checkboxWrapper}>
          <CheckBox checked={checkedAnn} onPress={() => setCheckedAnn(!checkedAnn)}/>
          <View style={styles.checkboxText}>
            <Text style={styles.text}>I understand that the wallet cannot be unlocked without the password. Recovering the wallet is only possible with the seed.</Text>
          </View>
        </View>

        <View style={styles.checkboxWrapper}>
          <CheckBox checked={checkedTerms} onPress={() => setCheckedTerms(!checkedTerms)}/>
          <View style={styles.checkboxText}>
            <Text style={[styles.text, styles.greenText]}>THERMS AND CONDITIONS</Text>
            <Text style={styles.text}>I agree to all the terms and conditions of using this application.</Text>
          </View>
        </View>    

        <TouchableOpacity
          onPress={continuePressed}
          style={[continueButtonStyle, styles.continueButton]}
          disabled={!continueUnlocked}
        >
          <Image source={IMAGE_UP_ARROW} />
          <Text style={styles.continueButtonText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
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

  subTitle: {
    color: '#bbbbbb',
    textAlign: 'center',
    fontSize: 20,
  },

  text: {
    color: '#bbbbbb',
    fontSize: 12,
    textAlign: 'left',
  },

  passwordInput: {
    backgroundColor: '#8A8D96',
    borderRadius: 10,
    marginBottom: 20,
    padding: 8,
    fontSize: 18,
    fontFamily: DefaultFont.bold,
  },

  progressbarWrapper: {
    marginLeft: 14,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  passwordStrength: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 2,
  },

  checkboxWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },

  checkboxText: {
    paddingLeft: 40,
    paddingRight: 40
  },

  greenText: {
    color: '#00fb99',
    fontWeight: 'bold'
  },

  redText: {
    color: '#c1272d',
    fontWeight: 'bold'
  },  

  continueButtonText: {
    color: 'white',
    marginTop: -25,
    fontSize: 18
  },

  continueButton: {
    alignItems: 'center',
  },
});

export default CreatePasswordScreen;
