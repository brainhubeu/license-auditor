const { exec } = require('child_process');
const fs = require('fs');


const bluebird = require('bluebird');
const request = require('superagent');
const _ = require('lodash');

const retrieveLicenseFromLicenseFileContent = require('./retrieveLicenseFromLicenseFileContent');

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

const retrieveLicenseFromLicenseFile = filename => {
  if (!fs.existsSync(filename)) {
    return '';
  }
  const content = fs.readFileSync(filename).toString();
  return retrieveLicenseFromLicenseFileContent(content, licenseMap, templates);
};

const retrieveLicenseFromRepo = async url => {
  const content = await request(url.replace(/\/\/\//, '//'))
    .set('Authorization', `token ${process.env.GITHUB_TOKEN}`)
    .set('user-agent', 'bot')
    .then(({ text }) => text);
  const license = retrieveLicenseFromLicenseFileContent(content, licenseMap, templates);
  console.log('license retrieved from repo', { license, url });
  return license;
};

const retrieveLicenseFromReadme = filename => {
  if (!fs.existsSync(filename)) {
    return '';
  }
  const lines = fs.readFileSync(filename).toString().split('\n').filter(line => line);
  const licenseWordIndex = lines.findIndex(line => /#* *License *$/.test(line));
  if (licenseWordIndex < 0) {
    return '';
  }
  const license = lines[licenseWordIndex + 1].trim();
  return licenseMap[license] || license;
};

const findLicense = async item => {
  if (typeof item.license === 'object') {
    if (Array.isArray(item.license)) {
      return item.license.map(x => x.type);
    }
    return item.license.type;
  }
  if (item.license && item.license !== 'SEE LICENSE IN LICENSE') {
    return licenseMap[item.license] || item.license;
  }
  if (item.licenses) {
    if (typeof item.licenses === 'object') {
      if (Array.isArray(item.licenses)) {
        return item.licenses.map(x => x.type);
      }
      return item.licenses.type;
    }
  }
  if (fs.existsSync(item.path.replace(/package\.json$/, 'LICENSE-MIT'))) {
    return 'MIT';
  }
  try {
    const license = retrieveLicenseFromLicenseFile(item.path.replace(/package\.json$/, 'LICENSE'));
    if (license) {
      return license;
    }
  } catch (error) {
    console.error(error);
  }
  try {
    const license = retrieveLicenseFromLicenseFile(item.path.replace(/package\.json$/, 'LICENSE.md'));
    if (license) {
      return license;
    }
  } catch (error) {
    console.error(error);
  }
  try {
    const license = retrieveLicenseFromLicenseFile(item.path.replace(/package\.json$/, 'LICENCE'));
    if (license) {
      return license;
    }
  } catch (error) {
    console.error(error);
  }
  try {
    const license = retrieveLicenseFromReadme(item.path.replace(/package\.json$/, 'README'));
    if (license) {
      return license;
    }
  } catch (error) {
    console.error(error);
  }
  try {
    const license = retrieveLicenseFromReadme(item.path.replace(/package\.json$/, 'readme'));
    if (license) {
      return license;
    }
  } catch (error) {
    console.error(error);
  }
  try {
    const license = retrieveLicenseFromReadme(item.path.replace(/package\.json$/, 'README.md'));
    if (license) {
      return license;
    }
  } catch (error) {
    console.error(error);
  }
  try {
    const license = retrieveLicenseFromReadme(item.path.replace(/package\.json$/, 'readme.md'));
    if (license) {
      return license;
    }
  } catch (error) {
    console.error(error);
  }
  try {
    const license = retrieveLicenseFromReadme(item.path.replace(/package\.json$/, 'Readme.md'));
    if (license) {
      return license;
    }
  } catch (error) {
    console.error(error);
  }
  try {
    const license = retrieveLicenseFromReadme(item.path.replace(/package\.json$/, 'readme.markdown'));
    if (license) {
      return license;
    }
  } catch (error) {
    console.error(error);
  }
  try {
    const license = await retrieveLicenseFromRepo(`${_.get(item, 'repository.url', item.repository).replace(/github.com/, '/raw.githubusercontent.com').replace(/\.git$/, '').replace(/^git:\/\/\//, 'https://')}/master/LICENSE`);
    if (license) {
      return license;
    }
  } catch (error) {
    console.error(error);
  }
  return 'UNKNOWN';
};

const licenseChecker = {
  init: (params, callback) => {
    exec('find node_modules -name "package.json"', async (err, stdout, stderr) => {
      console.error(stderr);
      const packages = stdout.split('\n')
        .filter(x => x)
        .filter(x => /node_modules\/[0-9A-Za-z-]*\/package\.json$/.test(x)
                || /node_modules\/@[0-9A-Za-z-]*\/[0-9A-Za-z-]*\/package\.json$/.test(x));
      const data = packages
        .map(path => ({ path, ...JSON.parse(fs.readFileSync(path).toString()) }))
        .filter(item => item.name);
      const licenseData = await bluebird.mapSeries(data, async item => ({
        licenses: await findLicense(item),
        path: item.path,
        repository: _.get(item, 'repository.url'),
        publisher: _.get(item, 'author.name', item.author),
        email: _.get(item, 'author.email'),
      }));
      callback(null, licenseData);
    });
  },
};

module.exports = licenseChecker;
