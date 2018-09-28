import React from 'react'
import { Modal, Header, Button, Icon } from 'semantic-ui-react'

import { connect } from 'react-redux'
import { showLoading } from '../../../../Actions/index'

import { API } from 'aws-amplify'

class AttendBooking extends React.Component {

    handleMarkBookingAsAttended = async e => {
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
                        booking_status: 2
                    }
                })
                console.log(z)
                const response = await API.post("events", "/booking_status", {
                    body : {
                        bookings: z
                    }
                })
                console.log(response)
                a.map(item => {
                    item.booking_status = 2
                    this.props.handleChangeBooking(item)
                })
                this.props.handleClose()

            } else {
                //Code block for single booking
                const booking = this.props.booking
                const data = {
                    bookings: [{
                        booking_id: booking.booking_beid,
                        booking_status: 2
                    }]
                }

                const response = await API.post("events", "/booking_status", {
                    body : data
                })

                console.log(response)
                booking['booking_status'] = 2
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
            <Modal size='tiny' open={open} onClose={handleClose} dimmer={'inverted'}>
                <Modal.Header>Mark as Attended</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header color='red' content="You have intended to mark the booking as attended." />  
                        <p>Is it okay to mark the booking as attended?</p> 
                    </Modal.Description>    
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
                        loading={this.props.isLoading}
                        onClick={this.handleMarkBookingAsAttended}
                    >
                        Proceed
                        <Icon name='chevron right' />
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

export default connect(mapStateToProps, { showLoading })(AttendBooking)