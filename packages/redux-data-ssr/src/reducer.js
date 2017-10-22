import { SET_LOADED_COMPONENT, DISMISS_LOADED_COMPONENT } from './constants';

export const initialState = () => ({
  initialData: {},
});

const reducer = (state = initialState(), action) => {
  switch (action.type) {
    case SET_LOADED_COMPONENT:
      return {
        ...state,
        initialData: {
          ...state.initialData,
          [action.key]: true,
        },
      };

    case DISMISS_LOADED_COMPONENT:
      const { key } = action;

      if (!(key in state.initialData)) return state;

      const initialData = { ...state.initialData };
      delete initialData[key];
      return {
        ...state,
        initialData,
      };

    default:
      return state;
  }
};

export default reducer;
