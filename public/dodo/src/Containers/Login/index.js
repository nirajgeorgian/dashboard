import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter, Redirect, Link } from 'react-router-dom'
import { Container, Form, Button, Input, Message, Checkbox,Modal, Icon, Header } from 'semantic-ui-react'
import AwsConfig from '../../Config/AwsConfig'
import classes from './Login.local.scss'
import { Signup } from '../'
import ForgotPassword from '../ForgotPassword'
import SocialButton from './SocialButton/index'
import { signinCallback,FacebookSigninAuth} from '../../Config/socialSignin'
import { getAwsProfile } from '../../Config/getAwsProfile'

// import actions
import { loginRequest, clearMessage, googleLogin, facebookLogin, confirmUserLogin } from '../../Actions'

class Login extends Component{
  state = {
    email: "nirajgeorgian01@gmail.com",
    password: "nirajgeorgian@N9",
    rememberMe: false,
    showSignUp:false,
    google_text:'Login with Google',
    showForgotPassword: false,
    confirmationCode: ""
    // redirectUser: false
  }

  validateForm() {
    return this.state.email.length && this.state.password.length
  }

  handleGoogleLogin = response => {
    console.log(response);
    localStorage.setItem("email",response._profile.email)
    localStorage.setItem("name",response._profile.name)
    localStorage.setItem("gender","Male")
    localStorage.setItem("date_of_birth","Feb6th2018")
    localStorage.setItem("password",'Sagepass@123')
    localStorage.setItem("id_token",response._token.idToken)
    const { from } = this.props.location.state || { from: { pathname: '/' }}
    this.props.googleLogin(response._token.idToken)
      .then(() => {

        this.props.history.push('/home');
      })
      .catch(err => {
        console.log("In Login:"+ err);
      })
  }

  handleGoogleLoginFailure = error => {
    console.log(error);
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
    if(this.props.errorMessage !== "") {
      this.props.clearMessage()
    }
  }
  handleCheck = event => {
    this.setState({
      [event.target.id]: event.target.checked
    })
  }

  handleFacebookLogin = response => {

    console.log(response);
    localStorage.setItem("email",response._profile.email)
    localStorage.setItem("name",response._profile.name)
    localStorage.setItem("gender","Male")
    localStorage.setItem("date_of_birth","Feb6th2018")
    localStorage.setItem("password",'Sagepass@123')
    localStorage.setItem("id_token",response._token.accessToken)
    const { from } = this.props.location.state || { from: { pathname: '/' }}
    this.props.facebookLogin(response._token.accessToken)
      .then(() => {

        this.props.history.push('/home');
      })
      .catch(err => {
        console.log(err);
      })
  }

  handleFacebookLoginFailure = err => {
    console.log(err);
  }


  handleFormSubmit = (e) => {
    e.preventDefault()
    // check from where the route is coming
    const { from } = this.props.location.state || { from: { pathname: '/' }}
    this.props.loginRequest(this.state.email,this.state.password)
    .then(dodo => {
      console.log(dodo);
      this.props.history.push(from.pathname)
    })
    .catch((err) => {
      console.log("err")
    })
      // .then(async () => {
      //   // this.setState(() => ({
      //   //   redirectUser: true
      //   // }))
      //   // const dodo = await getAwsProfile(this.state.email)
      // })
  }

  handleSignUpClick = e => {
    this.setState({
      showSignUp: true
    })
  }

  handleForgotPassword = event => {
    this.setState({
      showForgotPassword: true
    })
  }

  handleConfirmationCode = event => {
    this.setState({
      confirmationCode: event.target.value
    })
  }
  handleConfirmForm = event => {
    event.preventDefault()
    this.props.confirmUserLogin(this.props.showConfirm, this.state.confirmationCode)
      .then(res => this.props.loginRequest(this.state.email, this.state.password))
      .then(() => this.props.history.push("/"))
  }

  confirmModal() {
    return (
      <Modal open size="small" basic>
        <Header content="Confirmation Code" />
        <Modal.Content>
          <h3>Please check your inbox for the confirmation code.</h3>
        </Modal.Content>
        <Modal.Actions className="confirmBtn">
          <Input onChange={ this.handleConfirmationCode } placeholder="Enter confirmation code" />
          <Button loading={this.state.isLoading} color='green' inverted onClick={this.handleConfirmForm}>
            <Icon name="checkmark" />Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  render() {
    /*
      check from where the route is coming
      const { from } = this.props.location.state || { from: { pathname: '/' }}
      const { redirectUser } = this.state
      if(redirectUser === true) {
        <Redirect to='/' />
      }
    */
    if(this.props.isAutenticated === true) {
      return (
        <Redirect to='/' />
      )
    } else if(this.state.showSignUp) {
        return ( <Signup /> )
    } else if(this.state.showForgotPassword) {
      return ( <ForgotPassword /> )
    }
    else if(this.props.showConfirm){
      return (
        this.confirmModal()
      )
    }else {
      {
        return (
          <Container className="authform">
            <Form onSubmit={this.handleFormSubmit} error>
              <Form.Field>
                <label>Email</label>
                <Input
                  autoFocus
                  type = "email"
                  placeholder = "Enter your email"
                  id="email"
                  onChange = {this.handleInputChange}
                  value = {this.state.email}
                  onBlur = {this.handleInputBlur}
                  loading={this.props.isLoading}
                  onClick = {this.handleFocusChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  id="password"
                  onChange={this.handleInputChange}
                  value={this.state.password}
                  onClick = {this.handleFocusChange}
                  loading={this.props.isLoading}
                />
              </Form.Field>
              <Form.Field>
                <Checkbox label='Remember me' onChange={this.handleCheck} id="rememberMe"/>
              </Form.Field>
              { this.props.errorMessage !== ""
                ? <Message
                    error
                    header = 'Authentication Error'
                    content = { this.props.errorMessage }
                  />
                : null
              }
              <Button disabled={!this.validateForm()} loading={this.props.isLoading} type="submit">Login</Button>
              <Button className={classes.signup} onClick={this.handleSignUpClick}>Sign Up</Button>
            </Form>
            <center >
            <SocialButton
                  className={classes.social}
                  provider='google'
                  appId='154989464234-oknvq4k08qdq2ebvmesluvi1nh45rqqh.apps.googleusercontent.com'
                  onLoginSuccess={this.handleGoogleLogin}
                  onLoginFailure={this.handleGoogleLoginFailure}>
                  {this.state.google_text}
            </SocialButton>
            <SocialButton
                  provider='facebook'
                  appId='188125851781824'
                  onLoginSuccess={this.handleFacebookLogin}
                  onLoginFailure={this.handleFacebookLoginFailure}>
                  Login with facebook
            </SocialButton>
            <Button onClick={this.handleForgotPassword}>ResetPassword</Button>
            </center>
          </Container>
        )
      }
    }
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
  return bindActionCreators({ loginRequest, clearMessage, googleLogin, facebookLogin, confirmUserLogin }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
