// Anything custom type
const valueKey = Symbol('value');
function Any(value) {
  this[valueKey] = value;
};
Any.prototype.toString = function() { return String(this[valueKey]); };
Any.prototype.valueOf = function() { return this[valueKey]; };

module.exports = {
  Any,
};
