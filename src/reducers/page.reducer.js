import {PAGE_BACKWARD, PAGE_FORWARD, PAGE_REFREST, PAGE_TRANS} from "../actionType/page.action.type";

export const pageReducer = (state = null, action) => {
  // just a helper to stop some of the network calls
  switch (action.type) {
    case PAGE_TRANS:
      return action.payload
    case PAGE_REFREST:
      return action.payload
    case PAGE_FORWARD:
      return action.payload
    case PAGE_BACKWARD:
      return action.payload
    default:
      return state
  }
}