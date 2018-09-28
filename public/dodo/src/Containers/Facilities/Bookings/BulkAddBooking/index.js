import React from 'react'
import { Modal, Form, Input } from 'semantic-ui-react'

import { connect } from 'react-redux'
import { showLoading } from '../../../../Actions/index'

import Datetime from 'react-datetime'
import moment from 'moment'
import '../../../Membership/AddMembership/DatePicker.scss'

class BulkAddBooking extends React.Component {

    state = {
        data: [
            {
                booking_email: '',
                booking_facility: '',
                booking_date: '',
                booking_status: '',
                booking_fee:'',
                booking_slot: '',
                booking_fullname: ''
            },
            {
                booking_email: '',
                booking_facility: '',
                booking_date: '',
                booking_status: '',
                booking_fee:'',
                booking_slot: '',
                booking_fullname: ''
            },
            {
                booking_email: '',
                booking_facility: '',
                booking_date: '',
                booking_status: '',
                booking_fee:'',
                booking_slot: '',
                booking_fullname: ''
            },
            {
                booking_email: '',
                booking_facility: '',
                booking_date: '',
                booking_status: '',
                booking_fee:'',
                booking_slot: '',
                booking_fullname: ''
            },
            {
                booking_email: '',
                booking_facility: '',
                booking_date: '',
                booking_status: '',
                booking_fee:'',
                booking_slot: '',
                booking_fullname: ''
            }
        ],
        facility_list: []
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

    handleFormSubmit = event => {

    }

    renderRows = key => (
        <Form.Group widths={7} key={key}>
            <Form.Field className={ key ? null : "required"}>
                <label>{key ? null : 'Email Address'}</label>
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
                    <label>{ key ? null : 'Facility'}</label>
                    <Dropdown
                        fluid
                        search
                        selection
                        placeholder="Facility"
                        options={this.state.facility_list}
                        onChange={(e, data) => {
                            e.persist()
                            this.setState(state => ({
                                ...state,
                                data: [
                                    ...state.data.slice(0, key),
                                    { ...state.data[key], booking_facility: data.value },
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
                <Form.Field className={ key ? null: "required"}>
                    <label>{ key ? null : 'Slot'}</label>
                    <Dropdown
                        fluid
                        search
                        selection
                        placeholder="Slot"
                        onChange={(e, data) => {
                            e.persist()
                            this.setState(state => ({
                                ...state,
                                data: [
                                    ...state.data.slice(o, key),
                                    { ...state.data[key], booking_slot: data.value },
                                    ...state.data.slice(key + 1)
                                ]
                            }))
                        }}
                    />
                </Form.Field>
                <Form.Field width={3} className={ key ? null: "required"}>
                    <label>{ key ? null : 'Status'}</label>
                    <Dropdown
                        fluid
                        search
                        selection
                        placeholder="Status"
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
                <Form.Field width={2} className={ key ? null: "required"}>
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

    render() {
        const {
            open,
            handleClose
        } = this.props
        return (
            <Modal
                open={open}
                size='fullscreen'
                dimmer={'inverted'}
                onClose={handleClose}
            >
                <Modal.Header><center>Add Bulk Bookings</center></Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form>
                            <Form.Field>
                                <center>
                                    Please fill the below details to add bookings to the facility.
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
                                        onClick={handleClose}
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

const mapStateToProps = state => ({
    isLoading: state.isLoading
})

export default connect(mapStateToProps, { showLoading })(BulkAddBooking)