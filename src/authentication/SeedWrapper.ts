
// This class is responsible for wrapping the seed in
// an object and clearing (overwriting it with 0b1111111)
// after finished usage.
export default class SeedWrapper {
  _released = false;
  _buffer: Buffer;

  constructor(buffer: Buffer) {
    this._buffer = buffer;
  }

  get() {
    return this._buffer;
  }

  release() {
    for (let i = 0; i < this._buffer.length; ++i) {
      this._buffer[i] = 0xFF;
    }

    this._released = true;
  }
}
