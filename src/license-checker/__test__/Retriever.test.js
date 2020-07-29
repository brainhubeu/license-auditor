const Retriever = require('../Retriever');

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
    const retriever = Retriever(licenseMap, templates);

    const result = retriever.retrieveLicenseFromLicenseFileContent(content);

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
    const retriever = Retriever(licenseMap, templates);

    const result = retriever.retrieveLicenseFromLicenseFileContent(content);

    expect(result).toBe('FOO');
  });

  test('should return the license content if no known license is matched', () => {
    const content = `custom license
foo bar baz`;
    const licenseMap = {
      'MIT license': 'MIT',
    };
    const templates = {
      'foo bar': 'FOO',
    };
    const retriever = Retriever(licenseMap, templates);

    const result = retriever.retrieveLicenseFromLicenseFileContent(content);

    expect(result).toBe(`custom license
foo bar baz`);
  });
});
