
import React from 'react';

import {
  Image,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

import BaseButton from './BaseButton';
import SettingsButtonImage from '../../../assets/glyphs/settings.png';

interface ButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
}

const SettingsButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  const {
    onPress,
    ...otherProps
  } = props;

  return (
    <BaseButton {...otherProps} onPress={onPress}>
      <Image
        source={SettingsButtonImage}
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

export default SettingsButton;
