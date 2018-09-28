import React from 'react'
import { Modal, Dropdown, Button, Icon, Input, Form } from 'semantic-ui-react'

import { connect } from 'react-redux'
import { showLoading } from '../../../../Actions/index'

import Datetime from 'react-datetime'
import moment from 'moment'
import '../../../Membership/AddMembership/DatePicker.scss'

const bookingOptions = [
    { key:0, text: 'Booked', value: 0},
    { key:1, text: 'Cancelled', value: 1},
    { key:2, text: 'Attended', value: 2},
    { key:3, text: 'No Show', value: 3}
]

class AddBooking extends React.Component {
    state = {
        email: '',
        facility: '',
        date: '',
        status: '',
        fees:'',
        slot: '',
        booking_fname: '',
        booking_lname: '', 
        facility_slots: [],
        facility_list: []
    }

    componentDidMount() {
        console.log(this.props.facilities)
        const facilities = this.props.facilities.map((item, key) => ({
			key: key,
			text: item.fname,
			value: item.fid
		}))
        this.setState({
            facility_list: facilities
        })
    }

    handleInputChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleDropdown = async (e, data) => {
        await this.setState({
            [data.id]: data.value
        })
        if([data.id] == 'facility') {
            var facility = this.props.facilities.filter(item => item.fid == data.value)[0]
            var slots = facility.ftimeslot.map((item, key) => ({
                key: key,
                text: item.slot_start + ' - ' + item.slot_end,
                value: item.slot_start + ' - ' + item.slot_end,
            }))
            this.setState({
                facility_slots: slots
            })
        } else if([data.id] == 'slot') {
            var facility = this.props.facilities.filter(item => item.fid == this.state.facility)[0]
            facility.ftimeslot.map(item => {
                if(
                    item.slot_start == this.state.slot.split("-")[0].trim() &&
                    item.slot_end == this.state.slot.split("-")[1].trim()
                )
                this.setState({
                    fees: item.slot_cost
                })
            })
        }
    }

    handleFormSubmit = event => {

    }

    render() {
        const {
            open,
            handleClose
        } = this.props
        return (
            <Modal
                size='small'
                dimmer={'inverted'}
                open={open}
                onClose={handleClose}>   
                <Modal.Header><center>Add Booking</center></Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form>
                            <Form.Field>
                                <center>
                                    Please fill the below details to add booking to the facility.
                                </center>    
                            </Form.Field>
                            <Form.Group widths="2">
                                <Form.Field required>
                                    <label>Email Address</label>
                                    <Input 
                                        id="email"
                                        focus={true}
                                        placeholder="Email Address"
                                        type="email"
                                        onChange={this.handleInputChange}
                                        loading={this.props.isLoading}
                                    />    
                                </Form.Field>
                                <Form.Field required>
                                    <label>Facility</label>
                                    <Dropdown
                                        id="facility"
                                        placeholder="Choose the Facility"
                                        fluid
                                        search
                                        selection
                                        options={this.state.facility_list}
                                        onChange={this.handleDropdown}
                                    />
                                </Form.Field>    
                            </Form.Group>
                            <Form.Group widths="4">
                                <Form.Field required>
                                    <label>Date</label>
                                    <Datetime
                                        onChange={date => {
                                            this.setState({
                                                date: date.format('YYYY-MM-DD HH:mm:ss')
                                            })
                                        }}
                                        dateFormat="MMM Do YYYY"
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        inputProps={{ placeholder: 'Date' }}
                                        renderInput={(props, openCalendar, closeCalendar) => (
                                            <Input icon="calendar alternate outline" iconPosition="left" {...props} />
                                        )}
                                    /> 
                                </Form.Field>
                                <Form.Field required>
                                    <label>Slot</label>
                                    <Dropdown
                                        id="slot"
                                        placeholder="Slot"
                                        fluid
                                        selection
                                        options={this.state.facility_slots}
                                        onChange={this.handleDropdown}
                                    />
                                </Form.Field>
                                <Form.Field required>
                                    <label>Status</label>
                                    <Dropdown
                                        id="status"
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
                                        id="fees"
                                        placeholder="e.g. 500"
                                        type="number"
                                        value={this.state.fees}
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

const mapStateToProps = state => ({
    isLoading: state.isLoading
})

export default connect(mapStateToProps, { showLoading })(AddBooking);