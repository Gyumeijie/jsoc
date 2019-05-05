# jsoc [![](https://travis-ci.com/Gyumeijie/jsoc.svg?branch=master)](https://travis-ci.com/Gyumeijie/jsoc)

> Clone or Copy a JavaScript Object.

## Install

```bash
$ npm install jsoc
```

## Usage

```js
const clone = require('jsoc');

let a = { foo: { bar: 'baz' } };

let b = clone(a);
a.foo.bar = 'foo';

console.log(a); // { foo: { bar: 'foo' } }
console.log(b); // { foo: { bar: 'baz' } }
```

## License

MIT © [Gyumeijie](https://github.com/Gyumeijie)
