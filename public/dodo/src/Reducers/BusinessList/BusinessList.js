import { BUSINESS_LIST } from '../../Actions/ACTION_TYPE/ACTION_TYPE'

export default function(state = [], action) {
  switch (action.type) {
    case BUSINESS_LIST:
      return action.payload
      break;
    default:
      return state
  }
}
