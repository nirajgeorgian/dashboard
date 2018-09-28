import { SIGNUP_SUCCESS, CONFIRM_USER } from '../../ACTION_TYPE/ACTION_TYPE'
import userPool from '../../../Config/userPool'
import { errorMessage } from '../Messages/ErrorMessage'
import { isLoading } from '../UIActions/isLoading'
import config from '../../../Config/AwsConfig'

import AWS from 'aws-sdk'

AWS.config.update({region:'eu-west-1'});

const signupSuccess = () => {
  return {
    type: 'SIGNUP_SUCCESS'
  }
}

const clearMessage = () => {
  return {
    type: 'CLEAR_MESSAGE'
  }
}

const confirmUserAction = () => {
  return {
    type: 'CONFIRM_USER'
  }
}

function userDataInformation(username) {
  return {
    Username: username,
    ClientId: config.cognito.APP_CLIENT_ID
  }
}

const confirmUser = (newUser, confirmationCode) => {
  return dispatch => {
    dispatch(isLoading())
    return new Promise((resolve, reject) => {
      newUser.confirmRegistration(confirmationCode, true, function(err, result) {
        if (err) {
          dispatch(errorMessage(err.message))
          dispatch(isLoading())
          reject(err)
        } else {
          dispatch(confirmUserAction())
          dispatch(errorMessage(""))
          dispatch(isLoading())
          resolve(result)
        }
      })
    })
  }
}

function signupRequest(user) {
  return (dispatch) => {
    dispatch(isLoading())
    let attributeList = []
    const name = {
      Name: 'name',
      Value: user.firstname + " " + user.lastname
    }
    const birthdate = {
      Name: "birthdate",
      Value: user.birthdate
    }
    const gender = {
      Name: "gender",
      Value: user.gender
    }
    const provider = {
      Name: "custom:provider",
      Value: "sagepass"
    }
    attributeList.push(name)
    attributeList.push(birthdate)
    attributeList.push(gender)
    attributeList.push(provider)
    return new Promise((resolve, reject) => {
      userPool.signUp(user.email, user.password, attributeList, null, (err, result) => {
        if (err) {
          if(err.message === 'An account with the given email already exists.'){
            dispatch(errorMessage("Please try signing in using Google or Facebook."))
          } else {
          dispatch(errorMessage(err.message))
          }
          dispatch(isLoading())
          reject(err)
        } else {
          dispatch(signupSuccess())
          dispatch(errorMessage(""))
          dispatch(isLoading())
          console.log(result);
          resolve(result.user)
        }
      })
    })
  }
}

function resendCode(username){
  const params = userDataInformation(username)
  console.log(params);
  var provider = new AWS.CognitoIdentityServiceProvider();
  return dispatch => {
    dispatch(isLoading())
    return new Promise((resolve, reject) => {
      provider.resendConfirmationCode(params, function(err, result) {
        if(err) {
          dispatch(isLoading())
          dispatch(errorMessage(err.message))
          reject(err)
        } else {
          dispatch(isLoading())
          dispatch(errorMessage(""))
          resolve(result)
        }
      })
    })

  }
}

function clearErrorMessage(){
  return (dispatch) => {
    dispatch(clearMessage())
  }
}



export {
  signupRequest,
  signupSuccess,
  confirmUser,
  confirmUserAction,
  clearErrorMessage,
  resendCode
}
