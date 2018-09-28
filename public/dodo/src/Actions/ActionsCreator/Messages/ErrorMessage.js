import { ERROR_MESSAGE } from '../../ACTION_TYPE/ACTION_TYPE'

export function errorMessage(message) {
  return {
    type: ERROR_MESSAGE,
    payload: message
  }
}
