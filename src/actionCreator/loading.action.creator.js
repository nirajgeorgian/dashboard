import {LOADING_FALSE, LOADING_TRUE} from "../actionType/loading.action.type";

export const loadingTrue = payload => {
  return {
    type: LOADING_TRUE,
    payload: payload
  }
}

export const loadingFalse = payload => {
  return {
    type: LOADING_FALSE,
    payload: payload
  }
}