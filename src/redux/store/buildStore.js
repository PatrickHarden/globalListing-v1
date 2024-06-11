import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { identity } from 'ramda';
import reducers from '../reducers';
import { initialState } from './initialState';

const createReducers = (history) =>
  combineReducers({
    router: connectRouter(history),
    ...reducers
});

/*
const allowDebugging =
  process.env.NODE_ENV !== 'production' ||
  (localStorage && localStorage.getItem('reactDebug') === 'yes');
*/

/*

export const initialState = {
    filters: {
        usageType: null,
        aspects: null
    },
    markers: {
        current: [],
        data: [],
        idLookup: {},
        aspectLookup: {}
    },
    properties: {
        paging: {
            skip: 0,
            take: 25
        },
        current: [],
        data: [],
        idLookup: {}
    }
};

*/

const allowDebugging = true;

const buildStore = (history) => {

    const devToolsExt =
      allowDebugging && window.devToolsExtension
        ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        : identity;
  
    const middleWare = allowDebugging
      ? applyMiddleware(routerMiddleware(history), thunkMiddleware, createLogger())
      : applyMiddleware(routerMiddleware(history), thunkMiddleware);

    const store = createStore(
      createReducers(history),
      initialState,
      compose(
        middleWare,
        devToolsExt
      )
    );
  
    return store;
  };
  export default buildStore;