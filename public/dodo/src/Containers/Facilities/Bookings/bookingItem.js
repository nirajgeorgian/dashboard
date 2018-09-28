import React from 'react'
import { Form, Icon, Popup, Header } from 'semantic-ui-react'

import classes from './BookingItem.local.scss'

const bookingOptions = [
    { key:0, text: 'Booked', value: 0},
    { key:1, text: 'Cancelled', value: 1},
    { key:2, text: 'Attended', value: 2},
    { key:3, text: 'No Show', value: 3}
]

class BookingItem extends React.Component {

    handleSelectBooking = event => {

    }

    getBookingStatusText = (status) => {
        return bookingOptions
                .filter(item => item.value == status)[0].text
    }

    getBookingInfoText = (booking_id, booking_coupon) => {
        return (
            <div>
                Booking ID: {booking_id}
                <br />Coupon: {booking_coupon}
            </div>   
        )
    }

    render() {
        return (
            <div key={this.props.index}>
                <Form className={classes.bookingfield} key={this.props.index}>
                    <Form.Group widths={7}>
                        <Form.Field width={1} className={classes.fields}>
                            <Icon 
                                name={this.props.isSelected ? 'check square outline pointer' : 'square outline pointer'}
                                onClick={this.handleSelectBooking}
                            />
                        </Form.Field>
                        <Form.Field width={3} className={classes.fields}>
                            <strong>{booking_fname} {booking_lname}</strong>
                            {
                                booking_fname == "Niraj" ? 
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
                        <Form.Field width={3} className={classes.fields}>
                            { moment(booking_date).format("Do MMMM hh:mm A")}
                        </Form.Field>
                        <Form.Field width={3} className={classes.fields}>
                            <Popup
                                trigger={<Icon
                                            name='redo'
                                            color='blue'
                                            style={{ cursor: 'pointer'}}
                                        />}
                                content="Click here to reschedule."
                            />
                            <Popup
                                trigger={<Icon
                                            name='eye slash outline'
                                            color='grey'
                                            style={{ cursor: 'pointer'}}
                                        />}
                                content="Click to mark the user didn't attend the slot. Refund if policy defined."
                            />
                            <Popup
                                trigger={<Icon
                                            name='times'
                                            color='grey'
                                            style={{ cursor: 'pointer'}}
                                        />}
                                content="Cancel this booking & issue refund."
                            />
                            <Popup
                                trigger={<Icon
                                            name='comment alternate'
                                            color='blue'
                                            style={{ cursor: 'pointer'}}
                                        />}
                                content="Message this user directly."
                            />
                            <Popup
                                trigger={<Icon
                                            name='info'
                                            // color='blue'
                                            style={{ cursor: 'pointer'}}
                                        />}
                                content={this.getBookingInfoText(booking_beid,booking_coupon)}
                            />
                            <Popup
                                trigger={<Icon
                                            name='check'
                                            color={booking_status == 2 ? 'green' : 'grey'} 
                                            style={{ cursor: 'pointer' }}
                                        />}
                                content={booking_status == 2 ? "Booking has been already marked as attended" : "Click to mark the booking as attended."}
                            />
                        </Form.Field>
                    </Form.Group>
                </Form>
                <Header dividing className={classes.header}/>
            </div>
        )
    }
}

export default BookingItem