import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Alert } from 'react-native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Camera } from 'react-native-vision-camera';

// Self defined components
import BaseScreen from './BaseScreen';
import {HeaderButtonType} from '../components/Header';
import type {RootStackParamList} from '../App';
import AuthenticationRequestModal from '../screens/AuthenticationRequestModal';

// Events
import events, {Events} from '../events';

// Hooks
import { useEncryptedStorage } from '../hooks/useEncryptedStorage';

// Classes
import DeepLinkState from '../authentication/DeepLinkState';
import AuthenticationRequest from '../authentication/AuthenticationRequest';

// Images
import IMAGE_CAMERA from '../../assets/images/camera.png';

export interface HomeScreenInterface {
  navigation: NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>
}

const HomeScreen: React.FC<HomeScreenInterface> = ({navigation}) => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [request, setRequest] = React.useState<AuthenticationRequest | null>(null);

  const storage = useEncryptedStorage();

  const cameraButtonPressed = () => {
    const execute = async () => {
      const status = await Camera.requestCameraPermission();
      if (status === 'authorized') {
        setHasPermission(true);
      }
    };   

    execute().catch(e => console.error(e));
  };

  // Link Handler.
  // Requests are only handled when the application is unlocked.
  const handleLink = React.useCallback((url: string) => {
    // AuthenticationRequest came in. Authenticate if possible.
    console.log('Handle URL', url);

    try {
      const digiIdRequest = AuthenticationRequest.fromURL(url);

      setRequest(digiIdRequest);

      digiIdRequest.init().then(() => {
        // ToDo: Rerender modal...
      }).catch(e => console.error(e));

    } catch (e) {
      // ToDo: Show error with custom UI
      console.error(e);

      if (e instanceof Error) {
        Alert.alert('Authentication failed', e.message);      
      }
    }

  }, []);

  const screenFocused = React.useCallback(() => {
    // When this screen is shown, check if a link caused this
    // app to open.
    if (DeepLinkState.hasRequest()) {
      const requestURL = DeepLinkState.getRequest();
      handleLink(requestURL);
    }
  }, [handleLink]);

  // Scan Handler.
  // Camera is opened, if the user gave permission or the system claims
  // the user has permissions already.
  React.useEffect(() => {
    // Do not open camera screen if user denied permissions
    if (!hasPermission) return;

    // Show Camera Screen (Modal)
    navigation.navigate('CameraScreen');

    // Reset permissions
    setHasPermission(false);
  }, [hasPermission, navigation]);  

  // QR Code Event Handler
  // Calls handleAuthenticationRequest() with the URL that was extracted
  // from a QR code using the camera scanner.
  React.useEffect(() => {
    // Listen for scanner event and handle authentication request
    // appropriately.
    const subscription = events.addListener(
      Events.AUTHENTICATION_REQUEST,
      handleLink,
    );
    
    return () => subscription.remove();    
  }, [handleLink]);

  // Check if deep link was opened
  useFocusEffect(screenFocused);

  const headerProps = {
    leftButtonType: HeaderButtonType.NONE,
    rightButtonType: HeaderButtonType.SETTINGS,
    rightButtonProps: {
      onPress: () => {
        // Temporary onPress handler (for PoC only)
        if (!storage) return;

        storage.clear().then(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'WelcomeScreen' }],
          });
        });
      },
    },
  };

  const scrollViewProps = {
    scrollEnabled: false,
  };  

  return (
    <BaseScreen scrollViewProps={scrollViewProps} headerProps={headerProps}>
      <AuthenticationRequestModal request={request} onClose={() => setRequest(null)} />

      <View style={styles.center}>
        <TouchableOpacity onPress={cameraButtonPressed} style={styles.cameraButton}>
          <Image source={IMAGE_CAMERA} style={styles.cameraImage} />
        </TouchableOpacity>
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cameraButton: {
    // marginTop: 40,
  },

  cameraImage: {
    resizeMode: 'contain',
    width: 200,
    height: 200,
  },
});

export default HomeScreen;
