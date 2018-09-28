import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import {
  Container,
  Form,
  Input,
  Button,
  Message,
  Modal,
  Icon,
  Header
} from 'semantic-ui-react'
import {
  forgotPasswordReset,
  userDataInformation,
  confirmPassword,
  resendToken,
  loginRequest,
  showLoading,
  showerrorMessage
} from '../../Actions/'
import { invokeApig } from '../../Config/awsLib'

import classes from './Forgot.local.scss'
import logo from '../../assests/img/sp_logo.png'

class ForgotPassword extends Component {
  state = {
    email: '',
    showEmailInput: true,
    showTokenInput: false,
    showChanged: false,
    onTokenResent: false,
    token: '',
    newPassword: '',
    confirmPassword: '',
    business_count: 0,
    showBusinessModal: false,
    provider: ''
  }

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  businesses = () => {
    return invokeApig({
      path: '/list'
    })
  }

  check_user_type = email => {
    return axios
      .post('https://testapi.sagepass.com/user/check_user', { email: email })
      .then(res => {
        const type = res.data.UserAttributes[6]
        console.log(type)
        return this.setState({ provider: type.Value })
      })
      .catch(err => console.log(err.message))
  }

  onTokenResend = event => {
    console.log(forgotPasswordReset)
    const userData = userDataInformation(this.state.email)
    this.props
      .resendToken(userData)
      .then(res => {
        this.setState({
          showEmailInput: false,
          onTokenResent: true,
          showTokenInput: true
        })
      })
      .catch(err => {
        this.setState({
          showTokenInput: false
        })
        console.log(this.props)
      })
  }

  onPasswordChangeSubmit = event => {
    event.preventDefault()
    this.setState({
      showEmailInput: false,
      showTokenInput: false,
      showChanged: true
    })
  }

  onFormSubmit = async event => {
    event.preventDefault()
    this.props.showLoading()
    await this.check_user_type(this.state.email)
    this.props.showLoading()
    // if(this.state.provider == 'social')
    // console.log(forgotPasswordReset);
    const userData = userDataInformation(this.state.email)
    this.props
      .forgotPasswordReset(userData, this.state.provider)
      .then(res => {
        this.setState({
          showEmailInput: false,
          showTokenInput: true
        })
      })
      .catch(err => {
        this.setState({
          showTokenInput: false
        })
      })
  }

  onTokenConfirm = async event => {
    event.preventDefault()
    this.props.handleLoginFrom()
    const userData = userDataInformation(this.state.email)
    this.props
      .confirmPassword(userData, this.state.token, this.state.newPassword)
      .then(res => {
        this.setState({
          showEmailInput: false,
          showTokenInput: false,
          showChanged: true
        })
        this.props
          .loginRequest(this.state.email, this.state.newPassword)
          .then(() => {
            console.log('In Forgot Modal')
            this.props.showLoading()
          })
          .then(async () => {
            const { isAutenticated } = this.props
            if (isAutenticated) {
              try {
                const data = await this.businesses()
                console.log(data.length)
                this.setState({
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
              this.props.handleForgotModalClose()
              this.props.handleBusinessModalOpen()
            } else {
              this.props.history.push('/home')
            }
          })
          .catch(err => console.log(err.message))
      })
  }

  handleForgotModalClose = () => {
    this.props.showerrorMessage('')
    this.props.handleForgotModalClose()
  }

  render() {
    //   return (
    //     <Container>
    //       <h2>Enter your email</h2>
    //       <Form onSubmit={this.state.showTokenInput == false ? this.onFormSubmit : this.onTokenConfirm} error>
    //         <Form.Field>
    //           <label>Enter your email</label>
    //           <Input
    //             type="email"
    //             id="email"
    //             onChange={this.onInputChange}
    //           />
    //         </Form.Field>
    //           {
    //             this.state.showTokenInput &&
    //             <Form.Field>
    //               <label>Your Confirmation Token</label>
    //               <Input
    //                 type="number"
    //                 id="token"
    //                 onChange={this.onInputChange}
    //               />
    //             </Form.Field>
    //           }
    //           {
    //             this.state.showTokenInput &&
    //             <Form.Field>
    //               <label>New Password</label>
    //               <Input
    //                 type="password"
    //                 id="newPassword"
    //                 onChange={this.onInputChange}
    //               />
    //             </Form.Field>
    //           }
    // { this.props.errorMessage !== ""
    //   ? <Message
    //       error
    //       header = 'Signup Error'
    //       content = { this.props.errorMessage }
    //     />
    //   : null
    // }
    //         <Button type='submit' loading={this.props.isLoading}>{this.state.showTokenInput == true ? "Confirm" : "Send Token"}</Button>
    //       </Form>
    //     </Container>
    //   )
    // }
    return (
      <Modal
        open={this.props.showForgot}
        dimmer={'inverted'}
        onClose={this.handleForgotModalClose}
        className="ui coupled modal mini forgotmodal"
      >
        <Modal.Header className="header">
          <center>
            <img src={logo} className="logoimg fixed" />
            <a className="logoletter relative">sagepass</a>
            <div className="row">
              <br />Forgot Password?
            </div>
          </center>
        </Modal.Header>
        <Modal.Content>
          <Modal.Description className="content">
            <Form error>
              {this.state.showEmailInput ? (
                <div>
                  <Form.Field className="required field">
                    <center id="forgotstatustext" className="trans5">
                      Please enter your email address to receive the OTP. It
                      will further then be used to reset the password.
                    </center>
                  </Form.Field>
                  <Form.Field className="required field trans5">
                    <label>Email</label>
                    <Input
                      autoFocus
                      type="email"
                      placeholder="Email"
                      icon="user"
                      iconPosition="left"
                      id="email"
                      loading={this.props.isLoading}
                      onClick={this.handleFocusChange}
                      onChange={this.onInputChange}
                    />
                  </Form.Field>
                  {this.props.errorMessage !== '' ? (
                    <Message negative>
                      <Message.Header>Forgot Password Error</Message.Header>
                      <p>{this.props.errorMessage}</p>
                    </Message>
                  ) : null}
                  <center>
                    <Button
                      icon
                      onClick={this.onFormSubmit}
                      labelPosition="left"
                      className="ui sgcolorhover right labeled icon button trans5"
                    >
                      Fetch OTP
                      <Icon name="key" />
                    </Button>
                  </center>
                </div>
              ) : null}
              {this.state.showTokenInput ? (
                <div>
                  <Form.Field className="required field">
                    <center className="trans5">
                      {this.state.onTokenResent ? (
                        <b className="ui green text">
                          OTP has been sent again to your mail.
                        </b>
                      ) : (
                        <div>
                          <b className="ui green text">
                            OTP has been sent to your email successfully.
                          </b>{' '}
                          Please check the mail and enter the OTP.
                        </div>
                      )}
                    </center>
                  </Form.Field>
                  <Form.Field className="required field trans5">
                    <label>OTP Code</label>
                    <Input
                      autoFocus
                      type="text"
                      placeholder="OTP Code"
                      icon="user"
                      id="token"
                      iconPosition="left"
                      loading={this.props.isLoading}
                      onClick={this.handleFocusChange}
                      onChange={this.onInputChange}
                    />
                  </Form.Field>
                  <Form.Field className="required field trans5">
                    <label>New Password</label>
                    <Input
                      type="password"
                      placeholder="New Password"
                      icon="user"
                      id="newPassword"
                      iconPosition="left"
                      loading={this.props.isLoading}
                      onClick={this.handleFocusChange}
                      onChange={this.onInputChange}
                    />
                  </Form.Field>
                  <Form.Field className="required field trans5">
                    <label>Confirm Password</label>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      icon="user"
                      id="confirmPassword"
                      iconPosition="left"
                      loading={this.props.isLoading}
                      onClick={this.handleFocusChange}
                      onChange={this.onInputChange}
                    />
                  </Form.Field>
                  {this.props.errorMessage !== '' ? (
                    <Message
                      error
                      header="Password Change Error"
                      content={this.props.errorMessage}
                    />
                  ) : null}
                  <center>
                    {!this.state.onTokenResent ? (
                      <a
                        className={'pointer ' + classes.anchorPad}
                        onClick={this.onTokenResend}
                      >
                        Resend OTP
                      </a>
                    ) : null}
                    <Button
                      icon
                      onClick={this.onTokenConfirm}
                      labelPosition="left"
                      className="ui sgcolorhover right labeled icon button trans5"
                    >
                      Submit
                      <Icon name="key" />
                    </Button>
                  </center>
                </div>
              ) : null}
              {this.state.showChanged ? (
                <div>
                  <Form.Field className="required field">
                    <center className="trans5">
                      <b className="ui green text">
                        Password has been changed successfully.
                      </b>{' '}
                      Please wait to be redirected to the home page.
                    </center>
                  </Form.Field>
                  <center>
                    <Button
                      loading={this.props.isLoading}
                      onClick={() => console.log('')}
                      className="ui sgcolorhover right labeled icon button trans5"
                    >
                      .
                    </Button>
                  </center>
                </div>
              ) : null}
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
      // </CSSTransitionGroup>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.isLoading,
    errorMessage: state.errorMessage,
    isAutenticated: state.isAutenticated
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      forgotPasswordReset,
      userDataInformation,
      confirmPassword,
      resendToken,
      loginRequest,
      showLoading,
      showerrorMessage
    },
    dispatch
  )
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
)
