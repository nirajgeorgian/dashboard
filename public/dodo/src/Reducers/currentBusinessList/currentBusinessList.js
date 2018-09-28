import { CURRENT_BUSINESS_LIST } from '../../Actions/ACTION_TYPE/ACTION_TYPE'

export default function(state = {}, action) {
  switch(action.type) {
    case CURRENT_BUSINESS_LIST:
      if(action.payload == undefined) {
        return state
      } else {
        return action.payload
      }
      break;
    default:
      return state
  }
}
