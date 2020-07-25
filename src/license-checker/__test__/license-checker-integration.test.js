/* eslint-disable no-undefined */

const licenseChecker = require('../license-checker');

describe('licenseChecker', () => {
  test('should find licenses', async () => {
    const result = await licenseChecker.findAllLicenses();

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'MIT',
        path: 'node_modules/slash/package.json',
        repository: undefined,
        publisher: 'Sindre Sorhus',
        email: 'sindresorhus@gmail.com',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'Unlicense',
        path: 'node_modules/tweetnacl/package.json',
        repository: 'https://github.com/dchest/tweetnacl-js.git',
        publisher: 'TweetNaCl-js contributors',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'BSD-3-Clause',
        path: 'node_modules/override-require/package.json',
        repository: 'https://github.com/gajus/override-require',
        publisher: 'Gajus Kuizinas',
        email: 'gajus@gajus.com',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'Apache-2.0',
        path: 'node_modules/walker/package.json',
        repository: 'https://github.com/daaku/nodejs-walker',
        publisher: 'Naitik Shah <n@daaku.org>',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'ISC',
        path: 'node_modules/sane/node_modules/anymatch/package.json',
        repository: 'https://github.com/micromatch/anymatch',
        publisher: 'Elan Shanker',
      },
    ]));
  });
});
