const licenseAuditor = require('@brainhubeu/license-auditor');
const { warn, fail } = require('danger');

const whitelist = require('./license/whitelist');
const blacklist = require('./license/blacklist');

licenseAuditor({
  whitelistedLicenses: whitelist,
  blacklistedLicenses: blacklist,
  projectPath: process.env.PROJECT_PATH,
  ciManager: {
    warn,
    fail,
  },
});

