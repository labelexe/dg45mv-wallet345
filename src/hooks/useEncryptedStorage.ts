import React from 'react';

import { EncryptedStorage } from '../storage/EncryptedStorage';

export const EncryptedStorageContext = React.createContext<EncryptedStorage | null>(null);
export const useEncryptedStorage = () => React.useContext(EncryptedStorageContext);
