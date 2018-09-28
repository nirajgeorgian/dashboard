import { SHOW_CONFIRM, SEND_USER } from '../../Actions/ACTION_TYPE/ACTION_TYPE'

export default function(state = false, action) {
  switch (action.type) {
    case SHOW_CONFIRM:
            return action.payload
            break
    case SEND_USER:
            return action.payload
   default:
            return state
  }
}
