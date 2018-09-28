import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import userPool from './userPool'

const congitoUser = (username, password) => {
  let authenticationData = {
    Username : username,
    Password : password,
  }
  let authenticationDetails = new AuthenticationDetails(authenticationData)
  let userData = {
    Username : username,
    Pool : userPool
  }
  let cognitoUser = new CognitoUser(userData);
  return {
    authenticationDetails,
    cognitoUser
  }
}

export default congitoUser
