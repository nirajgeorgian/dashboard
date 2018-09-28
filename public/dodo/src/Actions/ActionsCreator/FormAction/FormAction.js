

const One = user => {
    return {
      type: "STEP_ONE",
      payload: 11
    }
  }
  




const OneTemp = () => {
//   let user = cognitoUser(username, password)
//   return (dispatch) => {
//     dispatch(isLoading())
//     user.cognitoUser.authenticateUser(user.authenticationDetails, {
//       onSuccess: data => {
//         dispatch(setUser(user.cognitoUser))
//         dispatch(loginUser(data))
//         dispatch(loginSuccess())
//         dispatch(isLoading())
//       },
//       onFailure: error => {
//         dispatch(loginUser(error.message))
//         dispatch(isLoading())
//       }
//     })
//   }
return (dispatch) => {
    dispatch(One());
}
}

export {
  One,
  OneTemp
}
