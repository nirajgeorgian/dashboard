import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Account extends Component {
	render() {
		console.log(this.props)
		return (
			<div>
				Account component here<br />
				<Link to='/account/signup'>signup</Link><br />
				<Link to='/account/login'>login</Link>
			</div>
		)
	}
}

export default Account
