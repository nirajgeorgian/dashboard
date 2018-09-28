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
import classes from './AddAttendanceModal.local.scss'
import Datetime from 'react-datetime'

import TimePicker from '../../../Components/UI/TimePicker'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { API } from 'aws-amplify'
import { attendanceAdd } from '../../../Actions/ActionsCreator/AttendanceActions/index'
import { isLoading } from '../../../Actions/ActionsCreator/UIActions/isLoading'

class AddAttendanceModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showDatePicker: false,
			showTimePopUp: false,
			date: '',
			time: '',
			employee: '',
			comment: ''
		}

		this.employeeList = this.props.employees.map(emp => ({
			key: emp.empid,
			value: emp.empid,
			text: `${emp.empfname} ${emp.emplname}`
		}))
	}
	handelInputChange = (e, data) => {
		this.setState({ [data.id]: data.value })
	}

	validate = () => {
		const { employee, time, date } = this.state

		return employee === '' || time === '' || date === ''
	}

	submit = async status => {
		this.props.toggleLoading()
		this.setState({ error: false })
		const { employee, time, date, comment } = this.state

		const data = {
			checkindate: date,
			checkintime: time,
			emp_id: employee,
			status,
			bizid: this.props.currentBusiness.bizid
		}
		if (comment !== '') data.comment = comment

		console.log(data)

		try {
			const response = await API.post(
				'employee',
				`/attendance/${this.props.currentBusiness.bizid}`,
				{
					body: { ...data }
				}
			)
			console.log(response)
			if (response.status) {
				// this.props.employeeAdd(response.message)
				this.props.toggleAddAttendanceModal()
			} else {
				this.setState({ error: true })
			}
		} catch (err) {
			console.log(err)
			this.setState({ error: true })
		}

		this.props.toggleLoading()
	}
	render() {
		const { open, toggleAddAttendanceModal } = this.props
		return (
			<Modal
				onClose={toggleAddAttendanceModal}
				open={open}
				size="tiny"
				dimmer="inverted"
				closeOnDimmerClick={
					!this.state.showTimePopUp && !this.state.showDatePicker
				}
			>
				<Modal.Header>
					<center>Add Attendance data</center>
				</Modal.Header>
				<Modal.Content>
					<center>
						<p>
							Please fill the below details to add attendance data of the
							employee.
						</p>
					</center>
					<Form className={classes.form}>
						<Form.Group widths={3}>
							<Form.Field width={8} required>
								<label>Employee</label>
								<Dropdown
									placeholder="Choose the Employee"
									fluid
									search
									selection
									options={this.employeeList}
									onChange={(e, data) =>
										this.setState({ employee: data.value })
									}
								/>
							</Form.Field>
							<Form.Field width={4} required>
								<label>Date</label>
								<Datetime
									open={this.state.showDatePicker}
									viewMode="years"
									renderInput={(props, openCalendar, closeCalendar) => (
										<Input icon="calendar" iconPosition="left" {...props} />
									)}
									closeOnSelect={true}
									inputProps={{ placeholder: 'Date' }}
									onChange={date =>
										this.setState({
											date: date.format('YYYY-MM-DD')
										})
									}
									dateFormat="MMM Do YYYY"
									timeFormat={false}
									onFocus={() => this.setState({ showDatePicker: true })}
									onBlur={() => this.setState({ showDatePicker: false })}
								/>
							</Form.Field>
							<Form.Field width={4} required>
								<label>Time</label>
								<TimePicker
									showPopUp={this.state.showTimePopUp}
									handelPopUpChange={popUpState =>
										this.setState({ showTimePopUp: popUpState })
									}
									placeholder="Time"
									time={this.state.transactionTime}
									setTime={time => this.setState({ time: time })}
									value={this.state.time}
								/>
							</Form.Field>
						</Form.Group>
						<Form.Field>
							<label>Comment</label>
							<Input
								id="comment"
								icon="file outline"
								iconPosition="left"
								onChange={this.handelInputChange}
								placeholder="e.g. Late due to hospital visit"
							/>
						</Form.Field>
						<Form.Field>
							<center>
								<Button
									onClick={() => this.submit(1)}
									icon
									positive
									labelPosition="right"
									loading={this.props.isLoading}
									disabled={this.validate()}
								>
									<Icon name="clock outline" />
									Check In
								</Button>
								<Button
									onClick={() => this.submit(0)}
									icon
									primary
									labelPosition="right"
									loading={this.props.isLoading}
									disabled={this.validate()}
								>
									<Icon name="clock outline" />
									Check Out
								</Button>
							</center>
						</Form.Field>
					</Form>
				</Modal.Content>
			</Modal>
		)
	}
}

const mapStateToProps = state => ({
	employees: state.employees,
	currentBusiness: state.currentBusinessList,
	isLoading: state.isLoading
})

const mapActionToProps = dispatch =>
	bindActionCreators(
		{
			attendanceAdd,
			toggleLoading: isLoading
		},
		dispatch
	)

export default connect(
	mapStateToProps,
	mapActionToProps
)(AddAttendanceModal)
