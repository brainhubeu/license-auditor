# license-auditor

## Prerequisites

### Supported package managers

- npm
- yarn classic (v1)
- pnpm

## Getting started

To start using License Auditor, in the root of your project run

```
npx @brainhubeu/lac init
```

Follow the configuration wizard and select the template which suits your project.

> [!CAUTION]
> The default configuration should not be in any way interpreted as legal advice.

Next, to conduct license audit run

```
npx @brainhubeu/lac
```

The results will be printed in the console.

## Available options

- `--verbose` - Verbose output (default: false)
- `--filter [filter]` - Filter verbose output by license status - whitelist, blacklist, or unknown
- `--json [json]` - Save the result to a JSON file. If no path is not provided, a file named license-auditor.results.json will be created in the current directory.
- `--production` - Skip the audit for licenses in development dependencies (default: false)
- `--default-config` - Run audit with default whitelist/blacklist configuration

> [!IMPORTANT]
> Verify dev dependencies if they generate code, embed assets, or otherwise impact the final product, as their licenses might impose restrictions. Always prioritize reviewing both when in doubt or if your project may be redistributed or commercialized.

## Configuration file structure

All licenses are sourced from [SPDX license list](https://spdx.org/licenses/)

- `whitelist` - array of SPDX license identifiers of licenses permitted within the project,
- `blacklist` - array of SPDX license identifiers of licenses prohibited within the project,
- `overrides` - an object with the specified severity:
  - `warn` - package should be omitted from audit, but it will produce a warning,
  - `off`- package should be completely omitted from the audit.

## Known issues

### "missing: some-package@>=3.0.0, required by some-other-package@5.0.1"

This is most likely caused by enabled legacy-peer-deps in npm, which makes npm skip installing peer dependencies. License auditor will show partial results (for packages found by npm until the error occurred). To see complete results you must turn the legacy-peer-deps off and fix any peer dependency conflicts.
