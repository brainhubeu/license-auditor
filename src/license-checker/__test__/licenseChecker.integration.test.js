const licenseChecker = require('../licenseChecker');

const expectedDataArray = require('./constants/licenseChecker-integration-expected-data-array');

let result;

describe('licenseChecker', () => {
  beforeAll(async () => {
    jest.setTimeout(120000);
    result = await licenseChecker.findAllLicenses({ projectPath: 'src/license-checker/__test__' });
  });

  test('should return licences with a valid schema', () => {
    result.forEach(item => {
      expect(typeof item.path).toBe('string');
      expect(typeof item.licenses === 'string' || Array.isArray(item.licenses)).toBe(true);
      expect(typeof item.licensePath).toBe('string');
      expect(['string', 'undefined'].includes(typeof item.repository)).toBe(true);
      expect(['string', 'undefined'].includes(typeof item.publisher)).toBe(true);
      expect(['string', 'undefined'].includes(typeof item.email)).toBe(true);
    });
  });

  test.each(expectedDataArray)('.contains(%j)', expected => {
    const foundItem = result.find(item => item.path === expected.path);
    expect(!!foundItem).toEqual(true);
    expect(foundItem).toEqual(expected);
  });
});
