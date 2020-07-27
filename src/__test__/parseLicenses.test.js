const parse = require('../parseLicenses');

const licenses
  = {
    MIT_APACHE: {
      license: ['MIT', 'Apache'],
      repository: 'https://github.com/X',
      publisher: 'John Doe',
      email: 'john.doe@gmail.com',
      path: 'node_modules/X',
      licensePath: 'node_modules/X/LICENSE',
      version: '0.0.1',
    },
    BSD_AFL: {
      license: ['BSD', 'AFL'],
      repository: 'https://github.com/Y',
      publisher: 'Foo Bar',
      email: 'foo.bar@gmail.com',
      path: 'node_modules/Y',
      licensePath: 'node_modules/Y/LICENSE',
      version: '0.0.2',
    },
  };

describe('parseLicenses', () => {
  test('should not call createWarnNotification or createErrorNotification', () => {
    const parseLicensesDependencies = {
      whitelistedLicenses: ['MIT', 'Apache', 'BSD', 'AFL'],
      blacklistedLicenses: [],
      createWarnNotification: jest.fn(),
      createErrorNotification: jest.fn(),
    };
    parse(parseLicensesDependencies)([licenses.MIT_APACHE, licenses.BSD_AFL]);

    expect(parseLicensesDependencies.createErrorNotification).not.toHaveBeenCalled();
    expect(parseLicensesDependencies.createWarnNotification).not.toHaveBeenCalled();
  });

  test('should call createWarnNotification', () => {
    const parseLicensesDependencies = {
      whitelistedLicenses: [],
      blacklistedLicenses: [],
      createWarnNotification: jest.fn(),
      // eslint-disable-next-line no-empty-function
      createErrorNotification: () => { },
    };
    parse(parseLicensesDependencies)([licenses.MIT_APACHE, licenses.BSD_AFL]);

    expect(parseLicensesDependencies.createWarnNotification.mock.calls[0]).toEqual([
      `MODULE PATH: node_modules/X
| LICENSE: MIT,Apache
| LICENSE PATH: node_modules/X/LICENSE
| REPOSITORY: https://github.com/X
| PUBLISHER: John Doe
| EMAIL: john.doe@gmail.com
| VERSION: 0.0.1
`,
    ]);
  });

  test('should call createErrorNotification', () => {
    const parseLicensesDependencies = {
      whitelistedLicenses: [],
      blacklistedLicenses: ['BSD'],
      // eslint-disable-next-line no-empty-function
      createWarnNotification: () => { },
      createErrorNotification: jest.fn(),
    };
    parse(parseLicensesDependencies)([licenses.MIT_APACHE, licenses.BSD_AFL]);

    expect(parseLicensesDependencies.createErrorNotification.mock.calls[0]).toEqual([
      `MODULE PATH: node_modules/Y
| LICENSE: BSD,AFL
| LICENSE PATH: node_modules/Y/LICENSE
| REPOSITORY: https://github.com/Y
| PUBLISHER: Foo Bar
| EMAIL: foo.bar@gmail.com
| VERSION: 0.0.2
`,
    ]);
  });

  test('should fail on missing licenses', () => {
    const parseLicensesDependencies = {
      // eslint-disable-next-line no-undefined
      whitelistedLicenses: undefined,
      // eslint-disable-next-line no-undefined
      blacklistedLicenses: undefined,
      // eslint-disable-next-line no-empty-function
      createWarnNotification: () => {},
      // eslint-disable-next-line no-empty-function
      createErrorNotification: () => {},
    };

    expect(() => parse(parseLicensesDependencies)([licenses.MIT_APACHE, licenses.BSD_AFL])).toThrow(TypeError);
  });
});
