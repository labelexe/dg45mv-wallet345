
// import bip38 from 'bip38';

import {
  entropyToMnemonic,
} from 'bip39';

import randomBytes from './randomBytes';

export enum BIP39_WORDS {
  N12 = 12,
  N24 = 24,
}

export type MnemonicGeneratorSettings = {
  isSeedEncrypted: boolean;
  seedPassphrase: string;
  numberOfWords: BIP39_WORDS;
};

export type StepCallback = (buffer: Buffer | null) => void;
export type MnemonicCallback = (mnemonic: string | null) => void;

const DEFAULT_SETTINGS: MnemonicGeneratorSettings = {
  isSeedEncrypted: false,
  seedPassphrase: '',
  numberOfWords: BIP39_WORDS.N24,
};

interface MnemonicGenerator {
  step: (entropy: Buffer, cb: StepCallback) => void;
  reset: () => void;
  updateSettings: (settings: MnemonicGeneratorSettings) => void;
  getSettings: () => MnemonicGeneratorSettings;
  generateMnemonic: (callback: MnemonicCallback) => void;
  lastKnownMnemonic: string;
};

class MnemonicGeneratorImpl implements MnemonicGenerator {
  settings: MnemonicGeneratorSettings;
  gen: number;
  lastKnownMnemonic: string;

  constructor() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS);
    this.gen = 0;
    this.lastKnownMnemonic = '';
  }

  step(entropy: Buffer, cb: StepCallback) {
    // Currently, we are just producing 32 bit values to have the RNG
    // progress a bit.
    // ToDo: Web: Feed `entropy` into RNG, somehow
    randomBytes(4)
      .then(b => cb(b))
      .catch(() => cb(null));

    this.gen = this.gen + 1;
  }

  reset() {
    this.settings.seedPassphrase = DEFAULT_SETTINGS.seedPassphrase;
    this.settings.isSeedEncrypted = DEFAULT_SETTINGS.isSeedEncrypted;
    this.settings.numberOfWords = DEFAULT_SETTINGS.numberOfWords;
    this.lastKnownMnemonic = '';
    this.gen = 0;
  };

  updateSettings(s: MnemonicGeneratorSettings) {
    this.settings.isSeedEncrypted = s.isSeedEncrypted;
    this.settings.seedPassphrase = s.seedPassphrase;
    this.settings.numberOfWords = s.numberOfWords;
  };

  getSettings(): MnemonicGeneratorSettings {
    const s: MnemonicGeneratorSettings = Object.assign({}, this.settings);
    Object.freeze(s);
    return s;
  };

  generateMnemonic(callback: MnemonicCallback) {
    const nBytes = this.settings.numberOfWords === BIP39_WORDS.N12 ? 16 : 32;

    randomBytes(nBytes)
      .then(bytes => {
        const hex = bytes.toString('hex');
        const mnemonic = entropyToMnemonic(hex);
        callback(mnemonic);
      })
      .catch(() => callback(null));    
  };
}

export default new MnemonicGeneratorImpl();
