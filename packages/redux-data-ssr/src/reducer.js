import {
  SET_LOADED_COMPONENT,
  DISMISS_LOADED_COMPONENT,
} from './constants';

export const initialState = () => ({
  initialData: {},
});

const reducer = (state=initialState(), action) => {
  switch(action.type) {
    case SET_LOADED_COMPONENT:
      return {
        ...state,
        initialData: {
          ...state.initialData,
          [action.key]: action.data,
        },
      };
    case DISMISS_LOADED_COMPONENT:
    default:
      return state;
  }
};

export default reducer;
