import React, { Component } from 'react'
import { Header, Image, Modal } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { API } from 'aws-amplify'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import classes from './LandingPage.local.scss'
import logoImg from '../../../assests/img/sp_logo.png'
import Footer from '../../../Components/UI/Footer/index'
import SignupModal from '../../Signup/SignupModal'
import OTP from '../../Signup/OTP/otp'
import LoginModal from '../../Login/LoginModal'
import ForgotModal from '../../ForgotPassword/ForgotModal'
import BusinessModal from '../../Business/BusinessModal'
import Loading from '../../../Components/UI/Loading/index'
import SectionTwo from './SectionTwo/'
import SectionThree from './SectionThree'
import SectionFour from './SectionFour'
import SectionFive from './SectionFive'
import { invokeApig } from '../../../Config/awsLib'
import Navbar from '../../../Components/UI/NavBar'
// class Navbar extends Component {
//   state = {
//     username: '',
//     password: '',
//     newUser: null,
//     showSignup: false,
//     showLogin: false,
//     showOtp: false,
//     showBusinessPage: false,
//     showForgotPassword: false
//   }
//   signupOnclick = event => {
//     this.props.handleSignupModalOpen()
//   }

//   handleSignupModalClose = event => {
//     this.props.handleSignupModalClose()
//   }
//   handleOTPModalOpen = event => {
//     this.props.handleOTPModalOpen()
//   }

//   handleForgotModalOpen = event => {
//     this.props.handleForgotModalOpen()
//   }

//   handleForgotModalClose = event => {
//     this.props.handleForgotModalClose()
//   }

//   handleLoginModalOpen = event => {
//     this.props.handleLoginModalOpen()
//   }

//   handleLoginModalClose = event => {
//     this.props.handleLoginModalClose()
//   }

//   handleBusinessModalOpen = event => {
//     this.props.handleBusinessModalOpen()
//   }

//   handleBusinessModalClose = event => {
//     this.props.handleBusinessModalClose()
//   }

//   setUserAndPass = (user, pass, newUser) => {
//     this.setState({
//       username: user,
//       password: pass,
//       newUser: newUser
//     })
//   }
//   render() {
//     return (
//       <header>
//         <div className={'logobox ' + classes.landlogobox}>
//           <img src={logoImg} className="logoimg" />
//           <a className="logoletter">sagepass</a>
//           <a className="logosmallletter">for Business</a>
//         </div>
//         <div className={classes.headertabs}>
//           <a className="trans3">Features</a>
//           <a className="trans3">Pricing</a>
//           <a className="trans3">Contact</a>
//         </div>
//         <div className={classes.authbox}>
//           <button
//             className="ui sgcolor animate button loginbtn"
//             id="landlogin"
//             onClick={this.handleLoginModalOpen}
//           >
//             Login
//           </button>
//           <button
//             className="ui sgcolorhover animate button getstartedbtn"
//             onClick={this.signupOnclick}
//           >
//             Get Started
//           </button>
//         </div>
//         {this.props.showSignupModal === true ? (
//           <SignupModal
//             classes={classes}
//             showSignup={this.props.showSignupModal}
//             handleSignupModalClose={this.handleSignupModalClose}
//             handleOTPModalOpen={this.handleOTPModalOpen}
//             setUserAndPass={this.setUserAndPass}
//             handleLoginModalOpen={this.handleLoginModalOpen}
//           />
//         ) : null}
//         {this.props.showOTPModal === true ? (
//           <OTP
//             showOTP={this.props.showOTPModal}
//             handleOTPModalClose={this.props.handleOTPModalClose}
//             handleBusinessModalOpen={this.props.handleBusinessModalOpen}
//             username={this.state.username}
//             password={this.state.password}
//             newUser={this.state.newUser}
//             handleLoginFrom={this.props.handleLoginFrom}
//           />
//         ) : null}
//         {this.props.showLoginModal === true ? (
//           <LoginModal
//             open={this.props.showLoginModal}
//             handleForgotModalOpen={this.handleForgotModalOpen}
//             handleForgotModalClose={this.handleForgotModalClose}
//             handleSignupModalOpen={this.signupOnclick}
//             handleLoginModalClose={this.handleLoginModalClose}
//             handleBusinessModalOpen={this.handleBusinessModalOpen}
//             handleLoginFrom={this.props.handleLoginFrom}
//             handleOTPModalOpen={this.handleOTPModalOpen}
//             setUserAndPass={this.setUserAndPass}
//           />
//         ) : null}
//         {this.props.showForgotModal === true ? (
//           <ForgotModal
//             showForgot={this.props.showForgotModal}
//             handleForgotModalClose={this.handleForgotModalClose}
//             handleBusinessModalOpen={this.handleBusinessModalOpen}
//             handleLoginFrom={this.props.handleLoginFrom}
//           />
//         ) : null}
//         {this.props.showBusinessModal === true ? (
//           <BusinessModal
//             showBusinessModal={this.props.showBusinessModal}
//             showUserLogout={this.props.showUserLogout}
//             handleBusinessModalClose={this.props.handleBusinessModalClose}
//             closeOnDimmerClick={false}
//           />
//         ) : null}
//       </header>
//     )
//   }
// }

class LandingPage extends Component {
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

	// headerOnKeyPress = event => {
	//   event.preventDefault()
	//   if (event.keyCode == 27) {
	//     this.setState({
	//       showSignupModal: false
	//     })
	//   }
	// }

	businesses = () => {
		// return invokeApig({
		//   path: '/listmine'
		// })
		return API.get('business', '/listmine')
	}

	async componentDidMount() {
		this.setState({ loading: true })
		const { isAutenticated } = this.props.state
		if (isAutenticated) {
			try {
				const data = await this.businesses()
				console.log(data.length)
				this.setState({
					business_count: data.length,
					loading: false
				})
				if (this.state.business_count == 0)
					this.setState({ showBusinessModal: true })
			} catch (e) {
				return new Error(e)
			}
		}
		// this.setState({ showBusinessModal: true})
	}

	render() {
		if (this.props.state.isAutenticated) {
			if (this.state.loading && !this.state.from_login) {
				return <Loading>Your business is loading</Loading>
			}
		}

		if (this.props.state.isAutenticated && this.state.business_count > 0) {
			return <Redirect to="/home" />
		} else {
			return (
				<div /*onKeyDown={this.headerOnKeyPress}*/>
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
					<section className={classes.landsection1}>
						<div className={classes.l1_contents}>
							<h1>For the business that needs</h1>
							<h1>to be online.</h1>
							<a>What can your business do?</a>
							<button
								className="ui sgcolorhover animate sgbtnmain button getstartedbtn"
								onClick={this.handleSignupModalOpen}
							>
								Get Started
							</button>
						</div>
					</section>
					<SectionTwo />
					<SectionThree />
					<SectionFour />
					<SectionFive />
					<div className={classes.landfooterdivider} />
					<Footer />
				</div>
			)
		}
	}
}

function mapStateToProps(state) {
	return {
		state
	}
}

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({}, dispatch)
// }

export default withRouter(
	connect(
		mapStateToProps,
		null
	)(LandingPage)
)
