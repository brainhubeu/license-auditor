# detect-pm

A fork of [detect-package-manager](https://github.com/egoist/detect-package-manager) by [EGOIST](https://github.com/egoist), extended for use in the [@brainhubeu/license-auditor](https://github.com/brainhubeu/license-auditor/) project.

## Why this fork?

This package extends the battle-tested `detect-package-manager` solution to distinguish between package managers currently supported by the @brainhubeu/license-auditor project. Specifically, it adds support for detecting yarn classic while excluding yarn modern and bun.

## Usage

```typescript
import { detectPm } from './src/extended-detect';

async function example() {
  try {
    const pm = await detectPm();
    console.log(`Detected package manager: ${pm}`);
    // Possible outputs: 'npm', 'pnpm', or 'yarn-classic'
  } catch (error) {
    console.error(error);
  }
}

example();
```

The `detectPm` function returns a Promise that resolves to one of the following values: `'npm'`, `'pnpm'`, or `'yarn-classic'`. It will throw an error if it detects yarn modern or bun, as these are not currently supported.

## Differences from the original package

1. The original `detect` function from `index.ts` returns `'npm'`, `'yarn'`, `'pnpm'`, or `'bun'`.
2. The new `detectPm` function in `extended-detect.ts`:
   - Returns `'npm'`, `'pnpm'`, or `'yarn-classic'`
   - Throws an error for bun
   - Distinguishes between yarn classic and modern, throwing an error for yarn modern
3. The new version introduces a `SupportedPm` type that explicitly defines the supported package managers.

## Credits

Original package: [detect-package-manager](https://github.com/egoist/detect-package-manager) by [EGOIST](https://github.com/egoist)

Extended and maintained by [Brainhub](https://github.com/brainhubeu/)

## License

MIT
