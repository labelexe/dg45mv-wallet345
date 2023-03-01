import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Animated,
} from 'react-native';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Self defined components
import BaseScreen from './BaseScreen';
import {HeaderButtonType} from '../components/Header';
import TextView from '../components/TextView';
import Spacer from '../components/Spacer';

// Image Assets
import IMAGE_HOME from '../../assets/images/home.png';
import IMAGE_SUCCESS from '../../assets/images/success_bg.png';

import type {RootStackParamList} from '../App';

export interface SuccessScreenInterface {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'SuccessScreen'
  >
}

const SuccessScreen: React.FC<SuccessScreenInterface> = ({
  navigation,
}) => {
  const zoomAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!zoomAnimation) return;
    
    Animated.spring(zoomAnimation, {
      stiffness: 800,
      damping: 15,
      toValue: 1,
      delay: 250,
      useNativeDriver: true,
    }).start();
  }, [zoomAnimation]);

  const zoomingImageStyle = {
    transform: [
      {
        scale: zoomAnimation.interpolate({
          inputRange: [0.00, 1.20],
          outputRange: [0.70, 1.20],
        }),
      },
    ],
  };  

  const headerProps = {
    leftButtonType: HeaderButtonType.NONE,
  };

  const scrollViewProps = {
    scrollEnabled: true,
  };

  const continuePressed = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeScreen' }],
    });    
  };

  return (
    <BaseScreen scrollViewProps={scrollViewProps} headerProps={headerProps}>
      <View style={{flex: 1, marginBottom: 20}}>
        <View style={styles.titleWrapper}>
          <TextView style={[styles.title, styles.greenText]}>SUCCESS</TextView>
        </View>
        <Spacer type={1} />
        <View style={styles.titleWrapper}>
          <TextView style={styles.subTitle}>Your secret seed was successfully imported.</TextView>
        </View>
        <View style={styles.centerWrapper}>
          <Animated.Image source={IMAGE_SUCCESS} style={[styles.successImage, zoomingImageStyle]} />
        </View>
        <TouchableOpacity onPress={continuePressed}>
          <View style={{alignItems: 'center'}}>
            <Image source={IMAGE_HOME} style={styles.homeButtonImage} />
            <Text style={styles.homeButtonText}>CONTINUE</Text>
          </View>
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
    fontSize: 64,
  },

  subTitle: {
    color: '#bbbbbb',
    textAlign: 'center',
    fontSize: 20,
  },

  greenText: {
    color: '#00fb99',
    fontWeight: 'bold'
  },

  centerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  successImage: {
    width: 250,
    height: '60%',
    minHeight: 200,
    resizeMode: 'contain',
  },

  homeButtonText: {
    marginTop: -5,
    fontSize: 18,
    color: '#888',
  },

  homeButtonImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default SuccessScreen;
