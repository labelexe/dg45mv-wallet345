import React from 'react';

import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

import type { RouteProp } from '@react-navigation/native';
import { URL } from 'react-native-url-polyfill';

import type { DropdownValue, DropdownItem } from '../../components/Dropdown';

import BaseScreen from '../BaseScreen';
import { HeaderButtonType } from '../../components/Header';
import Dropdown from '../../components/Dropdown';
import CredentialProviderRequest, { ServiceIdentifier } from '../../modules/CredentialProviderRequest';
import Button from '../../components/Button';

import LOCK_IMAGE from '../../../assets/images/2fa_lock.png';
import DIGITHREE_LABS from '../../../assets/images/digithree.png';

type RouteType = RouteProp<{params: { serviceIdentifiers?: ServiceIdentifier[] }}, 'params'>;

interface CredentialProviderScreenProps {
  serviceIdentifiers?: ServiceIdentifier[];

  // At the moment, this screen is not wrapped
  // into a stack navigation container.
  // The screen is returned directly because navigation
  // is not needed in the credential provider screen extension.
  route: RouteType | undefined;
};

const ITEMS: Array<DropdownItem> = [
  {
    
    label: 'accounts.binance.com',
    value: 'accounts.binance.com',
  },

  {
   
    label: 'mail.google.com',
    value: 'mail.google.com',
  },
];

const CredentialProviderScreen: React.FC<CredentialProviderScreenProps> = (props) => {
  const { route } = props;

  // Try to unwrap serviceIdentifiers either from .route or directly from the props.
  const serviceIdentifiers = route?.params?.serviceIdentifiers;

  // Convert service identifiers into DropdownItems
  const items = React.useMemo<Array<DropdownItem>>(() => {
    const mappedIdentifiers = (serviceIdentifiers ?? []).map((sid) => {
      const value = new URL(sid.identifier).hostname;
      return {
        value: value,
        label: value,
      };
    });

    // Merge items with configured realms.
    const merged = [...mappedIdentifiers, ...ITEMS];

    return merged.filter((item, pos) => merged
      .findIndex(a => a.value === item.value) === pos); // unique
  }, [serviceIdentifiers]);

  const [selectedRealm, setSelectedRealm] = React.useState<DropdownItem>(items[0]);

  const onAuthenticate = () => {
    // ToDo: Generate credentials
    const username = 'peterpan@hotmail.com';
    const password = 'abcdefghikl';

    // Return credentials to ASCredentialProviderViewController (ios)
    CredentialProviderRequest.authenticationRequestCompleted(username, password);
  };

  const onCancelAuthentication = () => {
    // User cancelled authentication request
    CredentialProviderRequest.authenticationRequestCancelled('USER_CANCELLED');
  };

  const updateSelectedRealm = (value: DropdownValue) => {
    const item = items.find(item => item.value === value);
    if (item) setSelectedRealm(item);
  };

  const headerProps = {
    leftButtonType: HeaderButtonType.CANCEL,
    leftButtonProps: {
      onPress: onCancelAuthentication,
    },
  };

  return (
    <BaseScreen headerProps={headerProps} hideHeader={false}>  
      <Image
        source={LOCK_IMAGE}
        style={styles.image}
      />

      <Text style={styles.dropdownHeading}>Generate Password For:</Text>
      <Dropdown 
        items={items}
        value={selectedRealm.value}
        onChange={updateSelectedRealm}
      />

      <Button disabled={selectedRealm == null} onPress={onAuthenticate} style={styles.authenticateButton}>
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Authenticate on
          {'\n'}
          {selectedRealm.value}
        </Text>
      </Button>

      <View style={styles.spacer} />

      <View style={{ alignItems: 'center' }}>
        <Image source={DIGITHREE_LABS} />
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  image: {
    marginBottom: 12,
    resizeMode: 'contain',
  },

  spacer: {
    flex: 1,
  },

  dropdownHeading: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 12,
  },

  authenticateButton: {
    borderRadius: 5,
    padding: 15,
    marginTop: 15,
    backgroundColor: '#33394a',
  },
});

export default CredentialProviderScreen;
