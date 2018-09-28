import userPool from './userPool'
import { CognitoUser } from 'amazon-cognito-identity-js'

export function getAwsProfile(username) {
  const userData = {
    Username: username,
    Pool: userPool
  }
  const cognitoUser = new CognitoUser(userData)
  return new Promise((resolve, reject) => {
    cognitoUser.getUserAttributes(function(err, result) {
      if(err) {
        reject(err)
      }
      resolve(result)
    })
  })
}
