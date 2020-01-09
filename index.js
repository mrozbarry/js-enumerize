const { Enumeration } = require('./enumeration');
const { Any } = require('./any');
const { coax } = require('./coax');

// Main method
const enumerize = (values) => new Enumeration(values);

module.exports = enumerize;
module.exports.Any = Any;
module.exports.Enumeration = Enumeration;
module.exports.coax = coax;
module.exports.default = enumerize;
