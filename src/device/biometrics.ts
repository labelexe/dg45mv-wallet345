import * as Keychain from 'react-native-keychain';

class Biometrics {
  biometryType: Keychain.BIOMETRY_TYPE | null;

  constructor() {
    this.biometryType = null;
  }

  async init() {
    return Keychain.getSupportedBiometryType().then(biometryType => {
      // Store biometry type for later access
      this.biometryType = biometryType;

    }).catch(e => {
      console.error(e);
      this.biometryType = null;
    });    
  }

  supportsBiometricAuthentication(): boolean {
    switch (this.biometryType) {
    case Keychain.BIOMETRY_TYPE.TOUCH_ID:
    case Keychain.BIOMETRY_TYPE.FACE_ID:
    case Keychain.BIOMETRY_TYPE.FINGERPRINT:
    case Keychain.BIOMETRY_TYPE.FACE:
    case Keychain.BIOMETRY_TYPE.IRIS:
      return true;

    default:
      return false;
    }
  }

  getSensorName(): string {
    switch (this.biometryType) {
    case Keychain.BIOMETRY_TYPE.TOUCH_ID:
      return 'Touch ID';

    case Keychain.BIOMETRY_TYPE.FACE_ID:
      return 'Face ID';

    case Keychain.BIOMETRY_TYPE.FINGERPRINT:
      return 'Fingerprint';

    case Keychain.BIOMETRY_TYPE.FACE:
      return 'Face Detection';

    case Keychain.BIOMETRY_TYPE.IRIS:
      return 'IRIS';
        
    default:
      return '';
    }
  }

  async testBiometrics(): Promise<boolean> {
    try {
      const keyValue = 'BT';
      const testValue = `BIOMETRIC_TEST_${Date.now()}`;

      const options = {
        service: keyValue,
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      };

      // Write value
      await Keychain.setGenericPassword(keyValue, testValue, options);      

      // Read value
      const data = await Keychain.getGenericPassword({ service: keyValue });
      if (!data) return false;
      const storedValue = data.password;

      return storedValue === testValue;

    } catch (e) {
      console.error(e);
    }

    return false;
  }
}

export default new Biometrics();
