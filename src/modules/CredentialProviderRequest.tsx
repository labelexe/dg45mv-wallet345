import {
  NativeModules,
} from 'react-native';

const {
  CredentialProviderRequest,
} = NativeModules;

export type ServiceIdentifier = {
  identifier: string;
  type: string;
};

export interface CredentialProviderRequestInterface {
  authenticationRequestCompleted(username: string, password: string): void;
  authenticationRequestCancelled(reason: string): void;
  autofillIsEnabled(): Promise<boolean>;
  autofillIsSupported(): Promise<boolean>;
  askForPermissions(): void;
};

export default CredentialProviderRequest as CredentialProviderRequestInterface;
