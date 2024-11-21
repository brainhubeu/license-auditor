import { describe, expect, test } from "vitest";
import * as pty from 'node-pty';

describe("license-auditor", () => {
  describe("cli", () => {
    test("audits compliant packages correctly", async () => {
      const { stdout, stderr } = await new Promise<{ stdout: string, stderr: string }>((resolve, reject) => {
        const cli = pty.spawn('npx', ['../../packages/cli/dist/cli.js'], {
          cwd: './test/testProject',
        });

        const stdoutChunks: string[] = [];
        const stderrChunks: string[] = [];
        cli.onData((data) => {
          stdoutChunks.push(data.toString());
        });

        cli.onExit((code) => {
          expect(code.exitCode).toBe(0);
          resolve({ stdout: stdoutChunks.join(''), stderr: stderrChunks.join('') });
        });
      });

      console.log('finished');
      console.log('--- stdout ---');
      console.log(stdout);
      console.log('--- stderr ---');
      console.log(stderr);
      expect(stdout).toContain('66 licenses are compliant');
    });
  });
});
