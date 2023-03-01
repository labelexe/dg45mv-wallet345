
import AuthenticationRequest from './AuthenticationRequest';
import SeedWrapper from './SeedWrapper';

interface AuthenticationRequestHandler {
  init(request: AuthenticationRequest): Promise<void>;
  execute(seed: SeedWrapper): Promise<boolean>;
};

export default AuthenticationRequestHandler;
