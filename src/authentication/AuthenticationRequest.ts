
import { URL } from 'react-native-url-polyfill';
import AuthenticationRequestHandler from './AuthenticationRequestHandler';
import SeedWrapper from './SeedWrapper';

import DigiIdHandler from './handlers/DigiId';
import BitIdHandler from './handlers/BitId';

export type RequestParams = { 
  [key: string]: string;
};

export type MethodNameMap = {
  [key: string]: string;
};

type RequestHandlers = { 
  [key: string]: AuthenticationRequestHandler;
};

type URLComponents = {
  scheme: string;
  host: string;
  params: RequestParams;
  pathname: string;
};

const DEFAULT_SCHEME = 'DEFAULT';

const URL_HANDLERS: RequestHandlers = {
  'digiid': DigiIdHandler,
  'dgmvid': DigiIdHandler,
  'bitid': BitIdHandler,
};

const METHOD_NAMES: MethodNameMap = {
  'digiid': 'Digi-ID',
  'dgmvid': 'Digi-ID',
  'bitid': 'Bit-ID',
};

function serializeParams(params: RequestParams): string {
  return Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
}

export default class AuthenticationRequest {
  originalURL: string;
  urlComponents: URLComponents;
  initialized = false;

  constructor(originalURL: string, urlComponents?: URLComponents) {
    this.originalURL = originalURL;

    if (urlComponents) {
      this.urlComponents = urlComponents;

    } else {
      this.urlComponents = AuthenticationRequest.parseURL(originalURL);
    }
  }

  static parseURL(url: string): URLComponents {
    let parsedURL;

    try {
      // Example: dgmvid://digicorplabs.com/?x=12381283218
      parsedURL = new URL(url);
    } catch (e) {
      throw new Error('Invalid URL');
    }

    const {
      host,     // Example 'digicorplabs.com'
      protocol, // Example 'dgmvid:'
      search,   // Example '?x=12381283218'
      pathname, // Example '/login'
    } = parsedURL;

    // Parse and organize parameters
    const params = search
      .replace(/^[?]/, '')
      .split(/[&]/)
      .reduce<RequestParams>((a, c) => {
        const [key, value] = c.split(/=/);
        a[key] = value;
        return a;
      }, {});

    // Remove colon from the protocol
    const scheme = protocol.replace(/[:]$/, '');

    if (Object.keys(URL_HANDLERS).indexOf(scheme) === -1) {
      throw new Error(`URL scheme not supported: ${scheme}`);
    }

    const parsed: URLComponents = {
      scheme,
      host,
      params,
      pathname,
    };

    return parsed;
  }

  // Parse incoming URL and return a AuthenticationRequest
  static fromURL(url: string): AuthenticationRequest {
    const urlComponents = this.parseURL(url);
    return new this(url, urlComponents);
  }

  getBaseUrl(scheme = DEFAULT_SCHEME): string {
    if (scheme === DEFAULT_SCHEME) scheme = this.getWebScheme();
    return `${scheme}://${this.urlComponents.host}`;
  }

  getWebUrl(scheme = DEFAULT_SCHEME): string {
    if (scheme === DEFAULT_SCHEME) scheme = this.getWebScheme();
    const baseUrl = this.getBaseUrl(scheme);
    return `${baseUrl}?${serializeParams(this.urlComponents.params)}`;
  }

  getCallbackURL(scheme = DEFAULT_SCHEME): string {
    if (scheme === DEFAULT_SCHEME) scheme = this.getWebScheme();
    return `${this.getBaseUrl()}${this.urlComponents.pathname}`;
  }

  getMethodName(): string {
    return METHOD_NAMES[this.urlComponents.scheme] ?? 'unknown';
  }

  getWebScheme(): string {
    return (this.urlComponents.params['u'] === '1') ? 'http' : 'https';
  }

  async signRequest(seed: SeedWrapper): Promise<boolean> {
    const requestHandler = URL_HANDLERS[this.urlComponents.scheme];
    await requestHandler.init(this);
    return await requestHandler.execute(seed);
  }

  async init(): Promise<void> {
    await this.fetchFavicon();
    this.initialized = true;
  }

  async fetchFavicon(): Promise<void> {
    // ToDo: implement favicon fetcher
  }
}
