const parse = require('../parseLicenses');

const licenses = [
  {
    licenses: ['MIT', 'Apache2'],
    repository: 'https://github.com/X',
    publisher: 'John Doe',
    email: 'john.doe@gmail.com',
    url: 'johndoe.com',
    path: '/path/to/project/node_modules/X',
    licenseFile: '/path/to/file/node_modules/X/LICENSE',
  },
  {
    licenses: ['BSD', 'AFL'],
    repository: 'https://github.com/Y',
    publisher: 'Foo Bar',
    email: 'foo.bar@gmail.com',
    url: 'foobar.com',
    path: '/path/to/project/node_modules/Y',
    licenseFile: '/path/to/file/node_modules/Y/LICENSE',
  },
];

describe('parseLicenses', () => {
  test('should not call createWarnNotification or createErrorNotification', () => {
    const parseLicensesDependencies = {
      whitelistedLicenses: ['MIT', 'Apache2', 'BSD', 'AFL'],
      blacklistedLicenses: [],
      createWarnNotification: jest.fn(),
      createErrorNotification: jest.fn(),
    };
    parse(parseLicensesDependencies)(licenses);

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
    parse(parseLicensesDependencies)(licenses);

    expect(parseLicensesDependencies.createWarnNotification).toHaveBeenCalledWith(
      `MODULE : ${licenses[1].path.substr(licenses[1].path.indexOf('node_modules'),
      )}\n | LICENSE : ${
        licenses[1].licenses
      }\n | LICENSE_FILE : ${licenses[1].licenseFile.substr(
        licenses[1].licenseFile.indexOf('node_modules'),
      )}\n | REPOSITORY: ${licenses[1].repository}\n | PUBLISHER : ${
        licenses[1].publisher
      }\n | EMAIL : ${licenses[1].email}\n | URL : ${licenses[1].url}\n`);
  });

  test('should call createErrorNotification', () => {
    const parseLicensesDependencies = {
      whitelistedLicenses: [],
      blacklistedLicenses: ['BSD'],
      // eslint-disable-next-line no-empty-function
      createWarnNotification: () => { },
      createErrorNotification: jest.fn(),
    };
    parse(parseLicensesDependencies)(licenses);

    expect(parseLicensesDependencies.createErrorNotification).toHaveBeenCalledWith(
      `MODULE : ${licenses[1].path.substr(licenses[1].path.indexOf('node_modules'),
      )}\n | LICENSE : ${
        licenses[1].licenses
      }\n | LICENSE_FILE : ${licenses[1].licenseFile.substr(
        licenses[1].licenseFile.indexOf('node_modules'),
      )}\n | REPOSITORY: ${licenses[1].repository}\n | PUBLISHER : ${
        licenses[1].publisher
      }\n | EMAIL : ${licenses[1].email}\n | URL : ${licenses[1].url}\n`);
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

    expect(() => parse(parseLicensesDependencies)(licenses)).toThrow(TypeError);
  });
});
