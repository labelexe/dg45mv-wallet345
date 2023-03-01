import {
  createHash,
} from 'crypto';

const sha256 = (data) => {
  const hash = createHash('sha256').update(data).digest('hex');
  return hash;
};

export {
  sha256,
};
