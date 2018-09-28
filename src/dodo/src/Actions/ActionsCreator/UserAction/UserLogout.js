import { LOG_OUT } from '../../ACTION_TYPE/ACTION_TYPE'
import { removeBusinessList } from '../BusinessList/BusinessListAction'
import { removeCurrentBusinessListFunc } from '../currentBusinessList/currentBusinessList'
import { loginSuccess } from '../LoginAction/LoginAction'
import { cognitoUserRemove } from '../CurrentUser/CurrentUserAction'
import { signOutUser } from '../../../Config/awsLib'
import { errorMessage } from '../Messages/ErrorMessage'

const USER_LOGOUT = () => {
  return {
    type: LOG_OUT
  }
}

const userLogout = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      signOutUser()
        .then(() => {
          if(localStorage.hasOwnProperty('email')){
            localStorage.removeItem('email')
          }
          dispatch(cognitoUserRemove())
          dispatch(errorMessage(""))
          dispatch(removeBusinessList())
          dispatch(removeCurrentBusinessListFunc())
          dispatch(USER_LOGOUT())
          resolve()
        })
        .catch((e) => {
          console.log(e.message);
          dispatch(errorMessage(e.message))
          reject()
        })
    })
  }
}

const showerrorMessage = (error) => {
  return(dispatch) => {
    dispatch(errorMessage(error))
  }
}

export {
  userLogout,
  showerrorMessage
}
