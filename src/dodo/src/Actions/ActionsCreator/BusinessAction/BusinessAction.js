import { BUSINESS_FETCHED, BUSINESS_NOT_FETCHED, BUSINESS_UPDATE, BUILDING_DELETE, BUILDING_ADDED } from '../../ACTION_TYPE/ACTION_TYPE'
import { invokeApig } from '../../../Config/awsLib'


function getBusiness() {
  return invokeApig({
    path: "/listmine"
  })
}

const businessFetched = (data) => {
  return {
    type: BUSINESS_FETCHED,
    payload: data
  }
}

const buildingAdded = (data) => {
  return {
    type: BUILDING_ADDED,
    payload: data
  }
}

const buildingDeleted = (data) => {
  return {
    type: BUILDING_DELETE,
    payload: data
  }
}

const businessUpdated = (business) => {
  return {
    type: BUSINESS_UPDATE,
    payload: business
  }
}

const businessNotFetched = () => {
  return {
    type: BUSINESS_NOT_FETCHED
  }
}

function getUserBusinesses() {

  return async dispatch => {
    try {
      const data = await getBusiness()
      dispatch(businessFetched(data))
    }
    catch(e) {
      console.log(e.message);
      dispatch(businessNotFetched())
    }
  }
}

function updateBusiness(business) {
  return async dispatch => {
    dispatch(businessUpdated(business));
  }
}

function deleteBuilding(building) {
  return async dispatch => {
    dispatch(buildingDeleted(building))
  }
}

function addBuilding(building) {
  return async dispatch => {
    dispatch(buildingAdded(building))
  }
}

export {
  getUserBusinesses,
  updateBusiness,
  deleteBuilding,
  addBuilding
}
