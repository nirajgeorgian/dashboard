import React from 'react'
import { Modal, Form, Dropdown, Input, Button, Icon } from 'semantic-ui-react'
import Datetime from 'react-datetime'
import moment from 'moment'

import '../../AddMembership/DatePicker.scss'

import { showLoading } from '../../../../Actions/index'

import { connect } from 'react-redux'
import { API } from 'aws-amplify'

import TimePicker from '../../../../Components/UI/TimePicker'

const members = [
	{ key: 0, text: 'Rohan Seth', value: 'Rohan Seth' },
	{ key: 1, text: 'Raj Das', value: 'Raj Das' },
	{ key: 2, text: 'Niraj Georgian', value: 'Niraj Georgian' },
	{ key: 3, text: 'Prithwee Das', value: 'Prithwee Das' }
]

class AddAttendance extends React.Component {
	state = {
		checkIn: false,
		checkOut: false,
		status: -1,
		mem_name: '',
		medium: 'Online',
		members_dropdown: '', 	
		checkdate: '',
		checktime: '',
		showTimePopUp: false
	}

	componentDidMount() {
		console.log(this.props.members)
		const data = this.props.members.map(item => {
			return {
				key: item.mem_id,
				text: item.mem_fullname,
				value: item.mem_fullname
			}
		})
		this.setState({
			members_dropdown: data
		})
	}

	handleCheckIn = event => {
		this.setState({ checkIn: true, checkOut: false, status: 1 }, () =>
			this.handleFormSubmit()
		)
	}

	handleCheckOut = event => {
		this.setState({ checkOut: true, checkIn: false, status: 0 }, () =>
			this.handleFormSubmit()
		)
	}

	handleFormSubmit = async () => {
		this.props.showLoading()
		var data = Object.assign({}, this.state)
		const member = this.props.members.filter(
			member => this.state.mem_name == member.mem_fullname
		)[0]
		data['business_id'] = this.props.business.bizid
		data['mem_id'] = member.mem_id
		data['mems'] = member.mem_mems
		if (this.state.status == 1) {
			data['checkindate'] = this.state.checkdate
			data['checkintime'] = this.state.checktime
		} else if (this.state.status == 0) {
			data['checkoutdate'] = this.state.checkdate
			data['checkouttime'] = this.state.checktime
		}
		console.log(data)

		try {
			const response = await API.post('members', '/attendance', {
				body: data
			})

			console.log('Response:', response)
			this.props.showLoading()
			this.props.handleAdd(response.message)
			this.props.handleClose()
		} catch (e) {
			this.props.showLoading()
			console.log(e)
		}
	}

	handleDropdown = (e, data) => {
		this.setState({
			[data.id]: data.value
		})
	}

	handleDateChange = date => {
		this.setState({
			checkdate: date.format('MM,DD,YYYY')
		})
	}

	hadleInputChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		})
	}

	render() {
		return (
			<Modal
				open={this.props.open}
				size="tiny"
				onClose={this.props.handleClose}
				closeOnDimmerClick={!this.state.showTimePopUp}
			>
				<Modal.Header>
					<center>Add Attendance data</center>
				</Modal.Header>
				<Modal.Content>
					<Modal.Description>
						<Form>
							<Form.Field>
								<center>
									Please fill the below details to add attendance data of the
									user.
								</center>
							</Form.Field>
							<Form.Group widths={3}>
								<Form.Field width={8} className="required">
									<label>Member Name</label>
									<Dropdown
										id="mem_name"
										fluid
										search
										selection
										placeholder="Choose the member"
										options={this.state.members_dropdown}
										onChange={this.handleDropdown}
									/>
								</Form.Field>
								<Form.Field width={4} className="required">
									<label>Date</label>
									<Datetime
										id="checkdate"
										dateFormat="MMM Do YYYY"
										timeFormat={false}
										onChange={this.handleDateChange}
										closeOnSelect={true}
										inputProps={{ placeholder: 'Date' }}
										renderInput={(props, openCalendar, closeCalendar) => (
											<Input icon="calendar" iconPosition="left" {...props} />
										)}
									/>
								</Form.Field>
								<Form.Field width={4} className="required">
									<label>Time</label>
									{/* <Input
										icon="time"
										id="checktime"
										iconPosition="left"
										placeholder="Time"
										onChange={this.hadleInputChange}
									/> */}
									<TimePicker
										showPopUp={this.state.showTimePopUp}
										handelPopUpChange={popUpState =>
											this.setState({ showTimePopUp: popUpState })
										}
										placeholder="Time"
										time={this.state.checktime}
										setTime={time => this.setState({ checktime: time })}
									/>
								</Form.Field>
							</Form.Group>
							<center>
								<Button
									icon
									color="green"
									labelPosition="right"
									className="trans5"
									onClick={this.handleCheckIn}
									loading={this.state.checkIn ? this.props.isLoading : false}
								>
									<Icon name="time outline" />Check-in
								</Button>
								<Button
									icon
									primary
									labelPosition="right"
									className="trans5"
									onClick={this.handleCheckOut}
									loading={this.state.checkOut ? this.props.isLoading : false}
								>
									<Icon name="time outline" />Check-out
								</Button>
							</center>
						</Form>
					</Modal.Description>
				</Modal.Content>
			</Modal>
		)
	}
}

function mapStateToProps(state) {
	return {
		isLoading: state.isLoading,
		business: state.currentBusinessList
	}
}

export default connect(
	mapStateToProps,
	{ showLoading }
)(AddAttendance)
