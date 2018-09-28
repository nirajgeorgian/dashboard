import { COGNITO_USER_ADD, COGNITO_USER_REMOVE } from '../../Actions/ACTION_TYPE/ACTION_TYPE'

export default function(state = {}, action) {
  switch(action.type) {
    case COGNITO_USER_ADD:
      return action.payload
      break
    case COGNITO_USER_REMOVE:
      return {}
      break
    default:
      return state
  }
}
