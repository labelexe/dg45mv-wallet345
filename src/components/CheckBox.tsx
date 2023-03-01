
import React from 'react';

import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image
} from 'react-native';
import { Text } from 'react-native-svg';

import IMAGE_CHECK from '../../assets/images/checkbox_ticked.png';

interface ButtonProps {
  onPress:()=>void,
  checked: boolean
}

/// Component: CheckBox
const CheckBox: React.FC<ButtonProps> = (props: ButtonProps) => {
  const {
    onPress,
    ...otherProps
  } = props;

  return (
    <TouchableOpacity
      style={styles.baseStyle}
      onPress={onPress}
      {...otherProps}
    >
      <View style={styles.button}>
        {props.checked ? <Image source={IMAGE_CHECK} style={styles.checkImage} /> : <Text></Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: -15,
  },

  button: {
    backgroundColor: '#859a9b',
    shadowColor: '#303838',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
    width: 20,
    height: 20,
    borderRadius: 3
  },

  checkImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },

});

export default CheckBox;
