import { describe, test, expect } from 'vitest';
import { findDiffRecursive } from './matchSnapshotRecursive';

describe("matchSnapshotRecursive", () => {
  test("works", async () => {
    const source = {
      whitelist: [
        {
          "packageName": "express@4.21.1",
          "packagePath": "<TEST_DIR>/node_modules/express",
          "status": "whitelist",
          "licenses": [
            {
              "reference": "https://spdx.org/licenses/MIT.html",
              "isDeprecatedLicenseId": false,
              "detailsUrl": "https://spdx.org/licenses/MIT.json",
              "name": "MIT License",
              "licenseId": "MIT",
              "seeAlso": [
                "https://opensource.org/license/mit/"
              ],
              "isOsiApproved": true,
              "isFsfLibre": true,
              "source": "package.json-license"
            },
            {
              "reference": "https://spdx.org/licenses/MIT.html",
              "isDeprecatedLicenseId": false,
              "detailsUrl": "https://spdx.org/licenses/MIT.json",
              "name": "MIT License",
              "licenseId": "MIT",
              "seeAlso": [
                "https://opensource.org/license/mit/"
              ],
              "isOsiApproved": true,
              "source": "license-file-content"
            }
          ],
          "licensePath": [
            "<TEST_DIR>/node_modules/express/package.json",
            "<TEST_DIR>/node_modules/express/LICENSE"
          ],
          "verificationStatus": "ok"
        },
        {
          "packageName": "some-package@1.0.0",
        }
      ],
    };
    const compare = {
      whitelist: [
        {
          "packageName": "some-package@1.0.0",
        },
        {
          "packageName": "express@4.21.1",
          "packagePath": "<TEST_DIR>/node_modules/express",
          "status": "whitelist",
          "licenses": [
            {
              "reference": "https://spdx.org/licenses/MIT.html",
              "isDeprecatedLicenseId": false,
              "detailsUrl": "https://spdx.org/licenses/MIT.json",
              "name": "MIT License",
              "licenseId": "MIT",
              "seeAlso": [
                "https://opensource.org/license/mit/"
              ],
              "isOsiApproved": true,
              "source": "license-file-content"
            },
            {
              "reference": "https://spdx.org/licenses/MIT.html",
              "isDeprecatedLicenseId": true,
              "detailsUrl": "https://spdx.org/licenses/MIT.json",
              "name": "MIT License",
              "licenseId": "MIT",
              "seeAlso": [
                "https://opensource.org/license/mit/"
              ],
              "isOsiApproved": true,
              "isFsfLibre": true,
              "source": "package.json-license"
            },
            {
              "reference": "https://spdx.org/licenses/bad-license.html",
              "isDeprecatedLicenseId": true,
              "detailsUrl": "https://spdx.org/licenses/bad-license.json",
              "name": "bad-license License",
              "licenseId": "bad-license",
              "seeAlso": [
                "https://opensource.org/license/bad-license/"
              ],
              "isOsiApproved": true,
              "isFsfLibre": true,
              "source": "license-file-content"
            }
          ],
          "licensePath": [
            "<TEST_DIR>/node_modules/express/package.json",
            "<TEST_DIR>/node_modules/express/LICENSE"
          ],
          "verificationStatus": "ok"
        },
      ]
    };

    const { jsView, sortedView } = findDiffRecursive(source, compare);

    // uncomment to see how the diff looks
    // expect(sortedView.source).toEqual(sortedView.target);

    expect(jsView).toBe(`{
  whitelist: [
    {
      packageName: 'express@4.21.1',
      packagePath: '<TEST_DIR>/node_modules/express',
      status: 'whitelist',
      licenses: [
        {
          reference: 'https://spdx.org/licenses/bad-license.html', // +
          isDeprecatedLicenseId: true, // +
          detailsUrl: 'https://spdx.org/licenses/bad-license.json', // +
          name: 'bad-license License', // +
          licenseId: 'bad-license', // +
          seeAlso: [
            'https://opensource.org/license/bad-license/', // +
          ], // +
          isOsiApproved: true, // +
          isFsfLibre: true, // +
          source: 'license-file-content', // +
        }, // +
        {
          reference: 'https://spdx.org/licenses/MIT.html',
          isDeprecatedLicenseId: false,
          detailsUrl: 'https://spdx.org/licenses/MIT.json',
          name: 'MIT License',
          licenseId: 'MIT',
          seeAlso: [
            'https://opensource.org/license/mit/',
          ],
          isOsiApproved: true,
          source: 'license-file-content',
        },
        {
          reference: 'https://spdx.org/licenses/MIT.html',
          isDeprecatedLicenseId: false, // ~ true
          detailsUrl: 'https://spdx.org/licenses/MIT.json',
          name: 'MIT License',
          licenseId: 'MIT',
          seeAlso: [
            'https://opensource.org/license/mit/',
          ],
          isOsiApproved: true,
          isFsfLibre: true,
          source: 'package.json-license',
        }, // ~
      ], // ~
      licensePath: [
        '<TEST_DIR>/node_modules/express/LICENSE',
        '<TEST_DIR>/node_modules/express/package.json',
      ],
      verificationStatus: 'ok',
    }, // ~
    {
      packageName: 'some-package@1.0.0',
    },
  ], // ~
} // ~`);
    expect(sortedView.source).toBe(`{
  whitelist: [
    {
      packageName: 'express@4.21.1',
      packagePath: '<TEST_DIR>/node_modules/express',
      status: 'whitelist',
      licenses: [













        {
          reference: 'https://spdx.org/licenses/MIT.html',
          isDeprecatedLicenseId: false,
          detailsUrl: 'https://spdx.org/licenses/MIT.json',
          name: 'MIT License',
          licenseId: 'MIT',
          seeAlso: [
            'https://opensource.org/license/mit/',
          ],
          isOsiApproved: true,
          source: 'license-file-content',
        },
        {
          reference: 'https://spdx.org/licenses/MIT.html',
          isDeprecatedLicenseId: false,
          detailsUrl: 'https://spdx.org/licenses/MIT.json',
          name: 'MIT License',
          licenseId: 'MIT',
          seeAlso: [
            'https://opensource.org/license/mit/',
          ],
          isOsiApproved: true,
          isFsfLibre: true,
          source: 'package.json-license',
        },
      ],
      licensePath: [
        '<TEST_DIR>/node_modules/express/LICENSE',
        '<TEST_DIR>/node_modules/express/package.json',
      ],
      verificationStatus: 'ok',
    },
    {
      packageName: 'some-package@1.0.0',
    },
  ],
}`)
    expect(sortedView.target).toBe(`{
  whitelist: [
    {
      packageName: 'express@4.21.1',
      packagePath: '<TEST_DIR>/node_modules/express',
      status: 'whitelist',
      licenses: [
        {
          reference: 'https://spdx.org/licenses/bad-license.html',
          isDeprecatedLicenseId: true,
          detailsUrl: 'https://spdx.org/licenses/bad-license.json',
          name: 'bad-license License',
          licenseId: 'bad-license',
          seeAlso: [
            'https://opensource.org/license/bad-license/',
          ],
          isOsiApproved: true,
          isFsfLibre: true,
          source: 'license-file-content',
        },
        {
          reference: 'https://spdx.org/licenses/MIT.html',
          isDeprecatedLicenseId: false,
          detailsUrl: 'https://spdx.org/licenses/MIT.json',
          name: 'MIT License',
          licenseId: 'MIT',
          seeAlso: [
            'https://opensource.org/license/mit/',
          ],
          isOsiApproved: true,
          source: 'license-file-content',
        },
        {
          reference: 'https://spdx.org/licenses/MIT.html',
          isDeprecatedLicenseId: true,
          detailsUrl: 'https://spdx.org/licenses/MIT.json',
          name: 'MIT License',
          licenseId: 'MIT',
          seeAlso: [
            'https://opensource.org/license/mit/',
          ],
          isOsiApproved: true,
          isFsfLibre: true,
          source: 'package.json-license',
        },
      ],
      licensePath: [
        '<TEST_DIR>/node_modules/express/LICENSE',
        '<TEST_DIR>/node_modules/express/package.json',
      ],
      verificationStatus: 'ok',
    },
    {
      packageName: 'some-package@1.0.0',
    },
  ],
}`);
  });
});
