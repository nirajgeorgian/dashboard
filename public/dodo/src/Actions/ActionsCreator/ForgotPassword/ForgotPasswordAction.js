import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import { FORGOT_PASSWORD, SEND_FORGOT_PASSWORD_TOKEN_SUCCESS, SEND_FORGOT_PASSWORD_TOKEN_FAILURE } from '../../ACTION_TYPE/ACTION_TYPE'
import { isLoading } from '../UIActions/isLoading'
import { errorMessage } from '../Messages/ErrorMessage'
import userPool from '../../../Config/userPool'

const social_error = "Your account was set up using Google or Facebook. Please sign in using Google or Facebook."
const policy_error = "Password entered doesn't comply with the requirements.\n 1.It should be a minimum of 8 characters.\n 2.It should consist of at least an Uppercase, Lowercase, Number & Special character."

const forgotPasswordSend = () => {
  return {
    type: FORGOT_PASSWORD
  }
}

const sendForgotPasswordTokenSuccess = () => {
  return {
    type: SEND_FORGOT_PASSWORD_TOKEN_SUCCESS
  }
}

const sendForgotPasswordTokenFailure = () => {
  return {
    type: SEND_FORGOT_PASSWORD_TOKEN_FAILURE
  }
}

function userDataInformation(username) {
  return {
    Username: username,
    Pool: userPool
  }
}

// dispatch an action userDataInformation
const forgotPasswordReset = (userData, type) => {
  const cognitoUser = new CognitoUser(userData)
  return (dispatch) => {
    dispatch(isLoading())
    return new Promise((resolve, reject) => {
      if(type == 'social'){
        dispatch(isLoading())
        dispatch(errorMessage(social_error))
        reject(new Error(social_error))
        return
      }
      cognitoUser.forgotPassword({
        onSuccess: function(data) {
          // console.log(data)
          // return data
          // dispatch(sendForgotPasswordTokenSuccess())
          dispatch(forgotPasswordSend())
          dispatch(errorMessage(""))
          dispatch(isLoading())
          resolve(data)
        },
        onFailure: function(err) {
          // return err
          if(err.message == "Username/client id combination not found."){
            dispatch(errorMessage("Email account does not exist with us. Please check the email address."))
          } else {
            dispatch(errorMessage(err.message))
          }
          dispatch(isLoading())
          // dispatch(sendForgotPasswordTokenFailure())
          reject(err)
        }
      })
    })
  }
}

//Made a separate function for token resend as may be we need to dispatch different actions on reset and resend
const resendToken = userData => {
  const cognitoUser = new CognitoUser(userData)
  console.log(userData);
  return (dispatch) => {
    dispatch(isLoading())
    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: function(data) {
          // console.log(data)
          // return data
          // dispatch(sendForgotPasswordTokenSuccess())
          dispatch(forgotPasswordSend())
          dispatch(errorMessage(""))
          dispatch(isLoading())
          console.log(data);
          resolve(data)
        },
        onFailure: function(err) {
          console.log(err)
          // return err
          dispatch(errorMessage(err.message))
          dispatch(isLoading())
          // dispatch(sendForgotPasswordTokenFailure())
          reject(err)
        }
      })
    })
  }
}

const confirmPassword = (userdata, verificationCode, newPassword) => {
  const cognitoUser = new CognitoUser(userdata)
  return (dispatch) => {
    dispatch(isLoading())
    return new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess() {
          console.log("successfully reset password")
          // dispatch(sendForgotPasswordTokenSuccess())
          dispatch(isLoading())
          dispatch(errorMessage(""))
          resolve()
        },
        onFailure: function(err) {
          console.log("Reset Password failed")
          // dispatch(sendForgotPasswordTokenFailure())
          dispatch(errorMessage(policy_error))
          dispatch(isLoading())
          reject()
        }
      })
    })
  }
  // cognitoUser
}

export {
  forgotPasswordReset,
  forgotPasswordSend,
  userDataInformation,
  confirmPassword,
  resendToken
}
