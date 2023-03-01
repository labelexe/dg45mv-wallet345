import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Self defined components
import BaseScreen from './BaseScreen';
import {HeaderButtonType} from '../components/Header';
import TextView from '../components/TextView';
import Spacer from '../components/Spacer';
import {DefaultFont} from '../styles/fonts';

// Classes
import MnemonicGenerator, {BIP39_WORDS} from '../crypto/MnemonicGenerator';

// Image Assets
import IMAGE_UP_ARROW from '../../assets/images/up_arrow.png';
import IMAGE_BUTTON_ACTIVE from '../../assets/images/n_words_active.png';
import IMAGE_BUTTON_INACTIVE from '../../assets/images/n_words_inactive.png';
import IMAGE_PLUS from '../../assets/images/plus.png';
import IMAGE_BACKSPACE from '../../assets/images/backspace.png';

import type {RootStackParamList} from '../App';

export interface ImportMnemonicScreenInterface {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ImportMnemonicScreen'>
}

const ImportMnemonicScreen: React.FC<ImportMnemonicScreenInterface> = ({
  navigation,
}) => {
  const [words, setWords] = React.useState<string[]>([]);
  const [numberOfWords, setNumberOfWords] = React.useState(BIP39_WORDS.N24);

  const [statusMessage, setStatusMessage] = React.useState('SEED NOT VALID');

  const [currentWord, setCurrentWord] = React.useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // If user changes word count after entering 12+ words,
  // cut off words.
  React.useEffect(() => {
    setStatusMessage('SEED NOT VALID');
    if (words.length > numberOfWords) {
      setWords(words.slice(0, numberOfWords));
    }
  }, [numberOfWords, words]);

  // Keyboard Handler
  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', () =>
      setKeyboardVisible(true),
    );
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const removeLastWord = React.useCallback(() => {
    if (words.length == 0) return;
    setWords(words.slice(0, words.length - 1));
  }, [words]);

  const addWord = () => {
    if (words.length >= numberOfWords) return;

    // ToDo: BIP39 check
    if (!currentWord) return;

    const newWords = words.concat([currentWord.toLowerCase()]);
    setWords(newWords);

    setCurrentWord(''); // reset textbox
  };

  const submitPressed = () => {
    MnemonicGenerator.lastKnownMnemonic = words.join(' ');
    navigation.navigate('CreatePasswordScreen');
  };

  // Backspace button
  const backspaceButton = React.useMemo(() => {
    return (
      <TouchableOpacity
        key={'backspace'}
        style={styles.backspaceButton}
        onPress={removeLastWord}>
        <Image style={styles.backspaceImage} source={IMAGE_BACKSPACE} />
      </TouchableOpacity>
    );
  }, [removeLastWord]);

  // Prerender words
  const seedElements = React.useMemo(() => {
    if (words.length == 0) {
      return (
        <TextView style={styles.emptySeed} key={'empty'}>
          Enter your words below...
        </TextView>
      );
    }

    return words.map((w, i) => (
      <View key={i} style={styles.seedWordContainer}>
        <View style={styles.seedWord} key={`word_${i}`}>
          <TextView style={styles.seedText}>
            {i + 1}. {w}
          </TextView>
        </View>
        {i === words.length - 1 ? backspaceButton : null}
      </View>
    ));
  }, [words, backspaceButton]);

  const renderAddWordForm = () => {
    if (words.length >= numberOfWords) return null;

    return (
      <View style={styles.addSeedContainer}>
        <TextInput
          style={styles.seedInput}
          placeholder={`Input word ${words.length + 1}`}
          placeholderTextColor={'#585C68'}
          onChangeText={(word) => setCurrentWord(word)}
          onSubmitEditing={addWord}
          blurOnSubmit={words.length >= numberOfWords}
          value={currentWord}
        />
        <TouchableOpacity style={styles.plusButton} onPress={addWord}>
          <View>
            <Image source={IMAGE_PLUS} style={styles.plusImage} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const wordsSelector = React.useMemo(() => {
    if (keyboardVisible) return null;

    return (
      <View>
        <View style={styles.titleWrapper}>
          <TextView style={styles.title}>IMPORT EXISTING SEED PHRASE</TextView>
        </View>

        <Spacer type={3} />

        <View style={styles.titleWrapper}>
          <TextView style={styles.subTitle}>Select Number of Words:</TextView>
        </View>

        <Spacer type={3} />

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={() => setNumberOfWords(BIP39_WORDS.N12)}
            style={styles.roundButton}>
            <TextView style={styles.buttonText}>12</TextView>
            <Image
              source={
                numberOfWords === BIP39_WORDS.N12
                  ? IMAGE_BUTTON_ACTIVE
                  : IMAGE_BUTTON_INACTIVE
              }
              style={styles.buttonImage}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setNumberOfWords(BIP39_WORDS.N24)}
            onLongPress={() =>
              setWords([
                'witch',
                'collapse',
                'practice',
                'feed',
                'shame',
                'open',
                'despair',
                'reek',
                'road',
                'again',
                'ice',
                'least',
                'witch',
                'collapse',
                'practice',
                'feed',
                'shame',
                'open',
                'despair',
                'reek',
                'road',
                'again',
                'ice',
                'least',
              ])
            }
            style={styles.roundButton}>
            <TextView style={styles.buttonText}>24</TextView>
            <Image
              source={
                numberOfWords === BIP39_WORDS.N24
                  ? IMAGE_BUTTON_ACTIVE
                  : IMAGE_BUTTON_INACTIVE
              }
              style={styles.buttonImage}
            />
          </TouchableOpacity>
        </View>

        <Spacer type={3} />

        <View style={styles.titleWrapper}>
          <TextView style={styles.subTitle}>Your Seed:</TextView>
        </View>
      </View>
    );
  }, [numberOfWords, keyboardVisible]);

  const continueButtonLocked = numberOfWords !== words.length;

  const headerProps = {
    leftButtonType: HeaderButtonType.BACK,
  };

  const scrollViewProps = {
    scrollEnabled: true,
  };

  return (
    <BaseScreen scrollViewProps={scrollViewProps} headerProps={headerProps}>
      <View style={{flex: 1}}>
        {wordsSelector}

        <Spacer type={2} />

        <View style={styles.seedWrapper}>{seedElements}</View>

        <Spacer type={2} />

        {renderAddWordForm()}

        <Spacer type={1} />

        <TextView style={styles.redText}>{statusMessage}</TextView>

        <Spacer type={1} />

        <TouchableOpacity
          onPress={submitPressed}
          disabled={numberOfWords !== words.length}
          style={{opacity: continueButtonLocked ? 0.3 : 1.0}}>
          <View style={{alignItems: 'center'}}>
            <Image source={IMAGE_UP_ARROW} />
            <TextView style={styles.continueButtonText}>CONTINUE</TextView>
          </View>
        </TouchableOpacity>
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  titleWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  title: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 32,
  },

  subTitle: {
    color: '#bbbbbb',
    textAlign: 'center',
    fontSize: 20,
  },

  emptySeed: {
    color: '#00fb99',
    textAlign: 'center',
    fontSize: 15,
  },

  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  seedButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },

  seedWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  roundButton: {
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 65,
  },

  buttonImage: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  buttonActive: {
    backgroundColor: '#33eeff',
  },

  buttonInactive: {
    backgroundColor: '#555555',
  },

  seedWordContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    marginRight: 5,
    marginLeft: 5,
  },

  seedWord: {
    justifyContent: 'center',
    backgroundColor: '#33eeff',
    borderRadius: 10,
    padding: 10,
  },

  buttonText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#01071B',
    zIndex: 2,
  },

  buttonBottomBorder: {
    height: 3,
    width: 20,
    backgroundColor: '#33eeff',
  },

  seedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#01071B',
  },

  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },

  advancedHeading: {
    textAlign: 'center',
    color: '#00fb99',
    fontWeight: 'bold',
    fontSize: 12,
  },

  advancedButton: {
    padding: 4,
  },

  continueButtonText: {
    color: 'white',
    marginTop: -25,
    fontSize: 18,
  },

  seedInput: {
    backgroundColor: '#aaaabb',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    paddingTop: 8,
    paddingRight: 15,
    paddingBottom: 8,
    paddingLeft: 15,
    fontSize: 18,
    width: '80%',
    fontFamily: DefaultFont.bold,
  },

  plusButton: {
    backgroundColor: '#00fb99',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },

  plusImage: {
    height: 20,
    resizeMode: 'contain',
  },

  addSeedContainer: {
    display: 'flex',
    flexDirection: 'row',
  },

  redText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: DefaultFont.regular,
    color: '#bb0000',
  },

  backspaceButton: {},

  backspaceImage: {
    marginTop: 3,
    marginHorizontal: 10,
    tintColor: '#00fb99',
  },
});

export default ImportMnemonicScreen;
