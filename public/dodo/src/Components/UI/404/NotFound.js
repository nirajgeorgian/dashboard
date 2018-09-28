import React from 'react'
import { Image, Icon } from 'semantic-ui-react'
import notfound_logo from '../../../assests/img/404.png'
import logoImg from '../../../assests/img/sp_logo.png'
import classes from './NotFound.local.scss'
import spiez_logo from '../../../assests/img/spiezlogoletter.png'
import Footer from '../Footer'
import Navbar from '../NavBar'
import { Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { compose, bindActionCreators } from 'redux'
import { userLogout } from '../../../Actions'

class NotFound extends React.Component {
  state = {
    showSignupModal: false,
    showOTPModal: false,
    showBusinessModal: false,
    showForgotModal: false,
    showLoginModal: false,
    business_count: 0,
    loading: false,
    from_login: false,
    showUserLogout: true
  }

  handleLogOut = (event, data) => {
    this.props.userLogout().then(() => {
      this.props.history.push('/')
    })
  }

  handleDropDown = event => {
    this.setState({ showDropDown: true })
  }
  hideDropDown = event => {
    this.setState({ showDropDown: false })
  }

  handleBusinessModalOpen = event => {
    this.setState({
      showBusinessModal: true
    })
  }

  handleLoginFrom = event => {
    this.setState({
      from_login: true
    })
  }

  handleBusinessModalClose = event => {
    this.setState({
      showBusinessModal: false
    })
  }

  handleSignupModalOpen = event => {
    this.setState({
      showSignupModal: true
    })
  }
  handleForgotModalOpen = event => {
    this.setState({
      showForgotModal: true
    })
  }
  handleForgotModalClose = event => {
    this.setState({
      showForgotModal: false
    })
  }

  handleLoginModalOpen = event => {
    this.setState({
      showLoginModal: true
    })
  }

  handleLoginModalClose = event => {
    this.setState({
      showLoginModal: false
    })
  }
  handleSignupModalClose = event => {
    this.setState({
      showSignupModal: false
    })
  }
  handleOTPModalOpen = event => {
    this.setState({
      showOTPModal: true
    })
  }
  handleOTPModalClose = event => {
    this.setState({
      showOTPModal: false
    })
  }

  render() {
    const { isAutenticated } = this.props.state
    const { children } = this.props
    return (
      <div className={classes.container}>
        {isAutenticated ? (
          <div className={classes.header}>
            <div className={classes.logo}>
              <Link to="/">
                <img src={logoImg} />
                <p className={classes.sagepass}>sagepass</p>
              </Link>
            </div>
            <div className="userbox">
              <div id="userlogo" className="ui pointing dropdown userlogo">
                <a href="profile" />
                <img
                  src={spiez_logo}
                  className="logoimg userlogo"
                  onClick={this.handleDropDown}
                />
                <div className="userdivide" />
                <a className={classes.username} onClick={this.handleDropDown}>
                  Spiez Web Services
                  {/* {this.props.user[4].Value} */}
                </a>
                <Dropdown
                  open={this.state.showDropDown}
                  onClose={this.hideDropDown}
                  pointing
                  icon={null}
                  className={classes.username}
                >
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={this.handleEditProfile}>
                      <a className={'item ' + classes.changeColor}>
                        <Icon className="edit" />Edit Profile
                      </a>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={this.handleAccountSettings}>
                      <a className={'item ' + classes.changeColor}>
                        <Icon className="settings" />Account Settings
                      </a>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={this.support}>
                      <a className={'item ' + classes.changeColor}>
                        <Icon className="life ring" />Support
                      </a>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={this.termsAndConditions}>
                      <a className={'item ' + classes.changeColor}>
                        <Icon className="legal" />Terms & Conditions
                      </a>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={this.handleLogOut}>
                      <a className={'item ' + classes.changeColor}>
                        <Icon className="sign out" />Logout
                      </a>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        ) : (
          <Navbar
            showSignupModal={this.state.showSignupModal}
            handleSignupModalOpen={this.handleSignupModalOpen}
            handleSignupModalClose={this.handleSignupModalClose}
            showOTPModal={this.state.showOTPModal}
            handleOTPModalOpen={this.handleOTPModalOpen}
            handleOTPModalClose={this.handleOTPModalClose}
            showForgotModal={this.state.showForgotModal}
            handleForgotModalOpen={this.handleForgotModalOpen}
            handleForgotModalClose={this.handleForgotModalClose}
            showBusinessModal={this.state.showBusinessModal}
            handleBusinessModalOpen={this.handleBusinessModalOpen}
            handleBusinessModalClose={this.handleBusinessModalClose}
            showLoginModal={this.state.showLoginModal}
            handleLoginModalOpen={this.handleLoginModalOpen}
            handleLoginModalClose={this.handleLoginModalClose}
            showUserLogout={this.state.showUserLogout}
            from_login={this.state.from_login}
            handleLoginFrom={this.handleLoginFrom}
          />
        )}
        {/* <Image alt="Page Not Found" src={notfound_logo} /> */}
        <div className={classes.body}>
          { children }
        </div>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = state => ({ state })

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ userLogout }, dispatch)
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(NotFound)
