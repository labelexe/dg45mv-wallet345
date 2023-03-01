import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from 'crypto';

import pbkdf2 from './pbkdf2';

const IV_LENGTH = 16;
const DEFAULT_ALGO = 'aes-256-ctr';

const DEFAULT_PBKDF2_OPTIONS = {
  iterations: 512,
  keylen: 32,
  digest: 'sha256',
};

export function encrypt(data: string, encryptionKey: Buffer, algo: string = DEFAULT_ALGO): string {
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(algo, encryptionKey, iv);

  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export function decrypt(data: string, encryptionKey: Buffer, algo: string = DEFAULT_ALGO): string {
  const [iv, encryptedText] = data
    .split(/[:]/)
    .map(d => Buffer.from(d, 'hex'));

  const decipher = createDecipheriv(algo, encryptionKey, iv);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export async function encryptWithPassphrase(data: string, passphrase: string, salt: Buffer, options: object = {}) {
  const _options = Object.assign({}, DEFAULT_PBKDF2_OPTIONS, options);
  const key = await pbkdf2(passphrase, salt, _options.iterations, _options.keylen, _options.digest);
  return encrypt(data, key);
};

export async function decryptWithPassphrase(data: string, passphrase: string, salt: Buffer, options: object = {}) {
  const _options = Object.assign({}, DEFAULT_PBKDF2_OPTIONS, options);
  const key = await pbkdf2(passphrase, salt, _options.iterations, _options.keylen, _options.digest);
  return decrypt(data, key);
};