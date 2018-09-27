import {LOADING_FALSE, LOADING_TRUE} from "../actionType/loading.action.type";

export const loadingReducer = (state = false, action) => {
  switch (action.type) {
    case LOADING_TRUE:
      return action.payload
    case LOADING_FALSE:
      return action.payload
    default:
      return state
  }
}