
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const DEFAULT_OPTIONS = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};

export const light = (options) => ReactNativeHapticFeedback.trigger(
  'impactLight',
  Object.assign({}, DEFAULT_OPTIONS, options)
);
