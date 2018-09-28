import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Container,
  Checkbox,
  Form,
  Button,
  Select,
  Modal,
  Icon,
  Header,
  Input,
  Message,
  Dropdown
} from 'semantic-ui-react'
import Datetime from 'react-datetime'
import moment from 'moment'
import classes from './Signup.local.scss'
import './DatePicker.scss'
import sp_logo from '../../assests/img/sp_logo.png'

// import actions
import {
  signupRequest,
  clearMessage,
  confirmUser,
  loginRequest,
  googleLogin,
  facebookLogin,
  clearErrorMessage,
  showerrorMessage
} from '../../Actions'

import SocialButton from '../Login/SocialButton'

// Gender Object For Select Element
const gender = [
  { key: 'male', value: 'Male', text: 'Male' },
  { key: 'female', value: 'Female', text: 'Female' },
  { key: 'Other', value: 'Other', text: 'Other' }
]

class SignupModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      birthdate: moment(),
      gender: 'Male',
      checkbox: false,
      isLoading: false,
      newUser: null,
      date_picker: false
    }
  }

  monthMap = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  componentDidMount() {
    this.props.clearMessage()
  }
  validateForm = () => {
    const validate =
      this.state.firstname.length &&
      this.state.lastname.length &&
      this.state.email.length &&
      this.state.password.length &&
      this.state.gender.length &&
      this.state.checkbox
    return validate
  }
  handleInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }
  handleDateChange = date => {
    this.setState({
      birthdate: date.format('MM,DD,YYYY')
    })
  }

  renderMonth = ({ className, ...props }, month, year, selectedDate) => {
    const sixYearAgo = moment().subtract(6, 'year')
    const eightyYearAgo = moment().subtract(80, 'year')

    console.log(sixYearAgo.year(), year)
    if (sixYearAgo.year() < year) {
      return (
        <td
          className={className + ' ' + classes.disabledCalenderItem}
          {...props}
        >
          {this.monthMap[month]}
        </td>
      )
    } else if (eightyYearAgo.year() > year) {
      return (
        <td
          className={className + ' ' + classes.disabledCalenderItem}
          {...props}
        >
          {this.monthMap[month]}
        </td>
      )
    } else if (sixYearAgo.year() === year && sixYearAgo.month() < month) {
      return (
        <td
          className={className + ' ' + classes.disabledCalenderItem}
          {...props}
        >
          {this.monthMap[month]}
        </td>
      )
    } else if (eightyYearAgo.year() === year && eightyYearAgo.month() > month) {
      return (
        <td
          className={className + ' ' + classes.disabledCalenderItem}
          {...props}
        >
          {this.monthMap[month]}
        </td>
      )
    }
    return (
      <td className={className} {...props}>
        {this.monthMap[month]}
      </td>
    )
  }

  renderYear = ({ className, ...props }, year, selectedDate) => {
    const sixYearAgo = moment().subtract(6, 'year')
    const eightyYearAgo = moment().subtract(80, 'year')
    if (sixYearAgo.year() < year)
      return (
        <td
          className={className + ' ' + classes.disabledCalenderItem}
          {...props}
        >
          {year}
        </td>
      )
    else if (eightyYearAgo.year() > year)
      return (
        <td
          className={className + ' ' + classes.disabledCalenderItem}
          {...props}
        >
          {year}
        </td>
      )
    return (
      <td className={className} {...props}>
        {year}
      </td>
    )
  }
  renderDate = ({ className, ...props }, currentDate, selectedDate) => {
    const sixYearAgo = moment().subtract(6, 'year')
    const eightyYearAgo = moment().subtract(80, 'year')
    if (sixYearAgo < currentDate)
      return (
        <td
          className={className + ' ' + classes.disabledCalenderItem}
          {...props}
        >
          {currentDate.date()}
        </td>
      )
    else if (eightyYearAgo > currentDate)
      return (
        <td
          className={className + ' ' + classes.disabledCalenderItem}
          {...props}
        >
          {currentDate.date()}
        </td>
      )
    return (
      <td className={className} {...props}>
        {currentDate.date()}
      </td>
    )
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
          this.props.handleSignupModalClose()
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
          this.props.handleSignupModalClose()
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

  handleFocusChange = event => {
    if (this.props.errorMessage !== '') {
      this.props.clearMessage()
    }
  }
  handleCheckbox = (event, data) => {
    this.setState({
      [data.id]: data.checked
    })
  }
  handleDropbox = (event, data) => {
    this.setState({
      [data.id]: data.value
    })
  }
  handleForm = event => {
    event.preventDefault()
    if (this.state.checkbox) {
      this.props
        .signupRequest(this.state)
        .then(res => this.setState({ newUser: res }))
        .then(() =>
          this.props.setUserAndPass(
            this.state.email,
            this.state.password,
            this.state.newUser
          )
        )
        .then(() => {
          this.props.handleSignupModalClose()
        })
        .then(() => {
          this.props.handleOTPModalOpen()
        })
        .catch(err => console.log(err.message))
    }
  }

  handleSignupModalClose = event => {
    this.props.showerrorMessage('')
    this.props.handleSignupModalClose()
  }

  handleAnchor = event => {
    this.props.handleSignupModalClose()
    this.props.handleLoginModalOpen()
  }
  render() {
    return (
      <Modal
        open={this.props.showSignup}
        className="ui coupled modal tiny"
        dimmer={'inverted'}
        onClose={this.handleSignupModalClose}
      >
        <Modal.Header className="header">
          <center>
            <img src={sp_logo} className="logoimg fixed" />
            <a className="logoletter relative">sagepass</a>
          </center>
        </Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <div className={classes.socialLiginBtnContainer}>
              {/* <center className={classes.social}> */}
              <SocialButton
                provider="facebook"
                appId="188125851781824"
                onLoginSuccess={this.handleFacebookLogin}
                onLoginFailure={this.handleFacebookLoginFailure}
                className={'ui facebook button'}
              >
                <div className={classes.socialLoginBtn}>
                  <i className="facebook icon" />
                  Login with Facebook
                </div>
              </SocialButton>
              {/* </center> */}
              {/* <center className={classes.social}> */}
              <SocialButton
                provider="google"
                appId="864308516869-qncjb0nbu0it4orc2f8iebhknblubr9n.apps.googleusercontent.com"
                onLoginSuccess={this.handleGoogleLogin}
                onLoginFailure={this.handleGoogleLoginFailure}
                className={'ui google plus button'}
              >
                <div className={classes.socialLoginBtn}>
                  <i className="google plus icon" />
                  Login with Google
                </div>
              </SocialButton>
              {/* </center> */}
            </div>

            <Form onSubmit={this.handleForm} error>
              <Form.Field>
                <center>Please fill the below details to start with us.</center>
              </Form.Field>
              <Form.Group widths="equal">
                <Form.Field className="required">
                  <label>First Name</label>
                  <Input
                    autoFocus
                    type="text"
                    placeholder="First Name"
                    id="firstname"
                    onChange={this.handleInputChange}
                    onClick={this.handleFocusChange}
                    loading={this.props.isLoading}
                  />
                </Form.Field>
                <Form.Field className="required">
                  <label>Last Name</label>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    id="lastname"
                    onChange={this.handleInputChange}
                    onClick={this.handleFocusChange}
                    loading={this.props.isLoading}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field className="required">
                  <label>Email Address</label>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    id="email"
                    onChange={this.handleInputChange}
                    onClick={this.handleFocusChange}
                    loading={this.props.isLoading}
                  />
                </Form.Field>
                <Form.Field className="required">
                  <label>Password</label>
                  <Input
                    type="password"
                    placeholder="Password"
                    id="password"
                    onChange={this.handleInputChange}
                    onClick={this.handleFocusChange}
                    loading={this.props.isLoading}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field className="required">
                  <label>Date of Birth</label>
                  <Datetime
                    viewMode="years"
                    open={this.state.date_picker}
                    renderInput={(props, openCalendar, closeCalendar) => (
                      <Input icon="calendar" iconPosition="left" {...props} />
                    )}
                    renderDay={this.renderDate}
                    renderYear={this.renderYear}
                    renderMonth={this.renderMonth}
                    closeOnSelect={true}
                    inputProps={{ placeholder: 'Date of Birth' }}
                    onChange={this.handleDateChange}
                    dateFormat="MMM Do YYYY"
                    timeFormat={false}
                    onClick={this.handleFocusChange}
                  />
                </Form.Field>
                <Form.Field className="required">
                  <label>Gender</label>
                  <Dropdown
                    fluid
                    selection
                    id="gender"
                    options={gender}
                    placeholder="Select Gender"
                    onChange={this.handleDropbox}
                    loading={this.props.isLoading}
                  />
                </Form.Field>
              </Form.Group>
              <div className="required field">
                <div className="ui checkbox">
                  <Checkbox
                    id="checkbox"
                    label="I agree to the Terms of Service."
                    onChange={this.handleCheckbox}
                  />
                </div>
              </div>
              {this.props.errorMessage !== '' ? (
                <center className="field row show" id="signupmessage">
                  <a className="ui red text">{this.props.errorMessage}</a>
                </center>
              ) : null}
              <center>
                <Button
                  icon
                  loading={this.state.isLoading}
                  labelPosition="right"
                  disabled={!this.validateForm()}
                  type="submit"
                  className="ui sgcolorhover right key icon button"
                >
                  Signup<i className="key icon" />
                </Button>
                {/* <Button className={classes.login} onClick={this.handleLoginClick}>Log In</Button> */}
                <a
                  className="pointer"
                  id="existingaccountbtn"
                  onClick={this.handleAnchor}
                >
                  Already having an account?
                </a>
              </center>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }
}
//

function mapStateToProps(state) {
  return {
    isLoading: state.isLoading,
    isAutenticated: state.isAutenticated,
    errorMessage: state.errorMessage
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loginRequest,
      confirmUser,
      signupRequest,
      clearMessage,
      clearMessage,
      googleLogin,
      facebookLogin,
      showerrorMessage
    },
    dispatch
  )
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SignupModal)
)
