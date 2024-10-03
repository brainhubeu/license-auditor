const Retriever = require('../retriever');

describe('Retriever.retrieveLicenseFromLicenseFileContent', () => {
  test('should find a mapped license', () => {
    const content = `
    MIT license
    MIT license content
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
    const content = `copyright by Alan Anderson
BSD license content`;
    const licenseMap = {
      'MIT license': 'MIT',
    };
    const templates = {
      'BSD license content': 'BSD',
    };
    const retriever = Retriever(licenseMap, templates);

    const result = retriever.retrieveLicenseFromLicenseFileContent(content);

    expect(result).toBe('BSD');
  });

  test('should return the license content if no known license is matched', () => {
    const content = `custom license
custom license content`;
    const licenseMap = {
      'MIT license': 'MIT',
    };
    const templates = {
      'BSD license content': 'BSD',
    };
    const retriever = Retriever(licenseMap, templates);

    const result = retriever.retrieveLicenseFromLicenseFileContent(content);

    expect(result).toBe(`custom license
custom license content`);
  });
});
