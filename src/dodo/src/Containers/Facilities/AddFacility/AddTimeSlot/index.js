import React from 'react'
import { Modal, Form, Dropdown, Input, Popup, Checkbox, Button , Icon} from 'semantic-ui-react'
import Datetime from 'react-datetime'
import moment from 'moment'
import TimePicker from '../../../../Components/UI/TimePicker'
import '../../../Membership/AddMembership/DatePicker.scss'

const slot_days = [
    { key:0, text: 'Sunday', value: 0},
    { key:1, text: 'Monday', value: 1},
    { key:2, text: 'Tuesday', value: 2},
    { key:3, text: 'Wednesday', value: 3},
    { key:4, text: 'Thursday', value: 4},
    { key:5, text: 'Friday', value: 5},
    { key:6, text: 'Saturday', value: 6}
]

const groups = [
    { key:0, text: 'General', value:0 },
    { key:1, text: 'Off-peak Hours', value:1 },
    { key:2, text: 'Peak Hours', value:2 },
    { key:3, text: 'Junior', value:3 },
    { key:4, text: 'Senior', value:4 },
    { key:5, text: 'Adult', value:5 }
]

class AddTimeSlot extends React.Component {

    state = {
        slot_day: '',
        slot_start: '',
        slot_end: '',
        slot_cost: '',
        slot_group: '',
        slot_membersonly: false,
        showTimePopUpForStart: false,
        showTimePopUpForEnd: false
    }

    handleDropdown = (e, data) => {
        this.setState({
            [data.id]: data.value
        })
    }

    handleInputChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = e => {
        const data = Object.assign({}, this.state)
        delete data.showTimePopUpForEnd
        delete data.showTimePopUpForStart
        console.log(data)
        this.props.handleAddTimeSlot(data)
        this.props.handleClose()
    }

    render() {
        const {
            open,
            handleClose
        } = this.props
        return (
            <Modal 
                open={open} 
                onClose={handleClose} 
                size='small' 
                dimmer={'inverted'}
                closeOnDimmerClick={
                    !this.state.showTimePopUpForEnd &&
                    !this.state.showTimePopUpForStart
                }
            >
                <Modal.Header>
                    <center>
                        Add Timeslot
                    </center>
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form>
                            <Form.Field>
                                <center>
                                    Please fill the details carefully here as it will be displayed to end users.
                                </center>
                            </Form.Field>
                            <Form.Group widths={3}>
                                <Form.Field required width={8}>
                                    <label>Day</label>
                                    <Dropdown
                                        id="slot_day"
                                        placeholder="Choose the type"
                                        selection
                                        options={slot_days}
                                        onChange={this.handleDropdown}
                                    />
                                </Form.Field>
                                <Form.Field width={8} required>
                                    <label>Time Window</label>
                                    <Form.Group widths={2} required>
                                        <Form.Field width={8}>
                                            <TimePicker
                                                icon='time'
                                                showPopUp={this.state.showTimePopUpForStart}
                                                handelPopUpChange={popUpState =>
                                                    this.setState({ showTimePopUpForStart: popUpState })
                                                }
                                                placeholder="Start Time"
                                                time={this.state.slot_start}
                                                setTime={time => this.setState({ slot_start: time })}
                                            /> 
                                        </Form.Field>
                                        <Form.Field width={8}>
                                            <TimePicker
                                                icon='time'
                                                showPopUp={this.state.showTimePopUpForEnd}
                                                handelPopUpChange={popUpState =>
                                                    this.setState({ showTimePopUpForEnd: popUpState })
                                                }
                                                placeholder="End Time"
                                                time={this.state.slot_end}
                                                setTime={time => this.setState({ slot_end: time })}
                                            /> 
                                        </Form.Field>
                                    </Form.Group>
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths={3}>
                                <Form.Field required>
                                    <label>Guest Pricing</label>
                                    <Input
                                        id="slot_cost"
                                        icon='rupee'
                                        iconPosition='left'
                                        type="number"
                                        placeholder='e.g. 300'
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Field>
                                <Form.Field required>
                                    <Popup
                                        trigger={<label>Slot Group</label>}
                                        content='Slot Group to be classified for further use in Membership. You can just type to create a new group.'
                                    />
                                    <Dropdown
                                        id="slot_group"
                                        search
                                        selection
                                        placeholder='Group'
                                        options={groups}
                                        onChange={this.handleDropdown}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Allow members only</label>
                                    <Checkbox 
                                        toggle
                                        onChange={(e, data) => {
                                            console.log(data)
                                            this.setState({
                                                slot_membersonly: data.checked
                                            })
                                        }}
                                        checked={this.state.slot_membersonly}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <center>
                        <Button
                            color='red'
                            className='cancel'
                            content='Cancel'
                            onClick={handleClose}
                        />
                        <Button
                            color='green'
                            icon
                            labelPosition='right'
                            onClick={this.handleSubmit}
                        >
                            Create
                            <Icon name='check' />
                        </Button>
                    </center>
                </Modal.Actions>
            </Modal>
        )
    }
}


export default AddTimeSlot