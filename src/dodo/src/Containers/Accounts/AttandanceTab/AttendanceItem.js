import React from 'react'
import {
	Divider,
	Icon,
	Popup,
	Modal,
	Button,
	Header,
	Form,
	TextArea,
	Checkbox
} from 'semantic-ui-react'

import classes from './AttandanceTab.local.scss'
import UserInfoModal from '../UserInfoModal'

export const Users = {
	id: 0,
	name: 'Niraj Georgian',
	image: 'http://dev.sagepass.com:8081/img/chat/sp_logo.png',
	MemberSince: '29 May 2017',
	Membership: 'Monthly Plan',
	ContactNumber: '08998 73578',
	EmailAddress: 'hello@sagepass.com',
	Address: '62, Palash Building, Near Dutta Mandir, Wakad, Pune',
	favourite: false,
	age: 22,
	cognitoId: '1432-4522-5464-7676'
}

class AttendanceItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showRemoveAttendanceModal: false,
			showDirectMessageModal: false,
			directMessageText: '',
			directMessageCheckBox: true,
			showUserInfoModal: false
		}
	}

	toggleRemoveAttendanceModal = () =>
		this.setState(state => ({
			showRemoveAttendanceModal: !state.showRemoveAttendanceModal
		}))

	toggleUserInfoModal = () =>
		this.setState(state => ({ showUserInfoModal: !state.showUserInfoModal }))

	toggleDirectMessageModal = () =>
		this.setState(state => ({
			showDirectMessageModal: !state.showDirectMessageModal
		}))

	renderDirectMessageModal = () => {
		return (
			<Modal
				onClose={this.toggleDirectMessageModal}
				open={this.state.showDirectMessageModal}
				size="tiny"
				dimmer="inverted"
			>
				<Modal.Header>
					<center>Send Message & Notification</center>
				</Modal.Header>
				<Modal.Content>
					<p className={classes.directMessageText}>
						This message will be pushed to the members on their mobile apps &
						emails if subscribed.
					</p>

					<Form>
						<Form.Field>
							<TextArea
								value={this.state.directMessageText}
								onChange={(_, data) =>
									this.setState({ directMessageText: data.value })
								}
								placeholder="e.g. Dear User, We would like to discuss with you about our new offers."
							/>
						</Form.Field>
						<Form.Field>
							<center>
								<Checkbox
									checked={this.state.directMessageCheckBox}
									label="It's okay for the users to contact me."
									onChange={(_, data) =>
										this.setState({ directMessageCheckBox: data.checked })
									}
								/>
							</center>
						</Form.Field>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button onClick={this.toggleDirectMessageModal} positive>
						Nope
					</Button>
					<Button negative icon labelPosition="right">
						Yep, Please remove
						<Icon name="close" />
					</Button>
				</Modal.Actions>
			</Modal>
		)
	}

	renderRemoveAttandanceModal = () => {
		return (
			<Modal
				onClose={this.toggleRemoveAttendanceModal}
				open={this.state.showRemoveAttendanceModal}
				size="tiny"
				dimmer="inverted"
			>
				<Modal.Header>Remove the attendance entry</Modal.Header>
				<Modal.Content>
					<Header as="h3" color="red">
						You have intended to remove the attendance entry.
					</Header>
					<p>Is it okay to remove the attendance entry?</p>
				</Modal.Content>
				<Modal.Actions>
					<Button onClick={this.toggleRemoveAttendanceModal} positive>
						Nope
					</Button>
					<Button negative icon labelPosition="right">
						Yep, Please remove
						<Icon name="close" />
					</Button>
				</Modal.Actions>
			</Modal>
		)
	}
	render() {
		return (
			<div>
				{this.state.showRemoveAttendanceModal &&
					this.renderRemoveAttandanceModal()}
				{this.state.showDirectMessageModal && this.renderDirectMessageModal()}
				{this.state.showUserInfoModal && (
					<UserInfoModal
						open={this.state.showUserInfoModal}
						user={Users}
						onClose={this.toggleUserInfoModal}
					/>
				)}
				<div className={classes.attendanceItem}>
					<div
						onClick={this.toggleUserInfoModal}
						className={classes.employeeName}
					>
						Niraj Georgian
					</div>
					<div className={classes.comment}>Late due to an emergency</div>
					<div className={classes.device}>Manual</div>
					<div className={classes.outorin}>In</div>
					<div className={classes.date}>24th December 2018</div>
					<div className={classes.time}>07:46 AM</div>
					<div
						onClick={this.toggleDirectMessageModal}
						className={classes.attendanceMessage}
					>
						<Popup
							trigger={<Icon color="blue" name="comment alternate" />}
							content="Message this user directly"
						/>
					</div>
					<div
						onClick={this.toggleRemoveAttendanceModal}
						className={classes.attendanceClose}
					>
						<Popup
							trigger={<Icon color="red" name="close" />}
							content="Remove this log"
						/>
					</div>
				</div>
				<Divider className={classes.divider} />
			</div>
		)
	}
}

export default AttendanceItem
