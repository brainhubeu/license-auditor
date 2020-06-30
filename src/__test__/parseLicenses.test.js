const parse = require('../parseLicenses');

const licenses
  = {
    MIT_APACHE: {
      licenses: ['MIT', 'Apache'],
      repository: 'https://github.com/X',
      publisher: 'John Doe',
      email: 'john.doe@gmail.com',
      url: 'johndoe.com',
      path: 'node_modules/X',
      licenseFile: 'node_modules/X/LICENSE',
    },
    BSD_AFL: {
      licenses: ['BSD', 'AFL'],
      repository: 'https://github.com/Y',
      publisher: 'Foo Bar',
      email: 'foo.bar@gmail.com',
      url: 'foobar.com',
      path: 'node_modules/Y',
      licenseFile: 'node_modules/Y/LICENSE',
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

    expect(parseLicensesDependencies.createWarnNotification).toHaveBeenCalledWith(
      `MODULE : ${licenses.MIT_APACHE.path}
 | LICENSE : ${licenses.MIT_APACHE.licenses}
 | LICENSE_FILE : ${licenses.MIT_APACHE.licenseFile}
 | REPOSITORY: ${licenses.MIT_APACHE.repository}
 | PUBLISHER : ${licenses.MIT_APACHE.publisher}
 | EMAIL : ${licenses.MIT_APACHE.email}
 | URL : ${licenses.MIT_APACHE.url}
`);
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

    expect(parseLicensesDependencies.createErrorNotification).toHaveBeenCalledWith(
      `MODULE : ${licenses.BSD_AFL.path}
 | LICENSE : ${licenses.BSD_AFL.licenses}
 | LICENSE_FILE : ${licenses.BSD_AFL.licenseFile}
 | REPOSITORY: ${licenses.BSD_AFL.repository}
 | PUBLISHER : ${licenses.BSD_AFL.publisher}
 | EMAIL : ${licenses.BSD_AFL.email}
 | URL : ${licenses.BSD_AFL.url}
`);
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
