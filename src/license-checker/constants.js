const fs = require('fs');

const templates = {
  [fs.readFileSync(`${__dirname}/templates/BSD-2-Clause.txt`).toString()]: 'BSD 2-Clause',
  [fs.readFileSync(`${__dirname}/templates/MIT.txt`).toString()]: 'MIT',
};

const licenseMap = {
  '(The MIT License)': 'MIT',
  'Apache License': 'Apache',
  'ISC License': 'MIT',
  'MIT License': 'MIT',
  'The ISC License': 'ISC',
  'The MIT License (MIT)': 'MIT',
  'The MIT License (MIT)^M': 'MIT',
  'The MIT License': 'MIT',
  'This software is released under the MIT license:': 'MIT',
};

const customLicenceFiles = {
  'LICENSE-MIT': 'MIT',
};

const licenseFiles = [
  'LICENSE',
  'LICENCE',
  'LICENSE.md',
  'LICENCE.md',
];

const readmeFiles = [
  'README',
  'readme',
  'Readme',
  'README.md',
  'readme.md',
  'Readme.md',
  'README.markdown',
  'readme.markdown',
  'Readme.markdown',
];

module.exports = {
  templates,
  licenseMap,
  customLicenceFiles,
  licenseFiles,
  readmeFiles,
};
