
import React from 'react';

import {
  View,
  Image,
  StyleSheet,
} from 'react-native';

import type {
  StyleProp,
  ViewStyle,
  ImageStyle,
} from 'react-native';

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import CloseButton from './HeaderButtons/CloseButton';
import BackButton from './HeaderButtons/BackButton';
import BaseButton from './HeaderButtons/BaseButton';
import SettingsButton from './HeaderButtons/SettingsButton';

import Logo from '../../assets/images/logo.png';

/// Types
export enum HeaderButtonType {
  BACK = 'BACK',
  CANCEL = 'CANCEL',
  NONE = 'NONE',
  SETTINGS = 'SETTINGS',
}

export interface HeaderProps {
  leftButtonType?: HeaderButtonType;
  leftButtonProps?: object;
  rightButtonType?: HeaderButtonType;
  rightButtonProps?: object;
  hideHeader?: boolean;
  style?: StyleProp<ViewStyle>;
}

/// Helper functions
const getLeftComponent = (buttonType: HeaderButtonType) => {
  switch (buttonType) {
  case HeaderButtonType.CANCEL:
    return CloseButton;

  case HeaderButtonType.NONE:
    return BaseButton;

  case HeaderButtonType.BACK:
  default:
    return BackButton;
  }
};

const getRightComponent = (buttonType: HeaderButtonType) => {
  switch (buttonType) {
  case HeaderButtonType.SETTINGS:
    return SettingsButton;
    
  case HeaderButtonType.NONE:
  default:
    return BaseButton;
  }
};

/// Component: Header
const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const {
    leftButtonType = HeaderButtonType.BACK,
    rightButtonType = HeaderButtonType.NONE,
    leftButtonProps = {},
    rightButtonProps = {},
    hideHeader = false,
    style,
    ...otherProps
  } = props;

  const insets = useSafeAreaInsets();

  const LeftComponent = React.useMemo(() => getLeftComponent(leftButtonType), [leftButtonType]);
  const RightComponent = React.useMemo(() => getRightComponent(rightButtonType), [rightButtonType]);

  if (hideHeader) return null;

  const localHeaderStyle = {
    paddingTop: insets.top,
  };

  return (
    <View style={[styles.headerWrapper, localHeaderStyle, style]} {...otherProps} >
      <View style={styles.headerContainer}>
        <LeftComponent
          {...leftButtonProps}
        />

        <View style={styles.logoContainer}>
          <Image
            source={Logo}
            style={styles.logo}
          />
        </View>

        <RightComponent
          {...rightButtonProps}
        />
      </View>
    </View>
  );
};

type Styles = {
  headerWrapper: ViewStyle;
  headerContainer: ViewStyle;
  logoContainer: ViewStyle;
  logo: ImageStyle;
};

const styles = StyleSheet.create<Styles>({
  headerWrapper: {
    backgroundColor: '#01081BCC',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
  },

  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    resizeMode: 'contain'
  },
});

export default Header;
