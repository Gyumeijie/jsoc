'use strict';

const isPrimitive = (val) => typeof val !== 'object' || val === null;

const clone = (target) => {
  // Return the target if it is actually a primitive
  if (isPrimitive(target)) return target;
};

module.exports = clone;
