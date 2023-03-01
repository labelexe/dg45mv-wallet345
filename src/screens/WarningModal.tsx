import React, {useState} from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

import ModalContainer from '../components/ModalContainer';
import TextView from '../components/TextView';

import IMAGE_UP_ARROW from '../../assets/images/up_arrow.png';
import ICON_WARNING_WHITE from '../../assets/images/white-warning-icon.png';

const WarningModal = () => {
  const [modalVisible, setModalVisible] = useState(true);

  const closePressed = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <ModalContainer onClose={() => setModalVisible(false)} visible={modalVisible}>
      <View style={styles.modalView}>
        <Image source={ICON_WARNING_WHITE} style={styles.warning_icon} />
        <TextView style={styles.modalTitle}>WARNING!</TextView>
        <TextView style={styles.modalSubTitle}>Backup your seed wisely.</TextView>
        <TextView style={styles.modalTextWhite}>
          This seed phrase will be the only way to access your identity.
          Losing it means you will not be able to access your funds, assets
          and other important things.
        </TextView>
        <View style={styles.spliter} />
        <TextView style={styles.modalTextBlack}>
          Disclosure of your seed can lead to your identity, funds and
          assets being stolen.
        </TextView>
        <TouchableOpacity onPress={closePressed}>
          <View style={{alignItems: 'center'}}>
            <Image source={IMAGE_UP_ARROW} />
            <TextView style={styles.modalButtonText}>OK, UNDERSTOOD!</TextView>
          </View>
        </TouchableOpacity>
      </View>
    </ModalContainer>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },  
  modalView: {
    width: 310,
    backgroundColor: '#c1272d',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
  modalSubTitle: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalTextWhite: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  modalTextBlack: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
  },
  modalButtonText: {
    marginTop: -25,
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
  },
  spliter: {
    height: 0,
    width: 200,
    marginTop: 30,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#999999',
  },
  warning_icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});

export default WarningModal;
