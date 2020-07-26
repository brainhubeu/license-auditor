/* eslint-disable no-undefined */

const licenseChecker = require('../licenseChecker');

describe('licenseChecker', () => {
  test('should find licenses', async () => {
    const result = await licenseChecker.findAllLicenses();

    result.forEach(item => {
      expect(typeof item.path).toBe('string');
      expect(typeof item.license === 'string' || Array.isArray(item.license)).toBe(true);
      expect(typeof item.licensePath).toBe('string');
      expect(['string', 'undefined'].includes(typeof item.repository)).toBe(true);
      expect(['string', 'undefined'].includes(typeof item.publisher)).toBe(true);
      expect(['string', 'undefined'].includes(typeof item.email)).toBe(true);
    });

    expect(result).toEqual(expect.arrayContaining([
      {
        license: 'MIT',
        licensePath: 'node_modules/slash/package.json',
        path: 'node_modules/slash/package.json',
        repository: undefined,
        publisher: 'Sindre Sorhus',
        email: 'sindresorhus@gmail.com',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: 'Unlicense',
        licensePath: 'node_modules/tweetnacl/package.json',
        path: 'node_modules/tweetnacl/package.json',
        repository: 'https://github.com/dchest/tweetnacl-js.git',
        publisher: 'TweetNaCl-js contributors',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: 'Apache-2.0',
        licensePath: 'node_modules/walker/package.json',
        path: 'node_modules/walker/package.json',
        repository: 'https://github.com/daaku/nodejs-walker',
        publisher: 'Naitik Shah <n@daaku.org>',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: 'BSD-3-Clause',
        licensePath: 'node_modules/override-require/package.json',
        path: 'node_modules/override-require/package.json',
        repository: 'https://github.com/gajus/override-require',
        publisher: 'Gajus Kuizinas',
        email: 'gajus@gajus.com',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: 'ISC',
        licensePath: 'node_modules/sane/node_modules/anymatch/package.json',
        path: 'node_modules/sane/node_modules/anymatch/package.json',
        repository: 'https://github.com/micromatch/anymatch',
        publisher: 'Elan Shanker',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: '(MIT OR Apache-2.0)',
        licensePath: 'node_modules/atob/package.json',
        path: 'node_modules/atob/package.json',
        repository: 'git://git.coolaj86.com/coolaj86/atob.js.git',
        publisher: 'AJ ONeal <coolaj86@gmail.com> (https://coolaj86.com)',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: 'Apache-2.0',
        licensePath: 'node_modules/espree/node_modules/eslint-visitor-keys/package.json',
        path: 'node_modules/espree/node_modules/eslint-visitor-keys/package.json',
        publisher: 'Toru Nagashima (https://github.com/mysticatea)',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: 'BSD-2-Clause',
        licensePath: 'node_modules/espree/package.json',
        path: 'node_modules/espree/package.json',
        publisher: 'Nicholas C. Zakas <nicholas+npm@nczconsulting.com>',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: 'CC-BY-3.0',
        licensePath: 'node_modules/spdx-exceptions/package.json',
        path: 'node_modules/spdx-exceptions/package.json',
        publisher: 'The Linux Foundation',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: '(MIT OR CC0-1.0)',
        licensePath: 'node_modules/jest-resolve/node_modules/read-pkg/node_modules/type-fest/package.json',
        path: 'node_modules/jest-resolve/node_modules/read-pkg/node_modules/type-fest/package.json',
        publisher: 'Sindre Sorhus',
        email: 'sindresorhus@gmail.com',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: [
          'AFLv2.1',
          'BSD',
        ],
        licensePath: 'node_modules/json-schema/package.json',
        path: 'node_modules/json-schema/package.json',
        repository: 'http://github.com/kriszyp/json-schema',
        publisher: 'Kris Zyp',
      },
    ]));
  });
});
