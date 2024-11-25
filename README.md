# license-auditor

## Known issues
### "missing: some-package@>=3.0.0, required by some-other-package@5.0.1"
This is most likely caused by enabled legacy-peer-deps in npm, which makes npm skip installing peer dependencies. License auditor will show partial results (for packages found by npm until the error occurred). To see complete results you must turn the legacy-peer-deps off and fix any peer dependency conflicts. 
