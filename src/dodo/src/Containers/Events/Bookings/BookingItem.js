import React from 'react'
import { Form, Icon, Header, Popup } from 'semantic-ui-react'

import classes from './Bookings.local.scss'
import moment from 'moment'

import CancelBookingModal from './CancelBooking/index'
import NoShowBookingModal from './NoShowBooking/index'
import AttendBookingModal from './AttendBooking/index'
import RescheduleBookingModal from './RescheduleBooking/index'

const bookingOptions = [
    { key:0, text: 'Booked', value: 0},
    { key:1, text: 'Cancelled', value: 1},
    { key:2, text: 'Attended', value: 2},
    { key:3, text: 'No Show', value: 3}
]

class BookingItem extends React.Component {
    state = {
        selected: false,
        showCancelBookingModal: false,
        showNoShowBookingModal: false,
        showAttendBookingModal: false,
        showRescheduleBookingModal: false
    }

    handleSelectBooking = async event => {
        await this.setState({
            selected: !this.state.selected
        })
        this.props.handleSelectedBookingState(this.props.index, this.state.selected)
    }

    handleChangeBooking = (booking) => {
        this.props.handleChangeBooking(booking)
    }

    getBookingStatusText = (status) => {
        return bookingOptions
                .filter(item => item.value == status)[0].text
    }

    getBookingInfoText = (booking_id, booking_time, booking_coupon) => {
        return (
            <div>
                Booking ID: {booking_id}
                <br />Time: {booking_time}
                <br />Coupon: {booking_coupon}
            </div>   
        )
    }

    render() {
        const {
            booking_fname,
            booking_lname,
            booking_event,
            booking_fee,
            booking_status,
            booking_date,
            booking_beid
        } = this.props.booking
        return (
            <div key={this.props.index}>
                <Form className={classes.bookingfield} key={this.props.index}>
                    <Form.Group widths={3}>
                        <Form.Field width={1} className={classes.fields}>
                            <Icon 
                                name={this.props.isSelected ? 'check square outline pointer' : 'square outline pointer'}
                                onClick={this.handleSelectBooking}
                            />
                        </Form.Field>
                        <Form.Field width={3} className={classes.fields}>
                            <strong>{booking_fname} {booking_lname}</strong>
                            { booking_fname == "Niraj" ?
                                <Icon 
                                    name='wheelchair' 
                                    color='red' 
                                    style={{ cursor: pointer }} 
                                /> 
                                : null
                            }
                        </Form.Field>
                        <Form.Field width={3} className={classes.fields}>
                            {booking_event}
                        </Form.Field> 
                        <Form.Field width={1} className={classes.fields}>
                            ₹{booking_fee}
                        </Form.Field>
                        <Form.Field width={2} className={classes.fields}>
                            { this.getBookingStatusText(booking_status) }
                        </Form.Field>  
                        <Form.Field width={3}>
                            { moment(booking_date).format("Do MMMM hh:mm A")}
                        </Form.Field>
                        <Form.Field width={3}>
                            <Popup
                                trigger={<Icon 
                                            name='check'
                                            color={booking_status == 2 ? 'green' : 'grey'} 
                                            style={{ cursor: 'pointer' }}
                                            onClick={e => {
                                                this.setState({
                                                    showAttendBookingModal: true
                                                })
                                            }}
                                        />}
                                content={booking_status == 2 ? "Booking has been already marked as attended" : "Click to mark the booking as attended."}
                            />
                            <Popup
                                trigger={<Icon 
                                            name='redo'
                                            color='blue'
                                            style={{ cursor: 'pointer' }}
                                            onClick={e => {
                                                this.setState({
                                                    showRescheduleBookingModal: true
                                                })
                                            }}
                                        />}
                                content="Click here to reschedule."
                            />
                            <Popup
                                trigger={<Icon 
                                            name='eye slash outline'
                                            color={booking_status == 3 ? 'red' : 'grey'}
                                            style={{ cursor: 'pointer' }}
                                            onClick={e => {
                                                this.setState({
                                                    showNoShowBookingModal: true
                                                })
                                            }}
                                        />}
                                content={booking_status == 3 ? "Booking has been already marked as No Show" : "Click to mark the user didn't attend the event. Refund if policy defined."}
                            />
                            <Popup
                                trigger={<Icon 
                                            name='times'
                                            id="cancelBooking"
                                            color={booking_status == 1 ? 'red' : 'grey'}
                                            style={{ cursor: 'pointer' }}
                                            onClick={e => {
                                                this.setState({
                                                    showCancelBookingModal: true
                                                })
                                            }}
                                        />}
                                content={booking_status == 1 ? "Booking has been already cancelled" : "Cancel this booking & issue refund."}
                            />
                            <Popup
                                trigger={<Icon 
                                            name='comment alternate'
                                            color='blue'
                                            style={{ cursor: 'pointer' }}
                                        />}
                                content="Message this user directly."
                            />
                            <Popup
                                trigger={<Icon 
                                            name='info'
                                            style={{ cursor: 'pointer' }}
                                        />}
                                content={this.getBookingInfoText(booking_beid,moment(booking_date).format("Do MMMM hh:mm A"),'Nil.')}
                            />
                        </Form.Field>                 
                    </Form.Group>    
                </Form>
                <Header dividing className={classes.header}/>
                {
                    this.state.showCancelBookingModal ? 
                    <CancelBookingModal
                        open={this.state.showCancelBookingModal}
                        handleClose={() => {
                            this.setState({
                                showCancelBookingModal: false
                            })
                        }}
                        booking={this.props.booking}
                        handleChangeBooking={this.handleChangeBooking}
                    />
                    : null
                }
                {
                    this.state.showNoShowBookingModal ? 
                    <NoShowBookingModal
                        open={this.state.showNoShowBookingModal}
                        handleClose={() => {
                            this.setState({
                                showNoShowBookingModal: false
                            })
                        }}
                        booking={this.props.booking}
                        handleChangeBooking={this.handleChangeBooking}
                    />
                    : null
                }
                {
                    this.state.showAttendBookingModal ? 
                    <AttendBookingModal
                        open={this.state.showAttendBookingModal}
                        handleClose={() => {
                            this.setState({
                                showAttendBookingModal: false
                            })
                        }}
                        booking={this.props.booking}
                        handleChangeBooking={this.handleChangeBooking}
                    />
                    : null
                }
                {
                    this.state.showRescheduleBookingModal ? 
                    <RescheduleBookingModal
                        open={this.state.showRescheduleBookingModal}
                        handleClose={() => {
                            this.setState({
                                showRescheduleBookingModal: false
                            })
                        }}
                        booking={this.props.booking}
                        handleChangeBooking={this.handleChangeBooking}
                    />
                    : null
                }
            </div>        
        )
    }
}

export default BookingItem;