import createGenerateComponentKey from './createGenerateComponentKey';
const Component = () => {};

describe('createGenerateComponentKey', () => {
  it('should create a function that always produce the same output', () => {
    const generateComponentKey = createGenerateComponentKey();
    const key = generateComponentKey(Component, {});
    expect(generateComponentKey(Component, {})).toBe(key);
  });

  it('should create functions with different outputs', () => {
    const generateComponentKey1 = createGenerateComponentKey();
    const generateComponentKey2 = createGenerateComponentKey();
    const key1 = generateComponentKey1(Component, {});
    const key2 = generateComponentKey2(Component, {});
    expect(key1).not.toBe(key2);
  });
});
