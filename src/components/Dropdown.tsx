
import React from 'react';

import {
  StyleSheet,
} from 'react-native';

import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import { Dropdown } from 'react-native-element-dropdown';

export type DropdownValue = string | undefined;

export type DropdownItem = {
  label: string;
  value: DropdownValue;
  // readonly icon: Image
};

interface DropdownProps {
  items: Array<DropdownItem>;
  onChange: (value: DropdownValue) => void;
  value: DropdownValue;
  style?: StyleProp<ViewStyle>;
  placeholderText?: string;
}

const DEFAULT_PLACEHOLDER_TEXT = 'Select item...';

const DGMVDropdown: React.FC<DropdownProps> = (props: DropdownProps) => {
  const {
    items,
    style,
    onChange,
    value,
    placeholderText = DEFAULT_PLACEHOLDER_TEXT,
    ...otherProps
  } = props;

  const [innerValue, setInnerValue] = React.useState(value);
  const [isFocus, setIsFocus] = React.useState(false);

  React.useEffect(() => {
    setIsFocus(false);
    setInnerValue(value);
  }, [value]);

  return (
    <Dropdown
      style={[styles.dropdown, style]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      containerStyle={{ backgroundColor: '#0e1428' }}
      activeColor="#000"
      data={items}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={!isFocus ? placeholderText : '...'}
      value={innerValue}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(item: DropdownItem) => {
        onChange && onChange(item?.value);
      }}
      {...otherProps}
    />
  );
};

const styles = StyleSheet.create({
  placeholderStyle: {
    fontSize: 16,
    color: '#fff'
  },

  selectedTextStyle: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },

  dropdown: {
    height: 50,
    borderColor: 'gray',

    backgroundColor: '#0e1428',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});

export default DGMVDropdown;
