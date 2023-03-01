
import React from 'react';

import {
  View,
  StyleSheet,
  TextStyle,
  ViewStyle,
  StyleProp,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextInputProps,
} from 'react-native';

import TextView from './TextView';
import { DefaultFont } from '../styles/fonts';
import type { FontWeightType } from '../styles/fonts';

interface TextEditProps {
  style?: StyleProp<TextStyle>;
  fontWeight?: FontWeightType;
  fontSize?: number;
  title: string;
  textInputProps: TextInputProps;
  onChange?: (value: string) => void;
  onTextChange?: (value: string) => void;
  onBlur?: () => void;
  value?: string;

  error?: boolean;
  status?: string;
};

const TextEdit: React.FC<TextEditProps> = (props) => {
  const {
    title = 'TextEdit Title',
    textInputProps,
    onChange,
    onTextChange,
    onBlur,
    value,

    // Display status message underneath TextEdit component.
    // Label color will be green if error is false, otherwise it will be red.
    error = false,
    status,
  } = props;

  const {
    style: textInputStyle,
    ...otherTextInputProps
  } = textInputProps ?? {};

  const localStyle = {
  };

  const onChangeWrapper = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const text = e?.nativeEvent?.text;
    if (onChange && text != null) onChange(text);
  };

  const onTextChangeWrapper = (text: string) => {
    if (onTextChange) onTextChange(text);
  };

  const onBlurWrapper = () => {
    if (onBlur) onBlur();
  };  

  const statusView = React.useMemo(() => {
    if (!status) return null;

    return (
      <TextView style={error ? styles.error : styles.success}>
        {status}
      </TextView>
    );
  }, [status, error]);

  return (
    <View style={[styles.defaultStyle, localStyle, props.style]}>
      {/* Title */}
      <TextView style={styles.headingStyle}>{title}</TextView>

      {/* Text Input */}
      <View style={styles.textInputWrapper}>
        <TextInput
          style={[styles.textInput, textInputStyle]}
          onChange={onChangeWrapper}
          onBlur={onBlurWrapper}
          onChangeText={onTextChangeWrapper}
          value={value}
          {...otherTextInputProps}
        />
      </View>

      {/* Render status */}
      {statusView}
    </View>
  );
};

type Style = {
  defaultStyle: ViewStyle;
  headingStyle: TextStyle;
  textInputWrapper: ViewStyle;
  textInput: ViewStyle;
  error: TextStyle;
  success: TextStyle;
};

const styles = StyleSheet.create<Style>({
  defaultStyle: {
    color: '#fff',
    alignSelf: 'center',
    width: '100%'
  },

  headingStyle: {
    textAlign: 'left',
    fontSize: 14,
    width: '100%',
    color: '#33eeff',
    fontFamily: DefaultFont.bold
  },

  textInputWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#33eeff',
    width: '100%',
    marginBottom: 4
  },

  textInput: {
    paddingVertical: 8,
    color: 'white',
    fontFamily: DefaultFont.regular,
  },

  error: {
    color: '#FF3131',
    fontSize: 12,
    textAlign: 'left',
  },

  success: {
    color: '#00fb99',
    fontSize: 12,
    textAlign: 'left',
  },
});

export default TextEdit;
