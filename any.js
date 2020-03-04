// Anything custom type
class Any {
  constructor(value) {
    this.toString = () => String(value);
    this.valueOf = () => value;
  }
}

export {
  Any,
};
