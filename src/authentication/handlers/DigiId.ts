
import axios from 'axios';

import AuthenticationRequestHandler from '../AuthenticationRequestHandler';
import type AuthenticationRequest from '../AuthenticationRequest';
import Deriver from '../../wallet/Deriver';
import SeedWrapper from '../SeedWrapper';

class DigiIdRequestHandler implements AuthenticationRequestHandler {
  request: AuthenticationRequest | null = null;

  // eslint-disable-next-line @typescript-eslint/require-await
  async init(request: AuthenticationRequest) {
    this.request = request;
  }

  async execute(seed: SeedWrapper): Promise<boolean> {
    if (!this.request) return false;

    const deriver = new Deriver(seed, 'DigiByte', 'mainnet');
    const result = deriver.deriveAuthenticationKey(this.request, 0);
    console.log(result);

    try {
      // await axios.post(result.uri, result);

    } catch (e) {
      console.error(e);
      return false;
    }

    return true;
  }

  reset() {
    this.request = null;
  }
}

export default new DigiIdRequestHandler();
