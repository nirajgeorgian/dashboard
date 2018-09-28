import AWS from 'aws-sdk'
import config from './AwsConfig'
import userPool from './userPool'
/*
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

let authData = {
  ClientId: config.cognito.APP_CLIENT_ID,
  AppWebDomain: config.WEB_APP_DOMAIN,
  TokenScopesArray: ['phone', 'email', 'profile', 'openid'],
  RedirectUriSignIn: config.WEB_APP_REDIRECT_URI_LOGIN,
  RedirectUriSignOut: config.WEB_APP_REDIRECT_URI_LOGOUT,
  IdentityProvider: 'google',
  UserPoolId: config.cognito.USER_POOL_ID,
  AdvancedSecurityDataCollectionFlag: true
}

const auth = new CognitoAuth(authData)

auth.userhandler = {
	onSuccess: function(result) {
		alert("Sign in success");
		console.log(result);
	},
	onFailure: function(err) {
		console.log(err);
	}
};
*/

function getCurrentUser() {
  return userPool.getCurrentUser()
}

function getUserToken(currentUser) {
  return new Promise((resolve, reject) => {
    currentUser.getSession(function(err, session) {
      if (err) {
        reject(err)
        return
      }
      resolve(session.getIdToken().getJwtToken())
    })
  })
}

export async function GoogleSigninAuth(token) {
  AWS.config.update({
    region: config.REGION
  })

   AWS.config.credentials = await new AWS.WebIdentityCredentials({
    RoleArn: 'arn:aws:iam::134422165535:role/google_signin_role+=,.@-_',
    WebIdentityToken: token // Access token from identity provider
  });
  // It will return credentials object
  // return AWS.config.credentials.getPromise();
  return new Promise((resolve, reject) => {
    if(AWS.config.credentials) {
      AWS.config.credentials.get(function() {
        return resolve(AWS.config.credentials)
      })
    } else {
      return reject("not found")
    }

  })
}

export async function FacebookSigninAuth(token) {
  AWS.config.update({
    region: config.REGION
  })

   AWS.config.credentials = await new AWS.WebIdentityCredentials({
    RoleArn: 'arn:aws:iam::134422165535:role/facebook_signin_role+=,.@-_',
    ProviderId: 'graph.facebook.com',
    WebIdentityToken: token // Access token from identity provider
  });
  // It will return credentials object
  // return AWS.config.credentials.getPromise();
  return new Promise((resolve, reject) => {
    if(AWS.config.credentials) {
      AWS.config.credentials.get(function() {
        return resolve(AWS.config.credentials)
      })
    } else {
      return reject("not found")
    }

  })
}

// export async function signinCallback(token) {
//
//   const user = await GoogleSininAuth(token)
//   console.log(user);
//   return GoogleSininAuth(token)
// }

// export function FacebookSignInAuth(response){
//   FB.login(function(token){
//     if(response.authResponse){
//       console.log('You are logged in.')
//
//       console.log(response);
//       getFBAwsCredentials(response.authResponse.accessToken);
//     }else{
//       console.log('Problem in signing in.')
//     }
//   })
// }
//
// export function fbsigninCallback(response){
//
//   FB.getLoginStatus(function(response){
//     if(response.status === 'connected'){
//
//       console.log(response);
//       getFBAwsCredentials(response.authResponse.accessToken);
//
//     }else{
//       const user = FacebookSignInAuth(response);
//       return user
//     }
//   });
// }
//
// function getFBAwsCredentials(accessToken){
//   AWS.config.update({
//     region: config.REGION
//   })
//
//   AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: config.IDENTITY_POOL_ID,
//     Logins: {
//        'graph.facebook.com': accessToken
//     }
//   });
//
//   AWS.config.credentials.get(function(){
//     console.log(AWS.config.credentials)
//   });
// }
