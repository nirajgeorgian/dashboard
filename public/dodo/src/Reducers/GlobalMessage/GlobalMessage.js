import { GLOBAL_MESSAGE } from '../../Actions/ACTION_TYPE/ACTION_TYPE'

export default function(state = "", action) {
  switch (action.type) {
    case GLOBAL_MESSAGE:
      return action.payload
      break;
    default:
      return state
  }
}
