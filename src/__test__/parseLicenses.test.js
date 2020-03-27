const parse = require('../parseLicenses');

describe('parseLicenses', () => {
  test('Should not call create warning or error notification methods', () => {
    const parseLicensesDependencies = {
      whitelistedLicenses: ['MIT'],
      blacklistedLicenses: [],
      createWarnNotification: jest.fn(),
      createErrorNotification: jest.fn(),
    };
    const licenses = [{ repository: 'www.github.com/X', licenses: 'MIT' }];
    parse(parseLicensesDependencies)(licenses);

    expect(parseLicensesDependencies.createWarnNotification).not.toHaveBeenCalled();
    expect(parseLicensesDependencies.createWarnNotification).not.toHaveBeenCalled();
  });

  test('Should call create warning notification method', () => {
    const parseLicensesDependencies = {
      whitelistedLicenses: [],
      blacklistedLicenses: [],
      createWarnNotification: jest.fn(),
      // eslint-disable-next-line no-empty-function
      createErrorNotification: () => { },
    };
    const licenses = [{ repository: 'www.github.com/X', licenses: 'MIT' }];
    parse(parseLicensesDependencies)(licenses);

    expect(parseLicensesDependencies.createWarnNotification).toHaveBeenCalledWith(`MODULE : ${licenses[0].repository} | LICENSE : ${licenses[0].licenses}`);
  });

  test('Should call create error notification method', () => {
    const parseLicensesDependencies = {
      whitelistedLicenses: [],
      blacklistedLicenses: ['MIT'],
      // eslint-disable-next-line no-empty-function
      createWarnNotification: () => { },
      createErrorNotification: jest.fn(),
    };
    const licenses = [{ repository: 'www.github.com/X', licenses: 'MIT' }];
    parse(parseLicensesDependencies)(licenses);

    expect(parseLicensesDependencies.createErrorNotification).toHaveBeenCalledWith(`MODULE : ${licenses[0].repository} | LICENSE : ${licenses[0].licenses}`);
  });

  test('Should fail on missing licenses', () => {
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
    const licenses = [{ repository: 'www.github.com/X', licenses: 'MIT' }];

    expect(() => parse(parseLicensesDependencies)(licenses)).toThrow(TypeError);
  });
});
