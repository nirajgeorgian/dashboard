import React from 'react'
import { Modal, Form, Input, Dropdown, Button, Icon } from 'semantic-ui-react'

import Datetime from 'react-datetime'
import moment from 'moment'
import '../../Membership/AddMembership/DatePicker.scss'
import { connect } from 'react-redux';
import { showLoading } from '../../../Actions/index'

import { API } from 'aws-amplify'

const bookingOptions = [
    { key:0, text: 'Booked', value: 0},
    { key:1, text: 'Cancelled', value: 1},
    { key:2, text: 'Attended', value: 2},
    { key:3, text: 'No Show', value: 3}
]

class BulkBookingModal extends React.Component {

    state = {
        events_list: [],
        data: [
            {
                booking_email: '',
                booking_event: '',
                booking_date: '',
                booking_status: '',
                booking_fee: '',
                booking_fullname: ''

            },
            {
                booking_email: '',
                booking_event: '',
                booking_date: '',
                booking_status: '',
                booking_fee: '',
                booking_fullname: ''

            },
            {
                booking_email: '',
                booking_event: '',
                booking_date: '',
                booking_status: '',
                booking_fee: '',
                booking_fullname: ''

            },
            {
                booking_email: '',
                booking_event: '',
                booking_date: '',
                booking_status: '',
                booking_fee: '',
                booking_fullname: ''

            },
            {
                booking_email: '',
                booking_event: '',
                booking_date: '',
                booking_status: '',
                booking_fee: '',
                booking_fullname: ''

            },
        ]
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
        var a = this.state.data.map(item => {
                    if(item.booking_email || item.booking_date || item.booking_event || item.booking_fee || item.booking_fullname || typeof(item.booking_status) == 'number') {
                        if(item.booking_email && item.booking_date && item.booking_event && item.booking_fee && item.booking_fullname && typeof(item.booking_status) == 'number') {
                            return true
                        } else {
                            return false
                        }
                    }
                }).filter(item => item != undefined)
        
        if(a.length == 0) {
            return false
        } else {
            return a.reduce((result, val) => { return result && val })
        }
    }

    renderRows = (key) => {
        return (
            <Form.Group widths={6} key={key}>
                <Form.Field className={ key ? null: "required"}>
                    <label>{ key ? null : 'Email Address'}</label>
                    <Input
                        placeholder="Email Address"
                        type="email"
                        onChange={e => {
                            e.persist()
                            this.setState(state => ({
                                ...state,
                                data: [
                                    ...state.data.slice(0, key),
                                    { ...state.data[key], booking_email: e.target.value },
                                    ...state.data.slice(key + 1)
                                ]
                            }))
                        }}
                    />    
                </Form.Field>
                <Form.Field className={ key ? null: "required"}> 
                    <label>{ key ? null : 'Full Name'}</label>
                    <Input
                        placeholder="e.g. Steve Jobs"
                        type="text"
                        onChange={e => {
                            e.persist()
                            this.setState(state => ({
                                ...state,
                                data: [
                                    ...state.data.slice(0, key),
                                    { ...state.data[key], booking_fullname: e.target.value },
                                    ...state.data.slice(key + 1)
                                ]
                            }))
                        }}
                    /> 
                </Form.Field>
                <Form.Field width={4} className={ key ? null: "required"}>
                    <label>{ key ? null : 'Event'}</label>
                    <Dropdown
                        fluid
                        search
                        selection
                        placeholder="Event"
                        options={this.state.events_list}
                        onChange={(e, data) => {
                            e.persist()
                            this.setState(state => ({
                                ...state,
                                data: [
                                    ...state.data.slice(0, key),
                                    { ...state.data[key], booking_event: data.value },
                                    ...state.data.slice(key + 1)
                                ]
                            }))
                        }}
                    />
                </Form.Field>  
                <Form.Field width={2} className={ key ? null: "required"}>
                    <label>{ key ? null : 'Date'}</label>
                    <Datetime
                        dateFormat="MMM Do YYYY"
                        timeFormat={false}
                        closeOnSelect={true}
                        inputProps={{ placeholder: 'Date' }}
                        onChange={date => {
                            this.setState(state => ({
                                ...state,
                                data: [
                                    ...state.data.slice(0, key),
                                    { ...state.data[key], booking_date: date.format('YYYY-MM-DD HH:mm:ss') },
                                    ...state.data.slice(key + 1)
                                ]
                            }))
                        }}
                        renderInput={(props, openCalendar, closeCalendar) => (
                            <Input icon="calendar" iconPosition="left" {...props} />
                        )}
                    />
                </Form.Field> 
                <Form.Field width={3} className={ key ? null: "required"}>
                    <label>{ key ? null : 'Status'}</label>
                    <Dropdown
                        fluid
                        search
                        selection
                        placeholder="Choose the status"
                        options={bookingOptions}
                        onChange={(e, data) => {
                            e.persist()
                            this.setState(state => ({
                                ...state,
                                data: [
                                    ...state.data.slice(0, key),
                                    { ...state.data[key], booking_status: data.value },
                                    ...state.data.slice(key + 1)
                                ]
                            }))
                        }}
                    />
                </Form.Field> 
                <Form.Field width="2" className={ key ? null: "required"}>
                    <label>{ key ? null : 'Fees'}</label>
                    <Input
                        placeholder="e.g. 300"
                        type="text"
                        icon='rupee'
                        iconPosition='left'
                        onChange={e => {
                            e.persist()
                            this.setState(state => ({
                                ...state,
                                data: [
                                    ...state.data.slice(0, key),
                                    { ...state.data[key], booking_fee: e.target.value },
                                    ...state.data.slice(key + 1)
                                ]
                            }))
                        }}
                    />
                </Form.Field>      
            </Form.Group>
        )
    }

    handleFormSubmit = async event => {
        const bookings = this.state.data.filter(item => item.booking_email != '')
        bookings.map(booking => {
            booking['event_id'] = this.state.events_list.filter(item => item.value == booking.booking_event)[0].key
            booking['booking_fname'] = booking.booking_fullname.split(" ")[0]
            booking['booking_lname'] = booking.booking_fullname.split(" ")[1] ? booking.booking_fullname.split(" ")[1] : null
            booking['booking_fee'] = Number(booking.booking_fee)
        })

        var zozo = {
            business_id: this.props.business.bizid,
            bookings: bookings
        }
        this.props.showLoading()
        console.log(zozo)
        try {
            
            const response = await API.post("events", "/booking", {
                body: zozo
            })
            
            console.log(response)
        } catch(e) {
            console.log(e)
        }

        this.props.showLoading()
    }

    render() {
        return (
            <Modal
                size='fullscreen'
                open={this.props.open}
                dimmer={'inverted'}
                onClose={this.props.handleClose}
            >
                <Modal.Header><center>Add Bulk Bookings</center></Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form>
                            <Form.Field>
                                <center>
                                    Please fill the below details to add bookings to the event.
                                </center>    
                            </Form.Field>
                            {
                                this.state.data.map((item, key) => (
                                    this.renderRows(key)
                                ))
                            }
                            <Modal.Actions>
                                <center>
                                    <Button 
                                        color='red' 
                                        className="deny" 
                                        content='Cancel'
                                        disabled={this.props.isLoading}
                                        onClick={this.props.handleClose}
                                    />
                                    <Button
                                        positive
                                        icon
                                        labelPosition='right' 
                                        disabled={!this.validator()}
                                        loading={this.props.isLoading}
                                        onClick={this.handleFormSubmit}
                                    >Add
                                        <Icon name='check' />
                                    </Button>    
                                </center>    
                            </Modal.Actions>  
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

export default connect(mapStateToProps, { showLoading })(BulkBookingModal)