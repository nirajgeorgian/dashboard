import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
	FormGroup, InputGroup, Spinner, Icon, Tooltip, Button, Intent
} from '@blueprintjs/core'
import { userSignupStartAction } from '../../../actionCreator/user.action.creator'


class Signup extends Component {

	state = {
		email: '',
		username: '',
		password: '',
		helpers : {
			showPassword: false,
			loading: false,
			disabled: false
		}
	}

	handleLockClick = event => {
		this.setState((prevState, prevProps) => {
			return {
				helpers : {
					showPassword: !prevState.helpers.showPassword
				}
			}
		})
	}

	onInputChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		})
	}

	onFormSubmit = event => {
		event.preventDefault()
		const params = this.state
		delete params.helpers
		this.props.userSignupStartAction(this.state)
	}

  render() {
		const { showPassword, loading, disabled } = this.state.helpers
		const userSpinner = true ? <Spinner intent="primary" size={Icon.SIZE_STANDARD} /> : null
		const lockButton = (
			<Tooltip content={`${showPassword ? "Hide" : "Show"} Password`}>
				<Button
					icon={showPassword ? "unlock" : "lock"}
					intent={Intent.WARNING}
					minimal={true}
					onClick={this.handleLockClick}
				>
				</Button>
			</Tooltip>
		)
    return (
      <FormGroup intent="primary">
				<InputGroup
					id="email"
					large={true}
					placeholder="Email ..."
					leftIcon="paperclip"
					type="email"
					onChange={this.onInputChange}
				/>
        <InputGroup
					id="username"
					large={true}
					placeholder="Username ..."
					leftIcon="user"
					onChange={this.onInputChange}
				/>
				<InputGroup
					id="password"
          large={true}
          placeholder="Enter your password..."
          rightElement={lockButton}
					leftIcon="key"
          type={showPassword ? "text" : "password"}
					onChange={this.onInputChange}
	      />
				<Button
					rightIcon="arrow-right"
					intent={Intent.SUCCESS}
					large={true}
					onClick={this.onFormSubmit}
				>Signup </Button>
      </FormGroup>
    )
  }
}

const mapStateToProps = state => {
	return {
		...state
	}
}

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ userSignupStartAction }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
