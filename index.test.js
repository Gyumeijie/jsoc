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

describe('clone Date object', () => {
  test('simple date', () => {
    let o = new Date();
    let c = clone(o);
    expect(o.getTime() === c.getTime()).toBe(true);
  });
});

describe('clone RegExp object', () => {
  test('simple regular expression', () => {
    let o = /\[object (\w+)\]/gi;
    let c = clone(o);
    expect(c).toEqual(o);
    expect(c.global).toBe(true);
    expect(c.ignoreCase).toBe(true);
  });

  test('executed regular expression', () => {
    let o = /d/g;
    o.exec('abcd');
    expect(o.lastIndex).toBe(4);

    let c = clone(o);
    expect(c.lastIndex).toBe(4);
  });
});

describe('clone Array', () => {
  test('array containing only primitives', () => {
    let o = [null, undefined, 1, 'string', true];
    let c = clone(o);
    expect(c).toEqual(o);
  });
  test('array containing primitives and objects', () => {
    let date = new Date();
    let array = [];
    let obj = {
      date,
      array,
    };
    let o = [null, undefined, 1, 'string', true, obj];
    let c = clone(o);

    expect(c).toEqual(o);
    expect(c[5].date.getTime() === date.getTime()).toBe(true);
  });
});

describe('clone a native Set', () => {
  test('simple set', () => {
    let o = new Set();
    o.name = 'set';
    o.add(1);
    o.add(2);

    let c = clone(o);
    expect(c).toEqual(o);
  });

  test('simple weakset', () => {
    let o = new WeakSet();
    o.name = 'weakset';
    o.add({});
    o.add(() => {});

    expect(() => {
      clone(o);
    }).toThrow('WeakSet can not be cloned');
  });
});

describe('clone a native Map', () => {
  test('simple map', () => {
    let o = new Map();
    o.name = 'map';
    o.set('k1', 'value');
    o.set('k2', [1, 2, 3]);

    let c = clone(o);
    expect(c).toEqual(o);

    c.set('k2', [1, 2, 3, 4]);
    expect(c).not.toEqual(o);
  });

  test('simple weakmap', () => {
    let o = new WeakMap();
    o.name = 'weakmap';

    o.set({}, 'object');
    o.set(() => {}, 'function');

    expect(() => {
      clone(o);
    }).toThrow('WeakMap can not be cloned');
  });
});

describe('clone promise', () => {
  test('resolved promise', () => {
    return clone(Promise.resolve('success')).then((value) => {
      expect(value).toBe('success');
    });
  });

  test('resolved promise', () => {
    return clone(Promise.reject('error')).catch((error) =>
      expect(error).toMatch('error'),
    );
  });
});
