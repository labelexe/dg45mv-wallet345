import React from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import Header, { HeaderProps } from '../components/Header';

const PADDING_HORIZONTAL = 30;

export interface BaseScreenProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactElement[] | React.ReactElement;
  hideHeader?: boolean;
  headerHeight?: number,
  headerProps?: HeaderProps;
  scrollViewProps?: object;
  scrollViewInnerViewStyle?: StyleProp<ViewStyle>;
  scrollViewRef?: React.RefObject<ScrollView>;
};

const BaseScreen: React.FC<BaseScreenProps> = (props: BaseScreenProps) => {
  const {
    children,
    headerProps,
    hideHeader = false,
    headerHeight = 115,
    style,
    scrollViewRef,
    scrollViewProps,
    scrollViewInnerViewStyle,
    ...otherProps
  } = props;

  const {
    style: headerStyle,
    ...otherHeaderProps
  } = headerProps ?? {};

  const insets = useSafeAreaInsets();

  const localScrollViewContentStyle = {
    paddingTop: insets.top + (hideHeader ? 0 : headerHeight),
    paddingBottom: insets.bottom + (hideHeader ? 0 : headerHeight) + 20,
  };

  const localScrollViewInnerViewStyle = {
    paddingLeft: insets.left + PADDING_HORIZONTAL,
    paddingRight: insets.right + PADDING_HORIZONTAL,
  };

  const behavior = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <KeyboardAvoidingView style={[styles.page, style]} behavior={behavior} {...otherProps}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollViewContent, localScrollViewContentStyle]}
        ref={scrollViewRef}
        {...scrollViewProps}
      >
        <View style={[styles.scrollViewInnerView, localScrollViewInnerViewStyle, scrollViewInnerViewStyle]}>
          {children}
        </View>
      </ScrollView>

      <Header
        {...otherHeaderProps}
        hideHeader={hideHeader}
        style={[styles.headerStyle, headerStyle]}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#01071B',
  },

  scrollView: {
    flex: 1,
  },

  scrollViewInnerView: {
    marginBottom: 40,
    paddingBottom: 40,
    flex: 1,
  },

  scrollViewContent: {
    flexGrow: 1,
  },

  headerStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

export default BaseScreen;
