export const LINKS_LOADING = 'LINKS_LOADING';
export const LINKS_LOADED = 'LINKS_LOADED';

export const getLinks = () => dispatch => new Promise(rs => {
  dispatch({ type: LINKS_LOADING });
  setTimeout(() => {
    dispatch({
      type: LINKS_LOADED,
      data: [
        { to: '/', text: 'Home' },
        { to: '/list', text: 'List' },
      ]
    });
    rs();
  });
});

export const HOME_LOADING = 'HOME_LOADING';
export const HOME_LOADED = 'HOME_LOADED';

export const getHome = () => dispatch => new Promise(rs => {
  dispatch({ type: HOME_LOADING });
  setTimeout(() => {
    dispatch({
      type: HOME_LOADED,
      data: {
        title: 'Home',
        body: 'this is a body',
      },
    });
    rs();
  }, 1000);
});

export const LIST_LOADING = 'LIST_LOADING';
export const LIST_LOADED = 'LIST_LOADED';

export const getList = () => dispatch => new Promise(rs => {
  dispatch({ type: LIST_LOADING });
  setTimeout(() => {
    dispatch({
      type: LIST_LOADED,
      data: [
        'first',
        'second',
        'thrid',
      ],
    });
    rs();
  }, 1000);
});

