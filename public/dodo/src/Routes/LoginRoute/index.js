import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'

class LoginRoute extends Component {
  render() {

    return (
      <Route { ...orProps } render = { props => {

          }
        }
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    state: state
  }
}

export default connect(mapStateToProps, null)(LoginRoute)
