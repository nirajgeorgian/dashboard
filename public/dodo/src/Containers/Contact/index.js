import React from 'react'
import Navbar from '../../Components/UI/NavBar'
import { Icon, Form, Input, TextArea, Button, Popup } from 'semantic-ui-react'
import classes from './Contact.local.scss'
import Footer from '../../Components/UI/Footer'
const Recaptcha = require('react-recaptcha')

const sitekey = '6LdbHGMUAAAAACv_3FPTZa2Nxs-tWXTStzIggJqS'

const verifyCallback = response => {
	console.log(response)
}

const expiredCallback = () => {
	console.log(`Recaptcha expired`)
}

// define a variable to store the recaptcha instance
let recaptchaInstance

// handle reset
const resetRecaptcha = () => {
	recaptchaInstance.reset()
}

const initialData = {
	name: '',
	email: '',
	number: '',
	message: ''
}

class Contact extends React.Component {
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
			showUserLogout: true,
			data: { ...initialData }
		}
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

	reset = () => {
		resetRecaptcha()
		this.setState({ data: { ...initialData } })
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
					<div className={classes.contact_form}>
						<h1 className={classes.heading}>Contact</h1>
						<p style={{ fontSize: '1.1rem' }}>
							For all the queries, Please contact using our contact details as
							below.
						</p>
						<Form className={classes.form}>
							<Form.Group widths={'equal'}>
								<Form.Field>
									<Input
										value={this.state.data.name}
										onChange={(_, data) =>
											this.setState(state => ({
												data: { ...state.data, name: data.value }
											}))
										}
										fluid
										placeholder="Your Name"
									/>
								</Form.Field>
								<Form.Field>
									<Input
										value={this.state.data.email}
										onChange={(_, data) =>
											this.setState(state => ({
												data: { ...state.data, email: data.value }
											}))
										}
										fluid
										type="email"
										placeholder="Email Address"
									/>
								</Form.Field>
								<Form.Field>
									<Input
										value={this.state.data.number}
										onChange={(_, data) =>
											this.setState(state => ({
												data: { ...state.data, number: data.value }
											}))
										}
										fluid
										placeholder="Contact Number"
									/>
								</Form.Field>
							</Form.Group>
							<Form.Field>
								<TextArea
									value={this.state.data.message}
									onChange={(_, data) =>
										this.setState(state => ({
											data: { ...state.data, message: data.value }
										}))
									}
									placeholder="Please write your queries here"
									style={{ minHeight: 200 }}
								/>
							</Form.Field>
							<Form.Field>
								<center>
									<Recaptcha
										ref={e => (recaptchaInstance = e)}
										sitekey={sitekey}
										size="normal"
										render="explicit"
										verifyCallback={verifyCallback}
										expiredCallback={expiredCallback}
									/>
									{/* <div
										className="g-recaptcha"
										data-sitekey="6LdbHGMUAAAAACv_3FPTZa2Nxs-tWXTStzIggJqS"
									/> */}
								</center>
							</Form.Field>
							<Form.Field>
								<center>
									<Button onClick={this.reset} negative>
										Reset
									</Button>
									<Button icon positive labelPosition="left">
										Send
										<Icon name="send" />
									</Button>
								</center>
							</Form.Field>
						</Form>
						<div className={classes.contact_details}>
							<div className={classes.textDetails}>
								<h3>Corporate Office</h3>
								<p>Spiez Web Services Private Limited</p>
								<p>1-118, Amman Kovil Street </p>
								<p>Kulaiyaneri </p>
								<p>Tirunelveli district, Tamil Nadu </p>
								<p>India, PIN - 627 859 </p>
								<p className={classes.email}>
									E-Mail:
									<a href="mailto:hello@sagepass.com"> hello@sagepass.com</a>
								</p>
							</div>
							<div className={classes.linkDetails}>
								<h3>Social Media</h3>
								<div className={classes.icons}>
									<Popup
										trigger={
											<div>
												<Icon
													className={classes.messenger}
													size="huge"
													name="facebook messenger"
												/>
											</div>
										}
										content="Click here to chat with Facebook Messenger"
									/>
									<Popup
										trigger={
											<a
												href="https://www.facebook.com/thesagepass"
												target="_blank"
											>
												<Icon
													className={classes.facebook}
													size="huge"
													name="facebook square"
												/>
											</a>
										}
										content="Sagepass Facebook Page"
									/>
									<Popup
										trigger={
											<a href="https://twitter.com/sagepass" target="_blank">
												<Icon
													className={classes.twitter}
													size="huge"
													name="twitter"
												/>
											</a>
										}
										content="Sagepass Twitter profile"
									/>
									<Popup
										trigger={
											<a href="mailto:hello@sagepass.com">
												<Icon
													className={classes.mail}
													size="huge"
													name="mail"
												/>
											</a>
										}
										content="Click Here to mail Sagepass"
									/>
									<Popup
										trigger={
											<a
												href="https://plus.google.com/b/105252302658383213806/"
												target="_blank"
											>
												<Icon
													className={classes.plus}
													size="huge"
													name="google plus"
												/>
											</a>
										}
										content="Sagepass G+ profile"
									/>
								</div>
							</div>
						</div>
					</div>
					<Footer />
				</section>
			</div>
		)
	}
}

export default Contact
