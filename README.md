# license-auditor

## Getting started

To start using License Auditor, in the root of your project run

```
npx @brainhubeu/lca init
```

Follow the configuration wizard and select the template which suits your project.

> [!CAUTION]
> The default configuration should not be in any way interpreted as legal advice.

Next, to conduct license audit run

```
npx @brainhubeu/lca
```

The results will be printed in the console.

## Available options

- `--verbose` - Verbose output (default: false)
- `--filter [filter]` - Filter verbose output by license status - whitelist, blacklist, or unknown
- `--json [json]` - Save the result to a JSON file. If no path is not provided, a file named license-auditor.results.json will be created in the current directory.
- `--production` - Skip the audit for licenses in development dependencies (default: false)

> [!IMPORTANT]
> Verify dev dependencies if they generate code, embed assets, or otherwise impact the final product, as their licenses might impose restrictions. Always prioritize reviewing both when in doubt or if your project may be redistributed or commercialized.

## Configuration file structure

All licenses are sourced from [SPDX license list](https://spdx.org/licenses/)

- `whitelist` - array of SPDX license identifiers of licenses permitted within the project,
- `blacklist` - array of SPDX license identifiers of licenses prohibited within the project,
- `overrides` - an object with the specified severity:
  - `warn` - package should be omitted from audit, but it will produce a warning,
  - `off`- package should be completely omitted from the audit.
  