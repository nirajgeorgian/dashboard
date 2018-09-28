import React, { Component } from 'react'
import { Header, Image, Modal } from 'semantic-ui-react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import classes from './Navbar.local.scss'
import logoImg from '../../../assests/img/sp_logo.png'
import Footer from '../../../Components/UI/Footer/index'
import SignupModal from '../../../Containers/Signup/SignupModal'
import OTP from '../../../Containers/Signup/OTP/otp'
import LoginModal from '../../../Containers/Login/LoginModal'
import ForgotModal from '../../../Containers/ForgotPassword/ForgotModal'
import BusinessModal from '../../../Containers/Business/BusinessModal'
import Loading from '../../../Components/UI/Loading/index'
// import SectionTwo from './SectionTwo/'
// import SectionThree from './SectionThree'
// import SectionFour from './SectionFour'
// import ContactSection from './ContactSection'
import { invokeApig } from '../../../Config/awsLib'

class Navbar extends Component {
	state = {
		username: '',
		password: '',
		newUser: null,
		showSignup: false,
		showLogin: false,
		showOtp: false,
		showBusinessPage: false,
		showForgotPassword: false
	}
	signupOnclick = event => {
		this.props.handleSignupModalOpen()
	}

	handleSignupModalClose = event => {
		this.props.handleSignupModalClose()
	}
	handleOTPModalOpen = event => {
		this.props.handleOTPModalOpen()
	}

	handleForgotModalOpen = event => {
		this.props.handleForgotModalOpen()
	}

	handleForgotModalClose = event => {
		this.props.handleForgotModalClose()
	}

	handleLoginModalOpen = event => {
		this.props.handleLoginModalOpen()
	}

	handleLoginModalClose = event => {
		this.props.handleLoginModalClose()
	}

	handleBusinessModalOpen = event => {
		this.props.handleBusinessModalOpen()
	}

	handleBusinessModalClose = event => {
		this.props.handleBusinessModalClose()
	}

	setUserAndPass = (user, pass, newUser) => {
		this.setState({
			username: user,
			password: pass,
			newUser: newUser
		})
	}
	render() {
		return (
			<header>
				<div className={'logobox ' + classes.landlogobox}>
					<img src={logoImg} className="logoimg" />
					<a className="logoletter">sagepass</a>
					<a className="logosmallletter">for Business</a>
				</div>
				<div className={classes.headertabs}>
					<a className="trans3">Features</a>
					<Link className="trans3" to="/pricing">
						Pricing
					</Link>
					{/* <a className="trans3">Contact</a> */}
					<Link className="trans3" to="/contact">
						Contact
					</Link>
				</div>
				<div className={classes.authbox}>
					<button
						className="ui sgcolor animate button loginbtn"
						id="landlogin"
						onClick={this.handleLoginModalOpen}
					>
						Login
					</button>
					<button
						className="ui sgcolorhover animate button getstartedbtn"
						onClick={this.signupOnclick}
					>
						Get Started
					</button>
				</div>
				{this.props.showSignupModal === true ? (
					<SignupModal
						classes={classes}
						showSignup={this.props.showSignupModal}
						handleSignupModalClose={this.handleSignupModalClose}
						handleOTPModalOpen={this.handleOTPModalOpen}
						setUserAndPass={this.setUserAndPass}
						handleLoginModalOpen={this.handleLoginModalOpen}
					/>
				) : null}
				{this.props.showOTPModal === true ? (
					<OTP
						showOTP={this.props.showOTPModal}
						handleOTPModalClose={this.props.handleOTPModalClose}
						handleBusinessModalOpen={this.props.handleBusinessModalOpen}
						username={this.state.username}
						password={this.state.password}
						newUser={this.state.newUser}
						handleLoginFrom={this.props.handleLoginFrom}
					/>
				) : null}
				{this.props.showLoginModal === true ? (
					<LoginModal
						open={this.props.showLoginModal}
						handleForgotModalOpen={this.handleForgotModalOpen}
						handleForgotModalClose={this.handleForgotModalClose}
						handleSignupModalOpen={this.signupOnclick}
						handleLoginModalClose={this.handleLoginModalClose}
						handleBusinessModalOpen={this.handleBusinessModalOpen}
						handleLoginFrom={this.props.handleLoginFrom}
						handleOTPModalOpen={this.handleOTPModalOpen}
						setUserAndPass={this.setUserAndPass}
					/>
				) : null}
				{this.props.showForgotModal === true ? (
					<ForgotModal
						showForgot={this.props.showForgotModal}
						handleForgotModalClose={this.handleForgotModalClose}
						handleBusinessModalOpen={this.handleBusinessModalOpen}
						handleLoginFrom={this.props.handleLoginFrom}
					/>
				) : null}
				{this.props.showBusinessModal === true ? (
					<BusinessModal
						showBusinessModal={this.props.showBusinessModal}
						showUserLogout={this.props.showUserLogout}
						handleBusinessModalClose={this.props.handleBusinessModalClose}
						closeOnDimmerClick={false}
					/>
				) : null}
			</header>
		)
	}
}
export default Navbar
