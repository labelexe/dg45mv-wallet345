import React from 'react';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import Video from 'react-native-video';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Self defined components
import BaseScreen from './BaseScreen';
import DigicorpLogo from '../components/DigicorpLogo';
import TextView from '../components/TextView';

// Assets
import IMAGE_UP_ARROW from '../../assets/images/up_arrow.png';
import IMAGE_LOGO from '../../assets/images/logo.png';
import VIDEO_HELMET from '../../assets/video/intro_helmet.mp4';
const VIDEO_PAUSE = 3000;

import type {RootStackParamList} from '../App';

export interface WelcomeScreenInterface {
  navigation: NativeStackNavigationProp<RootStackParamList, 'WelcomeScreen'>
}

const WelcomeScreen: React.FC<WelcomeScreenInterface> = ({navigation}) => {
  const [videoIsPaused, setVideoIsPaused] = React.useState(false);
  const playerRef = React.useRef<Video | null>(null);
  const timeoutHandle = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const onEnd = () => {
    playerRef.current?.seek(0);
    setVideoIsPaused(true);

    timeoutHandle.current = setTimeout(() => {
      setVideoIsPaused(false);
    }, VIDEO_PAUSE);
  };

  const clearTimeouts = () => {
    if (!timeoutHandle.current) return;
    clearTimeout(timeoutHandle.current);
    timeoutHandle.current = null;
  };

  React.useEffect(() => {
    clearTimeouts();
  }, []);

  return (
    <BaseScreen
      hideHeader={true}
      style={styles.baseScreenStyle}
      scrollViewInnerViewStyle={styles.scrollViewInner}>
      <View style={{ flex: 1, justifyContent: 'space-around' }}>
      
        <View style={styles.dgmv_logo_container}>
          <DigicorpLogo />
          <Image style={styles.dgmv_logo} source={IMAGE_LOGO} />
        </View>

        <View style={{ maxHeight: 320 }}>
          <Video
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            source={VIDEO_HELMET}
            style={styles.helmet}
            resizeMode="contain"
            onEnd={onEnd}
            rate={videoIsPaused ? 0.0 : 1.0}
            ref={(ref) => (playerRef.current = ref)}
          />
        </View>

        <View>
          <TextView style={styles.slogan}>
            SECURE AND RELIABLE AUTHENTICATION
          </TextView>

          <TouchableOpacity
            onPress={() => navigation.navigate('OnboardingScreen')}>
            <View style={{alignItems: 'center'}}>
              <Image source={IMAGE_UP_ARROW} />
              <TextView style={styles.gray_text}>ENTER</TextView>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  baseScreenStyle: {
    backgroundColor: '#000',
  },

  scrollViewInner: {
    paddingHorizontal: 0,
    paddingVertical: 20
  },

  dgmv_logo_container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },

  dgmv_logo: {
    width: '100%',
    maxWidth: 240,
    minHeight: 80,
    resizeMode: 'contain',
  },

  helmet: {
    width: '100%',
    maxHeight: 300,
    height: '100%',
    alignSelf: 'center',
  },

  gray_text: {
    marginTop: -25,
    color: '#888',
  },

  slogan: {
    color: '#00fb99',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    paddingHorizontal: 20,
    maxWidth: 270
  },
});

export default WelcomeScreen;
