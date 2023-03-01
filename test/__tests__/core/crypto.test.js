import * as AES256 from '../../../src/crypto/aes256';
import PBKDF2 from '../../../src/crypto/pbkdf2';

describe('AES256', () => {
  const encryptionKey = Buffer.from('aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899', 'hex');

  it('should be able to encrypt a value and decrypt it again with static secret', async () => {
    const cipherText = 'I am Satoshi Nakamoto';

    const encrypted = await AES256.encrypt(cipherText, encryptionKey);
    const decrypted = await AES256.decrypt(encrypted, encryptionKey);

    expect(decrypted).toBe(cipherText);
  });

  it('should be able to encrypt a value and decrypt it again with pbkdf2', async () => {
    const cipherText = 'Who is Satoshi Nakamoto?';
    const secretPassword = 'Elon Musk';

    const salt = Buffer.from('abcdef0123456789abcdef0123456789', 'hex');
    const iterations = 512;
    const keylen = 32;
    const digest = 'sha256';
    const encryptionPassword = await PBKDF2(secretPassword, salt, iterations, keylen, digest);

    const encrypted = await AES256.encrypt(cipherText, encryptionPassword);
    const decrypted = await AES256.decrypt(encrypted, encryptionPassword);

    expect(decrypted).toBe(cipherText);
  });  

  it('should be able to encrypt/decrypt using en/decryptWithPassphrase', async () => {
    const cipherText = 'We are all Satoshi Nakamoto!';
    const secretPassword = 'I bet you know!';
    const salt = Buffer.from('abcdef0123456789abcdef0123456789', 'hex');

    const encrypted = await AES256.encryptWithPassphrase(cipherText, secretPassword, salt);
    const decrypted = await AES256.decryptWithPassphrase(encrypted, secretPassword, salt);

    expect(decrypted).toBe(cipherText);
  });

  it('should be able to encrypt/decrypt using en/decryptWithPassphrase and custom digest', async () => {
    const cipherText = 'UTXO is superior';
    const secretPassword = 'Bitcoin';
    const salt = Buffer.from('abcdef0123456789abcdef0123456789', 'hex');
    const options1 = {
      iterations: 1024,
      digest: 'sha512',
    };

    const options2 = {
      iterations: 512,
      digest: 'sha256',
    };    

    // Decrypting with different password options won't yield the same deciphered data
    const encrypted = await AES256.encryptWithPassphrase(cipherText, secretPassword, salt, options1);
    const decrypted = await AES256.decryptWithPassphrase(encrypted, secretPassword, salt, options2);
    expect(decrypted).not.toBe(cipherText);

    const encrypted2 = await AES256.encryptWithPassphrase(cipherText, secretPassword, salt, options1);
    const decrypted2 = await AES256.decryptWithPassphrase(encrypted, secretPassword, salt, options1);    
    expect(decrypted2).toBe(cipherText);
  });
});
