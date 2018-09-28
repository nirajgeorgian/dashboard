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
import classes from './AddEmployee.local.scss'
import Datetime from 'react-datetime'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { employeeAdd } from '../../../Actions/ActionsCreator/EmployeeActions'
import { isLoading } from '../../../Actions/ActionsCreator/UIActions/isLoading'
import { API } from 'aws-amplify'

class AddEmployeeModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			error: false,
			designation: '',
			email: '',
			employmentStart: '',
			employmentEnd: null,
			firstName: '',
			jobDescription: '',
			lastName: '',
			terms: false
		}
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

	addEmployee = async () => {
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
			bizid: this.props.currentBusiness.bizid,
			emp_email: email,
			emp_desig: designation,
			emp_desc: jobDescription,
			emp_fname: firstName,
			emp_lname: lastName,
			emp_start: employmentStart.format('YYYY/MM/DD')
		}
		if (employmentEnd) data['emp_end'] = employmentEnd.format('YYYY/MM/DD')

		try {
			const response = await API.post(
				'employee',
				`/create/${this.props.currentBusiness.bizid}`,
				{
					body: { ...data }
				}
			)
			console.log(response)
			if (response.status) {
				this.props.employeeAdd(response.message)
				this.props.toggleAddEmployeeModal()
			} else {
				this.setState({ error: true })
			}
		} catch (err) {
			console.log(err)
			this.setState({ error: true })
		}
		this.props.toggleLoading()
	}

	handelInputChange = (e, data) => {
		this.setState({ [data.id]: data.value })
	}
	render() {
		const { open, toggleAddEmployeeModal } = this.props
		return (
			<Modal
				onClose={toggleAddEmployeeModal}
				open={open}
				size="tiny"
				dimmer="inverted"
			>
				<Modal.Header>
					<center>Add Employee</center>
				</Modal.Header>
				<Modal.Content>
					<center>
						<p>Please fill the below details to add user as an employee.</p>
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
											employmentStart: date
										})
									}
									dateFormat="MMM Do YYYY"
									timeFormat={false}
									onClick={this.handleFocusChange}
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
											employmentEnd: date
										})
									}
									dateFormat="MMM Do YYYY"
									timeFormat={false}
									onClick={this.handleFocusChange}
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
									onClick={toggleAddEmployeeModal}
									negative
									icon
									className={classes.cancelBtn}
								>
									Cancel
								</Button>
								<Button
									onClick={this.addEmployee}
									icon
									positive
									labelPosition="right"
									loading={this.props.isLoading}
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
			employeeAdd,
			toggleLoading: isLoading
		},
		dispatch
	)

export default connect(
	mapStateToPops,
	mapActionToProps
)(AddEmployeeModal)
