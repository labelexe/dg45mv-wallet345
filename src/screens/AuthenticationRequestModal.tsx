import React from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';

// Components
import ModalContainer from '../components/ModalContainer';
import TextView from '../components/TextView';
import Spacer from '../components/Spacer';

// Classes
import AuthenticationRequest from '../authentication/AuthenticationRequest';
import events, {Events} from '../events';

// Hooks
import { useEncryptedStorage } from '../hooks/useEncryptedStorage';

// Image Assets
import IMAGE_UP_ARROW from '../../assets/images/up_arrow.png';

export type AuthenticationRequestModalProps = {
  request: AuthenticationRequest | null;
  onClose: () => void;
};

type AuthenticationInfo = {
  methodName: string,
  host: string,
  fullURL: string,
  baseURL: string
};

const AuthenticationRequestModal = (props: AuthenticationRequestModalProps) => {
  const {
    request,
    onClose,
    ...otherProps
  } = props;

  const storage = useEncryptedStorage();
  const modalVisible = (request != null);

  const authenticationInfo = React.useMemo<AuthenticationInfo>(() => {
    if (!request) return {
      methodName: '',
      host: '',
      fullURL: '',
      baseURL: '',
    };

    return {
      methodName: request.getMethodName(),
      host: request.urlComponents.host,
      baseURL: request.getBaseUrl(),
      fullURL: request.getWebUrl(),
    };
  }, [request]);

  const closePressed = () => {
    onClose();
  };

  const authenticatePressed = () => {
    if (!request) return;
    if (!storage) return;

    const execute = async () => {
      let seed;
      let success;

      try {
        seed = await storage.deriveSeed();
        success = await request.signRequest(seed);
      } catch (e) {
        console.error(e);
        success = false;
      } finally {
        if (seed) seed.release();
      }

      return success;
    };

    execute()
      .then(() => onClose())
      .catch(e => console.error(e));
  };

  // Request close of modal if the wallet gets locked
  React.useEffect(() => {
    const walletLocked = () => {
      onClose();
    };

    const subscription = events.addListener(Events.WALLET_LOCKED, walletLocked);
    return () => subscription.remove();
  }, [onClose]);

  return (
    <ModalContainer onClose={closePressed} visible={modalVisible} {...otherProps}>
      <View style={styles.modalView}>
        <TextView style={styles.modalHeading}>
          {authenticationInfo.methodName} Request
        </TextView>

        <Spacer type={2} />

        <TextView style={styles.description}>
          Securely sign in on
        </TextView>

        <TextView style={styles.baseURL}>
          {authenticationInfo.baseURL}
        </TextView>

        <TouchableOpacity onPress={authenticatePressed}>
          <View style={{alignItems: 'center'}}>
            <Image source={IMAGE_UP_ARROW} />
            <TextView style={styles.modalButtonText}>AUTHENTICATE</TextView>
          </View>
        </TouchableOpacity>          
      </View>
    </ModalContainer>
  );
};

const styles = StyleSheet.create({
  modalView: {
    width: '100%',
    maxWidth: 310,
    minHeight: 300,
    margin: 20,
    backgroundColor: '#001133',
    borderRadius: 6,
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

  description: {

  },

  baseURL: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'Roboto Mono',
    fontSize: 14,
    marginTop: 8,
  },

  modalHeading: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  modalButtonText: {
    marginTop: -25,
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  },
});

export default AuthenticationRequestModal;
