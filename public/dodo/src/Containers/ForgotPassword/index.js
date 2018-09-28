import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { Container, Form, Input, Button, Message } from 'semantic-ui-react'
import { forgotPasswordReset, userDataInformation, confirmPassword } from '../../Actions/'

class ForgotPassword extends Component {
  state = {
    email: "",
    showTokenInput: false,
    token: "",
    newPassword: ""
  }
  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }
  onTokenSubmit = event => {

  }
  onFormSubmit = event => {
    console.log(this.props);
    event.preventDefault()
    // console.log(forgotPasswordReset);
    const userData = userDataInformation(this.state.email)
    this.props.forgotPasswordReset(userData)
    .then(res => {
      this.setState({
        showTokenInput: true
      })
    })
    .catch(err => {
      this.setState({
        showTokenInput: false
      })
      console.log(this.props);
    })

    // console.log(this.state);
  }
  onTokenConfirm = async event => {
    event.preventDefault()
    const userData = userDataInformation(this.state.email)
    const res = await this.props.confirmPassword(userData, this.state.token, this.state.newPassword)
    console.log("confirm button");
  }
  render() {
    return (
      <Container>
        <h2>Enter your email</h2>
        <Form onSubmit={this.state.showTokenInput == false ? this.onFormSubmit : this.onTokenConfirm} error>
          <Form.Field>
            <label>Enter your email</label>
            <Input
              type="email"
              id="email"
              onChange={this.onInputChange}
            />
          </Form.Field>
            {
              this.state.showTokenInput &&
              <Form.Field>
                <label>Your Confirmation Token</label>
                <Input
                  type="number"
                  id="token"
                  onChange={this.onInputChange}
                />
              </Form.Field>
            }
            {
              this.state.showTokenInput &&
              <Form.Field>
                <label>New Password</label>
                <Input
                  type="password"
                  id="newPassword"
                  onChange={this.onInputChange}
                />
              </Form.Field>
            }
            { this.props.errorMessage !== ""
              ? <Message
                  error
                  header = 'Signup Error'
                  content = { this.props.errorMessage }
                />
              : null
            }
          <Button type='submit' loading={this.props.isLoading}>{this.state.showTokenInput == true ? "Confirm" : "Send Token"}</Button>
        </Form>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.isLoading,
    errorMessage: state.errorMessage
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ forgotPasswordReset, userDataInformation, confirmPassword }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ForgotPassword))
