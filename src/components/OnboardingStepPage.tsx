import React from 'react';

import {
  StyleSheet,
  View,
  Animated,
} from 'react-native';

import TextView from './TextView';
import Spacer from './Spacer';

import { useMediaQuery } from 'react-responsive';

interface OnboardingStepPageProps {
  title: string,
  subtitle: string,
  imageURI: HTMLImageElement,
  index: number
}

export type OnboardingStepPageHandle = {
  appear: () => void;
};

const OnboardingStepPage = React.forwardRef<OnboardingStepPageHandle, OnboardingStepPageProps>(function OnboardingStepPageWithRef(props, ref) {
  const { title, subtitle, imageURI } = props;

  const zoomAnimation = React.useRef(new Animated.Value(0)).current;
  const appearedRef = React.useRef(false);

  const isTabletOrMobileDevice = useMediaQuery({    
    minDeviceWidth: 1224,
    query: '(min-device-width: 1224px)'  
  });

  React.useImperativeHandle(ref, () => ({
    appear: () => {
      if (appearedRef.current) return;
      appearedRef.current = true;

      Animated.spring(zoomAnimation, {
        stiffness: 400,
        damping: 16,
        toValue: 1,
        delay: 250,
        useNativeDriver: true,
      }).start();
    },
  }));

  const zoomingImageStyle = {
    transform: [
      {
        scale: zoomAnimation.interpolate({
          inputRange: [0.00, 1.20],
          outputRange: [0.75, 0.9],
        }),
      },
    ],
  };

  return (
    <View style={styles.scroll_container}>
      <View style={styles.wallet_img_container}>

        <Animated.Image
          style={[styles.fitImage, zoomingImageStyle]}
          source={imageURI}
        />
      </View>

      <Spacer type={1} />
      
      <View>
        <TextView style={isTabletOrMobileDevice ? styles_tablet.title : styles.title} fontWeight={'bold'}>
          {title}
        </TextView>
        <TextView style={isTabletOrMobileDevice ? styles_tablet.title : styles.title} fontWeight={'light'}>
          {subtitle}
        </TextView>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  scroll_container: {
    width: '25%',
    flex: 1,
  },

  title: {
    color: '#00fb99',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
  },

  fitImage: {
    height: '90%',
    maxHeight: 400,
    resizeMode: 'contain'
  },

  wallet_img_container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const styles_tablet = StyleSheet.create({
  title: {
    color: '#00fb99',
    textAlign: 'center',
    fontSize: 28,
    marginBottom: 10,
  },
});

export default OnboardingStepPage;