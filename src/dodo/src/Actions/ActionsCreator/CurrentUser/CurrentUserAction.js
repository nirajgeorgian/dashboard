import { COGNITO_USER_REMOVE, COGNITO_USER_ADD } from '../../ACTION_TYPE/ACTION_TYPE'

function cognitoUserAdd(userData) {
  return {
    type: COGNITO_USER_ADD,
    payload: userData
  }
}

function cognitoUserRemove() {
  return {
    type: COGNITO_USER_REMOVE
  }
}

export {
  cognitoUserAdd,
  cognitoUserRemove
}
