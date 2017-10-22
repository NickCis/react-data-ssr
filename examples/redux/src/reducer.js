import { combineReducers } from 'redux';
import { REDUCER_KEY, reducer } from 'redux-data-ssr';
import { LINKS_LOADING, LINKS_LOADED, HOME_LOADING, HOME_LOADED, LIST_LOADING, LIST_LOADED } from './actions';

const list = (state={loading: false, list: []}, action) => {
  switch (action.type) {
    case LIST_LOADING:
      return {
        loading: true,
        list: [],
      };

    case LIST_LOADED:
      return {
        loading: false,
        list: action.data,
      };

    default:
      return state;
  }
};

const links = (state={loading: false, links: []}, action) => {
  switch (action.type) {
    case LINKS_LOADING:
      return {
        loading: true,
        links: [],
      };

    case LINKS_LOADED:
      return {
        loading: false,
        links: action.data,
      };

    default:
      return state;
  }
};

const home = (state={loading: false, title: '', body: ''}, action) => {
  switch (action.type) {
    case HOME_LOADING:
      return {
        loading: true,
        title: '',
        body: '',
      };

    case HOME_LOADED:
      return {
        loading: false,
        title: action.data.title,
        body: action.data.body,
      };

    default:
      return state;
  }
};

const rootReducer = combineReducers({
  [ REDUCER_KEY ]: reducer,
  list,
  links,
  home,
});

export default rootReducer;
