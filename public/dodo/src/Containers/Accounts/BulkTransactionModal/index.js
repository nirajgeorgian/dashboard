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
import classes from './BulkTransactionModal.local.scss'
import Datetime from 'react-datetime'
import TimePicker from '../../../Components/UI/TimePicker'
import moment from 'moment'
import { API } from 'aws-amplify'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { transactionAdd } from '../../../Actions/ActionsCreator/TransactionActions'
import { isLoading } from '../../../Actions/ActionsCreator/UIActions/isLoading'

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

class BulkTransactionModal extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			error: false,
			data: [
				{
					transactionTime: '',
					showTimePopUp: false,
					senderOrReciever: '',
					transactionType: '',
					cashFlow: '',
					cashValue: '',
					comment: '',
					date: '',
					isDatePicker: true,
					showDatePicker: false,
					time: null
				},
				{
					transactionTime: '',
					showTimePopUp: false,
					senderOrReciever: '',
					transactionType: '',
					cashFlow: '',
					cashValue: '',
					comment: '',
					date: '',
					isDatePicker: true,
					showDatePicker: false,
					time: null
				},
				{
					transactionTime: '',
					showTimePopUp: false,
					senderOrReciever: '',
					transactionType: '',
					cashFlow: '',
					cashValue: '',
					comment: '',
					date: '',
					isDatePicker: true,
					showDatePicker: false,
					time: null
				},
				{
					transactionTime: '',
					showTimePopUp: false,
					senderOrReciever: '',
					transactionType: '',
					cashFlow: '',
					cashValue: '',
					comment: '',
					date: '',
					isDatePicker: true,
					showDatePicker: false,
					time: null
				},
				{
					transactionTime: '',
					showTimePopUp: false,
					senderOrReciever: '',
					transactionType: '',
					cashFlow: '',
					cashValue: '',
					comment: '',
					date: '',
					isDatePicker: true,
					showDatePicker: false,
					time: null
				}
			]
		}
	}

	validate = () => {
		let valid = true
		const { data } = this.state
		data.map(item => {
			const {
				time,
				senderOrReciever,
				transactionType,
				comment,
				cashFlow,
				cashValue
			} = item

			if (
				!(
					senderOrReciever !== '' &&
					transactionType !== '' &&
					comment !== '' &&
					cashFlow !== '' &&
					cashValue !== '' &&
					time
				)
			)
				valid = false
			return
		})
		return valid
	}
	componentDidMount() {
		setTimeout(
			() =>
				document
					.querySelector(`.${classes.firstDatePicker}`)
					.querySelector('.rdtPicker')
					.classList.add(classes.position),
			500
		)
	}
	handleSenderOrRecieverChange = (index, data) => {
		this.setState(state => ({
			...state,
			data: [
				...state.data.slice(0, index),
				{ ...state.data[index], senderOrReciever: data },
				...state.data.slice(index + 1)
			]
		}))
	}

	handleAddBulkTransaction = async () => {
		this.setState({ error: false })
		const { data: datas } = this.state
		const dataToSend = datas.map(data => ({
			bizid: this.props.currentBusiness.bizid,
			name: data.senderOrReciever,
			timestamp: data.time.format('MMM DD YYYY kk:mm:ss'),
			type: data.transactionType,
			comment: data.comment,
			cash_flow: data.cashFlow,
			cash_value: parseInt(data.cashValue)
		}))
		this.props.toggleLoading()
		try {
			const promises = dataToSend.map(body =>
				API.post('accounts', '/offline/add', {
					body
				})
			)
			const responses = await Promise.all(promises)

			responses.map(res => {
				// if (!res.staus) throw new Error('Something went wrong')
				console.log('adding')
				this.props.transactionAdd(res.message)
			})
			this.props.toggelBulkTransactionItemModal()
		} catch (err) {
			console.log(err)
			this.setState({ error: true })
		}
		this.props.toggleLoading()
		console.log(dataToSend)
	}

	convertTime = (time, index) => {
		let hour = time.split(':')[0]
		let min = time.split(':')[1].split(' ')[0]
		let meridian = time.split(':')[1].split(' ')[1]
		console.log(time, hour, min, meridian)
		if (meridian === 'AM' && hour === '12') hour = '00'

		if (meridian === 'PM' && parseInt(hour) < 12) hour = parseInt(hour) + 12
		const [month, date, year] = this.state.data[index].date
			.split(',')
			.map(item => parseInt(item))

		this.setState(state => ({
			...state,
			data: [
				...state.data.slice(0, index),
				{
					...state.data[index],
					time: moment([year, month - 1, date, hour, min])
				},
				...state.data.slice(index + 1)
			]
		}))
	}

	handleTransactionTimeChange = (index, data) => {
		this.setState(
			state => ({
				...state,
				data: [
					...state.data.slice(0, index),
					{ ...state.data[index], transactionTime: data },
					...state.data.slice(index + 1)
				]
			}),
			() => this.convertTime(data, index)
		)
	}

	handleTransactionTypeChange = (index, data) => {
		this.setState(state => ({
			...state,
			data: [
				...state.data.slice(0, index),
				{ ...state.data[index], transactionType: data },
				...state.data.slice(index + 1)
			]
		}))
	}

	handleCashFlowChange = (index, data) => {
		this.setState(state => ({
			...state,
			data: [
				...state.data.slice(0, index),
				{ ...state.data[index], cashFlow: data },
				...state.data.slice(index + 1)
			]
		}))
	}
	handelCashValueChange = (index, data) => {
		this.setState(state => ({
			...state,
			data: [
				...state.data.slice(0, index),
				{ ...state.data[index], cashValue: data },
				...state.data.slice(index + 1)
			]
		}))
	}
	handelCommentChange = (index, data) => {
		this.setState(state => ({
			...state,
			data: [
				...state.data.slice(0, index),
				{ ...state.data[index], comment: data },
				...state.data.slice(index + 1)
			]
		}))
	}

	renderFormRow = index => {
		return (
			<Form.Group key={index} widths={6}>
				<Form.Field width={3} required>
					{index < 1 ? (
						<label>Sender or Receiver</label>
					) : (
						<label className={classes.hidden}>Sender or Receiver</label>
					)}
					<Dropdown
						placeholder="e.g. Sai Enterprises"
						fluid
						search
						selection
						options={senderOrRecieverOptions}
						onChange={(e, data) =>
							this.handleSenderOrRecieverChange(index, data.value)
						}
					/>
				</Form.Field>
				<Form.Field
					className={index < 1 ? classes.firstDatePicker : ''}
					width={3}
					required
				>
					{index < 1 ? (
						<label>Transaction Time</label>
					) : (
						<label className={classes.hidden}>Transaction Time</label>
					)}

					{this.state.data[index].isDatePicker ? (
						<Datetime
							open={this.state.data[index].showDatePicker}
							viewMode="years"
							renderInput={(props, openCalendar, closeCalendar) => (
								<Input icon="clock" iconPosition="left" {...props} />
							)}
							closeOnSelect={true}
							inputProps={{
								placeholder: 'Time',
								value: this.state.data[index].time
									? this.state.data[index].time.format('Do MMM YYYY hh:mm A')
									: ''
							}}
							onChange={date =>
								this.setState(
									state => ({
										...state,
										data: [
											...state.data.slice(0, index),
											{ ...state.data[index], date: date.format('MM,DD,YYYY') },
											...state.data.slice(index + 1)
										]
									}),
									() =>
										this.setState(state => ({
											...state,
											data: [
												...state.data.slice(0, index),
												{
													...state.data[index],
													isDatePicker: false,
													showTimePopUp: true,
													showDatePicker: false
												},
												...state.data.slice(index + 1)
											]
										}))
								)
							}
							dateFormat="MMM Do YYYY"
							timeFormat={false}
							onFocus={() => {
								this.setState(state => ({
									...state,
									data: [
										...state.data.slice(0, index),
										{ ...state.data[index], showDatePicker: true },
										...state.data.slice(index + 1)
									]
								}))
							}}
							onBlur={() => {
								this.setState({ showDatePicker: false })
							}}
						/>
					) : (
						<TimePicker
							showPopUp={this.state.data[index].showTimePopUp}
							handelPopUpChange={popUpState => {
								this.setState(state => ({
									...state,
									data: [
										...state.data.slice(0, index),
										{ ...state.data[index], showTimePopUp: popUpState },
										...state.data.slice(index + 1)
									]
								}))
								if (!popUpState)
									return setTimeout(() => {
										return this.setState(state => ({
											...state,
											data: [
												...state.data.slice(0, index),
												{ ...state.data[index], isDatePicker: true },
												...state.data.slice(index + 1)
											]
										}))
									}, 1000)
							}}
							placeholder="Time"
							time={this.state.data[index].transactionTime}
							setTime={time => this.handleTransactionTimeChange(index, time)}
							value={
								this.state.data[index].time
									? this.state.data[index].time.format('Do MMM YYYY hh:mm A')
									: ''
							}
						/>
					)}
				</Form.Field>
				<Form.Field width={3} required>
					{index < 1 ? (
						<label>Transaction Type</label>
					) : (
						<label className={classes.hidden}>Transaction Type</label>
					)}
					<Dropdown
						placeholder="e.g. Rent, Electricity"
						fluid
						search
						selection
						options={transactionTypes}
						onChange={(e, data) =>
							this.handleTransactionTypeChange(index, data.value)
						}
					/>
				</Form.Field>
				<Form.Field width={2} required>
					{index < 1 ? (
						<label>Cash Flow</label>
					) : (
						<label className={classes.hidden}>Cash Flow</label>
					)}
					<Dropdown
						placeholder="e.g. Income"
						fluid
						search
						selection
						options={[
							{ key: 'Income', value: 1, text: 'Income' },
							{ key: 'Expenses', value: 0, text: 'Expenses' }
						]}
						onChange={(e, data) => this.handleCashFlowChange(index, data.value)}
					/>
				</Form.Field>
				<Form.Field width={2} required>
					{index < 1 ? (
						<label>Cash Value</label>
					) : (
						<label className={classes.hidden}>Cash Value</label>
					)}
					<Input
						id="cashValue"
						onChange={(e, data) =>
							this.handelCashValueChange(index, data.value)
						}
						placeholder="e.g. 450"
					/>
				</Form.Field>
				<Form.Field width={3} required>
					{index < 1 ? (
						<label>Comment</label>
					) : (
						<label className={classes.hidden}>Comment</label>
					)}
					<Input
						id="comment"
						onChange={(e, data) => this.handelCommentChange(index, data.value)}
						placeholder="e.g. Equipment Purchase"
					/>
				</Form.Field>
			</Form.Group>
		)
	}
	render() {
		const { open, toggelBulkTransactionItemModal } = this.props
		return (
			<Modal
				onClose={toggelBulkTransactionItemModal}
				open={open}
				size="fullscreen"
				dimmer="inverted"
				closeOnDimmerClick={
					!this.state.data[0].showTimePopUp &&
					!this.state.data[1].showTimePopUp &&
					!this.state.data[2].showTimePopUp &&
					!this.state.data[3].showTimePopUp &&
					!this.state.data[4].showTimePopUp
				}
			>
				<Modal.Header>
					<center>Add Bulk Transactions</center>
				</Modal.Header>
				<Modal.Content>
					<center>
						<p>Please fill the below details to add transaction data.</p>
					</center>
					<Form className={classes.form}>
						{this.state.data.map((_, i) => this.renderFormRow(i))}
						<Form.Field>
							<center>
								<Button
									onClick={toggelBulkTransactionItemModal}
									negative
									icon
									className={classes.cancelBtn}
								>
									Cancel
								</Button>
								<Button
									loading={this.props.isLoading}
									icon
									positive
									labelPosition="right"
									disabled={!this.validate()}
									onClick={this.handleAddBulkTransaction}
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
)(BulkTransactionModal)
