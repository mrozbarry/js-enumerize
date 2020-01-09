const coax = (Type, transformFn) => {
  return (...args) => new Type(transformFn(...args))
};

module.exports = {
  coax,
};
