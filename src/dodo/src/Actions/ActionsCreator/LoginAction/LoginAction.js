/*
  On successfull login function should take user object and store it inside store
  func (user) => store = user
*/
import { LOGIN_SUCCESS, LOGIN_USER, COGNITO_USER, SHOW_CONFIRM, SEND_USER } from '../../ACTION_TYPE/ACTION_TYPE'
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import AWS from 'aws-sdk'
import config from '../../../Config/AwsConfig'
import cognitoUser from '../../../Config/cognitoUser'
import userPool from '../../../Config/userPool'
import { signinCallback, GoogleSigninAuth, FacebookSigninAuth } from '../../../Config/socialSignin'

import { isLoading } from '../UIActions/isLoading'
import { errorMessage } from '../Messages/ErrorMessage'
import { cognitoUserAdd } from '../CurrentUser/CurrentUserAction'
import { signOutUser } from '../../../Config/awsLib'
import { userLogout } from '../UserAction/UserLogout'
import { signupRequest } from '../SignupAction/SignupAction'

const loginSuccess = () => {
  return {
    type: LOGIN_SUCCESS
  }
}



const showConfirm = (check) => {
  return {
    type: SHOW_CONFIRM,
    payload: check
  }
}

const sendUser = (user) => {
  return {
    type: SEND_USER,
    payload: user
  }
}

function userDataInformation(username) {
  return {
    Username: username,
    UserPoolId: config.cognito.USER_POOL_ID
  }
}

const showLoading = () => {
  return dispatch => {
    dispatch(isLoading())
  }
}


const checkLogin = (username, password) => {
  let user = cognitoUser(username, password)
  user.cognitoUser.getUserAttributes((err, result) => {
    if(err) {
      console.log(err);
    } else {
      console.log(result)
      return result
    }
  })
}

const signUserUp = () => {
    return dispatch => {
      dispatch(isLoading())
      let attributeList = []
      const name = {
        Name: 'name',
        Value: localStorage.getItem("name")
      }

      const birthdate = {
        Name: "birthdate",
        Value: localStorage.getItem("date_of_birth")
      }
      // console.log(birthdate.Value);
      const gender = {
        Name: "gender",
        Value: localStorage.getItem("gender")
      }
      // console.log(typeof localStorage.getItem("email"));
      const user = {
        email: localStorage.getItem("email"),
        password: JSON.stringify(localStorage.getItem("password"))
      }

      const provider = {
        Name: "custom:provider",
        Value: "social"
      }

      attributeList.push(name)
      attributeList.push(birthdate)
      attributeList.push(gender)
      attributeList.push(provider)

      return new Promise((resolve, reject) => {
        userPool.signUp(user.email, user.password, attributeList, null, (err, result) => {
          if (err) {
            console.log(err);
            reject(err)
          } else {
            console.log(result);
            // dispatch(showConfirm(true))
            dispatch(isLoading())
            resolve(dispatch(loginRequest(localStorage.getItem("email"),JSON.stringify(localStorage.getItem("password")))))
          }
          // confirmAsAdminSignUp(user.email)
          //   .then( res => {
          //     dispatch(isLoading())
          //     resolve(dispatch(loginRequest(localStorage.getItem("email"),JSON.stringify(localStorage.getItem("password")))))
          //   })
          //   .catch(err => {
          //     dispatch(errorMessage(err.message))
          //     reject(err.message)
          //     console.log(err);
          //   })
          // }
        })
      }).catch( err => {
        dispatch(errorMessage(err.message))
        // reject(err.message)
        console.log(err);
      })
  }
}

const confirmAsAdminSignUp = (username) => {
  const params = userDataInformation(username)
  var provider = new AWS.CognitoIdentityServiceProvider();
      return new Promise((resolve, reject) => {
        provider.adminConfirmSignUp(params, function(err, result) {
          if(err) {
            reject(err)
          } else {
            changeAdminAttributes(username)
              .then(res => resolve(result))
              .catch(err => {
                console.log(err);
              })
          }
        })
      })
}

const changeAdminAttributes = (username) =>{
  var params = {
    UserAttributes: [
      {
        Name: 'email_verified',
        Value: 'true'
      },
    ],
    UserPoolId: config.cognito.USER_POOL_ID,
    Username: username
  };
  var provider = new AWS.CognitoIdentityServiceProvider();
    return new Promise((resolve, reject) => {
      provider.adminUpdateUserAttributes(params, function(err, result){
        if(err) {
          reject(err)
        } else {
          resolve(result)
        }
    })
  })
}

const confirmUserLogin = (newUser, confirmationCode) => {
  return dispatch => {
    dispatch(isLoading())
    return new Promise((resolve, reject) => {
      newUser.confirmRegistration(confirmationCode, true, function(err, result) {
        if (err) {
          dispatch(errorMessage(err.message))
          dispatch(isLoading())
          reject(err)
        } else {
          dispatch(errorMessage(""))
          dispatch(isLoading())
          resolve(result)
        }
      })
    })
  }
}

const confirmUser = (newUser, confirmationCode, username, password) => {
  return dispatch => {
    dispatch(isLoading())
    return new Promise((resolve, reject) => {
      newUser.confirmRegistration(confirmationCode, true, async function(err, result) {
        if (err) {
          dispatch(errorMessage(err.message))
          dispatch(isLoading())
          reject(err)
        } else {
          // dispatch(confirmUserAction())
          dispatch(errorMessage(""))
          dispatch(isLoading())
          resolve(dispatch(await loginRequest()))
        }
      })
    })
  }
}

const loginRequest = (username, password) => {
  let user = new cognitoUser(username, password)
  console.log("User:",user)
  return (dispatch) => {
    dispatch(isLoading())
    return new Promise((resolve, reject) =>
      user.cognitoUser.authenticateUser(user.authenticationDetails, {
        onSuccess: result => {
          console.log(result);
          AWS.config.region = 'eu-west-1'
          const userPoolCred = 'cognito-idp.eu-west-1.amazonaws.com/' + config.cognito.USER_POOL_ID
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: config.IDENTITY_POOL_ID,
            Logins: {
              'cognito-idp.eu-west-1.amazonaws.com/eu-west-1_tuuCAenHU': result.getIdToken().getJwtToken()
            }
          })
          console.log(result);
          AWS.config.credentials.refresh((error) => {
            if (error) {
              dispatch(errorMessage(error.message))
              dispatch(isLoading())
              reject(error)
            } else {
              // Successfully logged in
              user.cognitoUser.getUserAttributes(async function(err, result) {
                if (err) {
                  dispatch(errorMessage(error.message))
                  dispatch(isLoading())
                  reject(err)
                } else {
                  // check if the user is having confirmed account
                  console.log(result);
                  for(let i = 0; i < result.length; i++) {
                    if (result[i].Name === 'email_verified') {
                      if(result[i].Value === "true") {
                        dispatch(loginSuccess())
                        dispatch(cognitoUserAdd(result))
                        dispatch(errorMessage(""))
                        dispatch(isLoading())
                        resolve()
                      } else {
                        await dispatch(userLogout())
                        dispatch(errorMessage("Account Not Confirmed"))
                        dispatch(isLoading())
                        reject()
                      }
                    }
                  }
                }
              })
            }
          })
        },
        onFailure: async error => {
          if(localStorage.getItem("email")){
            resolve(dispatch(await signUserUp()))
            dispatch(isLoading())
          } else {
            dispatch(isLoading())
            dispatch(errorMessage(error.message))
            reject(error)
          }
        }
      })
    )
  }
}


const googleLogin = (token) => {
  return async dispatch => {
    dispatch(isLoading())
      return new Promise((resolve, reject) => {
        GoogleSigninAuth(token)
        .then(async res => {
          console.log(res);
          if(res["expired"] !== true) {
            try {
              const data = dispatch(await loginRequest(localStorage.getItem("email"),JSON.stringify(localStorage.getItem("password"))))
              resolve(data)
            } catch(err){
              reject(err.message)
              console.log("Got Error:"+err);
            }finally  {
              dispatch(isLoading())
            }
          } else {
            reject()
            dispatch(errorMessage("Experiencing Problems"))
            dispatch(isLoading())
          }
        })
        .catch(err => {
            reject(err.message)
            dispatch(errorMessage(err.message))
            dispatch(isLoading())
        })
    })
  }
}

const facebookLogin = (token) => {
  return async dispatch => {
    dispatch(isLoading())
    return new Promise((resolve, reject) => {
      FacebookSigninAuth(token)
      .then(async res => {
        console.log(res);
        if(res["expired"] !== true) {
          try {
            const data = dispatch(await loginRequest(localStorage.getItem("email"),JSON.stringify(localStorage.getItem("password"))))
            resolve(data)
          }
          catch(err){
            reject(err.message)
            console.log("Got Error:"+err);
          }
         finally  {
            dispatch(isLoading())
          }
        } else {
          reject()
          dispatch(errorMessage("Experiencing Problems"))
          dispatch(isLoading())
        }
      })
      .catch(err => {
        reject(err.message)
        dispatch(errorMessage(err.message))
        dispatch(isLoading())
      })
   })
  }
}

export {
  loginSuccess,
  loginRequest,
  checkLogin,
  googleLogin,
  facebookLogin,
  confirmUserLogin,
  showLoading
}
