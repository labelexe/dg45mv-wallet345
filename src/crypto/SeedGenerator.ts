
// import bip38 from 'bip38';

import {
  mnemonicToSeed,
} from 'bip39';

interface SeedGenerator {
  generateSeed: (mnemonic: string, passphrase: string) => Promise<Buffer>;
};

class SeedGeneratorImpl implements SeedGenerator {
  async generateSeed(mnemonic: string, passphrase: string): Promise<Buffer> {
    return mnemonicToSeed(mnemonic, passphrase);
  };
}

export default new SeedGeneratorImpl();
