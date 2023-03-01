
import React from 'react';

import {
  View,
  StyleSheet,
  Image
} from 'react-native';


import DIGICORP_LABS from '../../assets/images/digicorp-labs.png';

const DigicorpLogo: React.FC = () => {
  return (
    <View style={styles.digicorp_logo}>
      <Image source={DIGICORP_LABS} style={styles.digicorp_img} />
    </View>
  );
};

const styles = StyleSheet.create({
  digicorp_logo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
	
  digicorp_img: {
    maxHeight: 35,
    resizeMode: 'contain',
  },
});

export default DigicorpLogo;
