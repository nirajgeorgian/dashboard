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

import classes from './TransactionsTab.local.scss'
import UserInfoModal from '../UserInfoModal'
import moment from 'moment'
import { API } from 'aws-amplify'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { transactionDelete } from '../../../Actions/ActionsCreator/TransactionActions'
import { isLoading } from '../../../Actions/ActionsCreator/UIActions/isLoading'

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

const expenseTypeMap = [
	'',
	'Sales',
	'Marketing',
	'Interest',
	'Tax',
	'General Admin Fees',
	'Accounting Fees',
	'Bank Charges',
	'Equipment Purchase',
	'Electricity',
	'Entertainment',
	'Legal Fees',
	'Motor Vehicle Expenses',
	'Printing & Stationery',
	'Rent',
	'Repairs & Maintenance',
	'Phone Expenses',
	'Wages & Expenses',
	'Other Income',
	'Other Expenses'
]

class TransactionItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showRemoveTransactionModal: false,
			showDirectMessageModal: false,
			directMessageText: '',
			directMessageCheckBox: true,
			showUserInfoModal: false
		}
	}

	toggleRemoveTransactionModal = () =>
		this.setState(state => ({
			showRemoveTransactionModal: !state.showRemoveTransactionModal
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

	removeTransaction = async () => {
		this.props.toggleLoading()

		try {
			const response = await API.del(
				'accounts',
				`/offline/delete/${this.props.data.id}`,
				{}
			)
			if (response.status) {
				this.toggleRemoveTransactionModal()
				this.props.transactionDelete(this.props.data.id)
			}
		} catch (error) {
			console.log(error)
		}
		this.props.toggleLoading()
	}

	renderRemoveTransactionModal = () => {
		return (
			<Modal
				onClose={this.toggleRemoveTransactionModal}
				open={this.state.showRemoveTransactionModal}
				size="tiny"
				dimmer="inverted"
			>
				<Modal.Header>Remove the Transaction entry</Modal.Header>
				<Modal.Content>
					<Header as="h3" color="red">
						You have intended to remove the transaction entry.
					</Header>
					<p>Is it okay to remove the transaction entry?</p>
				</Modal.Content>
				<Modal.Actions>
					<Button onClick={this.toggleRemoveTransactionModal} positive>
						Nope
					</Button>
					<Button
						onClick={this.removeTransaction}
						negative
						icon
						labelPosition="right"
						loading={this.props.isLoading}
					>
						Yep, Please remove
						<Icon name="close" />
					</Button>
				</Modal.Actions>
			</Modal>
		)
	}
	render() {
		const { data } = this.props
		const date = moment(data.timestamp, 'MMM DD YYYY hh:mm:ss').format(
			'Do MMM hh:mm A'
		)
		return (
			<div>
				{this.state.showRemoveTransactionModal &&
					this.renderRemoveTransactionModal()}
				{this.state.showDirectMessageModal && this.renderDirectMessageModal()}
				{data.cognitoid &&
					this.state.showUserInfoModal && (
						<UserInfoModal
							open={this.state.showUserInfoModal}
							user={{ ...Users, name }}
							onClose={this.toggleUserInfoModal}
						/>
					)}
				<div className={classes.transactionItem}>
					<div
						onClick={this.toggleUserInfoModal}
						className={data.cognitoid ? classes.nameBold : classes.name}
					>
						{data.name || data.custid}
					</div>
					<div className={classes.comment}>{data.comment}</div>
					<div className={classes.type}>{expenseTypeMap[data.type]}</div>
					<div
						className={
							data.cashflow === 1 || !data.offline
								? classes.cashValueIncome
								: classes.cashValueExpense
						}
					>
						{data.cashflow === 1 || !data.offline ? '+ ' : '- '}₹{data.cashvalue ||
							data.amount}
					</div>
					<div className={classes.datetime}>{date}</div>
					<div className={classes.actions}>
						{!!data.cognitoid && (
							<div onClick={this.toggleDirectMessageModal}>
								<Popup
									trigger={<Icon color="blue" name="comment alternate" />}
									content="Message this user directly"
								/>
							</div>
						)}
						{data.offline && (
							<div onClick={this.toggleRemoveTransactionModal}>
								<Popup
									trigger={<Icon color="red" name="close" />}
									content="Remove this log"
								/>
							</div>
						)}
					</div>
				</div>
				<Divider className={classes.divider} />
			</div>
		)
	}
}

const mapStateToPops = state => ({
	isLoading: state.isLoading
})

const mapActionToProps = dispatch =>
	bindActionCreators(
		{
			toggleLoading: isLoading,
			transactionDelete
		},
		dispatch
	)

export default connect(
	mapStateToPops,
	mapActionToProps
)(TransactionItem)
