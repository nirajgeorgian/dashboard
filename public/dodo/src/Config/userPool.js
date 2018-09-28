import { CognitoUserPool } from 'amazon-cognito-identity-js'
import AwsConfig from './AwsConfig'

let userPool = new CognitoUserPool({
  UserPoolId : AwsConfig.cognito.USER_POOL_ID, // Your user pool id here
  ClientId : AwsConfig.cognito.APP_CLIENT_ID // Your client id here
})

export default userPool
