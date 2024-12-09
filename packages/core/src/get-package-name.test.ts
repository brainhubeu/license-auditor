import { describe, expect, it } from 'vitest';
import { getPackageName } from './get-package-name.js';

describe('getPackageName', () => {
  it('returns package name without version for non-scoped packages', () => {
    expect(getPackageName('example-package@1.2.3')).toBe('example-package');
    expect(getPackageName('another-package@4.5.6')).toBe('another-package');
  });

  it('returns full name for non-versioned packages', () => {
    expect(getPackageName('example-package')).toBe('example-package');
    expect(getPackageName('another-package')).toBe('another-package');
  });

  it('returns package name without version for scoped packages', () => {
    expect(getPackageName('@scope/example-package@1.2.3')).toBe('@scope/example-package');
    expect(getPackageName('@scope/another-package@4.5.6')).toBe('@scope/another-package');
  });

  it('returns full name for scoped packages without version', () => {
    expect(getPackageName('@scope/example-package')).toBe('@scope/example-package');
    expect(getPackageName('@scope/another-package')).toBe('@scope/another-package');
  });

  it('handles edge cases gracefully', () => {
    expect(getPackageName('@')).toBe('@');
    expect(getPackageName('')).toBe('');
    expect(getPackageName('@scope/@1.0.0')).toBe('@scope/');
    expect(getPackageName('@scope/')).toBe('@scope/');
  });
});
