import React from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  PanResponder,
  LayoutChangeEvent,
  ScrollView,
} from 'react-native';

import QRCode from 'react-native-qrcode-svg';
import {useWindowDimensions} from 'react-native';
import {Bar as ProgressBar} from 'react-native-progress';
import {useFocusEffect} from '@react-navigation/native';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Self defined components
import BaseScreen from './BaseScreen';
import {HeaderButtonType} from '../components/Header';
import TextView from '../components/TextView';
import Spacer from '../components/Spacer';

// Core modules
import * as Haptic from '../device/haptic';
import * as Hashing from '../crypto/Hashing';
import MnemonicGenerator from '../crypto/MnemonicGenerator';

// Image Assets
import IMAGE_FINGERPRINT from '../../assets/images/fingerprint.png';

import type {RootStackParamList} from '../App';

export interface MnemonicGeneratorScreenInterface {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'MnemonicGeneratorSettingsScreen'
  >
}

const STEPS_REQUIRED = process.env.NODE_ENV === 'production' ? 50 : 30;

const MnemonicGeneratorScreen: React.FC<MnemonicGeneratorScreenInterface> = ({
  navigation,
}) => {
  const {height} = useWindowDimensions();

  const scrollViewRef = React.createRef<ScrollView>();

  const [lastPosition, setLastPosition] = React.useState({x: 0, y: 0});
  const [qrData, setQrData] = React.useState<string>('DGMV will conquer the world!');
  const [qrSize, setQrSize] = React.useState(200);
  const [generatorProgress, setGeneratorProgress] = React.useState(0.3);
  const rngProcessing = React.useRef(false);
  const stepsDone = React.useRef(0);

  // Open seed generator settings menu
  const advancedTapped = () => {
    navigation.navigate('MnemonicGeneratorSettingsScreen');
  };

  // Generate
  const generatorStep = React.useCallback(() => {
    if (rngProcessing.current) return;
    rngProcessing.current = true; // roadblock

    const content = Buffer.from(JSON.stringify(lastPosition));

    // Generate a secure number.
    // This internally causes the secure number generator to go several
    // steps forward. It does not enhance security for native devices, as those
    // use a crypto RNG anyway.
    // It will mainly affect the web extension RNG.
    MnemonicGenerator.step(content, (b) => {
      if (b === null) return;

      // Prepare content
      const buffers: Buffer[] = [b, content];
      const hashContent = Buffer.concat(buffers);

      // Hash content
      const hash = Hashing.sha256(hashContent);

      // Update QR Code
      setQrData(hash.substr(0, hash.length / 2));

      // Emit haptic event
      Haptic.light();

      // Progress
      stepsDone.current += 1;
      setGeneratorProgress(stepsDone.current / STEPS_REQUIRED);

      if (stepsDone.current >= STEPS_REQUIRED) {
        // All touch steps absolved. Move to next screen
        MnemonicGenerator.generateMnemonic((mnemonic: string | null) => {
          if (mnemonic === null) {
            return Alert.alert('Unexpected error', 'A seed phrase could not be created for unknown reasons. Please try again or contact support!');
          }

          // We didn't decide to use parameters to pass the mnemonic.
          // Instead, for security reasons, we are storing the seed
          // in the MnemonicGenerator itself.
          // That way, we can clear the mnemonic when we are not using
          // it anymore. This makes sure, it isn't kept in memory throughout
          // the whole application lifetime.
          MnemonicGenerator.lastKnownMnemonic = mnemonic;
          navigation.navigate('MnemonicScreen');
        });  

      } else {
        // Wait a bit until we allow the user to pan again
        setTimeout(() => {
          rngProcessing.current = false;
        }, 80);
      }
    });
  }, [lastPosition, navigation]);

  const initGenerator = React.useCallback(() => {
    setGeneratorProgress(0.3);
    stepsDone.current = 0;
    rngProcessing.current = false;
  }, []);

  React.useEffect(() => {
    MnemonicGenerator.reset();
  }, []);

  // Initialize seed generator when this screen is shown
  useFocusEffect(initGenerator);

  // PanHandler updated the finger/mouse position.
  // Try to generate a new step
  React.useEffect(() => {
    generatorStep();
  }, [generatorStep]);

  // Create pan handler for generating a secure seed (for pseudo only).
  const panResponder = React.useRef(
    PanResponder.create({
      onPanResponderTerminationRequest: () => false,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event, gestureState) => {
        const scrollView = scrollViewRef.current;
        if (!scrollView) return;
        scrollView.setNativeProps({ scrollEnabled: false });
        setLastPosition({
          x: gestureState.x0,
          y: gestureState.y0,
        });
      },
      onPanResponderRelease: () => {
        const scrollView = scrollViewRef.current;
        if (!scrollView) return;        
        scrollView.setNativeProps({ scrollEnabled: true });
      },
      onPanResponderMove: (event, gestureState) => {
        setLastPosition({x: gestureState.dx, y: gestureState.dy});
      },
    }),
  ).current;

  const resizeQrCode = (event: LayoutChangeEvent) => {
    const height = event?.nativeEvent?.layout?.height ?? 200;
    setQrSize(height);
  };

  const headerProps = {
    leftButtonType: HeaderButtonType.BACK,
  };

  const scrollViewProps = {
    scrollEnabled: true,
  };

  return (
    <BaseScreen scrollViewProps={scrollViewProps} headerProps={headerProps} scrollViewRef={scrollViewRef}>
      <View style={{height: height - 65}}>
        <View style={styles.title_wrapper}>
          <TextView style={styles.title}>CREATE MASTER SEED</TextView>
        </View>

        {/* Display a QR code which displays arbitrary data */}
        {/* This QR code is useless in general, but is for UI feedback only */}
        {/* ToDo: Replace with something smarter */}
        <View style={styles.qrcode_wrapper} onLayout={resizeQrCode}>
          <QRCode
            value={qrData}
            size={qrSize}
            backgroundColor="#01071b"
            color="#33eeff"
          />
        </View>

        <Spacer type={1} />

        <View style={styles.progressbar_wrapper}>
          {/* Progress bar will keep spinning until the user rubs the box below for the first time. */}
          <ProgressBar
            progress={generatorProgress}
            indeterminate={stepsDone.current === 0}
            indeterminateAnimationDuration={2000}
            color="rgba(21, 238, 255, 1)"
            width={200}
          />
        </View>

        <Spacer type={1} />

        {/* This box shows the instructions of rubbing on the screen */}
        <View style={styles.fingerprint_wrapper} {...panResponder.panHandlers}>
          <View style={styles.fingerprint_box}>
            <TextView
              style={{
                color: '#01071b',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 18,
                marginBottom: 8,
              }}>
              RUB HERE
            </TextView>
            <TextView
              style={{color: '#01071b', textAlign: 'center', fontSize: 12}}>
              To see your seed phrase, use your thumb to rub this box until the
              progress bar is filled.
            </TextView>
            <Image
              source={IMAGE_FINGERPRINT}
              style={{
                height: '50%',
                width: '50%',
                resizeMode: 'contain',
                marginLeft: 12,
              }}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.advancedButton}
          onPress={advancedTapped}>
          <TextView style={styles.advancedHeading}>
            {'ADVANCED SETTINGS'}
          </TextView>
        </TouchableOpacity>
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

  qrcode_wrapper: {
    height: '35%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressbar_wrapper: {
    height: '5%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fingerprint_wrapper: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 180,
  },

  fingerprint_box: {
    width: 270,
    backgroundColor: '#33eeff',
    borderRadius: 10,
    padding: 15,
    paddingBottom: 0,
    display: 'flex',
    alignItems: 'center',
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 4,
    shadowOpacity: 0.5,
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

export default MnemonicGeneratorScreen;
