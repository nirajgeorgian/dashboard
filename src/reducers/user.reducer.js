import {USER_AUTH_FAILURE, USER_AUTH_START, USER_AUTH_SUCCESS} from '../actionType/user.action.type'

const initialState = {
  token: null,
  loggedIn: false
}

export const userReducer = (state = initialState, action) => {
  switch(action.type) {
    case USER_AUTH_START:
      return {
        ...state
      }
    case USER_AUTH_SUCCESS:
      return {
        ...state,
        ...action.payload
      }
    case USER_AUTH_FAILURE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
