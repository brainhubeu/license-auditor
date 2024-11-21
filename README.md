# license-auditor

## Getting started

To start using License Auditor, in the root of your project run

```
npx @brainhubeu/license-auditor-cli init
```

Follow the configuration wizard and select the template which suits your project.

**NOTE: the default configuration should not be in any way interpreted as legal advice.**

Next, to conduct license audit run

```
npx @brainhubeu/license-auditor-cli
```

The results will be printed in the console.

## Available options

- `--verbose` - Verbose output (default: false)
- `--filter [filter]` - Filter by license status - whitelist, blacklist, or unknown
- `--json [json]` - Save the result to a JSON file. If no path is not provided, a file named license-auditor.results.json will be created in the current directory.
- `--production` - Don't check licenses in development dependencies (default: false)

## Configuration file structure

All licenses are sourced from [SPDX license list](https://spdx.org/licenses/)

- `whitelist` - array of SPDX license identifiers of licenses permitted within the project,
- `blacklist` - array of SPDX license identifiers of licenses prohibited within the project,
- `overrides`:
  - `warn` - array of package names which should be omitted from audit, but produce a warning,
  - `off`- array of package names which should be completely omitted from the audit,

## Local development and testing

1. Build packages repo packages

- Run `npm run build` in root, turbo should handle building the app,
- If you encounter errors during build, check the code,
- Build order should be tooling > core > cli,

2. Run `npm i`
3. Run `npm run cli:init` in the root of the project

- Complete the configuration wizard

4. Run `npm run cli` in the root of the project

- If you want to run the tool in a different directory, use `npx [...path]/license-auditor/packages/dist/cli.js`
- Be mindful of user permissions (eg. [chown on cli.js](https://stackoverflow.com/questions/53455753/ubuntu-create-react-app-fails-with-permission-denied/53455921#53455921))
