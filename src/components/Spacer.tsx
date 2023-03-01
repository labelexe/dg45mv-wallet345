
import React from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';

export type SpacerType = 1 | 2 | 3 | 4;

interface SpacerProps {
  type: SpacerType;
};

/// Component: Spacer
const Spacer: React.FC<SpacerProps> = (props: SpacerProps) => {
  const {
    type,
    ...otherProps
  } = props;

  const spacerStyle = styles[`v_spacer_${type}`];

  return (
    <View
      style={[styles.baseStyle, spacerStyle]}
      {...otherProps}
    />
  );
};

const styles = StyleSheet.create({
  baseStyle: {
    height: 0,
  },

  v_spacer_1: {
    height: 10,
  },

  v_spacer_2: {
    height: 20,
  },  

  v_spacer_3: {
    height: 30,
  },

  v_spacer_4: {
    height: 40,
  },  
});

export default Spacer;
