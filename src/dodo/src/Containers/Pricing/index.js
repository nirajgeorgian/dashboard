import React from 'react'
import Navbar from '../../Components/UI/NavBar'
import {
	Icon,
	Form,
	Input,
	TextArea,
	Button,
	Popup,
	Header
} from 'semantic-ui-react'
import classes from './Pricing.local.scss'
import Footer from '../../Components/UI/Footer'
import SectionOne from './SectionOne'

class Pricing extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
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
	}

	componentDidMount() {
		// document.documentElement.scrollTop = 0
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
		return (
			<div>
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
				<section className={classes.form_container}>
					<SectionOne />
					<Footer />
				</section>
			</div>
		)
	}
}

export default Pricing
