/* eslint-disable no-undefined */

const licenseChecker = require('../licenseChecker');

describe('licenseChecker', () => {
  test('should find licenses', async () => {
    jest.setTimeout(120000);
    const result = await licenseChecker.findAllLicenses({ projectPath: 'src/license-checker/__test__' });

    result.forEach(item => {
      expect(typeof item.path).toBe('string');
      expect(typeof item.licenses === 'string' || Array.isArray(item.licenses)).toBe(true);
      expect(typeof item.licensePath).toBe('string');
      expect(['string', 'undefined'].includes(typeof item.repository)).toBe(true);
      expect(['string', 'undefined'].includes(typeof item.publisher)).toBe(true);
      expect(['string', 'undefined'].includes(typeof item.email)).toBe(true);
    });

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'MIT',
        licensePath: 'src/license-checker/__test__/node_modules/normalize-range/package.json',
        path: 'src/license-checker/__test__/node_modules/normalize-range/package.json',
        publisher: 'James Talmage',
        email: 'james@talmage.io',
        version: '0.1.2',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'MIT',
        licensePath: 'src/license-checker/__test__/node_modules/gaze/package.json',
        path: 'src/license-checker/__test__/node_modules/gaze/package.json',
        repository: 'https://github.com/shama/gaze.git',
        publisher: 'Kyle Robinson Young',
        email: 'kyle@dontkry.com',
        version: '1.1.3',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'Unlicense',
        licensePath: 'src/license-checker/__test__/node_modules/tweetnacl/package.json',
        path: 'src/license-checker/__test__/node_modules/tweetnacl/package.json',
        repository: 'https://github.com/dchest/tweetnacl-js.git',
        publisher: 'TweetNaCl-js contributors',
        version: '0.14.5',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'Copyright (c) 2011 Heather Arthur <fayearthur@gmail.com>\n\nPermission is hereby granted, free of charge, to any person obtaining\na copy of this software and associated documentation files (the\n"Software"), to deal in the Software without restriction, including\nwithout limitation the rights to use, copy, modify, merge, publish,\ndistribute, sublicense, and/or sell copies of the Software, and to\npermit persons to whom the Software is furnished to do so, subject to\nthe following conditions:\n\nThe above copyright notice and this permission notice shall be\nincluded in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,\nEXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\nMERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND\nNONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE\nLIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION\nOF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION\nWITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n',
        licensePath: 'src/license-checker/__test__/node_modules/parse-color/node_modules/color-convert/LICENSE',
        path: 'src/license-checker/__test__/node_modules/parse-color/node_modules/color-convert/package.json',
        repository: 'http://github.com/harthur/color-convert.git',
        publisher: 'Heather Arthur <fayearthur@gmail.com>',
        version: '0.5.3',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'ISC',
        licensePath: 'src/license-checker/__test__/node_modules/css-loader/node_modules/semver/package.json',
        path: 'src/license-checker/__test__/node_modules/css-loader/node_modules/semver/package.json',
        version: '6.3.0',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'Apache-2.0',
        licensePath: 'src/license-checker/__test__/node_modules/shasum-object/package.json',
        path: 'src/license-checker/__test__/node_modules/shasum-object/package.json',
        repository: 'https://github.com/goto-bus-stop/shasum-object.git',
        publisher: 'Renée Kooi <renee@kooi.me>',
        version: '1.0.0',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'BSD-2-Clause',
        licensePath: 'src/license-checker/__test__/node_modules/estraverse/package.json',
        path: 'src/license-checker/__test__/node_modules/estraverse/package.json',
        repository: 'http://github.com/estools/estraverse.git',
        version: '4.3.0',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: '(MIT OR Apache-2.0)',
        licensePath: 'src/license-checker/__test__/node_modules/atob/package.json',
        path: 'src/license-checker/__test__/node_modules/atob/package.json',
        repository: 'git://git.coolaj86.com/coolaj86/atob.js.git',
        publisher: 'AJ ONeal <coolaj86@gmail.com> (https://coolaj86.com)',
        version: '2.1.2',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'BSD-3-Clause',
        licensePath: 'src/license-checker/__test__/node_modules/wd/node_modules/tough-cookie/package.json',
        path: 'src/license-checker/__test__/node_modules/wd/node_modules/tough-cookie/package.json',
        repository: 'git://github.com/salesforce/tough-cookie.git',
        publisher: 'Jeremy Stashewsky',
        email: 'jstash@gmail.com',
        version: '2.4.3',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'CC-BY-3.0',
        licensePath: 'src/license-checker/__test__/node_modules/spdx-exceptions/package.json',
        path: 'src/license-checker/__test__/node_modules/spdx-exceptions/package.json',
        publisher: 'The Linux Foundation',
        version: '2.3.0',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'Copyright (c) Felix Böhm\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:\n\nRedistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.\n\nRedistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.\n\nTHIS IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS,\nEVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n',
        licensePath: 'src/license-checker/__test__/node_modules/domutils/LICENSE',
        path: 'src/license-checker/__test__/node_modules/domutils/package.json',
        repository: 'git://github.com/FB55/domutils.git',
        publisher: 'Felix Boehm <me@feedic.com>',
        version: '1.5.1',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: '(MIT AND CC-BY-3.0)',
        licensePath: 'src/license-checker/__test__/node_modules/spdx-ranges/package.json',
        path: 'src/license-checker/__test__/node_modules/spdx-ranges/package.json',
        publisher: 'The Linux Foundation',
        version: '2.1.1',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'UNKNOWN',
        licensePath: 'UNKNOWN',
        path: 'src/license-checker/__test__/node_modules/browserify/test/ignore_transform_key/node_modules/a/package.json',
        version: '1.0.0',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'UNKNOWN',
        licensePath: 'UNKNOWN',
        path: 'src/license-checker/__test__/node_modules/browserify/test/ignore_transform_key/node_modules/evil-transform/package.json',
        version: '1.0.0',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'UNKNOWN',
        licensePath: 'UNKNOWN',
        path: 'src/license-checker/__test__/node_modules/browserify/test/ignore_browser_field/node_modules/b/package.json',
        version: '1.0.0',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'UNKNOWN',
        licensePath: 'UNKNOWN',
        path: 'src/license-checker/__test__/node_modules/istanbul/node_modules/resolve/test/pathfilter/deep_ref/node_modules/deep/package.json',
        version: '1.2.3',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'MIT',
        licensePath: 'src/license-checker/__test__/node_modules/indexof/Readme.md',
        path: 'src/license-checker/__test__/node_modules/indexof/package.json',
        version: '0.0.1',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'Public Domain',
        licensePath: 'src/license-checker/__test__/node_modules/jsonify/package.json',
        path: 'src/license-checker/__test__/node_modules/jsonify/package.json',
        repository: 'http://github.com/substack/jsonify.git',
        publisher: 'Douglas Crockford',
        version: '0.0.0',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'Copyright (c) 2011 Dominic Tarr\n\nPermission is hereby granted, free of charge, \nto any person obtaining a copy of this software and \nassociated documentation files (the "Software"), to \ndeal in the Software without restriction, including \nwithout limitation the rights to use, copy, modify, \nmerge, publish, distribute, sublicense, and/or sell \ncopies of the Software, and to permit persons to whom \nthe Software is furnished to do so, \nsubject to the following conditions:\n\nThe above copyright notice and this permission notice \nshall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, \nEXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES \nOF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. \nIN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR \nANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, \nTORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE \nSOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.',
        licensePath: 'src/license-checker/__test__/node_modules/map-stream/LICENCE',
        path: 'src/license-checker/__test__/node_modules/map-stream/package.json',
        repository: 'git://github.com/dominictarr/map-stream.git',
        publisher: 'Dominic Tarr <dominic.tarr@gmail.com> (http://dominictarr.com)',
        version: '0.1.0',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: [
          'MIT',
        ],
        licensePath: 'src/license-checker/__test__/node_modules/prelude-ls/package.json',
        path: 'src/license-checker/__test__/node_modules/prelude-ls/package.json',
        repository: 'git://github.com/gkz/prelude-ls.git',
        publisher: 'George Zahariev <z@georgezahariev.com>',
        version: '1.1.2',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: 'WTFPL',
        licensePath: 'src/license-checker/__test__/node_modules/chai-as-promised/package.json',
        path: 'src/license-checker/__test__/node_modules/chai-as-promised/package.json',
        publisher: 'Domenic Denicola <d@domenic.me> (https://domenic.me)',
        version: '7.1.1',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: [
          'MIT',
          'Apache2',
        ],
        licensePath: 'src/license-checker/__test__/node_modules/pause-stream/package.json',
        path: 'src/license-checker/__test__/node_modules/pause-stream/package.json',
        repository: 'git://github.com/dominictarr/pause-stream.git',
        publisher: 'Dominic Tarr <dominic.tarr@gmail.com> (dominictarr.com)',
        version: '0.0.11',
      },
    ]));

    expect(result).toEqual(expect.arrayContaining([
      {
        licenses: [
          'AFLv2.1',
          'BSD',
        ],
        licensePath: 'src/license-checker/__test__/node_modules/json-schema/package.json',
        path: 'src/license-checker/__test__/node_modules/json-schema/package.json',
        repository: 'http://github.com/kriszyp/json-schema',
        publisher: 'Kris Zyp',
        version: '0.2.3',
      },
    ]));
  });
});
