import React from 'react'
import { Modal, Icon, Button, Form, Input } from 'semantic-ui-react'

import { connect } from 'react-redux'
import { showLoading } from '../../../../Actions/index'

import Datetime from 'react-datetime'
import '../../../Membership/AddMembership/DatePicker.scss'
import moment from 'moment'

import { API } from 'aws-amplify'

class RescheduleBooking extends React.Component {

    state = {
        new_booking_date: ''
    }

    handleRescheduleBooking = async e => {

        this.props.showLoading()

        try {
            if(this.props.selectedBookings) {
                //Code block for multiple bookings
                var a = this.props.bookings.map((item, index) => {
                    if(this.props.selectedBookings[index]) {
                        return item
                    }
                }).filter(item => item!= undefined)

                var z = a.map(item => {
                    return {
                        booking_id: item.booking_beid,
                        booking_date: this.state.new_booking_date
                    }
                })
                console.log(z)
                const response = await API.post("events", "/booking_date", {
                    body : {
                        bookings: z
                    }
                })
                console.log(response)
                a.map(item => {
                    item.booking_date = this.state.new_booking_date
                    this.props.handleChangeBooking(item)
                })
                this.props.handleClose()

            } else {
                //Code block for single booking
                const booking = this.props.booking
                const data = {
                    bookings: [{
                        booking_id: booking.booking_beid,
                        booking_date: this.state.new_booking_date
                    }]
                }

                const response = await API.post("events", "/booking_date", {
                    body : data
                })

                console.log(response)
                booking['booking_date'] = this.state.new_booking_date
                this.props.handleChangeBooking(booking)
                this.props.handleClose()
            }

            this.props.handleClose()
        } catch(e) {
            console.log(e)
        }

        this.props.showLoading()
    }

    render() {
        const {
            open,
            handleClose
        } = this.props
        return (
            <Modal size='mini' open={open} onClose={handleClose} dimmer={'inverted'}>
                <Modal.Header>
                    <center>
                        Reschedule
                    </center>
                </Modal.Header>  
                <Modal.Content>
                    <center>
                        <Form>
                            <Form.Field>
                                You have intended to reschedule this booking.
                                <br /> Rescheduling the booking will notify the users.
                            </Form.Field> 
                            <Form.Field required>
                                <Datetime
                                    dateFormat="MMM Do YYYY"
                                    timeFormat={false}
                                    closeOnSelect={true}
                                    inputProps={{ placeholder: 'New Date' }}
                                    onChange={date => {
                                        this.setState({
                                            new_booking_date: date.format('YYYY-MM-DD HH:mm:ss')
                                        })
                                    }}
                                    renderInput={(props, openCalendar, closeCalendar) => (
                                        <Input icon="calendar alternate outline" iconPosition="left" {...props} />
                                    )}
                                />
                            </Form.Field>    
                        </Form>    
                    </center>    
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color='red'
                        className="deny"
                        content="Cancel"
                        onClick={handleClose}
                        disabled={this.props.isLoading}
                    />
                    <Button
                        positive
                        icon
                        labelPosition='right'
                        disabled={this.state.new_booking_date == ''}
                        loading={this.props.isLoading}
                        onClick={this.handleRescheduleBooking}
                    >Reschedule
                        <Icon name='redo' />
                    </Button>
                </Modal.Actions>              
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        isLoading: state.isLoading
    }
}

export default connect(mapStateToProps, { showLoading })(RescheduleBooking)