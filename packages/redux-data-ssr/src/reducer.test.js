import reducer from './reducer';
import { SET_LOADED_COMPONENT, DISMISS_LOADED_COMPONENT } from './constants';

describe('reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      initialData: {},
    });
  });

  it('should handle SET_LOADED_COMPONENT', () => {
    const key = 'test-key';
    expect(
      reducer(
        {
          initialData: {
            component: true,
          },
        },
        {
          type: SET_LOADED_COMPONENT,
          key,
        }
      )
    ).toEqual({
      initialData: {
        component: true,
        [key]: true,
      },
    });
  });

  it('should not mutate state (SET_LOADED_COMPONENT)', () => {
    const key = 'test-key';
    const getState = () => ({
      initialData: {
        component: true,
      },
    });
    const state = getState();

    reducer(state, {
      type: SET_LOADED_COMPONENT,
      key,
    });

    expect(state).toEqual(getState());
  });

  it('should handle DISMISS_LOADED_COMPONENT', () => {
    const key = 'component';
    expect(
      reducer(
        {
          initialData: {
            [key]: true,
          },
        },
        {
          type: DISMISS_LOADED_COMPONENT,
          key,
        }
      )
    ).toEqual({
      initialData: {},
    });
  });

  it('should not mutate state (DISMISS_LOADED_COMPONENT)', () => {
    const key = 'component';
    const getState = () => ({
      initialData: {
        [key]: true,
      },
    });
    const state = getState();

    reducer(state, {
      type: DISMISS_LOADED_COMPONENT,
      key,
    });

    expect(state).toEqual(getState());
  });
});
