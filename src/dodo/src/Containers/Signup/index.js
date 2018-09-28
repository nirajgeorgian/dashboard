import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Container, Form, Button, Select, Modal, Icon, Header, Input, Message } from 'semantic-ui-react'
import Datetime from 'react-datetime'
import moment from 'moment'
import classes from './Signup.local.scss'
import { Login } from '../'

// import actions
import { signupRequest, clearMessage, confirmUser, loginRequest, clearErrorMessage } from '../../Actions'

// Gender Object For Select Element
const gender = [
  { key: 'male', value: "Male", text: "Male"},
  { key: 'female', value: "Female", text: "Female"},
  { key: 'Other', value: "Other", text: "Other"},
]

class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      birthdate: moment(),
      gender: "",
      isLoading: false,
      newUser: null,
      confirmationCode: "",
      showLogin: false,
    }
  }

  componentDidMount(){
    this.props.clearMessage();
  }
  validateForm = () => {
    const validate = this.state.firstname.length &&
           this.state.lastname.length &&
           this.state.email.length &&
           this.state.password.length &&
           this.state.gender.length
    return validate
  }
  handleInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }
  handleDateChange = (date) => {
    this.setState({
      birthdate: date.format("MM,DD,YYYY")
    })
  }
  handleSelectChage = event => {
    if(event.target.lastChild) {
      this.setState({
        [event.target.parentElement.parentElement.getAttribute("id")]: event.target.lastChild.innerHTML
      })
    }
  }
  handleFocusChange = event => {
    if(this.props.errorMessage !== "") {
      this.props.clearMessage()
    }
  }
  handleForm = event => {
    event.preventDefault()
    this.props.signupRequest(this.state)
    .then(res => this.setState({ newUser: res }))
    .catch(err => console.log(err))
    // .then(() => this.setState({ newUser: true }))
  }
  handleConfirmationCode = event => {
    this.setState({
      confirmationCode: event.target.value
    })
  }
  handleConfirmForm = event => {
    event.preventDefault()
    this.props.confirmUser(this.state.newUser, this.state.confirmationCode)
      .then(res => this.props.loginRequest(this.state.email, this.state.password))
      .then(() => this.props.history.push("/"))
  }
  handleLoginClick = e => {
    this.setState({ showLogin: true})
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
  signupForm() {
    if(this.state.showLogin){
      return <Login />
    }
    else {
      return (
        <Form onSubmit={this.handleForm} error>
          <Form.Field>
            <label>Firstname</label>
            <Input
              autoFocus
              type="text"
              placeholder="enter your firstname"
              id="firstname"
              onChange={this.handleInputChange}
              onClick = { this.handleFocusChange }
              loading={this.props.isLoading}
            />
          </Form.Field>
          <Form.Field>
            <label>Lastname</label>
            <Input
              type="text"
              placeholder="enter your lastname"
              id="lastname"
              onChange={this.handleInputChange}
              onClick = { this.handleFocusChange }
              loading={this.props.isLoading}
            />
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <Input
              type="email"
              placeholder="enter your email"
              id="email"
              onChange={this.handleInputChange}
              onClick = { this.handleFocusChange }
              loading={this.props.isLoading}
            />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <Input
              type="password"
              placeholder="enter your password"
              id="password"
              onChange={this.handleInputChange}
              onClick = { this.handleFocusChange }
              loading={this.props.isLoading}
            />
          </Form.Field>
          <Form.Field>
            <label>Your Gender</label>
            <Select
              placeholder="Choose Your Gender"
              options={gender} id="gender"
              onChange={this.handleSelectChage}
              onClick = { this.handleFocusChange }
              loading={this.props.isLoading}
            />
          </Form.Field>
          <Form.Field>
            <label>Select Your Date Of Birth</label>
            <Datetime
              inputProps={{ placeholder: 'Choose your Date Of Birth'}}
              onChange={this.handleDateChange}
              dateFormat="MMM Do YYYY"
              timeFormat={false}
              onClick = { this.handleFocusChange }
            />
          </Form.Field>
          { this.props.errorMessage !== ""
            ? <Message
                error
                header = 'Signup Error'
                content = { this.props.errorMessage }
              />
            : null
          }
          <Button loading={this.state.isLoading} disabled={!this.validateForm()} type="submit">Signup</Button>
          <Button className={classes.login} onClick={this.handleLoginClick}>Log In</Button>
        </Form>
      )
    }
  }
  render() {
    return (
      <Container className="authform">
        {this.state.newUser === null
          ? this.signupForm()
          : this.confirmModal()
        }
      </Container>
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
  // return none
  return bindActionCreators({ loginRequest, confirmUser, signupRequest, clearMessage, clearMessage }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signup))
