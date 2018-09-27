import { combineEpics } from 'redux-observable'
/*
  import all the epics and combine into one just like root reducer
 */
import { loginUserEpic } from './user.epic'

export const rootEpics = combineEpics(loginUserEpic)
