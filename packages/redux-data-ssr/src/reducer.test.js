import reducer from './reducer';
import {
  SET_LOADED_COMPONENT,
  DISMISS_LOADED_COMPONENT,
} from './constants';

describe('reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      initialData: {},
    });
  });

  it('should handle SET_LOADED_COMPONENT', () => {
    const key = 'test-key';
    const data = {
      test: 'test',
    };
    expect(reducer({
      initialData: {
        component: { test: 'test' },
      },
    }, {
      type: SET_LOADED_COMPONENT,
      key,
      data,
    })).toEqual({
      initialData: {
        component: { test: 'test' },
        [ key ]: data,
      }
    });
  });

  it('should handle DISMISS_LOADED_COMPONENT', () => {
    expect(reducer({
      initialData: {
        component: { test: 'test' },
      },
    }, {
      type: SET_LOADED_COMPONENT,
      key: 'component',
    })).toEqual({
      initialData: {}
    });
  });
});
