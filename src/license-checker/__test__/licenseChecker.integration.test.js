/* eslint-disable no-undefined */

const licenseChecker = require('../licenseChecker');

describe('licenseChecker', () => {
  test('should find licenses', async () => {
    jest.setTimeout(60000);
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
        version: '3.0.0',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: 'Unlicense',
        licensePath: 'node_modules/tweetnacl/package.json',
        path: 'node_modules/tweetnacl/package.json',
        repository: 'https://github.com/dchest/tweetnacl-js.git',
        publisher: 'TweetNaCl-js contributors',
        version: '0.14.5',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: 'Apache-2.0',
        licensePath: 'node_modules/walker/package.json',
        path: 'node_modules/walker/package.json',
        repository: 'https://github.com/daaku/nodejs-walker',
        publisher: 'Naitik Shah <n@daaku.org>',
        version: '1.0.7',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: 'ISC',
        licensePath: 'node_modules/sane/node_modules/anymatch/package.json',
        path: 'node_modules/sane/node_modules/anymatch/package.json',
        repository: 'https://github.com/micromatch/anymatch',
        publisher: 'Elan Shanker',
        version: '2.0.0',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: '(MIT OR Apache-2.0)',
        licensePath: 'node_modules/atob/package.json',
        path: 'node_modules/atob/package.json',
        repository: 'git://git.coolaj86.com/coolaj86/atob.js.git',
        publisher: 'AJ ONeal <coolaj86@gmail.com> (https://coolaj86.com)',
        version: '2.1.2',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: 'Apache-2.0',
        licensePath: 'node_modules/espree/node_modules/eslint-visitor-keys/package.json',
        path: 'node_modules/espree/node_modules/eslint-visitor-keys/package.json',
        publisher: 'Toru Nagashima (https://github.com/mysticatea)',
        version: '1.3.0',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: 'BSD-2-Clause',
        licensePath: 'node_modules/espree/package.json',
        path: 'node_modules/espree/package.json',
        publisher: 'Nicholas C. Zakas <nicholas+npm@nczconsulting.com>',
        version: '7.1.0',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: 'CC-BY-3.0',
        licensePath: 'node_modules/spdx-exceptions/package.json',
        path: 'node_modules/spdx-exceptions/package.json',
        publisher: 'The Linux Foundation',
        version: '2.3.0',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: '(MIT OR CC0-1.0)',
        licensePath: 'node_modules/jest-resolve/node_modules/read-pkg/node_modules/type-fest/package.json',
        path: 'node_modules/jest-resolve/node_modules/read-pkg/node_modules/type-fest/package.json',
        publisher: 'Sindre Sorhus',
        email: 'sindresorhus@gmail.com',
        version: '0.6.0',
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
        version: '0.2.3',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: 'MIT',
        licensePath: 'http:///raw.githubusercontent.com/bwindels/exif-parser/master/LICENSE.md',
        path: 'node_modules/exif-parser/package.json',
        repository: 'http://github.com/bwindels/exif-parser.git',
        publisher: 'Bruno Windels <bruno.windels@gmail.com>',
        version: '0.1.12',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: 'MIT',
        licensePath: 'https:///raw.githubusercontent.com/visionmedia/better-assert/master/LICENSE',
        path: 'node_modules/better-assert/package.json',
        repository: 'https://github.com/visionmedia/better-assert.git',
        publisher: 'TJ Holowaychuk <tj@vision-media.ca>',
        version: '1.0.2',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        license: 'Copyright (c) 2011-2016 Heather Arthur <fayearthur@gmail.com>\n\nPermission is hereby granted, free of charge, to any person obtaining\na copy of this software and associated documentation files (the\n"Software"), to deal in the Software without restriction, including\nwithout limitation the rights to use, copy, modify, merge, publish,\ndistribute, sublicense, and/or sell copies of the Software, and to\npermit persons to whom the Software is furnished to do so, subject to\nthe following conditions:\n\nThe above copyright notice and this permission notice shall be\nincluded in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,\nEXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\nMERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND\nNONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE\nLIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION\nOF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION\nWITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n',
        licensePath: 'http:///raw.githubusercontent.com/harthur/color-convert/master/LICENSE',
        path: 'node_modules/color-convert/package.json',
        repository: 'http://github.com/harthur/color-convert.git',
        publisher: 'Heather Arthur <fayearthur@gmail.com>',
        version: '0.5.3',
      },
    ]));
  });
});
