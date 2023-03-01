
// eslint-disable-next-line
import React from 'react';

import {
  Platform,
  ViewStyle,
} from 'react-native';

// This class determines which padding to use for the header,
// if the screen is presented as a modal window.
// Since the introduction of ios 13 the window doesn't reach the
// top notch anymore, so no padding is needed in the header.

type PaddingValue = number | undefined;

const paddingTop: PaddingValue = Platform.select({
  // ViewController appearance was changed from iOS 13
  ios: parseInt(`${Platform.Version}`, 10) >= 13 ? 0 : undefined,

  // use default (see Header.tsx)
  android: undefined,
});

const style: ViewStyle = {};

if (typeof paddingTop === 'number') {
  style.paddingTop = paddingTop;
}

export default style;
