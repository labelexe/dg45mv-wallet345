
import React from 'react';

import {
  AppState,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthenticationCompletedScreen from './screens/AuthenticationCompletedScreen';
import CodeGeneratorScreen from './screens/CodeGeneratorScreen';
import AuthenticatorScreen from './screens/AuthenticatorScreen';
import ScanQRCodeScreen from './screens/ScanQRCodeScreen';
import GeneratePasswordScreen from './screens/GeneratePasswordScreen';
import AuthenticationInProcessScreen from './screens/AuthenticationInProcessScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import MnemonicGeneratorScreen from './screens/MnemonicGeneratorScreen';
import MnemonicGeneratorSettingsScreen from './screens/MnemonicGeneratorSettingsScreen';
import MnemonicPassphraseModal from './screens/MnemonicPassphraseModal';
import MnemonicScreen from './screens/MnemonicScreen';
import ImportMnemonicScreen from './screens/ImportMnemonicScreen';
import CredentialProviderScreen from './screens/extensions/CredentialProviderScreen';
import CreatePasswordScreen from './screens/CreatePasswordScreen';
import SuccessScreen from './screens/SuccessScreen';
import SetupScreen from './screens/SetupScreen';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import WalletLockedScreen from './screens/WalletLockedScreen';

import { ServiceIdentifier } from './modules/CredentialProviderRequest';
import { EncryptedStorageContext } from './hooks/useEncryptedStorage';
import Biometrics from './device/biometrics';
import events, {Events} from './events';

import createEncryptedStorage, { EncryptedStorage, handleCorruptedStorage } from './storage/EncryptedStorage';

interface LaunchProps {
  isActionExtension: boolean;
  serviceIdentifiers: ServiceIdentifier[];
}

export type RootStackParamList = {
  ScanQRCodeScreen: undefined;
  AuthenticationInProcessScreen: undefined;
  GeneratePasswordScreen: undefined;
  AuthenticationCompletedScreen: undefined;
  CodeGeneratorScreen: undefined;
  AuthenticatorScreen: undefined;
  CredentialProviderScreen: { serviceIdentifiers: ServiceIdentifier[] };
  OnboardingScreen: undefined;
  WelcomeScreen: undefined;
  MnemonicGeneratorScreen: undefined;
  MnemonicGeneratorSettingsScreen: undefined;
  MnemonicScreen: undefined;
  ImportMnemonicScreen: undefined;
  CreatePasswordScreen: undefined;
  SuccessScreen: undefined;
  SetupScreen: undefined;
  MnemonicPassphraseModal: undefined;
  HomeScreen: undefined;
  CameraScreen: undefined;
  WalletLockedScreen: { isActionExtension: boolean };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
type ScreenName = keyof RootStackParamList;

const DEFAULT_OTHER_OPTIONS = {};
const getScreenConfig = (otherOptions: object = DEFAULT_OTHER_OPTIONS) => {
  const config = {
    headerStyle: {
      backgroundColor: '#000',
    },
    headerTintColor: '#fff',
    headerShown: false,
    ...otherOptions,
  };

  return config;
};

const App: React.FC<LaunchProps> = (props: LaunchProps) => {
  const {
    isActionExtension,
  } = props;

  const [encryptedStorage, setEncryptedStorage] = React.useState<EncryptedStorage | null>(null);
  const [storageIsSetup, setStorageIsSetup] = React.useState(false);
  const navigationRef = createNavigationContainerRef();
  const appIsLoading = encryptedStorage == null;

  const defaultScreenConfig = getScreenConfig();

  // Determine which screen to initially show.
  const initialRouteName: ScreenName = React.useMemo(() => {
    if (storageIsSetup) {
      /**
       * Wallet is locked the first time the application is launched.
       **/
      return 'WalletLockedScreen';

    } else {
      /** Initial launch. Show splash screen with rotating helmet. */
      return 'WelcomeScreen';
    }
  }, [storageIsSetup]);

  /**
   * Initialize application.
   * - Initialize Biometrics support
   * - Create/Load encrypted storage
   */
  React.useEffect(() => {
    const execute = async () => {
      // Initialize Biometrics
      await Biometrics.init();

      // Initialize Storage
      try {
        const storage = await createEncryptedStorage();
        const isSetup = storage.isSetup;

        setStorageIsSetup(isSetup);
        setEncryptedStorage(storage);        
        console.log('Storage initialized!');

      } catch (e) {
        handleCorruptedStorage(e as Error);
      }
    };

    execute().catch(e => console.error(e));
  }, []);

  /**
   * AppState Listener.
   * Notify and lock storage when the app goes into background.
   */
  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (!encryptedStorage || !encryptedStorage.isSetup) return;

      if (nextAppState.match(/inactive/)) {
        console.log('App has become inactive!');

        // Lock wallet
        encryptedStorage.lock()
          .catch(e => console.error(e))
          .finally(() => events.emit(Events.WALLET_LOCKED));
        
        // Navigate back to wallet locked screen
        if (navigationRef.isReady()) {
          navigationRef.navigate('WalletLockedScreen' as never, {
            isActionExtension: isActionExtension
          } as never);
        }
      }
    });

    return () => {
      subscription.remove();
    };    
  }, [encryptedStorage, storageIsSetup, navigationRef, isActionExtension]);

  /**
   * SplashScreen handler.
   * Close app LaunchScreen when everything is loaded, that is,
   * when the storage is initialized.
   */
  React.useEffect(() => {
    if (!appIsLoading) SplashScreen.hide();
  }, [appIsLoading]);

  /**
   * Render nothing until secure storage is initialized
   */
  if (appIsLoading) {
    return null;
  }

  return (
    <EncryptedStorageContext.Provider value={encryptedStorage}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName={initialRouteName}>
          <Stack.Screen
            name={'ScanQRCodeScreen'}
            component={ScanQRCodeScreen}
            options={defaultScreenConfig}
          />

          <Stack.Screen
            name={'AuthenticationInProcessScreen'}
            component={AuthenticationInProcessScreen}
            options={defaultScreenConfig}
          />

          <Stack.Screen
            name={'GeneratePasswordScreen'}
            component={GeneratePasswordScreen}
            options={defaultScreenConfig}
          />

          <Stack.Screen
            name={'AuthenticationCompletedScreen'}
            component={AuthenticationCompletedScreen}
            options={defaultScreenConfig}
          />

          <Stack.Screen
            name={'CodeGeneratorScreen'}
            component={CodeGeneratorScreen}
            options={defaultScreenConfig}
          />

          <Stack.Screen
            name={'AuthenticatorScreen'}
            component={AuthenticatorScreen}
            options={defaultScreenConfig}
          />

          <Stack.Screen
            name={'OnboardingScreen'}
            component={OnboardingScreen}
            options={defaultScreenConfig}
          />

          <Stack.Screen
            name={'WelcomeScreen'}
            component={WelcomeScreen}
            options={getScreenConfig({ animation: 'none' })}
          />

          <Stack.Screen
            name={'MnemonicGeneratorScreen'}
            component={MnemonicGeneratorScreen}
            options={defaultScreenConfig}
          />
          
          <Stack.Screen
            name={'MnemonicScreen'}
            component={MnemonicScreen}
            options={defaultScreenConfig}
          />

          <Stack.Screen
            name={'MnemonicGeneratorSettingsScreen'}
            component={MnemonicGeneratorSettingsScreen}
            options={defaultScreenConfig}
          />

          <Stack.Screen
            name={'ImportMnemonicScreen'}
            component={ImportMnemonicScreen}
            options={defaultScreenConfig}
          />

          <Stack.Screen
            name={'SetupScreen'}
            component={SetupScreen}
            options={defaultScreenConfig}
          />        

          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen
              name={'MnemonicPassphraseModal'}
              component={MnemonicPassphraseModal}
              options={defaultScreenConfig}
            />

            <Stack.Screen
              name={'CameraScreen'}
              component={CameraScreen}
              options={defaultScreenConfig}
            />
          </Stack.Group>

          <Stack.Screen
            name={'CreatePasswordScreen'}
            component={CreatePasswordScreen}
            options={defaultScreenConfig}
          />

          <Stack.Screen
            name={'SuccessScreen'}
            component={SuccessScreen}
            options={defaultScreenConfig}
          />

          <Stack.Screen
            name={'CredentialProviderScreen'}
            component={CredentialProviderScreen}
            options={defaultScreenConfig}
            initialParams={{ serviceIdentifiers: props.serviceIdentifiers }}
          />

          <Stack.Screen
            name={'HomeScreen'}
            component={HomeScreen}
            options={defaultScreenConfig}
          />

          <Stack.Screen
            name={'WalletLockedScreen'}
            component={WalletLockedScreen}
            options={getScreenConfig({ animation: 'none' })}
            initialParams={{ isActionExtension }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </EncryptedStorageContext.Provider>
  );
};

export default App;
