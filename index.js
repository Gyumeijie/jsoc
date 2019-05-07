'use strict';

const isPrimitive = (val) => typeof val !== 'object' || val === null;

const typeRegExp = /\[object (\w+)\]/;
const getTypeOf = (obj) => {
  const type = Object.prototype.toString.call(obj);
  return typeRegExp.exec(type)[1];
};

const compositeType = ['Object', 'Array', 'Map', 'WeakMap', 'Set', 'WeakSet'];
const isCompositeType = (obj) => compositeType.includes(getTypeOf(obj));

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

const hasBeenCloned = (objRefs, obj) => {
  if (objRefs.indexOf(obj) === -1) {
    objRefs.push(obj);
    return false;
  }
  return true;
};

const clone = (obj) => {
  // Return the obj if it is actually a primitive
  if (isPrimitive(obj)) return obj;

  // Doing the actual cloning work
  const objRefs = [];
  const map = new Map();
  const cloning = (target) => {
    if (hasBeenCloned(objRefs, target)) {
      return map.get(target);
    }

    const cloned = initializeClonedObject(target);
    map.set(target, cloned);

    if (isCompositeType(target)) {
      // Loops through the properties of any composite object
      for (const key in target) {
        cloned[key] = isPrimitive(target[key])
          ? target[key]
          : cloning(target[key]);
      }

      // Additional operations for `Map`
      if (getTypeOf(target) === 'Map') {
        for (const [key, value] of target.entries()) {
          cloned.set(key, isPrimitive(value) ? value : cloning(value));
        }
      }

      // Additional operations for `Set`
      if (getTypeOf(target) === 'Set') {
        for (const key of target.keys()) {
          cloned.add(isPrimitive(key) ? key : cloning(key));
        }
      }

      // The `WeakSet` and `WeakMap` cann't be cloned
      if (['WeakSet', 'WeakMap'].includes(getTypeOf(target))) {
        throw new Error(`${getTypeOf(target)} can not be cloned`);
      }

      return cloned;
    }
    // Process other types such as `Date`, `RegExp`, `Promise`
    return cloneHandlers[getTypeOf(target)](target, cloning);
  };
  return cloning(obj);
};

module.exports = clone;
