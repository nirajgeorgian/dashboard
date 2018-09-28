import React from 'react'
import {
	Form,
	Modal,
	Header,
	Button,
	Icon,
	Input,
	Dropdown,
	Checkbox
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import classes from './EditEmployee.local.scss'
import Datetime from 'react-datetime'
import moment from 'moment'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { employeeEdit } from '../../../Actions/ActionsCreator/EmployeeActions'
import { isLoading } from '../../../Actions/ActionsCreator/UIActions/isLoading'
import { API } from 'aws-amplify'

class EditEmployeeModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			error: false,
			firstName: '',
			lastName: '',
			active: true,
			designation: '',
			jobDescription: '',
			email: '',
			startDate: '',
			endDate: ''
		}
	}
	handelInputChange = (e, data) => {
		this.setState({ [data.id]: data.value })
	}

	validate = () => {
		const {
			designation,
			email,
			employmentStart,
			employmentEnd,
			firstName,
			jobDescription,
			lastName,
			terms
		} = this.state

		if (
			designation === '' ||
			email === '' ||
			employmentStart === '' ||
			firstName === '' ||
			lastName === '' ||
			jobDescription === '' ||
			!terms
		) {
			return false
		}
		return true
	}

	submitEdit = async () => {
		this.props.toggleLoading()
		this.setState({ error: false })
		const {
			designation,
			email,
			employmentStart,
			employmentEnd,
			firstName,
			jobDescription,
			lastName,
			terms
		} = this.state

		const data = {
			emp_id: this.props.employee.empid,
			bizid: this.props.currentBusiness.bizid,
			emp_email: email,
			emp_desig: designation,
			emp_desc: jobDescription,
			emp_fname: firstName,
			emp_lname: lastName,
			emp_start: employmentStart
		}
		if (employmentEnd !== '') data['emp_end'] = employmentEnd
		try {
			const res = await API.put(
				'employee',
				`/update/${this.props.currentBusiness.bizid}`,
				{
					body: {
						...data
					}
				}
			)
			console.log(res)
			if (res.status) {
				this.props.employeeEdit(res.message)
				this.props.toggleEditEmployeeModal()
			} else this.setState({ error: true })
		} catch (err) {
			console.log('emp update error', err)
			this.setState({ error: true })
		}

		this.props.toggleLoading()
	}

	componentDidMount() {
		const { employee } = this.props
		this.setState({
			firstName: employee.empfname,
			lastName: employee.emplname,
			active: true,
			designation: employee.empdesig,
			jobDescription: employee.empdesc,
			email: employee.empemail,
			employmentStart: employee.empstart,
			employmentEnd: employee.empend
		})
	}
	render() {
		const { open, toggleEditEmployeeModal } = this.props
		return (
			<Modal
				onClose={toggleEditEmployeeModal}
				open={open}
				size="tiny"
				dimmer="inverted"
			>
				<Modal.Header>
					<center>Edit Employee</center>
				</Modal.Header>
				<Modal.Content>
					<center>
						<p>Please fill the below details to edit this employee.</p>
					</center>
					<Form className={classes.form}>
						<Form.Group widths={2}>
							<Form.Field required>
								<label>Email</label>
								<Input
									id="email"
									type="email"
									onChange={this.handelInputChange}
									icon={'at'}
									iconPosition="left"
									placeholder="e.g. hello@sagepass.com"
									value={this.state.email}
								/>
							</Form.Field>
							<Form.Field required>
								<label>Designation</label>
								<Input
									id="designation"
									onChange={this.handelInputChange}
									icon={'id card outline'}
									iconPosition="left"
									placeholder="e.g. Office Admin"
									value={this.state.designation}
								/>
							</Form.Field>
						</Form.Group>
						<Form.Field required>
							<label>Job Description</label>
							<Input
								id="jobDescription"
								onChange={this.handelInputChange}
								icon={'file outline'}
								iconPosition="left"
								placeholder="e.g. Office Admin"
								value={this.state.jobDescription}
							/>
						</Form.Field>
						<Form.Group widths={2}>
							<Form.Field required>
								<label>First Name</label>
								<Input
									id="firstName"
									onChange={this.handelInputChange}
									icon={'user'}
									iconPosition="left"
									placeholder="e.g. Steve"
									value={this.state.firstName}
								/>
							</Form.Field>
							<Form.Field required>
								<label>Last Name</label>
								<Input
									id="lastName"
									onChange={this.handelInputChange}
									icon={'user'}
									iconPosition="left"
									placeholder="e.g. Jobs"
									value={this.state.lastName}
								/>
							</Form.Field>
						</Form.Group>
						<Form.Group widths={2}>
							<Form.Field required>
								<label>Employment Start</label>
								<Datetime
									viewMode="years"
									renderInput={(props, openCalendar, closeCalendar) => (
										<Input icon="calendar" iconPosition="left" {...props} />
									)}
									closeOnSelect={true}
									inputProps={{ placeholder: 'Start Date' }}
									onChange={date =>
										this.setState({
											employmentStart: date.format('YYYY/MM/DD')
										})
									}
									dateFormat="MMM Do YYYY"
									timeFormat={false}
									onClick={this.handleFocusChange}
									value={moment(this.state.employmentStart, 'YYYY/MM/DD')}
								/>
							</Form.Field>
							<Form.Field>
								<label>Employment End (Optional)</label>
								<Datetime
									viewMode="years"
									renderInput={(props, openCalendar, closeCalendar) => (
										<Input icon="calendar" iconPosition="left" {...props} />
									)}
									closeOnSelect={true}
									inputProps={{ placeholder: 'End Date' }}
									onChange={date =>
										this.setState({
											employmentEnd: date.format('YYYY/MM/DD')
										})
									}
									dateFormat="MMM Do YYYY"
									timeFormat={false}
									onClick={this.handleFocusChange}
									value={moment(this.state.employmentEnd, 'YYYY/MM/DD')}
								/>
							</Form.Field>
						</Form.Group>
						<Form.Field>
							<center>
								<Checkbox
									checked={this.state.terms}
									onChange={(e, data) => this.setState({ terms: data.checked })}
									label={
										<label>
											I agree to the <Link to="/terms">Terms of Service</Link>.
										</label>
									}
								/>
							</center>
						</Form.Field>
						{this.state.error && (
							<Form.Field>
								{this.state.error && (
									<center>
										<p className={classes.error}>Something went wrong!</p>
									</center>
								)}
							</Form.Field>
						)}
						<Form.Field>
							<center>
								<Button
									onClick={toggleEditEmployeeModal}
									negative
									icon
									className={classes.cancelBtn}
								>
									Cancel
								</Button>
								<Button
									loading={this.props.isLoading}
									disabled={!this.validate()}
									icon
									positive
									labelPosition="right"
									onClick={this.submitEdit}
								>
									<Icon name="checkmark" />
									Update
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
			employeeEdit,
			toggleLoading: isLoading
		},
		dispatch
	)

export default connect(
	mapStateToPops,
	mapActionToProps
)(EditEmployeeModal)
