import React from 'react'
import {
	Header,
	Form,
	TextArea,
	Checkbox,
	Button,
	Input
} from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Datetime from 'react-datetime'
import moment from 'moment'
import { setCurrentBusinessListFunc } from '../../../Actions/ActionsCreator/currentBusinessList/currentBusinessList'
import { setGlobalMessage } from '../../../Actions/ActionsCreator/globalMessage/GlobalMessage'
// API import
import { API } from 'aws-amplify'
import Maintenance from './maintainanceDay/index'
import classes from './NoticeSettings.local.scss'
import TimePicker from '../../../Components/UI/TimePicker'
import compare from '../../../utility/compare'
import LoadingComponent from '../Loading'

let maintainceList;

class NoticeSettings extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			global_message: '',
			notice_push: false,
			maintenance_push: false,
			m_opening_time: '',
			m_closing_time: '',
			m_date: '',
			maintenance: this.props.currentBusinessList.maintenance
		}
	}

	componentWillMount() {
		maintainceList = this.props.currentBusinessList.maintenance.map((elem, i) => {
			return (
				<Maintenance
					key = {i}
					m_date = {elem.m_date}
					m_opening_time = {elem.m_opening_time}
					m_closing_time = {elem.m_closing_time}
				/>
			)
		})
	}

	componentWillReceiveProps(nextProps) {
		if(compare(nextProps.currentBusinessList.maintenance, this.state) == false) {
			const data = nextProps.currentBusinessList.maintenance
			maintainceList = nextProps.currentBusinessList.maintenance.map((elem, i) => {
				return (
					<Maintenance
						key = {i}
						m_date = {elem.m_date}
						m_opening_time = {elem.m_opening_time}
						m_closing_time = {elem.m_closing_time}
					/>
				)
			})
		}
	}

	monthMap = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	]

	postNotice = async () => {
		// TODO: post notice
		// console.log(this.state.global_message)
		let id = this.props.currentBusinessList.bizid;
		const data = await API.put("business", `/update/${id}`, {
			body: {
				global_message: this.state.global_message
			}
		})
		if(data) {
			console.log("sucessfully updated");
			this.props.setGlobalMessage(this.state.global_message)
		} else {
			console.log("Error updating");
		}
	}

	clearNotice = () => this.setState({ global_message: '' })

	clearMaintenance = () =>
		this.setState({ m_date: '', m_opening_time: '', m_closing_time: '' })

	postMaintenance = async (event) => {
		const id = this.props.currentBusinessList.bizid
		const updateData = await API.put("business", `/update/${id}`, {
			body: this.state
		})
		if(updateData) {
			const data = await API.get("business", '/listmine')
			// ?or else get it from state
			const business = await data.filter(singleBusiness => {
				return singleBusiness.bizname == this.props.currentBusinessList.bizname
			})
			await this.props.setCurrentBusinessListFunc(business[0])
			await this.props.setCurrentBusinessList(business[0])
			this.setState({
				global_message: '',
				notice_push: false,
				maintenance_push: false,
				m_opening_time: '',
				m_closing_time: '',
				m_date: ''
			})
			console.log("Succesfully updated " + updateData);
		} else {
			console.log("failed updating");
		}
	}
	renderDate = ({ className, ...props }, currentDate, selectedDate) => {
		return (
			<td className={className} {...props}>
				{currentDate.date()}
			</td>
		)
	}

	renderYear = ({ className, ...props }, year, selectedDate) => {
		return (
			<td className={className} {...props}>
				{year}
			</td>
		)
	}

	renderMonth = ({ className, ...props }, month, year, selectedDate) => {
		return (
			<td className={className} {...props}>
				{this.monthMap[month]}
			</td>
		)
	}

	handleDateChange = date => {
		this.setState({
			m_date: date.format('MMM Do YYYY')
		})
	}

	handleFocusChange = event => {
		if (this.props.errorMessage !== '') {
			this.props.clearMessage()
		}
	}

	render() {
		return (
			this.props.isLoading === false ?
			<div>
				<Header className={classes.notice_header} dividing>
					Notice
				</Header>
				<Form>
					<Form.Field>
						<label className={classes.lable}>
							Notice to users (<span className={classes.lable_span}>
								This message will be displayed at the top of your page
							</span>)
						</label>
						<TextArea
							value={this.state.global_message}
							onChange={e => this.setState({ global_message: e.target.value })}
							placeholder="e.g. We run special dance programs on every Saturday. Please book it soon to not miss it."
						/>
					</Form.Field>
					<Form.Group widths={2}>
						<Form.Field width={10}>
							<Checkbox
								checked={this.state.notice_push}
								onChange={(e, data) =>
									this.setState({ notice_push: data.checked })
								}
								label="Push notification to active members on apps and mail."
							/>
						</Form.Field>
						<Form.Field className={classes.buttons} width={6}>
							<Button onClick={this.clearNotice} color="red">
								Clear
							</Button>
							<Button onClick={this.postNotice} primary>
								Post
							</Button>
						</Form.Field>
					</Form.Group>
				</Form>
				<Header as="h4" className={classes.notice_header} dividing>
					Maintenance Day
				</Header>
				<Form>
					<Form.Field>
						<label className={classes.lable}>
							Notice to users (<span className={classes.lable_span}>
								This maintenance information will be displayed at the top of
								your page
							</span>)
						</label>
					</Form.Field>
					{ maintainceList }
					<Header as="h4" className={classes.notice_header} dividing>
						Previous Maintainance
					</Header>
					<Form.Group widths={3}>
						<Form.Field>
							<Datetime
								viewMode="days"
								value={this.state.m_date}
								renderInput={(props, openCalendar, closeCalendar) => (
									<Input icon="calendar" iconPosition="left" {...props} />
								)}
								renderDay={this.renderDate}
								renderYear={this.renderYear}
								renderMonth={this.renderMonth}
								closeOnSelect={true}
								inputProps={{ placeholder: 'Maintenance Date' }}
								onChange={this.handleDateChange}
								dateFormat="MMM Do YYYY"
								timeFormat={false}
								onClick={this.handleFocusChange}
							/>
						</Form.Field>
						<Form.Field>
							<TimePicker
								time={this.state.m_opening_time}
								setTime={time => this.setState({ m_opening_time: time })}
								placeholder="Opening time"
								value = { this.state.m_opening_time }
							/>
						</Form.Field>
						<Form.Field>
							<TimePicker
								time={this.state.m_closing_time}
								setTime={time => this.setState({ m_closing_time: time })}
								placeholder="Closing time"
								value = { this.state.m_opening_time }
							/>
						</Form.Field>
					</Form.Group>
					<Form.Group widths={2}>
						<Form.Field width={10}>
							<Checkbox
								checked={this.state.maintenance_push}
								onChange={(e, data) =>
									this.setState({ maintenance_push: data.checked })
								}
								label="Push notification to active members on apps and mail."
							/>
						</Form.Field>
						<Form.Field className={classes.buttons} width={6}>
							<Button onClick={this.clearMaintenance} color="red">
								Clear
							</Button>
							<Button onClick={this.postMaintenance} primary>
								Post
							</Button>
						</Form.Field>
					</Form.Group>
				</Form>
			</div>
			: <LoadingComponent />
		)
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ setCurrentBusinessListFunc, setGlobalMessage }, dispatch)
}

const mapStateToProps = state => {
	return {
		isLoading: state.isLoading
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NoticeSettings))
