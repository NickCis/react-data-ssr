import { setLoadedComponent, dismissLoadedComponent } from './actions';
import { SET_LOADED_COMPONENT, DISMISS_LOADED_COMPONENT } from './constants';

describe('actions', () => {
  it('should create an action to add a loaded component', () => {
    const key = 'test-key';
    const expectedAction = {
      type: SET_LOADED_COMPONENT,
      key,
    };
    expect(setLoadedComponent(key)).toEqual(expectedAction);
  });

  it('should create an action to dismiss a loaded component', () => {
    const key = 'test-key';
    const expectedAction = {
      type: DISMISS_LOADED_COMPONENT,
      key,
    };
    expect(dismissLoadedComponent(key)).toEqual(expectedAction);
  });
});
