/*
  create the global store
 */
import {applyMiddleware, compose, createStore} from 'redux'
import {createEpicMiddleware} from 'redux-observable'
import logger from 'redux-logger'
import {persistReducer, persistStore} from 'redux-persist'
import localforage from "localforage" // defaults to localStorage for web
import {rootEpics} from '../epics/app.epic'
/*
  import your root reducer here
 */
import {rootReducer} from '../reducers/index.reducer'

localforage.config({
    driver: localforage.supports(localforage.LOCALSTORAGE) ? localforage.LOCALSTORAGE : localforage.INDEXEDDB,
    name: 'alterhoop-localforage'
})
/*
localforage.ready().then(function() {
    console.log(localforage.driver());
}).catch(function (e) {
    console.log(e);
})
*/

const persistConfig = {
  key: 'root',
  storage: localforage,
  whitelist: ['user']
}

/*
  make changes to create store with proper middleware
 */
const composeEnhancers = process.env.NODE_ENV === 'development' ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) : compose
const epicMiddleware = createEpicMiddleware()
const createStoreWithMiddleware = composeEnhancers(applyMiddleware(logger, epicMiddleware))(createStore)

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const configureStore = (initialState = {}) => {
  return createStoreWithMiddleware(persistedReducer, initialState)
}

const getStore = () => {
  let store
  if(global.window !== undefined) {
    store = configureStore( window.__REDUX_STATE__ || {} )
  } else {
    store = configureStore({})
  }
  epicMiddleware.run(rootEpics)
  return store
}
let persistor = persistStore(getStore())

export {
	persistor
}
export default getStore
