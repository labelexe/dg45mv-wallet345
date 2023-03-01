
import React from 'react';

import {
  Image,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import BaseButton from './BaseButton';
import BackButtonImage from '../../../assets/glyphs/back.png';

interface ButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
}

const BackButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  const navigation = useNavigation();

  const {
    onPress = () => navigation.canGoBack() && navigation.goBack(),
    ...otherProps
  } = props;

  return (
    <BaseButton {...otherProps} onPress={onPress}>
      <Image
        source={BackButtonImage}
        style={buttonStyle.imageStyle}
      />
    </BaseButton>
  );
};

const buttonStyle = StyleSheet.create({
  imageStyle: {
    resizeMode: 'contain',
    width: 24,
    height: 24,
  },
});

export default BackButton;
