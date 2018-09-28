// import the action creators
import { API } from 'aws-amplify';
import { BUSINESS_LIST } from '../../ACTION_TYPE/ACTION_TYPE'
import { isLoading } from '../UIActions/isLoading'

function getBusiness() {
  return API.get("business", "/listmine")
}

const setBusinessList = (data) => {
  return {
    type: BUSINESS_LIST,
    payload: data
  }
}

function getBusinessesList() {
  return async dispatch => {
    try {
      dispatch(isLoading())
      const list = await getBusiness()
      dispatch(setBusinessList(list))
      dispatch(isLoading())
    } catch (e) {
      console.error(e);
    }
  }
}

function removeBusinessList() {
  return async dispatch => {
    dispatch(setBusinessList([]))
  }
}

export {
  getBusinessesList,
  removeBusinessList
}
