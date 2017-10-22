import { SET_LOADED_COMPONENT, DISMISS_LOADED_COMPONENT } from './constants';

const setLoadedComponent = key => ({
  type: SET_LOADED_COMPONENT,
  key,
});

const dismissLoadedComponent = key => ({
  type: DISMISS_LOADED_COMPONENT,
  key,
});

export { setLoadedComponent, dismissLoadedComponent };
