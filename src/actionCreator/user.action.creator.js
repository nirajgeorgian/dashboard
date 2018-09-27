import {
  USER_AUTH_START, USER_AUTH_SUCCESS, USER_AUTH_FAILURE,
  USER_SIGNUP_START, USER_SIGNUP_SUCCESS, USER_SIGNUP_FAILURE
} from '../actionType/user.action.type'

/*
  loading: true *=> we have to set this in the state
 */
export const userAuthStartAction = payload => {
  return {
    type: USER_AUTH_START,
    payload
  }
}

export const userSignupStartAction = payload => {
  return {
    type: USER_SIGNUP_START,
    payload
  }
}

/*
  payload = { loggedIn: true, username: 'somevalue' }
 */
export const userAuthSuccessAction = payload => {
  return {
    type:  USER_AUTH_SUCCESS,
    payload
  }
}

export const userSignupSuccessAction = payload => {
  return {
    type: USER_SIGNUP_SUCCESS,
    payload
  }
}

/*
  payload.user = { loggedIn: false, username: null }
  payload.error = "some error message"
 */
export const userAuthFailureAction = payload => {
  return {
    type: USER_AUTH_FAILURE,
    user: payload.user,
    error: payload.error
  }
}

export const userSignupFailureAction = payload => {
  return {
    type: USER_SIGNUP_FAILURE,
    user: payload.user,
    error: payload.error
  }
}
