import React from 'react'
import { Modal, Header, Button, Icon } from 'semantic-ui-react'

import { API } from 'aws-amplify'
import { connect } from 'react-redux'

import { showLoading } from '../../../../Actions/index'

class DeleteAttendance extends React.Component {
	handleDeleteAttendance = async event => {
		this.props.showLoading()

		try {
			const attendance = Object.assign({}, this.props.attendance)
			const response = await API.del(
				'members',
				`/attendance/delete/${attendance.sno}`
			)
			console.log(response)
			this.props.handleDelete(attendance)
			this.props.showLoading()
			this.props.handleClose()
		} catch (e) {
			this.props.showLoading()
			console.log(e)
		}
	}

	render() {
		return (
			<Modal
				size="tiny"
				open={this.props.open}
				onClose={this.props.handleClose}
			>
				<Modal.Header>Remove the attendance entry</Modal.Header>
				<Modal.Content>
					<Modal.Description>
						<Header
							color="red"
							content="You have intended to remove the attendance entry."
						/>
						<p>Is it okay to remove the attendance entry?</p>
					</Modal.Description>
				</Modal.Content>
				<Modal.Actions>
					<Button
						positive
						className="deny"
						content="Nope"
						onClick={this.props.handleClose}
					/>
					<Button
						color="red"
						icon
						labelPosition="right"
						loading={this.props.isLoading}
						onClick={this.handleDeleteAttendance}
					>
						<Icon name="close" />Yep, Please remove
					</Button>
				</Modal.Actions>
			</Modal>
		)
	}
}

function mapStateToProps(state) {
	return {
		isLoading: state.isLoading
	}
}

export default connect(
	mapStateToProps,
	{ showLoading }
)(DeleteAttendance)
