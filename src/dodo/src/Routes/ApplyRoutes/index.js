import React from 'react'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

const ApplyRoutes = ({ component: C, props: childProps, ...rest }) => {
  // console.log('rest', rest)
  return (
    <Route
      {...rest}
      render={props => {
        /*
      rest.isAutenticated === true
      ? console.log(true)
      : console.log(false)
    */
        return <C {...props} {...childProps} />
      }}
    />
  )
}
function mapStateToProps(state) {
  return {
    isAutenticated: state.isAutenticated
  }
}

export default withRouter(connect(mapStateToProps, null)(ApplyRoutes))
