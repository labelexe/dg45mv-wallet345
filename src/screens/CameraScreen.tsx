import React from 'react';

import {
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';

import { useCameraDevices, Camera } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Self defined components
import BaseScreen from './BaseScreen';
import {HeaderButtonType} from '../components/Header';
import TextView from '../components/TextView';
import events, {Events} from '../events';
import modalPadding from '../styles/modalPadding';

import type {RootStackParamList} from '../App';

export interface CameraScreenInterface {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'CameraScreen'
  >
};

export interface QRCodeOverlayInterface {
  style?: ViewStyle;
  success?: boolean;
};

enum DimensionV {
  TOP = 'top',
  BOTTOM = 'bottom',
}

enum DimensionH {
  LEFT = 'left',
  RIGHT = 'right',
}

type Dimension = DimensionH | DimensionV;

const QRCodeOverlay: React.FC<QRCodeOverlayInterface> = (props: QRCodeOverlayInterface) => {
  const {
    success = false,
    style,
    ...otherProps
  } = props;

  const color = success ? '#00fb99' : '#00ffff';

  const cornerStyle: ViewStyle = {
    borderWidth: 0,
    borderColor: color,
    width: 50,
    height: 50,
    position: 'absolute',
  };

  const capitalize = (word: Dimension): string => word[0].toUpperCase() + word.substr(1).toLowerCase();

  const createCornerStyle = (xKey: DimensionH, yKey: DimensionV): ViewStyle => ({
    [xKey.toLowerCase()]: 0,
    [yKey.toLowerCase()]: 0,
    [`border${capitalize(xKey)}Width`]: success ? 4 : 2,
    [`border${capitalize(yKey)}Width`]: success ? 4 : 2,
  });

  const cornerTopLeftStyle = createCornerStyle(DimensionH.LEFT, DimensionV.TOP);
  const cornerTopRightStyle = createCornerStyle(DimensionH.RIGHT, DimensionV.TOP);
  const cornerBottomLeftStyle = createCornerStyle(DimensionH.LEFT, DimensionV.BOTTOM);
  const cornerBottomRightStyle = createCornerStyle(DimensionH.RIGHT, DimensionV.BOTTOM);

  const wrapperStyle: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
  };

  const innerStyle: ViewStyle = {
    width: 250,
    height: 250,
  };

  return (
    <View style={[wrapperStyle, style]} {...otherProps}>
      <View style={innerStyle}>
        <View style={[cornerStyle, cornerTopLeftStyle]}></View>
        <View style={[cornerStyle, cornerTopRightStyle]}></View>
        <View style={[cornerStyle, cornerBottomLeftStyle]}></View>
        <View style={[cornerStyle, cornerBottomRightStyle]}></View>
      </View>
    </View>
  );
};

const CameraScreen: React.FC<CameraScreenInterface> = ({
  navigation,
}) => {
  const { height } = useWindowDimensions();
  const [url, setUrl] = React.useState('');

  const hasFoundURL = url !== '';

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  const devices = useCameraDevices();
  const device = devices.external || devices.back || devices.front;  

  React.useEffect(() => {
    if (barcodes.length == 0) return;
    
    const firstBarCode = barcodes.find(barCode => {
      return typeof barCode.content?.data === 'string';
    });

    const url = firstBarCode?.content?.data;
    if (!url || typeof url !== 'string') return;

    // ToDo: Check if valid ...

    setUrl(url);
  }, [barcodes]);

  React.useEffect(() => {
    if (!hasFoundURL) return;

    // A url was detected, wait a bit and close the modal window.
    const handle = setTimeout(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        events.emit(Events.AUTHENTICATION_REQUEST, url);
        setUrl('');
      }
    }, 700);

    return () => clearTimeout(handle);
  }, [url, navigation, hasFoundURL]);

  React.useEffect(() => {
    // Clear URL on launch of this modal
    setUrl('');
  }, []);

  const headerProps = {
    leftButtonType: HeaderButtonType.CANCEL,
    style: { 
      ...modalPadding,
    },
  };

  const scrollViewProps = {
    scrollEnabled: false,
  };

  const baseScreenProps = {
    scrollViewProps: scrollViewProps,
    headerProps: headerProps,
    headerHeight: -50,
    scrollViewInnerViewStyle: {
      height: height,
    },
  };

  if (!device) {
    return (
      <BaseScreen {...baseScreenProps}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TextView style={{ color: '#c1272d' }}>
            Device camera not found.
          </TextView>
        </View>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen {...baseScreenProps}>
      <Camera
        style={[styles.camera, { opacity: hasFoundURL ? 0.3 : 1.0 }]}
        device={device}
        isActive={!hasFoundURL}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />

      <QRCodeOverlay
        style={styles.absoluteFill}
        success={hasFoundURL}
      />
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  camera: {
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default CameraScreen;
