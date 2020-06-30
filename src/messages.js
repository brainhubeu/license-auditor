const noPathSpecified = 'Project path is not specified.';
const noLicenses = 'There are no licenses to check';
const moduleInfo = licenseObj => `MODULE : ${licenseObj.path.substr(
  licenseObj.path.indexOf('node_modules'),
)}\n | LICENSE : ${
  licenseObj.licenses
}\n | LICENSE_FILE : ${licenseObj.licenseFile.substr(
  licenseObj.licenseFile.indexOf('node_modules'),
)}\n | REPOSITORY: ${licenseObj.repository}\n | PUBLISHER : ${
  licenseObj.publisher
}\n | EMAIL : ${licenseObj.email}\n | URL : ${licenseObj.url}\n`;

module.exports = { noPathSpecified, noLicenses, moduleInfo };
