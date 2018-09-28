import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import { connect } from 'react-redux'
import ProfileView from './ProfileView/ProfileView'

class Profile extends Component {
  state = {
    profileType: "view"
  }
  changeUpdateHandler = event => {
    this.setState({
      profileType: "edit"
    })
  }
  updateProfile = event => {
    event.preventDefault()
    console.log("called this");
    this.changeUpdateHandler()
  }
  render() {
    const { currentUser } = this.props
    delete currentUser[0]
    delete currentUser[1]
    delete currentUser[2]
    return (
      <Container>
        <ProfileView currentUser={currentUser} profileType={this.state.profileType} />
        <button onClick={this.state.profileType === 'view' ? this.changeUpdateHandler : this.updateProfile}>
          {this.state.profileType === 'view' ? "Edit Profile" : "Update Profile"}
        </button>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    errorMessage: state.errorMessage,
    isLoading: state.isLoading
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, null)(Profile)
