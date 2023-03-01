
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';

// Events
export enum Events {
  // Only viable when creating/importing a new wallet.
  // This event will be triggered when entering a BIP38 passphrase.
  PASSPHRASE_SELECTED = 'PASSPHRASE_SELECTED',

  // QR Code was detected, or a deep link was triggered, that will
  // show a confirmation dialog of the URL that was scanned.
  // This event passes the detected URL as an event parameter.
  AUTHENTICATION_REQUEST = 'AUTHENTICATION_REQUEST',

  // This emit gets emitted, whenever the wallet gets locked.
  // It will for example close all modal windows.
  WALLET_LOCKED = 'WALLET_LOCKED',
};

const events = new EventEmitter<Events>();
export default events;
