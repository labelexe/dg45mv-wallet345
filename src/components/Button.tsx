
import React from 'react';

import {
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { HeaderButtonType } from './Header';

import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

interface ButtonProps {
  leftButtonType?: HeaderButtonType,
  leftButtonProps?: object,
  style: StyleProp<ViewStyle>,
  disabled: boolean,
  children: React.ReactElement[] | React.ReactElement,
  onPress(): void
}

/// Component: Header
const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const {
    style,
    children,
    disabled,
    ...otherProps
  } = props;

  const disabledStyle = {
    opacity: disabled ? 0.3 : 1.0,
  };

  return (
    <TouchableOpacity
      style={[styles.baseStyle, disabledStyle, style]}
      disabled={disabled}
      {...otherProps}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;
