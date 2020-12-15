const fs = require('fs');

function Retriever(licenseMap, templates) {
  function retrieveLicenseFromLicenseFileContent(content) {
    const lines = content.split('\n');
    const license = lines.find(line => /license/i.test(line));
    const mapped = licenseMap[(license || '').trim()];
    if (mapped) {
      return mapped;
    }
    const withoutFirstLine = lines.slice(1).filter(line => line.length).join('\n');
    return templates[withoutFirstLine] || content;
  }

  function retrieveLicenseFromLicenseFile(filename) {
    if (!fs.existsSync(filename)) {
      return '';
    }
    const content = fs.readFileSync(filename).toString();
    return retrieveLicenseFromLicenseFileContent(content);
  }

  function retrieveLicenseFromReadme(filename) {
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
  }

  return {
    retrieveLicenseFromLicenseFileContent,
    retrieveLicenseFromReadme,
    retrieveLicenseFromLicenseFile,
  };
}

module.exports = Retriever;
