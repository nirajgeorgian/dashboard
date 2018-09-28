import React from 'react'
import { Menu, Dropdown, Popup, Input, Segment } from 'semantic-ui-react'

import { connect } from 'react-redux'

import classes from './Bookings.local.scss'

import BookingItem from './bookingItem'
import AddBooking from './AddBooking/index'

import Datetime from 'react-datetime'
import moment from 'moment'
import '../../Membership/AddMembership/DatePicker.scss'

const status = [
	{ key: 0, text: 'Booked', value: 0 },
	{ key: 1, text: 'Booked-Admin', value: 1 },
	{ key: 2, text: 'Cancelled - User', value: 2 },
	{ key: 3, text: 'Cancelled - Admin', value: 3 },
	{ key: 4, text: 'No Show', value: 4 },
	{ key: 5, text: 'Closed', value: 5 },
	{ key: 6, text: 'Blocked', value: 6 }
]

class Bookings extends React.Component {
	state = {
		parentCheckBox: false,
		searchFacility: '',
		searchDate: '',
		searchStatus: '',
		searchText: '',
		filteredBookings: [],
		facilitiesDropdown: [],
		searchCount: 0,
		bookings: []
	}

	componentDidMount() {
        document
			.querySelector(`.${classes.fromDate}`)
			.querySelector('.rdtPicker')
			.classList.add(classes.position)
		const facilities = this.props.facilities.map((item, key) => ({
			key: key,
			text: item.fname,
			value: item.fid
		}))
		console.log(this.props.bookings)
		this.setState({
			facilitiesDropdown: facilities,
			bookings: this.props.bookings,
			filteredBookings: this.props.bookings
		})
	}
	
	componentWillReceiveProps(props) {}

	handleParentCheckbox = e => {
		this.setState(
			{
				parentCheckBox: true
			}
			// () => this.setSearchedBooking()
		)
	}

	handleDropdown = (e, data) => {
		this.setState(
			{
				[data.id]: data.value
			},
			// () => this.setSearchedBooking()
		)
	}

	handleSearchTextChange = event => {
		this.setState({
			searchText: event.target.value
		})
	}

	setSearchedBooking = () => {
		var bookings = this.state.bookings
			.filter(booking => {
				if (
					booking.facility_name == this.state.searchFacility ||
					this.state.searchFacility == ''
				)
					return booking
			})
			.filter(booking => {
				if (
					moment(booking.booking_date, 'YYYY-MM-DD HH:mm:ss').format(
						'MM/DD/YYYY'
					) ==
						moment(this.state.searchDate, 'MM,DD,YYYY HH:mm:ss').format(
							'MM/DD/YYYY'
						) ||
					this.state.searchDate == ''
				)
					return booking
			})
			.filter(booking => {
				if (
					booking.booking_status == this.state.searchStatus ||
					this.state.searchStatus == ''
				)
					return booking
			})
			.filter(booking => {
				if (
					booking.booking_name == this.state.searchText ||
					this.state.searchText == ''
				)
					return booking
			})
		this.setState({
			filteredBookings: bookings,
			searchCount: bookings.length
		})
	}

	render() {
		return (
			<div>
				<Menu attached="top">
					<Dropdown
						open={false}
						item
						icon={
							this.state.parentCheckBox
								? 'check square outline'
								: 'square outline'
						}
						onClick={this.handleParentCheckbox}
					/>
					<Dropdown
						id="searchFacility"
						item
						search
						selection
						className={classes.noborder}
						placeholder="Choose the facility"
						options={this.state.facilitiesDropdown}
						onChange={this.handleDropdown}
					/>
					<Menu.Item className={classes.fromDate}>
						<Datetime
							// viewMode="years"
							renderInput={(props, openCalendar, closeCalendar) => (
								<Input icon="calendar" {...props} />
							)}
							closeOnSelect={true}
							inputProps={{ placeholder: 'Date' }}
							onChange={date => {
								this.setState(
									{
										searchDate: date.format('MM,DD,YYYY HH:mm:ss')
									},
									// () => this.setSearchedBooking()
								)
							}}
							dateFormat="MMM Do YYYY"
							timeFormat={false}
						/>
					</Menu.Item>
					<Dropdown
						id="searchStatus"
						placeholder="Choose the status"
						className={classes.noborder}
						item
						search
						selection
						options={status}
						onChange={this.handleDropdown}
					/>
					<Menu.Item>
						<Popup
							trigger={
								<strong className="green text">
									{this.state.searchCount > 1
										? `${this.state.searchCount} members`
										: `${this.state.searchCount} member`}
								</strong>
							}
							content="Number of bookings for the selected facility."
						/>
					</Menu.Item>
					<Menu.Item position="right">
						<Input
							id="searchText"
							className="transparent"
							icon="search link"
							placeholder="Search members..."
							type="text"
							onChange={this.handleSearchTextChange}
						/>
					</Menu.Item>
				</Menu>
				<Segment attached='bottom'>
                    {
                        this.state.filteredBookings.map((item, key) => (
							<BookingItem
							/>
						))
                    }
                </Segment>
				{
					this.props.showAddBooking ? (
						<AddBooking
							open={this.props.showAddBooking}
							handleClose={this.props.handleAddBookingModal}
							facilities={this.props.facilities}
						/>
					) : null
				}
			</div>
		)
	}
}

const mapStateToProps = state => ({
	business: state.currentBusinessList
})

export default connect(mapStateToProps,null)(Bookings);
