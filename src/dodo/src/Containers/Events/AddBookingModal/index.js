import React from 'react'
import { Modal, Form, Input, Dropdown, Checkbox, Button, Icon } from 'semantic-ui-react'

import { showLoading } from '../../../Actions/index'

import Datetime from 'react-datetime'
import moment from 'moment'
import '../../Membership/AddMembership/DatePicker.scss'

import { API } from 'aws-amplify'
import { connect } from 'react-redux';


const bookingOptions = [
    { key:0, text: 'Booked', value: 0},
    { key:1, text: 'Cancelled', value: 1},
    { key:2, text: 'Attended', value: 2},
    { key:3, text: 'NO Show', value: 3}
]

class AddBooking extends React.Component {

    state = {
        booking_email: '',
        booking_event: '',
        booking_date: '',
        booking_status: '',
        booking_fee: '',
        booking_fname: '',
        booking_lname: '',
        booking_confirm: false,
        events_list: []
    }

    componentWillMount() {
        var zozo = this.props.events.map(event => {
            return {
                key: event.event_eventid,
                text: event.event_name,
                value: event.event_name
            }
        })
        this.setState({
            events_list: zozo
        })
    }

    validator = () => {
        return  this.state.booking_email.length &&
                this.state.booking_event.length && 
                this.state.booking_date.length && 
                this.state.booking_fee.length && 
                this.state.booking_fname.length && 
                this.state.booking_lname.length && 
                this.state.booking_confirm &&
                typeof(this.state.booking_status) == "number"
    }

    handleInputChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleDropdown = (e, data) => {
        this.setState({
            [data.id]: data.value
        })
    }

    handleFormSubmit = async event => {
        
        this.props.showLoading()

        try {
            const data = Object.assign({}, this.state)
            
            data['event_id'] = this.state.events_list.filter(item => item.value == data.booking_event)[0].key
            data['booking_fee'] = Number(data.booking_fee)
            var zozo = {
                business_id: this.props.business.bizid,
                bookings: data
            }
            console.log(zozo)
            const response = await API.post("events", "/booking", {
                body: zozo
            })
            this.props.handleAddBooking(response)
            this.props.handleClose()
            console.log(response)
        } catch(e) {
            console.log(e)
        }

        this.props.showLoading()
    }

    render() {
        return (
            <Modal
                size='small' 
                dimmer={'inverted'}
                open={this.props.open} 
                onClose={this.props.handleClose}>
                <Modal.Header><center>Add Booking</center></Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form>
                            <Form.Field>
                                <center>
                                    Please fill the below details to add booking to the event.
                                </center>    
                            </Form.Field>
                            <Form.Group widths="2">
                                <Form.Field required>
                                    <label>Email Address</label>
                                    <Input 
                                        id="booking_email"
                                        focus={true}
                                        placeholder="Email Address"
                                        type="email"
                                        onChange={this.handleInputChange}
                                        loading={this.props.isLoading}
                                    />    
                                </Form.Field>
                                <Form.Field required>
                                    <label>Event</label>
                                    <Dropdown
                                        id="booking_event"
                                        placeholder="Choose the event"
                                        fluid
                                        search
                                        selection
                                        options={this.state.events_list}
                                        onChange={this.handleDropdown}
                                    />
                                </Form.Field>    
                            </Form.Group>    
                            <Form.Group widths="3">
                                <Form.Field required>
                                    <label>Date</label>
                                    <Datetime
                                        onChange={date => {
                                            this.setState({
                                                booking_date: date.format('YYYY-MM-DD HH:mm:ss')
                                            })
                                        }}
                                        dateFormat="MMM Do YYYY"
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        inputProps={{ placeholder: 'From Date' }}
                                        renderInput={(props, openCalendar, closeCalendar) => (
                                            <Input icon="calendar" iconPosition="left" {...props} />
                                        )}
                                    /> 
                                </Form.Field>
                                <Form.Field required>
                                    <label>Status</label>
                                    <Dropdown
                                        id="booking_status"
                                        placeholder="Choose the status"
                                        fluid
                                        selection
                                        options={bookingOptions}
                                        onChange={this.handleDropdown}
                                    />
                                </Form.Field>
                                <Form.Field required>
                                    <label>Fees</label>
                                    <Input
                                        icon='rupee'
                                        iconPosition='left'
                                        id="booking_fee"
                                        placeholder="e.g. 500"
                                        type="number"
                                        onChange={this.handleInputChange}
                                        loading={this.props.isLoading}
                                    />
                                </Form.Field>    
                            </Form.Group>
                            <Form.Group widths="2">
                                <Form.Field required>
                                    <label>First Name</label>
                                    <Input
                                        placeholder="First Name"
                                        type="text"
                                        id="booking_fname"
                                        onChange={this.handleInputChange}
                                        loading={this.props.isLoading}
                                    />
                                </Form.Field>
                                <Form.Field required>
                                    <label>Last Name</label>
                                    <Input
                                        placeholder="Last Name"
                                        type="text"
                                        id="booking_lname"
                                        onChange={this.handleInputChange}
                                        loading={this.props.isLoading}
                                    />
                                </Form.Field>    
                            </Form.Group>
                            <Form.Field required>
                                <center>
                                    <Checkbox
                                        label={<label>I agree to the <a href="/terms">Terms of Service</a>.</label>}
                                        onChange={(e, data) => {
                                            this.setState({
                                                booking_confirm: data.checked
                                            })
                                        }}
                                    />
                                </center>    
                            </Form.Field>
                            <center>
                                <Button 
                                    color='green'
                                    icon 
                                    labelPosition='right'
                                    onClick={this.handleFormSubmit}
                                    >Add
                                    <Icon name='check' />
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

export default connect(mapStateToProps, { showLoading })(AddBooking)