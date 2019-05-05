import clone from './';

describe('clone primitive', () => {
  test('clone undefined', () => {
    expect(clone(undefined)).toBe(undefined);
  });
  test('clone null', () => {
    expect(clone(null)).toBe(null);
  });
  test('clone nubmer', () => {
    expect(clone(1.0)).toBe(1.0);
    expect(clone(-1.0)).toBe(-1.0);
    expect(isNaN(clone(NaN))).toBe(true);
  });
  test('clone string', () => {
    expect(clone('string')).toBe('string');
    expect(clone('')).toBe('');
  });
  test('clone boolean', () => {
    expect(clone(false)).toBe(false);
    expect(clone(true)).toBe(true);
  });
});
