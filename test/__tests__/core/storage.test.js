import { jest } from '@jest/globals';
import createStorage, { VERSIONS } from '../../../src/storage/EncryptedStorage';

describe('Storage (V=1)', function () {
  let storageV1;

  beforeAll(async () => {
    storageV1 = await createStorage(VERSIONS.V1);
  });

  it('should yield false for storageIsSetup() if the storage was not setup before', async () => {
    const isSetup = await storageV1.storageIsSetup();
    expect(isSetup).toBe(false);
  });

  it('should not be able to unlock the storage before setup', async () => {
    const passphrase = 'test';
    const unlocked = await storageV1.unlock(passphrase);
    expect(unlocked).toBe(false);
  });

  it('should be able to setup the storage with some sample data', async () => {
    const storagePassword = 'password1';
    const mnemonic = 'ignore ignore ignore';

    const r = await storageV1.setup(storagePassword, mnemonic);

    const unlocked = await storageV1.storageIsSetup();
    expect(unlocked).toBe(true);
  });

  it('should be possible to lock the storage', async () => {
    const unlocked = await storageV1.isUnlocked();
    expect(unlocked).toBe(true);

    await storageV1.lock();
    const stillUnlocked = await storageV1.isUnlocked();
    expect(stillUnlocked).toBe(false);    
  })
});
