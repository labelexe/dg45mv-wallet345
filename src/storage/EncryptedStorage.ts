import * as Keychain from 'react-native-keychain';
import { randomBytes } from 'crypto';

import * as AES256 from '../crypto/aes256';
import SeedGenerator from '../crypto/SeedGenerator';
import SeedWrapper from '../authentication/SeedWrapper';

const KEY_MNEMONIC = 'M';
const KEY_PASSPHRASE = 'P';
const KEY_SALT = 'S';
const KEY_ENCRYPTION_PASSWORD = 'E';
const KEY_ENCRYPTION_TEST = 'T';
const KEY_VERSION = 'V';
const KEY_USE_BIOMETRICS = 'B';

const VALUE_ENCRYPTION_TEST = 'DGMV WALLET';

const STORAGE_VERSION_1 = 0x01;
const STORAGE_VERSION_CURRENT = STORAGE_VERSION_1;

export enum VERSIONS {
  V1 = STORAGE_VERSION_1,
};

export type KeychainOptions = {
  accessGroup?: string;
  accessible?: Keychain.ACCESSIBLE;
};

const DEFAULT_KEYCHAIN_OPTIONS: KeychainOptions = {
  // accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
  accessGroup: 'group.com.digicorplabs.dgmvapp',

  // Ensure that keychain does not migrate private data to a new device
  accessible: Keychain.ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
};

export interface EncryptedStorage {
  version: number;
  options: object;
  encryptionPassword: string | null;
  isSetup: boolean;
  isUnlocked: boolean;
  allowsBiometricalUnlock: boolean;

  setup: (walletPassword: string, mnemonic: string, seedPassphrase: string, useBiometrics: boolean) => Promise<boolean>;
  init: () => Promise<void>;
  testIfStorageIsSetup: () => Promise<boolean>;
  lock: () => Promise<boolean>;
  unlock: (walletPassword: string) => Promise<boolean>;
  testIfAllowsBiometricalUnlock: () => Promise<boolean>;

  store: (key: string, unencryptedData: string, options?: object) => Promise<void>;
  storeUnencrypted: (key: string, data: string, options?: object) => Promise<void>;

  getSalt: () => Promise<Buffer>;
  getMnemonic: () => Promise<string>;
  getMnemonicPassphrase: () => Promise<string>;
  getWalletEncryptionPassword: () => Promise<string>;

  deriveSeed: () => Promise<SeedWrapper>;

  fetch: (key: string) => Promise<string>;
  fetchUnencrypted: (key: string) => Promise<string>;

  clear: () => Promise<void>;
};

class EncryptedStorageV1 implements EncryptedStorage {
  version = STORAGE_VERSION_1;
  options = DEFAULT_KEYCHAIN_OPTIONS;
  encryptionPassword: string | null = null;

  isSetup = false;
  isUnlocked = false;
  allowsBiometricalUnlock = false;

  constructor(options = DEFAULT_KEYCHAIN_OPTIONS) {
    this.options = options;
  }

  async setup(walletPassword: string, mnemonic: string, seedPassphrase = '', useBiometrics: boolean): Promise<boolean> {
    const salt = randomBytes(32);

    this.isUnlocked = false;
    this.isSetup = false;
    this.encryptionPassword = walletPassword;

    try {
      await this.storeUnencrypted(KEY_SALT, salt.toString('hex'));
      await this.storeUnencrypted(KEY_VERSION, `${this.version}`);
      await this.store(KEY_ENCRYPTION_TEST, VALUE_ENCRYPTION_TEST);
      await this.store(KEY_MNEMONIC, mnemonic);
      await this.store(KEY_PASSPHRASE, seedPassphrase);

      if (useBiometrics) {
        // Storing encryption password without application encryption,
        // relying on the bare encryption of the OS.
        await this.storeUnencrypted(KEY_ENCRYPTION_PASSWORD, walletPassword, {
          // Make the entry only accessible with biometric sensors
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
        });

        await this.storeUnencrypted(KEY_USE_BIOMETRICS, 'true');
        this.allowsBiometricalUnlock = true;
      } else {
        // Disable biometrical login
        await this.storeUnencrypted(KEY_USE_BIOMETRICS, 'false');
        this.allowsBiometricalUnlock = false;
      }

      this.isUnlocked = true;

    } catch (e) {
      console.error(e);
      return false;
    }

    return await this.testIfStorageIsSetup();
  }

  async init(): Promise<void> {
    await this.testIfStorageIsSetup();
    await this.testIfUnlocked();
    await this.testIfAllowsBiometricalUnlock();
  }

  async testIfStorageIsSetup(): Promise<boolean> {
    this.isSetup = false;

    try {
      const salt = await this.fetchUnencrypted(KEY_SALT);
      if (salt) {
        this.isSetup = true;
        return this.isSetup;
      }

    } catch (e) {
      console.error(e);
    }

    return false;
  }

  async testIfUnlocked(): Promise<boolean> {
    this.isUnlocked = false;

    try {
      if (!this.isSetup) return false;
      if (!this.encryptionPassword) return false;
      const testVal = await this.fetch(KEY_ENCRYPTION_TEST);
      this.isUnlocked = (testVal === VALUE_ENCRYPTION_TEST);
      return this.isUnlocked;

    } catch (e) {
      console.error(e);
    }

    return false;
  }

  async testIfAllowsBiometricalUnlock(): Promise<boolean> {
    this.allowsBiometricalUnlock = false;

    const data = await this.fetchUnencrypted(KEY_USE_BIOMETRICS);
    if (!data) {
      return false;
    }

    this.allowsBiometricalUnlock = (data === 'true');
    return this.allowsBiometricalUnlock;
  }

  async lock(): Promise<boolean> {
    this.encryptionPassword = null;
    this.isUnlocked = false;
    return await Promise.resolve(true);
  }

  async unlock(walletPassword: string): Promise<boolean> {
    this.encryptionPassword = walletPassword;

    const isUnlocked = await this.testIfUnlocked();
    if (!isUnlocked) this.encryptionPassword = null;

    return isUnlocked;
  }

  async encrypt(data: string): Promise<string> {
    if (this.encryptionPassword == null) {
      throw new Error('Storage not unlocked (1)');
    }

    const salt = await this.getSalt();
    return AES256.encryptWithPassphrase(data, this.encryptionPassword, salt);
  }

  async decrypt(data: string): Promise<string> {
    if (this.encryptionPassword == null) {
      throw new Error('Storage not unlocked (2)');
    }

    const salt = await this.getSalt();
    return AES256.decryptWithPassphrase(data, this.encryptionPassword, salt);
  }

  async getSalt(): Promise<Buffer> {
    const data = await this.fetchUnencrypted(KEY_SALT);
    if (!data) {
      throw new Error('No salt found');
    }

    return Buffer.from(data, 'hex');
  }

  async getMnemonic(): Promise<string> {
    const data = await this.fetch(KEY_MNEMONIC);

    if (!data) {
      throw new Error('No mnemonic found');
    }

    return data;
  }

  async getMnemonicPassphrase(): Promise<string> {
    const data = await this.fetch(KEY_PASSPHRASE);
    return data;
  }  

  async getWalletEncryptionPassword(): Promise<string> {
    const data = await this.fetchUnencrypted(KEY_ENCRYPTION_PASSWORD);
    return data;
  }

  pack(key: string, val: string, meta: object = {}): string {
    const data = JSON.stringify({
      [key]: val,
      ...meta,
    });

    return data;
  }

  async store(key: string, unencryptedData: string, options?: object): Promise<void> {
    const encryptedData = await this.encrypt(unencryptedData);

    const _options = Object.assign({}, this.options, options, {
      service: key,
    });

    await Keychain.setGenericPassword(key, encryptedData, _options).catch(e => {
      console.error(e);
    });
  }

  async storeUnencrypted(key: string, data: string, options?: object): Promise<void> {
    const _options = Object.assign({}, this.options, options, {
      service: key,
    });
    await Keychain.setGenericPassword(key, data, _options);
  }

  async fetch(key: string): Promise<string> {
    if (!this.encryptionPassword) {
      throw new Error('Storage not unlocked (3)');
    }

    const encryptedData = await Keychain.getGenericPassword({ service: key });
    if (!encryptedData) return '';

    const password = encryptedData.password; // UserCredentials
    if (!password) return '';

    const decryptedData = await this.decrypt(password);
    return decryptedData;
  }

  async fetchUnencrypted(key: string): Promise<string> {
    const data = await Keychain.getGenericPassword({ service: key });
    if (!data) return '';
    return data.password;
  }

  async clear(): Promise<void> {
    const toBeCleared = [
      KEY_ENCRYPTION_TEST,
      KEY_ENCRYPTION_PASSWORD,
      KEY_MNEMONIC,
      KEY_PASSPHRASE,
      KEY_VERSION,
      KEY_SALT,
      KEY_USE_BIOMETRICS,
    ];

    const result = await Promise.all(toBeCleared.map(key => Keychain.resetGenericPassword({
      service: key,
    })));

    for (let i = 0; i < toBeCleared.length; ++i) {
      if (result[i] !== true) {
        console.warn(`Could not clear ${toBeCleared[i]}`);
      }
    }

    this.isSetup = false;
    this.isUnlocked = false;
    this.allowsBiometricalUnlock = false;
  }

  async deriveSeed(): Promise<SeedWrapper> {
    const mnemonic = await this.getMnemonic();
    const passphrase = await this.getMnemonicPassphrase();
    const seed = await SeedGenerator.generateSeed(mnemonic, passphrase);
    return new SeedWrapper(seed);
  }
}

async function getCurrentVersion(): Promise<VERSIONS> {
  try {
    const data = await Keychain.getGenericPassword({ service: KEY_VERSION });

    const existingStorageVersion = parseInt(data === false || data.password === '' ? `${STORAGE_VERSION_CURRENT}` : data.password);
    return existingStorageVersion;

  } catch (e) {
    console.error(e);
    return STORAGE_VERSION_CURRENT;
  }
};

export default async function createStorage(version?: VERSIONS, options?: object): Promise<EncryptedStorage> {
  const _version = version || await getCurrentVersion();
  let storage;

  if (_version === STORAGE_VERSION_1) {
    storage = new EncryptedStorageV1(options);
  }

  if (storage) {
    await storage.init();
    return storage;
  }

  throw new Error(`Invalid version ${_version} for encrypted storage`);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function handleCorruptedStorage(error: Error) {
  // ToDo: Implement logic for corrupted storage
};
