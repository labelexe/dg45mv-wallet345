
import React from 'react';
import ToggleSwitch from 'toggle-switch-react-native';

const THUMB_ON_STYLE = '#33eeff';
const THUMB_OFF_STYLE = '#116666';

interface SwitchProps {
  onToggle?: (newValue: boolean) => void;
  isOn?: boolean;
}

const Switch: React.FC<SwitchProps> = (props: SwitchProps) => {
  const {
    onToggle = () => null,
    isOn = false,
  } = props;

  return (
    <ToggleSwitch
      isOn={isOn}
      onColor="#555"
      offColor="#333"
      thumbOnStyle={{backgroundColor: THUMB_ON_STYLE }}
      thumbOffStyle={{backgroundColor: THUMB_OFF_STYLE }}
      trackOnStyle={{borderColor: '#aaa', borderWidth: 2, width: 45}}
      trackOffStyle={{borderColor: '#aaa', borderWidth: 2, width: 45}}
      onToggle={() => onToggle(!isOn)}
      size="small"
    />
  );
};

export default Switch;
