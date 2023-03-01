import React from 'react';

import {
  AppState,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

// Self defined components
import BaseScreen from './BaseScreen';
import {HeaderButtonType} from '../components/Header';
import TextView from '../components/TextView';
import Spacer from '../components/Spacer';
import { DefaultFont } from '../styles/fonts';

// Hooks
import { useEncryptedStorage } from '../hooks/useEncryptedStorage';

// Classes
import Biometrics from '../device/biometrics';

// Image Assets
import IMAGE_UP_ARROW from '../../assets/images/up_arrow.png';
import IMAGE_LOCK_SMALL from '../../assets/images/lock_small.png';
import IMAGE_BIOMETRICS from '../../assets/images/biometrics.png';

import type { RootStackParamList } from '../App';

type RouteType = RouteProp<{params: { isActionExtension?: boolean }}, 'params'>;

export interface WalletLockedScreenInterface {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'WalletLockedScreen'
  >;

  route: RouteType | undefined;
}

const STATUS_EMPTY = ' ';

const WalletLockedScreen: React.FC<WalletLockedScreenInterface> = ({
  navigation, route,
}) => {
  const [password, setPassword] = React.useState('');
  const [statusMessage, setStatusMessage] = React.useState(STATUS_EMPTY);
  const [askedForBiometrics, setAskedForBiometrics] = React.useState(false);
  const [showBiometricsButton, setShowBiometricsButton] = React.useState(false);
  const [tryUnlock, setTryUnlock] = React.useState(false);
  const storage = useEncryptedStorage();

  const isActionExtension = route?.params?.isActionExtension ?? false;
  const continueUnlocked = (password.length > 5);

  const headerProps = {
    leftButtonType: HeaderButtonType.NONE,
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

  const continueButtonStyle = {
    opacity: continueUnlocked ? 1.0 : 0.3,
  };

  const updatePassword = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const text = e?.nativeEvent?.text ?? '';
    setPassword(text);

    if (statusMessage !== STATUS_EMPTY) setStatusMessage(STATUS_EMPTY);
  };

  const continuePressed = React.useCallback(() => {
    if (!storage) {
      return setStatusMessage('APPLICATION NOT READY');
    }

    storage.unlock(password).then(success => {
      // Check if password was correct
      if (!success) {
        setPassword('');
        setStatusMessage('INVALID PASSWORD ENTERED');
        return;
      }

      // Reset status indicator
      setStatusMessage('');

      // Reset Biometrics. This screen will only ask for biometrics once
      // per application lock and only when it's brought to foreground.
      setAskedForBiometrics(false);

      // Determine which screen to show next
      let nextScreenName: keyof RootStackParamList = 'HomeScreen';

      if (isActionExtension) {
        /**
         * Credential Provider Screen got called by ios.
         * Do not launch main application, instead launch custom screen
         * that will generate a password for the active 
         * application or webpage.
         */
        nextScreenName = 'CredentialProviderScreen';
      }

      // Navigate to next screen
      navigation.reset({
        index: 0,
        routes: [{ name: nextScreenName }],
      });
    }).catch(e => {
      console.error(e);
      setStatusMessage('Wallet could not be unlocked');
    });
  }, [password, isActionExtension, navigation, storage]);

  React.useEffect(() => {
    if (tryUnlock) {
      setTryUnlock(false);
      continuePressed();
    }
  }, [tryUnlock, continuePressed]);

  React.useEffect(() => {
    if (!storage) return;

    if (!Biometrics.supportsBiometricAuthentication()) {
      return setShowBiometricsButton(false);
    }

    // Check if the storage allows biometrical unlock
    setShowBiometricsButton(storage.allowsBiometricalUnlock);
  }, [storage]);

  const attemptBiometricalUnlock = React.useCallback((force = false) => {
    const execute = async () => {
      if (!storage) return;

      // Exit if biometrics button will not be shown
      if (!showBiometricsButton) return;

      // Exit if already asked for biometrics
      if (!force) {
        if (askedForBiometrics) return;
        setAskedForBiometrics(true);
      }

      // Get wallet encryption password.
      // This instruction will cause the OS to show the biometric dialog.
      const encryptionPassword = await storage.getWalletEncryptionPassword();
      if (!encryptionPassword) return;

      setPassword(encryptionPassword);

      // Delay execution of unlocking wallet.
      setTimeout(() => {
        setTryUnlock(true);
      }, 700);
    };

    execute().catch(e => console.error(e));
  }, [askedForBiometrics, storage, showBiometricsButton]);

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      // Only react when the app was brought to foreground
      if (!nextAppState.match(/^active/)) return;
      attemptBiometricalUnlock();
    });

    return () => {
      subscription.remove();
    };
  }, [storage, attemptBiometricalUnlock]);

  const biometricsButtonPressed = () => {
    attemptBiometricalUnlock(true);  
  };

  return (
    <BaseScreen scrollViewProps={scrollViewProps} headerProps={headerProps}>
      <View style={{ flex: 1 }}>
        <View style={styles.centerWrapper}>
          <Image source={IMAGE_LOCK_SMALL} style={styles.imageLock} />
        </View>

        <Spacer type={4} />

        <View style={styles.titleWrapper}>
          <TextView style={styles.title}>ENTER PASSWORD TO UNLOCK APP</TextView>
        </View>

        <Spacer type={4} />
        
        <View style={styles.titleWrapper}>
          <TextView style={styles.subTitle}>
            Enter your personal password to unlock the Authenticator.
          </TextView>
        </View>

        <Spacer type={4} />

        <View style={[styles.centerWrapper, styles.passwordInputWrapper]}>
          <TextInput
            style={styles.passwordInput}
            placeholder={'Input Password'}
            placeholderTextColor={'#585C68'}
            onChange={updatePassword}
            value={password}
            onSubmitEditing={continuePressed}
            {...textInputProps}
          />

          { showBiometricsButton && (
            <TouchableOpacity style={styles.biometricsButton} onPress={biometricsButtonPressed}>
              <Image source={IMAGE_BIOMETRICS} style={styles.biometricsImage} />
            </TouchableOpacity>
          )}
        </View>

        <Spacer type={1} />

        <TextView style={styles.redText}>{statusMessage}</TextView>

        <Spacer type={2} />

        <TouchableOpacity
          onPress={continuePressed}
          style={[continueButtonStyle, styles.continueButton]}
          disabled={!continueUnlocked}
        >
          <Image source={IMAGE_UP_ARROW} />
          <TextView style={styles.continueButtonText}>CONTINUE</TextView>
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
    padding: 8,
    fontSize: 18,
    fontFamily: DefaultFont.bold,
    flex: 1,
  },

  greenText: {
    color: '#00fb99',
    fontWeight: 'bold'
  },

  redText: {
    color: '#c1272d',
    fontWeight: 'bold',
    textAlign: 'center',
  },  

  continueButtonText: {
    color: 'white',
    marginTop: -25,
    fontSize: 18
  },

  continueButton: {
    alignItems: 'center',
  },

  imageLock: {
    resizeMode: 'contain',
    width: 120,
    height: 120,
  },

  centerWrapper: {
    alignItems: 'center',
  },

  passwordInputWrapper: {
    flexDirection: 'row',
    maxWidth: 320,
    alignItems: 'center',
  },

  biometricsButton: {
    width: 32,
    height: 32,
    marginLeft: 8,
  },

  biometricsImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default WalletLockedScreen;
