import React from 'react'
import { Header, Form, Input, TextArea, Dropdown, Button, Flag, Segment, Dimmer, Loader }
	from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setCurrentBusinessListFunc } from '../../../Actions/ActionsCreator/currentBusinessList/currentBusinessList'
import classes from './GeneralSettings.local.scss'
import TimePicker from '../../../Components/UI/TimePicker'
import { invokeApig } from '../../../Config/awsLib'
import LoadingComponent from '../Loading'

// API import
import { API } from 'aws-amplify'

class GeneralSettings extends React.Component {
	constructor(props) {
		super(props)
		this.countryOptions = [
			{
				key: 'india',
				value: 'in',
				flag: 'in',
				text: 'India'
			},
			{
				key: 'uk',
				value: 'gb',
				flag: 'gb',
				text: 'UK'
			}
		]

		this.state = {
			"businesses": [],
			businessName: this.props.businessName,
			"business_name": '',
			"business_page": '',
			"business_type": '',
			"business_info": '',
			"business_day": '',
			"business_shutday": '',
			"info_name": '',
			"info_contact": '',
			"info_email": '',
			"location_address": '',
			"location_city": '',
			"location_code": "",
			"location_country": "in",
			"m_date": "",
			"day_start": "",
			"day_end": "",
			"showLoading": false
		}

		this.operatingHours = [
			{ key: '0', value: '0', text: '24 Hours x 7 Days' },
			{ key: '1', value: '1', text: 'All Days' },
			{ key: '2', value: '2', text: 'Weekdays Only' },
			{ key: '3', value: '3', text: 'All Days except Sunday' }
		]
	}

	componentWillMount() {
		this.setState({
			businesses: this.props.currentBusinessList,
			business_name: this.props.currentBusinessList.bizname == null ? '' : this.props.currentBusinessList.bizname,
			business_page: this.props.currentBusinessList.page == null ? '' : this.props.currentBusinessList.page,
			business_info: this.props.currentBusinessList.info.description == null ? '' : this.props.currentBusinessList.info.description,
			day_start: this.props.currentBusinessList.operating.operating_time == null ? '' : this.props.currentBusinessList.operating.operating_time,
			day_end: this.props.currentBusinessList.operating.closing_time == null ? '' : this.props.currentBusinessList.operating.closing_time,
			m_date: this.props.currentBusinessList.operating.operating_hours == null ? '' : this.props.currentBusinessList.operating.operating_hours,
			info_name: this.props.currentBusinessList.info.name == null ? '' : this.props.currentBusinessList.info.name,
			info_email: this.props.currentBusinessList.info.email == null ? '' : this.props.currentBusinessList.info.email,
			info_contact: this.props.currentBusinessList.info.contact == null ? '' : this.props.currentBusinessList.info.contact,
			info_description: this.props.currentBusinessList.info.description == null ? '' : this.props.currentBusinessList.info.description,
			location_address: this.props.currentBusinessList.location.address1 == null ? '' : this.props.currentBusinessList.location.address1,
			location_city: this.props.currentBusinessList.location.city == null ? '' : this.props.currentBusinessList.location.city,
			location_code: this.props.currentBusinessList.location.code == null ? '' : this.props.currentBusinessList.location.code,
			location_country: this.props.currentBusinessList.location.country == null ? '' : this.props.currentBusinessList.location.country
		})
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.currentBusinessList.bizname !== this.state.businessName) {
			const data = nextProps.currentBusinessList
			this.setState({
				businessName: data.bizname == null ? '' : data.bizname,
				businesses: data,
				business_name: (data).bizname == null ? '' : (data).bizname,
				business_page: (data).page == null ? '' : (data).page,
				business_info: (data).info.description == null ? '' : (data).info.description,
				day_start: (data).operating.operating_time == null ? '' : (data).operating.operating_time,
				day_end: (data).operating.closing_time == null ? '' : (data).operating.closing_time,
				m_date: (data).operating.operating_hours == null ? '' : (data).operating.operating_hours,
				info_name: (data).info.name == null ? '' : (data).info.name,
				info_email: (data).info.email == null ? '' : (data).info.email,
				info_contact: (data).info.contact == null ? '' : (data).info.contact,
				info_description: (data).info.description == null ? '' : (data).info.description,
				location_address: (data).location.address1 == null ? '' : (data).location.address1,
				location_city: (data).location.city == null ? '' : (data).location.city,
				location_code: (data).location.code == null ? '' : (data).location.code,
				location_country: (data).location.country == null ? '' : (data).location.country
			})
			return true
		}
		return false
	}

	// shouldComponentUpdate(nextProps, nextState) {
	// 	if(nextState.businessName !== this.state.businessName) {
	// 		return true
	// 	}
	// 	return false
	// }

	handleDropbox = (e, data) => {
		this.setState({ [data.id]: data.value })
	}

	handelInputChange = e => {
		console.log(e.target.id);
		this.setState({
			[e.target.id]: e.target.value
		})
	}

	handleFormSUbmit = async (e, data) => {
		e.preventDefault()
		this.props.setLoading(true)
		const id = this.props.currentBusinessList.bizid
		this.setState({
			id: id
		})
		const updateData = await API.put("business", `/update/${id}`, {
			body: this.state
		})
		if(updateData) {
			const data = await API.get("business", '/listmine')
			// ?or else get it from state
			const business = await data.filter(singleBusiness => {
				return singleBusiness.bizname == this.props.currentBusinessList.bizname
			})
			// console.log(business[0]);
			await this.props.setCurrentBusinessListFunc(business[0])
			await this.props.setCurrentBusinessList(business[0])
			console.log("Succesfully updated " + updateData);
			this.props.setLoading(false)
		} else {
			console.log("failed updating");
			this.props.setLoading(false)
		}
	}
	render() {
		return (
			this.props.isLoading === false ?
			<div className={classes.container}>
				<Header className={classes.general_settings_header} dividing>
					General Settings
				</Header>
				<Form onSubmit={this.handleFormSUbmit} loading = { this.props.loading }>
					<Form.Field required>
						<label>Business Name</label>
						<Input
							placeholder="Business Name"
							id="business_name"
							icon="building outline"
							iconPosition='left'
							value={this.state.business_name}
							onChange={this.handelInputChange}
						/>
					</Form.Field>
					<Form.Field required>
						<label>Sagepass URL</label>
						<Input
							placeholder="Sagepass URL"
							className={classes.sagepass_url}
							id="business_page"
							action={{
								content: 'https://www.sagepass.com/'
							}}
							value={this.state.business_page}
							onChange={this.handelInputChange}
							actionPosition="left"
						/>
					</Form.Field>
					<Form.Field required>
						<label>Description</label>
						<TextArea
							placeholder="Description to be displayed to users."
							className={classes.description}
							id="info_description"
							value={this.state.info_description}
							onChange={this.handelInputChange}
						/>
					</Form.Field>
					<Form.Field required>
						<label>Contact Details</label>
						<Form.Group widths={3}>
							<Form.Field>
								<Input
									placeholder="Contact Name"
									className={classes.contact_name}
									id="info_name"
									icon= 'user'
									iconPosition='left'
									value={this.state.info_name}
									onChange={this.handelInputChange}
								/>
							</Form.Field>
							<Form.Field>
								<Input
									placeholder="Contact Number"
									className={classes.contact_number}
									id="info_contact"
									icon= 'phone'
									iconPosition='left'
									value={this.state.info_contact}
									onChange={this.handelInputChange}
								/>
							</Form.Field>
							<Form.Field>
								<Input
									placeholder="Email Address"
									className={classes.email_address}
									id="info_email"
									icon= 'mail'
									iconPosition='left'
									value={this.state.info_email}
									onChange={this.handelInputChange}
								/>
							</Form.Field>
						</Form.Group>
					</Form.Field>
					<Form.Field required>
						<label>Location Information</label>
						<Form.Group widths={2}>
							<Form.Field width={10}>
								<Input
									placeholder="Address"
									className={classes.address}
									id="location_address"
									icon= 'map marker'
									iconPosition='left'
									value={this.state.location_address}
									onChange={this.handelInputChange}
								/>
							</Form.Field>
							<Form.Field width={6}>
								<Input
									placeholder="Postal Code"
									className={classes.post_code}
									id="location_code"
									action={{
										content: 'Post Code'
									}}
									actionPosition="left"
									value={this.state.location_code}
									onChange={this.handelInputChange}
								/>
							</Form.Field>
						</Form.Group>
						<Form.Group widths="equal">
							<Form.Field>
								<Input
									placeholder="City"
									className={classes.city}
									id="location_city"
									action={{
										content: 'city'
									}}
									actionPosition="left"
									value={this.state.location_city}
									onChange={this.handelInputChange}
								/>
							</Form.Field>
							<Form.Field>
								<Dropdown
									className={classes.country}
									id="location_country"
									placeholder="Country"
									search
									selection
									onChange={this.handleDropbox}
									options={this.countryOptions}
									defaultValue={this.state.location_country}
								/>
							</Form.Field>
						</Form.Group>
					</Form.Field>
					<Form.Field required>
						<label>Operating Hours</label>
						<Form.Group widths={3}>
							<Form.Field width={8}>
								<Dropdown
									selection
									className={classes.operating_hours}
									placeholder="Operating Hours"
									id="m_date"
									search
									options={this.operatingHours}
									onChange={this.handleDropbox}
									defaultValue={this.state.m_date}
									// loading={this.props.isLoading}
								/>
							</Form.Field>
							<Form.Field width={4}>
								<TimePicker
									placeholder="Opening Time"
									setTime={time => this.setState({ day_start: time })}
									time={this.state.day_start}
								/>
							</Form.Field>
							<Form.Field width={4}>
								<TimePicker
									placeholder="Closing Time"
									setTime={time => this.setState({ day_end: time })}
									time={this.state.day_end}
								/>
							</Form.Field>
						</Form.Group>
					</Form.Field>
					<div className={classes.actions}>
					<Button color="red">Reset</Button>
					<Button primary type="submit">Apply</Button>
					</div>
				</Form>
			</div>
		: <LoadingComponent />
		)
	}
}

const mapStateToProps = state => {
	return {
		businessesList: state.businessesList,
		isLoading: state.isLoading
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ setCurrentBusinessListFunc }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GeneralSettings))
