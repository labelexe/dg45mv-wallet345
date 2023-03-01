// pbkdf2

import { pbkdf2 } from 'crypto';

export default function pbkdf2_w(walletPassword: string | Buffer, salt: string | Buffer, iterations: number, keylen: number, digest: string): Promise<Buffer> {
  return new Promise((fulfill, reject) => {
    pbkdf2(walletPassword, salt, iterations, keylen, digest, (err, result) => {
      if (err) return reject(err);
      fulfill(result);
    });
  });
};