import {
  SET_LOADED_COMPONENT,
  DISMISS_LOADED_COMPONENT,
} from './constants';

const setLoadedComponent = (key, data) => ({
  type: SET_LOADED_COMPONENT,
  key,
  data,
});

const dismissLoadedComponent = key => ({
  type: DISMISS_LOADED_COMPONENT,
  key,
});

export {
  setLoadedComponent,
  dismissLoadedComponent,
};
