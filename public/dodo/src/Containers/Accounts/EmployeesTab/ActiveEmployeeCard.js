import React from 'react'
import {
	Header,
	Card,
	Button,
	Image,
	Popup,
	Icon,
	Modal,
	Form,
	Input
} from 'semantic-ui-react'
import Datetime from 'react-datetime'
import classes from './EmployeesTab.local.scss'
import EditEmployeeModal from '../EditEmployeeModal'
import moment from 'moment'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { employeeEdit } from '../../../Actions/ActionsCreator/EmployeeActions'
import { isLoading } from '../../../Actions/ActionsCreator/UIActions/isLoading'
import { API } from 'aws-amplify'

class ActiveEmployeeCard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showEndEmployementModal: false,
			showEditEmployeeModal: false,
			employmentEnd: null
		}
	}

	validate = () => this.state.employmentEnd

	endEmployment = async () => {
		this.props.toggleLoading()
		const { employee } = this.props
		const data = {
			bizid: this.props.currentBusiness.bizid,
			emp_id: employee.empid,
			emp_end: this.state.employmentEnd
		}

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
				this.toggleEndEmployementModal()
			} else this.setState({ error: true })
		} catch (err) {
			console.log('emp update error', err)
			this.setState({ error: true })
		}

		this.props.toggleLoading()
	}

	toggleEndEmployementModal = () =>
		this.setState(state => ({
			showEndEmployementModal: !state.showEndEmployementModal
		}))
	toggleEditEmployementModal = () =>
		this.setState(state => ({
			showEditEmployeeModal: !state.showEditEmployeeModal
		}))

	renderEndEmployementModal = () => {
		return (
			<Modal
				open={this.state.showEndEmployementModal}
				onClose={this.toggleEndEmployementModal}
				size="mini"
			>
				<Header textAlign="center" content="End Employment" />
				<Modal.Content>
					<Form>
						<Form.Field>
							<center>
								<p style={{ marginBottom: 0 }}>
									You have intended to end the employment.{' '}
								</p>

								<p>Ending the employment will notify the user.</p>
							</center>
						</Form.Field>
						<Form.Field>
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
								dateFormat="Do MMM YYYY"
								timeFormat={false}
								isValidDate={(currentDate, _) => {
									const start = moment(
										this.props.employee.empstart,
										'YYYY/MM/DD'
									)
									if (start.isBefore(currentDate)) return true
								}}
							/>
						</Form.Field>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button positive onClick={this.toggleEndEmployementModal}>
						Cancel
					</Button>
					<Button
						labelPosition="right"
						negative
						onClick={this.endEmployment}
						icon
						loading={this.props.isLoading}
						disabled={!this.validate()}
					>
						<Icon name="stop" />
						End
					</Button>
				</Modal.Actions>
			</Modal>
		)
	}

	render() {
		const { employee } = this.props
		return (
			<Card>
				{this.state.showEndEmployementModal && this.renderEndEmployementModal()}
				{this.state.showEditEmployeeModal && (
					<EditEmployeeModal
						toggleEditEmployeeModal={this.toggleEditEmployementModal}
						open={this.state.showEditEmployeeModal}
						employee={employee}
					/>
				)}
				<Card.Content>
					<Card.Header className={'center aligned'}>
						{employee.empfname} {employee.emplname}
					</Card.Header>
					<Card.Meta className={'center aligned'}>
						{employee.empdesig}
					</Card.Meta>
					<Card.Description className={'center aligned'}>
						{employee.empfname} is our {employee.empdesc}
					</Card.Description>
				</Card.Content>
				<Card.Content extra>
					<div className={classes.extra}>
						<div className={classes.cardImage}>
							<Image
								src={
									'https://www.shareicon.net/data/512x512/2016/09/15/829473_man_512x512.png'
								}
								circular
							/>
						</div>
						<div
							onClick={this.toggleEditEmployementModal}
							className={classes.editEmployee}
						>
							<Popup
								trigger={<Icon name="edit" />}
								content="Edit the employee"
							/>
						</div>
						<div
							onClick={this.toggleEndEmployementModal}
							className={classes.end}
						>
							<Popup
								trigger={<Icon name="stop" />}
								content="End the employement"
							/>
						</div>
					</div>
				</Card.Content>
			</Card>
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
)(ActiveEmployeeCard)
