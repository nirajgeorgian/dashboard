import React from 'react'
import { Segment, Form, Menu, Dropdown, Input, Popup } from 'semantic-ui-react'

import classes from './Bookings.local.scss'
import Datetime from 'react-datetime'
import moment from 'moment'
import '../../Membership/AddMembership/DatePicker.scss'
import BookingItem from './BookingItem'
import CancelBookingModal from './CancelBooking/index'
import NoShowBookingModal from './NoShowBooking/index'
import AttendBookingModal from './AttendBooking/index'
import RescheduleBookingModal from './RescheduleBooking/index'

const options = [
    { key:0, text: 'Booked', value: 0 },
    { key:1, text: 'Cancelled', value:1 },
    { key:2, text: 'Attended', value:2 },
    { key:3, text: 'No Show', value:3 },
    { key:4, text: 'Booked - Admin', value: 4 },
    { key:5, text: 'Cancelled - Admin', value:5 }
]

class Bookings extends React.Component {
    state = {
        bookings: [],
        filteredBookings: [],
        parentCheckBox: false,
        events_list: [],
        searchDate: '',
        searchStatus: '',
        searchText: '',
        searchDropdown: '',
        selectedMembersCount: 0,
        selectedBookings: []
    }

    componentWillMount() {
        var events = this.props.events.map(event => {
            return {
                key: event.event_eventid,
                text: event.event_name,
                value: event.event_name
            }    
        })
        this.setState({
            bookings: this.props.bookings,
            filteredBookings: this.props.bookings,
            events_list: events,
            selectedBookings: Array(this.props.bookings.length).fill(false)
        })
    }

    componentWillReceiveProps(props) {
        this.setState({
            bookings: props.bookings
        }, () => this.setSearchedUser() )
    }

    componentDidMount() {
        document
			.querySelector(`.${classes.fromDate}`)
			.querySelector('.rdtPicker')
			.classList.add(classes.position)
    }

    handleParentCheckboxClick = async event => {
        await this.setState({
            parentCheckBox: !this.state.parentCheckBox,
            selectedBookings: this.state.selectedBookings.fill(!this.state.parentCheckBox)
        })
    }

    handleDropdown = (e, data) => {
        this.setState({
            [data.id]: data.value
        }, () => this.setSearchedUser() )
        console.log("Search Date:",moment(this.state.searchDate,'MM,DD,YYYY'))
        console.log("Booking Date:", this.state.filteredBookings)
    }

    handleSelectedBookingState = async (key, value) => {
        const selectedBookings = Array.from(this.state.selectedBookings)
        selectedBookings[key] = value
        await this.setState({
            selectedBookings: selectedBookings
        })
    }

    handleChangeBooking = (booking) => {
        this.props.handleChangeBooking(booking)
    }

    handleSearchTextChange = e => {
        this.setState(
            { searchText: e.target.value }, 
            () => this.setSearchedUser() 
        )
    }

    setSearchedUser = () => {
        var bookings = this.state.bookings
            .filter(booking => {
                if(
                    booking.booking_event == this.state.searchDropdown || 
                    this.state.searchDropdown == ''
                )
                return booking
            })
            .filter(booking => {
                if(
                    booking.booking_status == this.state.searchStatus ||
                    this.state.searchStatus == ''
                )
                return booking
            })
            .filter(booking => {
                if(
                    moment(booking.booking_date,'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY') == 
                    moment(this.state.searchDate,'MM,DD,YYYY HH:mm:ss').format('MM/DD/YYYY') ||
                    this.state.searchDate == ''
                )
                return booking
            })
            .filter(booking => {
                if(
                    booking.booking_fname.indexOf(this.state.searchText) > -1 ||
                    booking.booking_lname.indexOf(this.state.searchText) > -1
                )
                return booking
            })
        
        this.setState({
            filteredBookings: bookings,
            selectedMembersCount: bookings.length
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
						onClick={this.handleParentCheckboxClick}
					/>
                    <Dropdown
						id="searchDropdown"
						item
						search
						selection
						className={classes.borderNone}
						placeholder="Choose the Event"
						options={this.state.events_list}
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
								this.setState({
									searchDate: date.format('MM,DD,YYYY HH:mm:ss')
                                }, () => this.setSearchedUser() )
							}}
							dateFormat="MMM Do YYYY"
							timeFormat={false}
						/>
                    </Menu.Item> 
                    <Dropdown
						id="searchStatus"
						item
						search
						selection
						className={classes.borderNone}
						placeholder="Choose the status"
						options={options}
						onChange={this.handleDropdown}
					/>
                    <Menu.Item>
                        <Popup
                            trigger={<strong className={classes.greenText}>{this.state.selectedMembersCount} {this.state.selectedMembersCount > 1 ? 'Bookings' : 'Booking'}</strong>}
                            content="Number of bookings in the selected event."
                        />
                    </Menu.Item>
                    <Menu.Item position='right'>
                        <Input
                            className="transparent"
                            icon='search link'
                            placeholder="Search members..."
                            type="text"
                            onChange={this.handleSearchTextChange}
                        />
                    </Menu.Item>           
                </Menu>
                <Segment attached='bottom'>
                    {
                        this.state.filteredBookings.map((booking, i) => (
                            <BookingItem
                                booking={booking}
                                index={i} 
                                handleSelectedBookingState={this.handleSelectedBookingState}
                                handleChangeBooking={this.handleChangeBooking}
                                isSelected={this.state.selectedBookings[i]}
                            />
                        ))
                    }
                </Segment>
                {
                    this.props.showCancelBookingModal ? 
                    <CancelBookingModal
                        open={this.props.showCancelBookingModal}
                        handleClose={this.props.handleCancelBookingModalClose}
                        selectedBookings={this.state.selectedBookings}
                        bookings={this.state.bookings}
                        handleChangeBooking={this.handleChangeBooking}
                    />
                    : null
                }
                {
                    this.props.showNoShowBookingModal ? 
                    <NoShowBookingModal
                        open={this.props.showNoShowBookingModal}
                        handleClose={this.props.handleNoShowBookingModalClose}
                        selectedBookings={this.state.selectedBookings}
                        bookings={this.state.bookings}
                        handleChangeBooking={this.handleChangeBooking}
                    />
                    : null
                }
                {
                    this.props.showAttendBookingModal ? 
                    <AttendBookingModal
                        open={this.props.showAttendBookingModal}
                        handleClose={this.props.handleAttendBookingModalClose}
                        selectedBookings={this.state.selectedBookings}
                        bookings={this.state.bookings}
                        handleChangeBooking={this.handleChangeBooking}
                    />
                    : null
                }  
                {
                    this.props.showRescheduleBookingModal ?
                    <RescheduleBookingModal
                        open={this.props.showRescheduleBookingModal}
                        handleClose={this.props.handleRescheduleBookingModalClose}
                        selectedBookings={this.state.selectedBookings}
                        bookings={this.state.bookings}
                        handleChangeBooking={this.handleChangeBooking}
                    />
                    : null
                }  
            </div>    
        )
    }
}

export default Bookings