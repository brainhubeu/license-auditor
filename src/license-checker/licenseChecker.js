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
  return { license, licensePath: url };
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
  return { license: licenseMap[license] || license, licensePath: filename };
};

const findLicense = async item => {
  if (typeof item.license === 'object') {
    if (Array.isArray(item.license)) {
      return { license: item.license.map(x => x.type), licensePath: item.path };
    }
    return { license: item.license.type, licensePath: item.path };
  }
  if (item.license && item.license !== 'SEE LICENSE IN LICENSE') {
    return { license: licenseMap[item.license] || item.license, licensePath: item.path };
  }
  if (item.licenses) {
    if (typeof item.licenses === 'object') {
      if (Array.isArray(item.licenses)) {
        return { license: item.licenses.map(x => x.type), licensePath: item.path };
      }
      return { license: item.licenses.type, licensePath: item.path };
    }
  }
  if (fs.existsSync(item.path.replace(/package\.json$/, 'license-mit'))) {
    return { license: 'MIT', licensePath: item.path.replace(/package\.json$/, 'license-mit') };
  }
  for (const licenseFile of licenseFiles) {
    try {
      const licensePath = item.path.replace(/package\.json$/, licenseFile);
      const license = retrieveLicenseFromLicenseFile();
      if (license) {
        return { license, licensePath };
      }
    } catch (error) {
      console.error(error);
    }
  }
  for (const readmeFile of readmeFiles) {
    try {
      const licensePath = item.path.replace(/package\.json$/, readmeFile);
      const license = retrieveLicenseFromReadme();
      if (license) {
        return { license, licensePath };
      }
    } catch (error) {
      console.error(error);
    }
  }
  for (const licenseFile of licenseFiles) {
    try {
      const licensePath = `${_.get(item, 'repository.url', item.repository).replace(/github.com/, '/raw.githubusercontent.com').replace(/\.git$/, '').replace(/^git:\/\/\//, 'https://')}/master/${licenseFile}`;
      const license = await retrieveLicenseFromRepo();
      if (license) {
        return { license, licensePath };
      }
    } catch (error) {
      console.error(error);
    }
  }
  return { license: 'UNKNOWN', licensePath: 'UNKNOWN' };
};

const licenseChecker = {
  findAllLicenses: () => new Promise((resolve, reject) => {
    exec('find node_modules -name "package.json"', async (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }
      if (stderr) {
        console.error(stderr);
      }
      const packages = stdout.split('\n')
        .filter(x => x)
        .filter(x => /node_modules\/[0-9A-Za-z-]*\/package\.json$/.test(x)
                || /node_modules\/@[0-9A-Za-z-]*\/[0-9A-Za-z-]*\/package\.json$/.test(x));
      const data = packages
        .map(path => ({ path, ...JSON.parse(fs.readFileSync(path).toString()) }))
        .filter(item => item.name);
      const licenseData = await bluebird.mapSeries(data, async item => ({
        ...(await findLicense(item)),
        path: item.path,
        repository: _.get(item, 'repository.url'),
        publisher: _.get(item, 'author.name', item.author),
        email: _.get(item, 'author.email'),
      }));
      resolve(licenseData);
    });
  }),
};

module.exports = licenseChecker;
