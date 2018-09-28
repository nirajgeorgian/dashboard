import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { compose, createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import localForage from 'localforage'
import { rootReducer } from '../../Reducers'

import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
	key: 'root',
	storage: storage,
	blacklist: ['isLoading', 'errorMessage', 'route','businesses'],
	whitelist: ['businessesList', 'currentUser', 'isAutenticated', 'currentBusinessList', 'globalMessage', 'paymentStatus', 'transactions'],
	// stateReconciler: autoMergeLevel2
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
	let store = createStore(
		persistedReducer,
		undefined,
		composeEnhancers(applyMiddleware(thunk, logger))
	)
	let persistor = persistStore(store)
	return { store, persistor }
}
