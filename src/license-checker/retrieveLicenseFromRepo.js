const request = require('superagent');

const retrieveLicenseFromLicenseFileContent = require('./retrieveLicenseFromLicenseFileContent');

const retrieveLicenseFromRepo = async (url, licenseMap, templates) => {
  const content = await request(url.replace(/\/\/\//, '//'))
    .set('Authorization', `token ${process.env.GITHUB_TOKEN}`)
    .set('user-agent', 'bot')
    .then(({ text }) => text);
  const license = retrieveLicenseFromLicenseFileContent(content, licenseMap, templates);
  return license;
};

module.exports = retrieveLicenseFromRepo;
