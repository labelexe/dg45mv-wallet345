/* eslint-disable */

import AuthenticationRequestHandler from '../AuthenticationRequestHandler';
import type AuthenticationRequest from '../AuthenticationRequest';
import SeedWrapper from '../SeedWrapper';

class BitIdRequestHandler implements AuthenticationRequestHandler {
  async init(request: AuthenticationRequest) {
  }

  async execute(seed: SeedWrapper): Promise<boolean> {
    return Promise.reject('Not implemented');
  }
}

export default new BitIdRequestHandler();
