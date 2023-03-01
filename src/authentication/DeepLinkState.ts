
//eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

import {
  Linking,
} from 'react-native';

class DeepLinkState {
  _url: string;

  constructor() {
    this._url = '';

    Linking.getInitialURL().then((url) => {
      if (!url) return;
      this._url = url;
    }).catch(e => {
      console.error(e);
    });

    Linking.addEventListener('url', (event) => {
      const url = event?.url;
      if (!url) return;
      this._url = url;
    });
  }

  hasRequest(): boolean {
    return (this._url !== '');
  }

  getRequest(): string {
    const url = this._url;
    this._url = ''; // clear
    return url;
  }
};

export default new DeepLinkState();
