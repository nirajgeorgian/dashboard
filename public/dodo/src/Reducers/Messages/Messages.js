import { ERROR_MESSAGE, CLEAR_MESSAGE } from '../../Actions/ACTION_TYPE/ACTION_TYPE'

export default function(state = "", action) {
  switch (action.type) {
    case ERROR_MESSAGE:
      return action.payload
      break
    case CLEAR_MESSAGE:
      return ""
      break
    default:
      return state
  }
}
