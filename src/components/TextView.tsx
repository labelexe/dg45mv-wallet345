
import React from 'react';

import {
  Text,
  StyleSheet,
  TextStyle,
  StyleProp,
} from 'react-native';

import { DefaultFont } from '../styles/fonts';
import type { FontWeightType } from '../styles/fonts';

interface ButtonProps {
  // children?: React.ReactElement[] | React.ReactElement;
  style?: StyleProp<TextStyle>;
  fontWeight?: FontWeightType;
  fontSize?: number;
};

const TextView: React.FC<ButtonProps> = (props) => {
  const {
    children = null,
    fontWeight = 'regular',
    fontSize = 18,
  } = props;

  const localStyle = {
    fontFamily: DefaultFont[fontWeight],
    fontSize: fontSize,
  };

  return (
    <Text style={[styles.defaultStyle, localStyle, props.style]}>
      {children}
    </Text>
  );
};

type Style = {
  defaultStyle: TextStyle;
};

const styles = StyleSheet.create<Style>({
  defaultStyle: {
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    width: '100%',
  },
});

export default TextView;
