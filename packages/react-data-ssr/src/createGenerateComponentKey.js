// Idea taken from JSS / MaterialUI createGenerateClassName
// XXX: this is relying that the import order between Client and Server side JS is the same
//      i don't know if this will break during code splitting

let keyCounter = 0;
const prod = process.env.NODE_ENV === 'production';

const createGenerateComponentKey = () => {
  const counter = keyCounter++;
  return (Component, props) => {
    if (prod) return `c-${counter}`;
    return `${Component.name}-${counter}`;
  };
};

export default createGenerateComponentKey;
