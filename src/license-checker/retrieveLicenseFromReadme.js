const fs = require('fs');

const retrieveLicenseFromReadme = (filename, licenseMap) => {
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

module.exports = retrieveLicenseFromReadme;
