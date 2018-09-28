import React from 'react'
import { Modal, Header, Segment, Checkbox, Button } from 'semantic-ui-react'

import { connect } from 'react-redux'
import { showLoading } from '../../../../Actions/index'

import { API } from 'aws-amplify'

class CancelBooking extends React.Component {
    state = {
        issueRefundRegardlessPolicy: false
    }

    handleCancelBooking = async e => {
        this.props.showLoading()

        try { 
            if(this.props.selectedBookings) {
                //Code block for multiple selecions
                var a = this.props.bookings.map((item, index) => {
                    if(this.props.selectedBookings[index]) {
                        return item
                    }
                }).filter(item => item!= undefined)

                var z = a.map(item => {
                    return {
                        booking_id: item.booking_beid,
                        booking_status: 1
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
                    item.booking_status = 1
                    this.props.handleChangeBooking(item)
                })
                this.props.handleClose()

            } else {
                //Code block for single selection
                const booking = this.props.booking
                const data = {
                    bookings: [{
                        booking_id: booking.booking_beid,
                        booking_status: 1 
                    }]
                }
                const response = await API.post("events", "/booking_status", {
                    body : data
                })
                console.log(response)
                booking['booking_status'] = 1
                this.props.handleChangeBooking(booking)
                this.props.handleClose()
            }
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
        return(
            <Modal size='tiny' open={open} onClose={handleClose} dimmer={'inverted'}>
                <Modal.Header>Cancelling the booking</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header color='red' content="You have intended to cancel the booking." />
                        <p>This will issue refund to the users as per the policy. Is it okay to cancel the booking?</p>
                        <Segment>
                            <div className="inline field">
                                <Checkbox
                                    label="Issue full refund (after the service fee) regardless of the policy."
                                    onChange={(_, data) => {
                                        this.setState({
                                            issueRefundRegardlessPolicy: data.checked
                                        })
                                    }}
                                />
                            </div>
                        </Segment>    
                    </Modal.Description>    
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        positive
                        className="deny"
                        content="Back"
                        onClick={handleClose}
                        disabled={this.props.isLoading}
                    />
                    <Button
                        color='red'
                        content="Cancel Booking"
                        loading={this.props.isLoading}
                        onClick={this.handleCancelBooking}
                    />
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

export default connect(mapStateToProps, { showLoading })(CancelBooking)
