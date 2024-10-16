/**
 * Configuration object.
 * @type {{ blacklist: LicenseType[], whitelist: LicenseType[], modules: Record<string, string> }}
 */

const config = {
  blacklist: [],
  whitelist: [],
  modules: {},
};

module.exports = { config };
