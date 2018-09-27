import {ERROR_SET, ERROR_UNSET} from "../actionType/error.action.type";

export const errorReducer = (state = null, action) => {
  switch (action.type) {
    case ERROR_SET:
      return action.payload
    case ERROR_UNSET:
      return action.payload
    default:
      return state
  }
}