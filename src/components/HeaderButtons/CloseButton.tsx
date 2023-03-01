
import React from 'react';

import {
  Image,
  StyleSheet,
  ImageStyle,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import BaseButton from './BaseButton';
import CloseButtonImage from '../../../assets/glyphs/close.png';

interface ButtonProps {
  onPress?: () => void;
}

const CloseButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  const navigation = useNavigation();

  const {
    onPress = () => navigation.canGoBack() && navigation.goBack(),
    ...otherProps
  } = props;

  return (
    <BaseButton {...otherProps} onPress={onPress}>
        <Image
          source={CloseButtonImage}
          style={buttonStyle.imageStyle}
        />
    </BaseButton>
  );
};

type Style = {
  imageStyle: ImageStyle;
};

const buttonStyle = StyleSheet.create<Style>({
  imageStyle: {
    resizeMode: 'contain',
    width: 24,
    height: 24,
  },
});

export default CloseButton;
