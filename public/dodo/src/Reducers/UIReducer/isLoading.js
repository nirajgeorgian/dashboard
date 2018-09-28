import { IS_LOADING } from '../../Actions/ACTION_TYPE/ACTION_TYPE'

export default function(state = false, action) {
  switch (action.type) {
    case IS_LOADING:
      return !state
      break;
    default:
      return state
  }
}
