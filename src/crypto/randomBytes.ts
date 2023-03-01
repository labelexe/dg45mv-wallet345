
import { randomBytes as rb } from 'react-native-randombytes';

export default function randomBytes(n: number): Promise<Buffer> {
  return new Promise((fulfill, reject) => {
    rb(n, (error, buffer) => {
      if (error) return reject(error);
      if (!buffer) return reject(new Error('No random data received'));
      fulfill(buffer);
    });
  });
};
