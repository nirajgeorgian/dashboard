import {PAGE_BACKWARD, PAGE_FORWARD, PAGE_REFREST, PAGE_TRANS} from "../actionType/page.action.type";

export const pageTrans = () => {
  return {
    type: PAGE_TRANS
  }
}

export const pageRefresh = () => {
  return {
    type: PAGE_REFREST
  }
}

export const pageForward = () => {
  return {
    type: PAGE_FORWARD
  }
}

export const pageBackward = () => {
  return {
    type: PAGE_BACKWARD
  }
}