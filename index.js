'use strict';

const isPrimitive = (val) => typeof val !== 'object' || val === null;

const getTypeOf = (obj) => {
  const type = Object.prototype.toString.call(obj);
  // [object xxx] typename starts at 8
  return type.slice(8, -1);
};

const compositeType = ['Object', 'Array', 'Map', 'WeakMap', 'Set', 'WeakSet'];

// Handler to clone Date object
const cloneDate = (date) => new Date(date.getTime());

// Handler to clone RegExp object
const cloneRegExp = (re) => {
  const cloned = new RegExp(re.source, re.flags);
  cloned.lastIndex = re.lastIndex;
  return cloned;
};

// Handler to clone Promise object
const clonePromise = (promise, cloning) =>
  new Promise((resolve, reject) => {
    promise.then(
      (value) => {
        resolve(isPrimitive(value) ? value : cloning(value));
      },
      (error) => {
        reject(isPrimitive(error) ? error : cloning(error));
      },
    );
  });

// Types needed to be handled specially
const cloneHandlers = {
  Date: cloneDate,
  RegExp: cloneRegExp,
  Promise: clonePromise
};

const initializeClonedObject = (obj) => {
  const type = getTypeOf(obj);
  let initVal = null;

  if (compositeType.includes(type)) {
    initVal = eval(`new ${type}()`);
  }
  return initVal;
};

const clone = (obj) => {
  // Return the obj if it is actually a primitive
  if (isPrimitive(obj)) return obj;

  // Doing the actual cloning work
  const objRefs = [];
  const map = new Map();
  const cloning = (target) => {
    // If target has been cloned
    if (objRefs.indexOf(target) !== -1) {
      return map.get(target);
    }
    objRefs.push(target);

    const cloned = initializeClonedObject(target);
    map.set(target, cloned);

    const type = getTypeOf(target);
    if (compositeType.includes(type)) {
      // Loops through the properties of any composite object
      for (const key in target) {
        cloned[key] = isPrimitive(target[key])
          ? target[key]
          : cloning(target[key]);
      }

      // Additional operations for `Map`
      if (type === 'Map') {
        for (const [key, value] of target.entries()) {
          cloned.set(key, isPrimitive(value) ? value : cloning(value));
        }
      }

      // Additional operations for `Set`
      if (type === 'Set') {
        for (const key of target.keys()) {
          cloned.add(isPrimitive(key) ? key : cloning(key));
        }
      }

      // The `WeakSet` and `WeakMap` cann't be cloned
      if (['WeakSet', 'WeakMap'].includes(type)) {
        throw new Error(`${type} can not be cloned`);
      }

      return cloned;
    }
    // Process other types such as `Date`, `RegExp`, `Promise`
    return cloneHandlers[type](target, cloning);
  };
  return cloning(obj);
};

module.exports = clone;
