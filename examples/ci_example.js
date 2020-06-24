/* eslint-disable import/no-unresolved, no-undef, import/no-extraneous-dependencies */
const licenseAuditor = require('@brainhubeu/license-auditor');

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

