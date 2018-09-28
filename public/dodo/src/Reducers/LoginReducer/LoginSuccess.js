import { LOGIN_SUCCESS, LOG_OUT, SIGNUP_SUCCESS, CONFIRM_USER, FORGOT_PASSWORD } from '../../Actions/ACTION_TYPE/ACTION_TYPE'
import { signOutUser } from '../../Config/awsLib'

export default function(state = false, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return true
      break;
    case LOG_OUT:
      signOutUser()
      return false
      break;
    case SIGNUP_SUCCESS:
      return false
      break;
    case CONFIRM_USER:
      return false
      break
    case FORGOT_PASSWORD:
      return false
      break
    default:
      return state
  }
}
