const noPathSpecified = 'Project path is not specified.';
const noLicenses = 'There are no licenses to check';
const moduleInfo = licenseItem => `MODULE PATH: ${licenseItem.path}
| LICENSE: ${licenseItem.licenses}
| LICENSE PATH: ${licenseItem.licensePath}
| REPOSITORY: ${licenseItem.repository}
| PUBLISHER: ${licenseItem.publisher}
| EMAIL: ${licenseItem.email}
| VERSION: ${licenseItem.version}
`;

module.exports = { noPathSpecified, noLicenses, moduleInfo };
