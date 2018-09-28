import { PAYMENT_SUCCESSFULL, PAYMENT_FAILED } from '../../Actions/ACTION_TYPE/ACTION_TYPE'

export default function(state = false, action){
  switch(action.type){
    case PAYMENT_SUCCESSFULL:
        return true
        break
    case PAYMENT_FAILED:
        return false
        break
    default:
          return state
  }
}
