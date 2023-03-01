import React from 'react';

import {
  Alert,
  Modal,
  StyleSheet,
  View,
  PanResponderGestureState,
  GestureResponderEvent,
  PanResponder,
} from 'react-native';

interface ModalContainerProps {
  onClose: () => void;
  visible: boolean;
  children: React.ReactElement[] | React.ReactElement;
  modalProps?: object;
};

const ModalContainer = (props: ModalContainerProps) => {
  const {
    children = null,
    visible,
    onClose,
    modalProps,
    ...otherProps
  } = props;

  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,

      onMoveShouldSetPanResponder: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        return !(gestureState.dx === 0 && gestureState.dy === 0);
      },
      onMoveShouldSetPanResponderCapture: () => false,

      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        if (gestureState.dy > 15) {
          onClose();
        }
      },
    })
  ).current;

  return (
    <View {...panResponder.panHandlers} style={styles.centeredView} {...otherProps}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          onClose();
        }}
        {...modalProps}
      >    
        <View style={styles.modalContentContainer}>
          {children}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
});

export default ModalContainer;
