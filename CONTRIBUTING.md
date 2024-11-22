# Contributing rules

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
