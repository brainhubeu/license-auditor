const fs = require('fs');

const retrieveLicenseFromLicenseFileContent = require('./retrieveLicenseFromLicenseFileContent');

const retrieveLicenseFromLicenseFile = (filename, licenseMap, templates) => {
  if (!fs.existsSync(filename)) {
    return '';
  }
  const content = fs.readFileSync(filename).toString();
  return retrieveLicenseFromLicenseFileContent(content, licenseMap, templates);
};

module.exports = retrieveLicenseFromLicenseFile;
