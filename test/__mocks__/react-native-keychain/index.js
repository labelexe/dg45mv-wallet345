
export const ACCESS_CONTROL = {
  USER_PRESENCE: 'MOCK_USER_PRESENCE',
  BIOMETRY_ANY_OR_DEVICE_PASSCODE: 'MOCK_BIOMETRY_ANY_OR_DEVICE_PASSCODE',
};

export const ACCESSIBLE = {
  WHEN_UNLOCKED: 'MOCK_WHEN_UNLOCKED',
};

const store = {};

export const setGenericPassword = jest.fn().mockImplementation(async (username, password, options) => {
  const { service } = options;
  store[service] = { username, password };
});

export const getGenericPassword = jest.fn().mockImplementation(async (options) => {
  const { service } = options;
  const val = store[service];
  if (!val) return false;
  return val;
});

