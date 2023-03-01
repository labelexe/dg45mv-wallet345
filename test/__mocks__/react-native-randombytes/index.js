export const randomBytes = (length, cb) => {
  let str = '';

  for (let i = 0; i < length; ++i) {
    str += `${(i * 81721) % 10}`;
  }

  return Buffer.from(str);
};
