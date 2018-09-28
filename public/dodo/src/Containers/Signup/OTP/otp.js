import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import { Modal, Header, Input, Icon, Button, Form } from 'semantic-ui-react'
import sp_logo from '../../../assests/img/sp_logo.png'
import classes from '../Signup.local.scss'

import { loginRequest, confirmUser, clearMessage, resendCode} from '../../../Actions'

class OTP extends Component {
  state = {
    isLoading: false,
    confirmationCode: "",
    tokenResent: false
  }
  validate = () => {
    return true && this.state.confirmationCode.length
  }
  handleConfirmationCode = event => {
    this.setState({
      confirmationCode: event.target.value
    })
  }
  handleFocusChange = event => {
    if(this.props.errorMessage !== "") {
      this.props.clearMessage()
    }
  }

  handleTokenResend = event => {
    this.props.resendCode(this.props.username)
      .then(() => this.setState({ tokenResent: true }))
  }
  handleConfirmForm = event => {
    this.props.handleLoginFrom()
    event.preventDefault()
    this.props.confirmUser(this.props.newUser, this.state.confirmationCode)
      .then(() => this.props.loginRequest(this.props.username, this.props.password))
      .then(() => this.props.handleOTPModalClose())
      .then(() => this.props.handleBusinessModalOpen())
      .catch(err => console.log(err))
  }

  render() {
    return (
      <Modal open={this.props.showOTP} onClose={this.props.handleOTPModalClose} className="ui coupled modal tiny signupotpmodal" dimmer={'inverted'}>
        <Modal.Header className="header">
          <center>
            <img src={sp_logo} className="logoimg fixed" />
            <a className="logoletter relative">sagepass</a>
            <div className="row"><br />E-Mail Verification</div>
          </center>
        </Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>
              <center>
                <b className="ui text green">
                  OTP (One Time Password) has been mailed to you email successfully.
                </b>
                <br />
                It is to verify your mail address and will be used to reset your password. Please check your email and enter the OTP.
              </center>
            </Header>
            <Form onSubmit={this.handleConfirmForm}>
              <Form.Field className="required trans5">
                <label>OTP Code</label>
                <Input
                  icon="user"
                  iconPosition='left'
                  loading={this.props.isLoading}
                  onChange={ this.handleConfirmationCode }
                  onClick = { this.handleFocusChange }
                  placeholder="Enter confirmation code"
                />
              </Form.Field>
              { this.props.errorMessage !== ""
                ? <center className="field row show" id="signupmessage">
                    <a className="ui red text">{this.props.errorMessage}</a>
                  </center>
                : null
              }
              <center>
                {
                    !this.state.tokenResent ?
                    <a id="forgotresendotp" className={"pointer " + classes.anchorPad} onClick={this.handleTokenResend}>Resend OTP</a>
                    : null

                }
                <Button
                  icon
                  labelPosition='right'
                  disabled={!this.validate()}
                  className="ui sgcolorhover right key icon button"
                  loading={this.state.isLoading}
                  type="submit">Confirm
                  <i className="key icon"></i>
                </Button>
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
    errorMessage: state.errorMessage
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loginRequest, confirmUser, clearMessage, resendCode }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OTP))
