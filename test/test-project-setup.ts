import * as fs from 'node:fs/promises';
import { afterAll, beforeAll, beforeEach } from 'vitest';
import * as path from 'node:path';
import { execAsync } from './utils';

beforeAll(async () => {
  await fs.copyFile(
    path.resolve(__dirname, '../packages/cli/src/utils/template/default/license-auditor.config.ts'),
    path.resolve(__dirname, 'testProject', 'license-auditor.config.ts')
  );

  await execAsync('npm i', { cwd: path.resolve(__dirname, 'testProject') })
});

beforeEach(async () => {
  await fs.rm(path.resolve(__dirname, 'testProject', 'node_modules'), { recursive: true, force: true });
  await execAsync('npm i', { cwd: path.resolve(__dirname, 'testProject') })
});

afterAll(async () => {
  await fs.rm(path.resolve(__dirname, 'testProject', 'node_modules'), { recursive: true, force: true });
  await fs.rm(path.resolve(__dirname, 'testProject', 'license-auditor.config.ts'), { force: true });
});

