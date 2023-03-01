
import {
  HDPrivateKey,
  PrivateKey,
  Message,
  Networks,
} from 'bitcore-lib';

import AuthenticationRequest from '../authentication/AuthenticationRequest';
import SeedWrapper from '../authentication/SeedWrapper';

const DigiByteTestnet = {
  name: 'digibyte-testnet',
  alias: 'digibyte-testnet',
  bech32prefix: 'dgbt',
  pubkeyhash: 0x7e,
  privatekey: 0xfe,
  scripthash: 0x8c,
  xpubkey: 0x043587cf,
  xprivkey: 0x04358394,
  networkMagic: 0xfac3b6da,
  port: 12024,
};

const DigiByteMainnet = {
  name: 'digibyte-mainnet',
  alias: 'digibyte-mainnet',
  bech32prefix: 'dgb',
  pubkeyhash: 0x1e,
  privatekey: 0x80,
  scripthash: 0x3f,
  xpubkey: 0x0488b21e,
  xprivkey: 0x0488ade4,
  networkMagic: 0xfac3b6da,
  port: 12024,
};

const clone = (c: Networks.Network) => Object.assign({}, c);

type NetworkMap = {
  [key: string]: Networks.Network;
}

const BitcoinLivenet = clone(Networks.livenet);
const BitcoinMainnet = clone(Networks.mainnet);
const BitcoinTestnet = clone(Networks.testnet);
const BitcoinRegtest = clone(Networks.regtest);

const NETWORKS = (): NetworkMap => ({
  // Bitcoin
  ['bitcoin-livenet']: clone(BitcoinLivenet),
  ['bitcoin-mainnet']: clone(BitcoinMainnet),
  ['bitcoin-testnet']: clone(BitcoinTestnet),
  ['bitcoin-regtest']: clone(BitcoinRegtest),

  // DigiByte
  ['digibyte-mainnet']: clone(DigiByteMainnet) as Networks.Network,
  ['digibyte-testnet']: clone(DigiByteTestnet) as Networks.Network,
});

(() => {
  const initialNetworks = NETWORKS();

  // Clear all networks from bitcore-lib
  [Networks.livenet, Networks.mainnet, Networks.testnet, Networks.regtest].forEach(network => {
    Networks.remove(network);
  });

  type UnsafeNetworkMap = {
    [key: string]: Networks.Network | null;
  };

  const nets = (Networks as unknown) as UnsafeNetworkMap;
  nets.livenet = null;
  nets.mainnet = null;
  nets.testnet = null;
  nets.regtest = null;
  nets.defaultNetwork = null;
})();

import * as Hashing from '../crypto/Hashing';

export type CoinName = 'DigiByte' | 'Bitcoin';
export type NetworkName = 'mainnet' | 'testnet';

export type AuthenticationSignature = {
  uri: string;
  address: string;
  signature: string;
};

export type BufferMap = {
  [key: string]: Buffer;
};

function getNetwork(name: string): Networks.Network {
  return NETWORKS()[name];
}

function withMagicBytes(magicBytes: Buffer, execute: () => string): string {
  const M = (Message as unknown) as BufferMap;
  const OM = M['MAGIC_BYTES']; // Original

  let ret = '';

  try {
    M['MAGIC_BYTES'] = magicBytes;
    ret = execute();

  } finally {
    M['MAGIC_BYTES'] = OM;
  }

  return ret;
}

function withDefaultNetwork<T>(network: Networks.Network, execute: () => T): T {
  const defaultNet: Networks.Network = Networks.defaultNetwork;

  let ret;

  try {
    Networks.add(network);
    const parsedNet = Networks.get(network.name, '');
    Networks.defaultNetwork = parsedNet;

    console.log('ALL', Networks);
    console.log(defaultNet);

    ret = execute();

  } finally {
    Networks.remove(network);
    Networks.defaultNetwork = defaultNet;
  }

  return ret;
}

export function signMessage(coin: CoinName, data: string, privateKey: PrivateKey): string {
  const magicBytes = Buffer.from(`${coin} Signed Message:\n`);

  const signedMessage = withMagicBytes(magicBytes, () => {
    return new Message(data).sign(privateKey);
  });


  return signedMessage;
}

export default class Deriver {
  seed: SeedWrapper;
  network: Networks.Network;
  networkId: string;
  coinName: CoinName;

  constructor(seed: SeedWrapper, coinName: CoinName, networkName: NetworkName = 'mainnet') {
    const networkKey = `${coinName.toLowerCase()}-${networkName}`;
    const network = getNetwork(networkKey);

    if (!network) {
      throw new Error('Network configuration not found');
    }

    if (seed.get().length != 32 && seed.get().length != 64) {
      throw new Error('Invalid seed');
    }

    this.seed = seed;
    this.network = network;
    this.networkId = networkKey;
    this.coinName = coinName;
  }

  deriveKey(path: string): PrivateKey {
    const seed = this.seed.get();

    return withDefaultNetwork(this.network, () => {
      const hdPrivateKey = HDPrivateKey.fromSeed(seed);
      console.log('HD', hdPrivateKey);
      const child = hdPrivateKey.deriveChild(path);
      const privateKey = child.privateKey;
      return privateKey;      
    });
  }  

  deriveAuthenticationKey(request: AuthenticationRequest, index: number): AuthenticationSignature {
    // uri: string, callbackURL: string
    const uri = request.originalURL;
    const callbackURL = request.getCallbackURL();

    const INDEX_BITS = 32;
    const INDEX_BYTES = INDEX_BITS / 8;
    const DERIVATION_INDEX_SIZE = INDEX_BITS / 8;

    // Create buffer from index
    const indexBuffer = Buffer.alloc(INDEX_BYTES);
    indexBuffer.writeUInt32LE(index, 0);

    // Concat index with url
    const content = Buffer.concat([indexBuffer, Buffer.from(callbackURL)]);

    // Hash the buffer
    const hashHex = Hashing.sha256(content); // hex string
    const hashBuffer = Buffer.from(hashHex, 'hex');

    // Calculate derivation path
    const A = hashBuffer.readUInt32LE(DERIVATION_INDEX_SIZE * 0);
    const B = hashBuffer.readUInt32LE(DERIVATION_INDEX_SIZE * 1);
    const C = hashBuffer.readUInt32LE(DERIVATION_INDEX_SIZE * 2);
    const D = hashBuffer.readUInt32LE(DERIVATION_INDEX_SIZE * 3);

    // Output indexes in littleEndian
    // console.log({
    //   hash: hashHex,
    //   A: A.toString(16).match(/../g).reverse().join('') + ': ' + A,
    //   B: B.toString(16).match(/../g).reverse().join('') + ': ' + B,
    //   C: C.toString(16).match(/../g).reverse().join('') + ': ' + C,
    //   D: D.toString(16).match(/../g).reverse().join('') + ': ' + D,
    // });

    // Derive the correct private key
    const type = 13;
    const path = `m/${type}'/${A}'/${B}'/${C}'/${D}'`;
    const privateKey = this.deriveKey(path);

    // Get address
    const address = privateKey.toAddress().toString();

    // Calculate signature
    const signature = signMessage(this.coinName, uri, privateKey);

    return {
      uri: uri,
      address: address,
      signature: signature,
    };
  }
}
