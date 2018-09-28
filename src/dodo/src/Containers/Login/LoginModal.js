import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter, Redirect, Link } from 'react-router-dom'
import {
  Container,
  Form,
  Button,
  Input,
  Message,
  Checkbox,
  Modal,
  Icon,
  Header
} from 'semantic-ui-react'
import AwsConfig from '../../Config/AwsConfig'
import classes from './Login.local.scss'
import { Signup } from '../'
import ForgotPassword from '../ForgotPassword'
import SocialButton from './SocialButton/index'
import { signinCallback, FacebookSigninAuth } from '../../Config/socialSignin'
import cognitoUser from '../../Config/cognitoUser'
import { getAwsProfile } from '../../Config/getAwsProfile'
import logo from '../../assests/img/sp_logo.png'
import { invokeApig } from '../../Config/awsLib'

// import actions
import {
  loginRequest,
  clearMessage,
  googleLogin,
  facebookLogin,
  confirmUserLogin,
  showerrorMessage
} from '../../Actions'
import { getBusinessesList } from '../../Actions/ActionsCreator/BusinessList/BusinessListAction'
import { showLoading } from '../../Actions/ActionsCreator/LoginAction/LoginAction'

class LoginModal extends Component {
  state = {
    email: 'nirajgeorgian01@gmail.com',
    password: 'nirajgeorgian@N9',
    rememberMe: false,
    showSignUp: false,
    google_text: 'Login with Google',
    showForgotPassword: false,
    confirmationCode: '',
    businessCount: 0,
    showBusinessModal: false
    // redirectUser: false
  }

  validateForm() {
    return this.state.email.length && this.state.password.length
  }

  businesses = () => {
    return invokeApig({
      path: '/listmine'
    })
  }

  handleGoogleLogin = response => {
    // console.log(response);
    localStorage.setItem('email', response._profile.email)
    localStorage.setItem('name', response._profile.name)
    localStorage.setItem('gender', 'Male')
    localStorage.setItem('date_of_birth', 'Feb6th2018')
    localStorage.setItem('password', 'Sagepass@123')
    localStorage.setItem('id_token', response._token.idToken)
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    this.props.handleLoginFrom()
    this.props
      .googleLogin(response._token.idToken)
      .then(() => {
        this.props.showLoading()
      })
      .then(async () => {
        const { isAutenticated } = this.props
        if (isAutenticated) {
          try {
            const data = await this.businesses()
            console.log(data.length)
            this.setState({
              businesses: {
                ...data
              },
              business_count: data.length
            })
            if (this.state.business_count === 0)
              this.setState({ showBusinessModal: true })
            // this.props.handleLoginFrom()
          } catch (e) {
            return new Error(e)
          }
        }
      })
      .then(() => {
        this.props.showLoading()
        if (this.state.showBusinessModal === true) {
          this.props.handleLoginModalClose()
          this.props.handleBusinessModalOpen()
        } else {
          // console.log("dont return here");
          this.props.history.push('/home')
        }
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  handleGoogleLoginFailure = error => {
    console.log(error)
  }
  handleInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }
  handleInputBlur = event => {
    // console.log(event.target.value)
  }

  handleFocusChange = event => {
    if (this.props.errorMessage !== '') {
      this.props.clearMessage()
    }
  }
  handleCheck = event => {
    this.setState({
      [event.target.id]: event.target.checked
    })
  }

  handleFacebookLogin = response => {
    console.log(response)
    localStorage.setItem('email', response._profile.email)
    localStorage.setItem('name', response._profile.name)
    localStorage.setItem('gender', 'Male')
    localStorage.setItem('date_of_birth', 'Feb6th2018')
    localStorage.setItem('password', 'Sagepass@123')
    localStorage.setItem('id_token', response._token.accessToken)
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    this.props.handleLoginFrom()
    this.props
      .facebookLogin(response._token.accessToken)
      .then(() => this.props.showLoading())
      .then(async () => {
        const { isAutenticated } = this.props
        if (isAutenticated) {
          try {
            const data = await this.businesses()
            console.log(data.length)
            this.setState({
              businesses: {
                ...data
              },
              business_count: data.length
            })
            if (this.state.business_count == 0)
              this.setState({ showBusinessModal: true })
          } catch (e) {
            return new Error(e)
          }
        }
      })
      .then(() => {
        this.props.showLoading()
        if (this.state.showBusinessModal == true) {
          this.props.handleLoginModalClose()
          this.props.handleBusinessModalOpen()
        } else {
          this.props.history.push('/home')
        }
      })
      .catch(err => {
        console.log('In Login:' + err)
      })
  }

  handleFacebookLoginFailure = err => {
    console.log(err)
  }

  handleFormSubmit = e => {
    console.log('From submit')
    e.preventDefault()
    let user = new cognitoUser(this.state.email, this.state.password)
    this.props.handleLoginFrom()
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    this.props
      .loginRequest(this.state.email, this.state.password)
      .then(() => {
        this.props.showLoading()
      })
      .then(async () => {
        console.log('Above isAutenticated')
        const { isAutenticated } = this.props
        if (isAutenticated) {
          try {
            const data = await this.businesses()
            await this.props.getBusinessesList()
            this.setState({
              businesses: {
                ...data
              },
              business_count: data.length
            })
            if (this.state.business_count === 0)
              this.setState({ showBusinessModal: true })
          } catch (e) {
            return new Error(e)
          }
        }
      })
      .then(() => {
        this.props.showLoading()
        if (this.state.showBusinessModal === true) {
          this.props.handleLoginModalClose()
          this.props.handleBusinessModalOpen()
        } else {
          this.props.history.push('/home')
        }
      })
      .catch(err => {
        if (err.message === 'User is not confirmed.') {
          this.props.setUserAndPass(
            this.state.email,
            this.state.password,
            user.cognitoUser
          )
          this.props.handleLoginModalClose()
          this.props.handleOTPModalOpen()
        }
        console.log(err.message)
      })
  }

  handleSignUpClick = event => {
    event.preventDefault()
    this.props.handleLoginModalClose()
    this.props.handleSignupModalOpen()
  }

  handleForgotPassword = event => {
    this.setState({
      showForgotPassword: true
    })
  }

  handleConfirmationCode = event => {
    this.props.showerrorMessage('')
    this.setState({
      confirmationCode: event.target.value
    })
  }
  handleConfirmForm = event => {
    event.preventDefault()
    this.props
      .confirmUserLogin(this.props.showConfirm, this.state.confirmationCode)
      .then(res =>
        this.props.loginRequest(this.state.email, this.state.password)
      )
      .then(() => this.props.history.push('/'))
  }

  confirmModal() {
    return (
      <Modal open size="small" basic>
        <Header content="Confirmation Code" />
        <Modal.Content>
          <h3>Please check your inbox for the confirmation code.</h3>
        </Modal.Content>
        <Modal.Actions className="confirmBtn">
          <Input
            onChange={this.handleConfirmationCode}
            placeholder="Enter confirmation code"
          />
          <Button
            loading={this.state.isLoading}
            color="green"
            inverted
            onClick={this.handleConfirmForm}
          >
            <Icon name="checkmark" />Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  handleClose = event => {
    this.props.showerrorMessage('')
    this.props.handleLoginModalClose()
  }

  handleAnchor = e => {
    this.props.handleLoginModalClose()
    this.props.handleForgotModalOpen()
  }

  handleOnKeyDown = event => {
    console.log('Rohan')
    if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      this.handleFormSubmit()
    }
  }
  render() {
    // if(this.props.showConfirm !== null || "")
    return (
      <Modal
        open={this.props.open}
        onClose={this.handleClose}
        dimmer={'inverted'}
        className="ui coupled modal mini loginmodal"
      >
        <Modal.Header className="header">
          <center>
            <img src={logo} className="logoimg fixed" />
            <a className="logoletter relative">sagepass</a>
          </center>
        </Modal.Header>
        <Modal.Content>
          <Modal.Description className="content">
            <center>
              <SocialButton
                className="ui facebook button"
                provider="facebook"
                appId="188125851781824"
                onLoginSuccess={this.handleFacebookLogin}
                onLoginFailure={this.handleFacebookLoginFailure}
              >
                <div style={{ width: '11rem' }}>
                  <i className="facebook icon" />
                  Login with Facebook
                </div>
              </SocialButton>
            </center>
            <center className={classes.social}>
              <SocialButton
                className="ui google plus button"
                provider="google"
                appId="864308516869-qncjb0nbu0it4orc2f8iebhknblubr9n.apps.googleusercontent.com"
                onLoginSuccess={this.handleGoogleLogin}
                onLoginFailure={this.handleGoogleLoginFailure}
              >
                <div style={{ width: '11rem' }}>
                  <i className="google plus icon" />
                  Login with Google
                </div>
              </SocialButton>
            </center>
            <Form onSubmit={this.handleFormSubmit} error>
              <Form.Field className="required field">
                <label>Email</label>
                <Input
                  icon="user"
                  iconPosition="left"
                  type="email"
                  placeholder="Email Address"
                  id="email"
                  onChange={this.handleInputChange}
                  value={this.state.email}
                  onBlur={this.handleInputBlur}
                  loading={this.props.isLoading}
                  onClick={this.handleFocusChange}
                />
              </Form.Field>
              <Form.Field className="required field">
                <label>Password</label>
                <Input
                  type="password"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  id="password"
                  onChange={this.handleInputChange}
                  value={this.state.password}
                  onClick={this.handleFocusChange}
                  loading={this.props.isLoading}
                />
              </Form.Field>
              <Form.Field>
                <Checkbox
                  label="Remember me on this device"
                  onChange={this.handleCheck}
                  id="rememberMe"
                />
              </Form.Field>
              {this.props.errorMessage !== '' ? (
                <center className="field row show" id="loginmessage">
                  <a className="ui red text">{this.props.errorMessage}</a>
                </center>
              ) : null}
              <center>
                <Button
                  disabled={!this.validateForm()}
                  icon
                  labelPosition="left"
                  loading={this.props.isLoading}
                  type="submit"
                  className="ui positive right labeled icon button"
                >
                  Login
                  <Icon name="checkmark" />
                </Button>
                <Button
                  size="small"
                  icon
                  onClick={this.handleSignUpClick}
                  labelPosition="left"
                  className="ui sgcolorhover right labeled icon button"
                >
                  Sign Up
                  <Icon name="signup" />
                </Button>
                <div className={classes.forgotpass}>
                  <a
                    id="forgotpassword"
                    className="pointer"
                    onClick={this.handleAnchor}
                  >
                    Forgot Password?
                  </a>
                </div>
              </center>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.isLoading,
    isAutenticated: state.isAutenticated,
    errorMessage: state.errorMessage,
    showConfirm: state.showConfirm
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loginRequest,
      clearMessage,
      googleLogin,
      facebookLogin,
      confirmUserLogin,
      showLoading,
      showerrorMessage,
      getBusinessesList
    },
    dispatch
  )
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LoginModal)
)
