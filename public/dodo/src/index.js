import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { ConfigurationOptions } from 'aws-sdk/lib/config'
import App from './App'
import { PersistGate } from 'redux-persist/lib/integration/react'
import Amplify from 'aws-amplify'
import config from './Config/AwsConfig'
import { configureStore } from './Store'
// import registerServiceWorker from './registerServiceWorker';
let { store, persistor } = configureStore()


// store.dispatch({ type: 'IS_LOADING'})
// console.log(store.getState())
/*
  loading is the default app start loding icon
  it should be loaded till the time app retain it's state from redux-persist
  loading=<SomeLoadingComponent />
*/

// configure AWS configure
Amplify.configure({
	Auth: {
		mandatorySignIn: true,
		region: config.cognito.REGION,
		userPoolId: config.cognito.USER_POOL_ID,
		identityPoolId: config.cognito.IDENTITY_POOL_ID,
		userPoolWebClientId: config.cognito.APP_CLIENT_ID
	},
	Storage: {
		region: config.s3.REGION,
		bucket: config.s3.SPEED_BUCKET,
		IdentityPoolId: config.cognito.IDENTITY_POOL_ID
	},
	API: {
		endpoints: [
			{
				name: 'business',
				endpoint: config.apiGateway.TESTURL,
				region: config.apiGateway.REGION
			},
			{
				name: 'facility',
				endpoint: config.apiGateway.FACILITYURL,
				region: config.apiGateway.REGION
			},
			{
				name: 'membership',
				endpoint: config.apiGateway.MEMBERSHIPURL,
				region: config.apiGateway.REGION
			},
			{
				name: 'payments',
				endpoint: config.apiGateway.PAYMENTSURL,
				region: config.apiGateway.REGION
			},
			{
				name: 'members',
				endpoint: config.apiGateway.MEMBERSURL,
				region: config.apiGateway.REGION
			},
			{
				name: 'events',
				endpoint: config.apiGateway.EVENTSURL,
				region: config.apiGateway.REGION
			},
			{
				name: 'accounts',
				endpoint: config.apiGateway.ACCOUNTSURL,
				region: config.apiGateway.REGION
			},
			{
				name: 'employee',
				endpoint: config.apiGateway.EMPLOYEEURL,
				region: config.apiGateway.REGION
			},
			{
				name: 'b2b',
				endpoint: config.apiGateway.B2B,
				region: config.apiGateway.REGION
			},
		]
	}
})

render(
	<Provider store={store}>
		<PersistGate loading="Loading your application" persistor={persistor}>
			<Router>
				<App />
			</Router>
		</PersistGate>
	</Provider>,
	document.getElementById('root')
)

// registerServiceWorker();
