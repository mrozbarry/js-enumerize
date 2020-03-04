const coax = (Type, transformFn) => (...args) => new Type(transformFn(...args));

export {
  coax,
};
