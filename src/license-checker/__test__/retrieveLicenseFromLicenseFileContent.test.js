const retrieveLicenseFromLicenseFileContent = require('../retrieveLicenseFromLicenseFileContent');

describe('retrieveLicenseFromLicenseFileContent', () => {
  test('should find a mapped license', () => {
    const content = `
    MIT license
    foo bar baz
`;
    const licenseMap = {
      'MIT license': 'MIT',
    };
    const templates = {};

    const result = retrieveLicenseFromLicenseFileContent(content, licenseMap, templates);

    expect(result).toBe('MIT');
  });

  test('should find a license by template', () => {
    const content = `custom license
foo bar baz`;
    const licenseMap = {
      'MIT license': 'MIT',
    };
    const templates = {
      'foo bar baz': 'FOO',
    };

    const result = retrieveLicenseFromLicenseFileContent(content, licenseMap, templates);

    expect(result).toBe('FOO');
  });
});
