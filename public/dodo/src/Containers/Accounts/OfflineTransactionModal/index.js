import React from 'react'
import {
	Form,
	Modal,
	Header,
	Button,
	Icon,
	Input,
	Dropdown
} from 'semantic-ui-react'
import classes from './OfflineTransactionModal.local.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { transactionAdd } from '../../../Actions/ActionsCreator/TransactionActions'
import { isLoading } from '../../../Actions/ActionsCreator/UIActions/isLoading'
import TimePicker from '../../../Components/UI/TimePicker'
import { API } from 'aws-amplify'
import Datetime from 'react-datetime'
import moment from 'moment'

const senderOrRecieverOptions = [
	{ key: 'Rohan Seth', value: 'Rohan Seth', text: 'Rohan Seth' },
	{ key: 'Raj Das', value: 'Raj Das', text: 'Raj Das' },
	{ key: 'Niraj Georgian', value: 'Niraj Georgian', text: 'Niraj Georgian' },
	{ key: 'Prithwee Das', value: 'Prithwee Das', text: 'Prithwee Das' }
]

const transactionTypes = [
	{ key: 'Sales', value: 1, text: 'Sales' },
	{ key: 'Marketing', value: 2, text: 'Marketing' },
	{ key: 'Interest', value: 3, text: 'Interest' },
	{ key: 'Tax', value: 4, text: 'Tax' },
	{
		key: 'General Admin fees',
		value: 5,
		text: 'General Admin fees'
	},
	{ key: 'Accounting Fees', value: 6, text: 'Accounting Fees' },
	{ key: 'Bank Charges', value: 7, text: 'Bank Charges' },
	{
		key: 'Equipments Purchase',
		value: 8,
		text: 'Equipments Purchase'
	},
	{ key: 'Electricity', value: 9, text: 'Electricity' },
	{ key: 'Entertainment', value: 10, text: 'Entertainment' },
	{ key: 'Legal Fees', value: 11, text: 'Legal Fees' },
	{
		key: 'Motor Vehicle Expenses',
		value: 12,
		text: 'Motor Vehicle Expenses'
	},
	{
		key: 'Printing & Stationery',
		value: 13,
		text: 'Printing & Stationery'
	},
	{ key: 'Rent', value: 14, text: 'Rent' },
	{ key: 'Repairs & Maintenance', value: 15, text: 'Repairs & Maintenance' },
	{ key: 'Phone Expenses', value: 16, text: 'Phone Expenses' },
	{
		key: 'Wages & Expenses',
		value: 17,
		text: 'Wages & Expenses'
	},
	{ key: 'Other Income', value: 18, text: 'Other Income' },
	{ key: 'Other Expenses', value: 19, text: 'Other Expenses' }
]

class OfflineTransactionModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			date: '',
			transactionTime: '',
			showTimePopUp: false,
			senderOrReciever: '',
			transactionType: '',
			comment: '',
			cashFlow: '',
			cashValue: '',
			isDatePicker: true,
			showDatePicker: false,
			time: null,
			error: false
		}
	}
	handelInputChange = (e, data) => {
		this.setState({ [data.id]: data.value })
	}

	validate = () => {
		const {
			time,
			senderOrReciever,
			transactionType,
			comment,
			cashFlow,
			cashValue
		} = this.state

		return (
			senderOrReciever !== '' &&
			transactionType !== '' &&
			comment !== '' &&
			cashFlow !== '' &&
			cashValue !== '' &&
			time
		)
	}

	convertTime = time => {
		let hour = time.split(':')[0]
		let min = time.split(':')[1].split(' ')[0]
		let meridian = time.split(':')[1].split(' ')[1]
		if (meridian === 'AM' && hour === '12') hour = '00'

		if (meridian === 'PM' && parseInt(hour) < 12) hour = parseInt(hour) + 12
		const [month, date, year] = this.state.date
			.split(',')
			.map(item => parseInt(item))

		this.setState({ time: moment([year, month - 1, date, hour, min]) })
	}

	handleAddTransaction = async () => {
		const {
			time,
			senderOrReciever,
			transactionType,
			comment,
			cashFlow,
			cashValue
		} = this.state
		this.setState({ error: false })
		this.props.toggleLoading()
		try {
			const response = await API.post('accounts', '/offline/add', {
				body: {
					bizid: this.props.currentBusiness.bizid,
					name: senderOrReciever,
					timestamp: time.format('MMM DD YYYY kk:mm:ss'),
					type: transactionType,
					comment: comment,
					cash_flow: cashFlow,
					cash_value: parseInt(cashValue)
				}
			})

			console.log(response)
			if (response.status) {
				response.message.offline = true
				this.props.transactionAdd(response.message)
				this.props.toggelOfflineTransactionItemModal()
			} else {
				this.setState({ error: true })
			}
		} catch (err) {
			this.setState({ error: true })
			console.log(err)
		}
		return this.props.toggleLoading()
	}
	render() {
		const { open, toggelOfflineTransactionItemModal } = this.props
		return (
			<Modal
				onClose={toggelOfflineTransactionItemModal}
				open={open}
				size="tiny"
				dimmer="inverted"
				closeOnDimmerClick={
					!this.state.showTimePopUp && !this.state.showDatePicker
				}
			>
				<Modal.Header>
					<center>Add Offline Transaction</center>
				</Modal.Header>
				<Modal.Content>
					<center>
						<p>Please fill the below details to add transaction data.</p>
					</center>
					<Form className={classes.form}>
						<Form.Group widths={2}>
							<Form.Field required>
								<label>Sender or Receiver</label>
								<Dropdown
									placeholder="e.g. Sai Enterprises"
									fluid
									search
									selection
									options={senderOrRecieverOptions}
									onChange={(e, data) =>
										this.setState({ senderOrReciever: data.value })
									}
								/>
							</Form.Field>
							<Form.Field required>
								<label>Transaction Time</label>
								{this.state.isDatePicker ? (
									<Datetime
										open={this.state.showDatePicker}
										viewMode="years"
										renderInput={(props, openCalendar, closeCalendar) => (
											<Input icon="clock" iconPosition="left" {...props} />
										)}
										closeOnSelect={true}
										inputProps={{
											placeholder: 'Time',
											value: this.state.time
												? this.state.time.format('Do MMM YYYY hh:mm A')
												: ''
										}}
										onChange={date =>
											this.setState(
												{
													date: date.format('MM,DD,YYYY')
												},
												() =>
													this.setState({
														isDatePicker: false,
														showTimePopUp: true
													})
											)
										}
										dateFormat="MMM Do YYYY"
										timeFormat={false}
										onFocus={() => {
											this.setState({ showDatePicker: true })
										}}
										onBlur={() => {
											this.setState({ showDatePicker: false })
										}}
									/>
								) : (
									<TimePicker
										showPopUp={this.state.showTimePopUp}
										handelPopUpChange={popUpState => {
											this.setState({ showTimePopUp: popUpState })
											if (!popUpState)
												return setTimeout(() => {
													return this.setState({ isDatePicker: true })
												}, 1000)
										}}
										placeholder="Time"
										time={this.state.transactionTime}
										setTime={time =>
											this.setState({ transactionTime: time }, () =>
												this.convertTime(this.state.transactionTime)
											)
										}
										value={
											this.state.time
												? this.state.time.format('Do MMM YYYY hh:mm A')
												: ''
										}
									/>
								)}
							</Form.Field>
						</Form.Group>
						<Form.Group widths={2}>
							<Form.Field required>
								<label>Transaction Type</label>
								<Dropdown
									placeholder="e.g. Rent, Electricity"
									fluid
									search
									selection
									options={transactionTypes}
									onChange={(e, data) =>
										this.setState({ transactionType: data.value })
									}
								/>
							</Form.Field>
							<Form.Field required>
								<label>Comment</label>
								<Input
									id="comment"
									onChange={this.handelInputChange}
									icon={'file outline'}
									iconPosition="left"
									placeholder="e.g. Equipment Purchase"
								/>
							</Form.Field>
						</Form.Group>
						<Form.Group widths={2}>
							<Form.Field required>
								<label>Cash Flow</label>
								<Dropdown
									placeholder="e.g. Income"
									fluid
									search
									selection
									options={[
										{ key: 'Income', value: 1, text: 'Income' },
										{ key: 'Expenses', value: 0, text: 'Expenses' }
									]}
									onChange={(e, data) =>
										this.setState({ cashFlow: data.value })
									}
								/>
							</Form.Field>
							<Form.Field required>
								<label>Cash Value</label>
								<Input
									id="cashValue"
									onChange={this.handelInputChange}
									icon={'rupee'}
									iconPosition="left"
									placeholder="e.g. 450"
									type="number"
									className={classes.cashValue}
								/>
							</Form.Field>
						</Form.Group>
						{this.state.error && (
							<Form.Field>
								<center className={classes.error}>Something went wrong!</center>
							</Form.Field>
						)}
						<Form.Field>
							<center>
								<Button
									onClick={toggelOfflineTransactionItemModal}
									negative
									icon
									className={classes.cancelBtn}
								>
									Cancel
								</Button>
								<Button
									onClick={this.handleAddTransaction}
									icon
									positive
									loading={this.props.isLoading}
									labelPosition="right"
									disabled={!this.validate()}
								>
									<Icon name="checkmark" />
									Add
								</Button>
							</center>
						</Form.Field>
					</Form>
				</Modal.Content>
			</Modal>
		)
	}
}

const mapStateToPops = state => ({
	currentBusiness: state.currentBusinessList,
	isLoading: state.isLoading
})

const mapActionToProps = dispatch =>
	bindActionCreators(
		{
			transactionAdd,
			toggleLoading: isLoading
		},
		dispatch
	)

export default connect(
	mapStateToPops,
	mapActionToProps
)(OfflineTransactionModal)
