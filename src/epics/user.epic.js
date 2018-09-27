import {filter, map, switchMap} from 'rxjs/operators'
import {concat, of} from 'rxjs'
import {ajax} from 'rxjs/ajax'
import {ofType} from 'redux-observable'
import {USER_AUTH_START, USER_SIGNUP_START} from '../actionType/user.action.type'
import {
  userAuthFailureAction,
  userAuthSuccessAction,
  userSignupFailureAction,
  userSignupSuccessAction
} from '../actionCreator/user.action.creator'
import {loadingFalse, loadingTrue} from "../actionCreator/loading.action.creator";

export const loginUserEpic = (action$, state$) => {
  return action$.pipe(
    ofType(USER_AUTH_START),
    filter(action => action.payload.username !== '' && action.payload.password !== ''),
    switchMap(({payload}) => {
      const headers = {'Content-Type': 'application/json'}
      const loadingOn = of(loadingTrue(true))
      const request = ajax.post('/api/auth/login', payload, headers).pipe(
        map(loginResponse => {
          // call the success reducer
          if (loginResponse.status === 200 && loginResponse.response.success) {
            const res = {
              loggedIn: true,
              token: loginResponse.response.data
            }
            return userAuthSuccessAction(res)
          } else {
            const res = {
              error: loginResponse.response.data,
              user: payload.username
            }
            return userAuthFailureAction(res)
          }
        })
      )
      const loadingOff = of(loadingFalse(false))

      // merge both the result's
      return concat(
        loadingOn,
        request,
        loadingOff
      )
    })
  );
}

export const signupUserEpic = (action$, state$) => action$.pipe(
  ofType(USER_SIGNUP_START),
  switchMap(action => {
    const headers = { 'Content-Type': 'application/json' }
    return ajax.post('/api/auth/signup', action.payload, headers).pipe(
      map(signupResponse => {
        if(signupResponse.status === 200 && signupResponse.response.success) {
          return userSignupSuccessAction(signupResponse.response)
        } else {
          const res = {
            error: signupResponse.response.data,
            user: action.payload.username
          }
          return userSignupFailureAction(res)
        }
      })
    )
  })
)
