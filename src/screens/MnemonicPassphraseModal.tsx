import React from 'react';
import {View, TextInputProps, Platform} from 'react-native';
import TextEdit from '../components/TextEdit';
import OutlinedButton from '../components/OutlinedButton';
import Spacer from '../components/Spacer';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

// Self defined components
import BaseScreen from './BaseScreen';
import {HeaderButtonType} from '../components/Header';
import events, {Events} from '../events';
import modalPadding from '../styles/modalPadding';

import type {RootStackParamList} from '../App';

export interface MnemonicPassphraseModalInterface {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'MnemonicPassphraseModal'
  >
}

const MIN_PASSWORD_LENGTH = 8;

const statusDescription = {
  PASSWORD_LENGTH: `The password is too short. Make sure it contains at least ${MIN_PASSWORD_LENGTH} characters.`,
  DOES_NOT_MATCH: 'The passwords do not match.',
  VALID: 'Valid password!',
  MATCH: 'Passwords do match!',
};

const MnemonicPassphraseModal: React.FC<MnemonicPassphraseModalInterface> = ({
  navigation,
}) => {
  const [seedPassphrase, setSeedPassphrase] = React.useState('');
  const [confirmSeedPassphrase, setConfirmSeedPassphrase] = React.useState('');

  const [textBox1Error, setTextBox1Error] = React.useState(false);
  const [textBoxStatus1, setTextBoxStatus1] = React.useState('');
  const [textBox2Error, setTextBox2Error] = React.useState(false);
  const [textBoxStatus2, setTextBoxStatus2] = React.useState('');

  const passwordLengthValid = (password: string) =>
    password && password.length >= MIN_PASSWORD_LENGTH;
  const passwordsMatch = (pw1: string, pw2: string) => pw1 === pw2;

  const insets = useSafeAreaInsets();

  const passphraseValid = React.useMemo(() => {
    return (
      passwordLengthValid(seedPassphrase) &&
      passwordsMatch(seedPassphrase, confirmSeedPassphrase)
    );
  }, [seedPassphrase, confirmSeedPassphrase]);

  const updateErrorMessage = React.useCallback((textBoxIndex: number) => {
    // Method was called from first password textbox
    if (textBoxIndex === 0 && seedPassphrase.length > 0) {
      if (!passwordLengthValid(seedPassphrase)) {
        setTextBox1Error(true);
        return setTextBoxStatus1(statusDescription['PASSWORD_LENGTH']);
      }

      setTextBox1Error(false);
      return setTextBoxStatus1(statusDescription['VALID']);
    }

    // Method was called from second password textbox
    if (textBoxIndex === 1 && confirmSeedPassphrase.length > 0) {
      if (!passwordsMatch(seedPassphrase, confirmSeedPassphrase)) {
        setTextBox2Error(true);
        return setTextBoxStatus2(statusDescription['DOES_NOT_MATCH']);
      }

      setTextBox2Error(false);
      return setTextBoxStatus2(statusDescription['MATCH']);
    }
  }, [seedPassphrase, confirmSeedPassphrase]);

  React.useEffect(() => updateErrorMessage(0), [seedPassphrase, updateErrorMessage]);
  React.useEffect(() => updateErrorMessage(1), [confirmSeedPassphrase, updateErrorMessage]);
  React.useEffect(() => setTextBoxStatus2(''), [textBoxStatus1]);  

  const submitPassphrase = () => {
    navigation.goBack();
    events.emit(Events.PASSPHRASE_SELECTED, seedPassphrase);
  };

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
    headerHeight: 70 + 53,
  };

  // Starting from ios 13, modal appearances are different.
  // We have to subtract the insets from the HeaderHeight,
  // which will effectively decrease the paddingTop of the scrollView.
  if (Platform.OS === 'ios' && parseInt(Platform.Version) >= 13) {
    baseScreenProps.headerHeight -= insets.top;
  }

  const textInputProps: TextInputProps = {
    autoCapitalize: 'none',
    autoComplete: 'off',
    autoCorrect: false,
    clearTextOnFocus: true,
    secureTextEntry: true,
  };

  return (
    <BaseScreen {...baseScreenProps}>
      <View>
        <TextEdit
          title={'ENTER SEED PASSPHRASE'}
          onChange={(val) => setSeedPassphrase(val)}
          textInputProps={textInputProps}
          value={seedPassphrase}
          status={textBoxStatus1}
          error={textBox1Error}
        />

        <Spacer type={3} />

        <TextEdit
          title={'CONFIRM SEED PASSPHRASE'}
          onChange={(val) => setConfirmSeedPassphrase(val)}
          textInputProps={textInputProps}
          value={confirmSeedPassphrase}
          status={textBoxStatus2}
          error={textBox2Error}
        />

        <Spacer type={3} />

        <OutlinedButton
          title={'SET SEED PASSPHRASE'}
          disabled={!passphraseValid}
          onPress={submitPassphrase}
        />
      </View>
    </BaseScreen>
  );
};

export default MnemonicPassphraseModal;
