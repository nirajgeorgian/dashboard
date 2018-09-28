import { GLOBAL_MESSAGE } from '../../ACTION_TYPE/ACTION_TYPE'
import { API } from 'aws-amplify';

const setGlobalMessageAction = data => {
  return {
    type: GLOBAL_MESSAGE,
    payload: data
  }
}

function setGlobalMessage(data, id) {
  return dispatch => {
    dispatch(setGlobalMessageAction(data))
  }
}

export {
  setGlobalMessage
}
