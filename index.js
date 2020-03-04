import { Enumeration } from './enumeration';
import { Any } from './any';
import { coax } from './coax';

// Main method
const enumerize = (values) => new Enumeration(values);

enumerize.Any = Any;
enumerize.Enumeration = Enumeration;
enumerize.coax = coax;

export default enumerize;
export {
  Any,
  Enumeration,
  coax,
};
