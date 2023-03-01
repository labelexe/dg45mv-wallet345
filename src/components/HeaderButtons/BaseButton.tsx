
import React from 'react';

import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';

interface ButtonProps {
  children?: React.ReactElement[] | React.ReactElement;
  onPress?: (event: GestureResponderEvent) => void;
}

const BaseButton: React.FC<ButtonProps> = (props) => {
  const {
    children = null,
    ...otherProps
  } = props;

  return (
    <TouchableOpacity {...otherProps} style={buttonStyle.container}>
      {children}
    </TouchableOpacity>
  );
};

type Style = {
  container: ViewStyle;
};

const buttonStyle = StyleSheet.create<Style>({
  container: {
    padding: 16,
    width: 48,
  },
});

export default BaseButton;
