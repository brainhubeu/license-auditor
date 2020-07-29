/* eslint-disable no-empty */
const { exec } = require('child_process');
const fs = require('fs');

const bluebird = require('bluebird');
const _ = require('lodash');

const Retriever = require('./Retriever');
const {
  templates,
  licenseMap,
  customLicenceFiles,
  licenseFiles,
  readmeFiles,
} = require('./constants');

const findLicense = async item => {
  const retriever = Retriever(licenseMap, templates);
  // first, we check the "license" field which can be a string, an array or an object
  // if the "license" field does not exist, we check the "licenses" field
  if (typeof item.license === 'object') {
    if (Array.isArray(item.license)) {
      return { licenses: item.license.map(x => x.type || x), licensePath: item.path };
    }
    return { licenses: item.license.type, licensePath: item.path };
  }
  if (item.license && item.license !== 'SEE LICENSE IN LICENSE') {
    return { licenses: licenseMap[item.license] || item.license, licensePath: item.path };
  }
  if (item.licenses && typeof item.licenses === 'object') {
    if (Array.isArray(item.licenses)) {
      return { licenses: item.licenses.map(x => x.type || x), licensePath: item.path };
    }
    return { licenses: item.licenses.type, licensePath: item.path };
  }
  for (const entry of Object.entries(customLicenceFiles)) {
    const [customLicenceFile, licenses] = entry;
    const licensePath = item.path.replace(/package\.json$/, customLicenceFile);
    if (fs.existsSync(licensePath)) {
      return { licenses, licensePath };
    }
  }
  for (const licenseFile of licenseFiles) {
    try {
      const licensePath = item.path.replace(/package\.json$/, licenseFile);
      const licenses = retriever.retrieveLicenseFromLicenseFile(licensePath);
      if (licenses) {
        return { licenses, licensePath };
      }
    } catch (error) {
      console.error(error);
    }
  }
  for (const readmeFile of readmeFiles) {
    try {
      const licensePath = item.path.replace(/package\.json$/, readmeFile);
      const licenses = retriever.retrieveLicenseFromReadme(licensePath);
      if (licenses) {
        return { licenses, licensePath };
      }
    } catch (error) {
      console.error(error);
    }
  }
  for (const licenseFile of licenseFiles) {
    try {
      const url = _.get(item, 'repository.url', item.repository);
      if (url) {
        const licensePath = `${url.replace(/github.com/, '/raw.githubusercontent.com').replace(/\.git$/, '').replace(/^git:\/\/\//, 'https://')}/master/${licenseFile}`;
        const licenses = await retriever.retrieveLicenseFromRepo(licensePath);
        if (licenses) {
          return { licenses, licensePath };
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  return { licenses: 'UNKNOWN', licensePath: 'UNKNOWN' };
};

const licenseChecker = {
  findAllLicenses: ({ projectPath }) => new Promise((resolve, reject) => {
    exec(`find ${projectPath}/node_modules -name "package.json"`, async (err, stdout, stderr) => {
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
        version: item.version,
      }));
      resolve(licenseData);
    });
  }),
};

module.exports = licenseChecker;
