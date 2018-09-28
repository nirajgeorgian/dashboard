import { CURRENT_BUSINESS_LIST } from '../../ACTION_TYPE/ACTION_TYPE'
import { isLoading } from '../UIActions/isLoading'

const setCurrentBusinessList = (data) => {
  return {
    type: CURRENT_BUSINESS_LIST,
    payload: data
  }
}

function setCurrentBusinessListFunc(data) {
  return dispatch => {
    dispatch(setCurrentBusinessList(data))
  }
}

function removeCurrentBusinessListFunc() {
  return dispatch => {
    dispatch(setCurrentBusinessList({}))
  }
}

export {
  setCurrentBusinessListFunc,
  removeCurrentBusinessListFunc
}
