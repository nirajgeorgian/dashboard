import React from 'react'
import { Header, Segment, Checkbox, Button, Modal } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import classes from './AdvancedSettings.local.scss'
import LoadingComponent from '../Loading'

const initialState = {
	perform_analytics: true,
	hide_contact_number: false,
	stop_new_membership: false,
	deactivate: false,
	showDeleteModal: false
}

class AdvancedSettings extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			...initialState,
			businessName: this.props.businessName
		}
	}

	reset = () => this.setState({ ...initialState })

	toggleDeleteModal = () =>
		this.setState(state => ({ showDeleteModal: !state.showDeleteModal }))

	showDeleteModal = () => {
		return (
			<Modal
				size="tiny"
				open={this.state.showDeleteModal}
				onClose={this.toggleDeleteModal}
			>
				<Modal.Header>Delete this business</Modal.Header>
				<Modal.Content>
					<Header className={classes.modal_header}>
						You have intended to delete the business.
					</Header>
					<p>
						Deleting this business will remove all the information, bookings,
						memberships and requests from it. It will also release the page name
						used.
					</p>
					<p>Are you sure to delete the business permanently from sagepass?</p>
				</Modal.Content>
				<Modal.Actions>
					<Button positive content="Nope" onClick={this.toggleDeleteModal} />
					<Button
						color="red"
						icon="close"
						labelPosition="right"
						content="Yep, please remove"
						onClick={this.toggleDeleteModal}
					/>
				</Modal.Actions>
			</Modal>
		)
	}

	render() {
		return (
			this.props.isLoading === false ?
			<div>
				{this.state.showDeleteModal && this.showDeleteModal()}
				<Header className={classes.advanced_header} dividing>
					Advanced Settings
				</Header>
				<Header as="h4" className={classes.advanced_header} dividing>
					Privacy
				</Header>
				<Segment>
					<Checkbox
						toggle
						checked={this.state.perform_analytics}
						onChange={(e, data) =>
							this.setState({ perform_analytics: data.checked })
						}
						label="Perform Analytics on the users who visit the business page."
					/>
				</Segment>
				<Segment>
					<Checkbox
						toggle
						checked={this.state.hide_contact_number}
						onChange={(e, data) =>
							this.setState({ hide_contact_number: data.checked })
						}
						label="Hide contact number from the page."
					/>
				</Segment>
				<Header as="h4" className={classes.advanced_header} dividing>
					Deactivate Services
				</Header>
				<Segment>
					<Checkbox
						toggle
						checked={this.state.stop_new_membership}
						onChange={(e, data) =>
							this.setState({ stop_new_membership: data.checked })
						}
						label="Stop receiving new bookings and memberships. But, Let the page stay."
					/>
				</Segment>
				<Segment>
					<Checkbox
						toggle
						checked={this.state.deactivate}
						onChange={(e, data) => this.setState({ deactivate: data.checked })}
						label="Do not allow users to visit this business or page and Deactivate."
					/>
				</Segment>
				<center>
					<Button onClick={this.toggleDeleteModal}>Delete this Business</Button>
				</center>
				<center className={classes.actions}>
					<Button onClick={this.reset} content="Reset" color="red" />
					<Button content="Apply" primary />
				</center>
			</div>
			: <LoadingComponent />
		)
	}
}

const mapStateToProps = state => {
	return {
		isLoading: state.isLoading
	}
}

export default withRouter(connect(mapStateToProps, null)(AdvancedSettings))
