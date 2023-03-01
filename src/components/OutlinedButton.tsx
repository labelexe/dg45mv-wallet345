
import React from 'react';

import {
  StyleSheet,
} from 'react-native';

import type {
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

import Button from './Button';
import TextView from './TextView';

interface OutlinedButtonProps {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  onPress(): void;
  title: string;
}

/// Component: OutlinedButton
const OutlinedButton: React.FC<OutlinedButtonProps> = (props: OutlinedButtonProps) => {
  const {
    style,
    title = 'BUTTON TITLE',
    disabled = false,
    textStyle,
    ...otherProps
  } = props;

  return (
    <Button
      style={[styles.outline, style]}
      disabled={disabled}
      {...otherProps}
    >
      <TextView style={[styles.textStyle, textStyle]}>
        {title}
      </TextView>
    </Button>
  );
};

const styles = StyleSheet.create({
  baseStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  outline: {
    borderWidth: 1,
    borderColor: '#00fb99',
    padding: 10,
    borderRadius: 3
  },

  textStyle: {
    color: '#00fb99',
    fontWeight: 'bold',
    fontSize: 16
  },
});

export default OutlinedButton;
