import React from 'react'
import { Modal, Button, Form, Dropdown, Input, Popup, Checkbox, Icon } from 'semantic-ui-react'

import TimePicker from '../../../../Components/UI/TimePicker'

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

class BulkAddTimeSlot extends React.Component {

    state = {
        data: [
            {
                slot_day: '',
                slot_start: '',
                slot_end: '',
                slot_cost: '',
                slot_group: '',
                slot_membersonly: false,
                showTimePopUpForStart: false,
                showTimePopUpForEnd: false
            },
            {
                slot_day: '',
                slot_start: '',
                slot_end: '',
                slot_cost: '',
                slot_group: '',
                slot_membersonly: false,
                showTimePopUpForStart: false,
                showTimePopUpForEnd: false
            },
            {
                slot_day: '',
                slot_start: '',
                slot_end: '',
                slot_cost: '',
                slot_group: '',
                slot_membersonly: false,
                showTimePopUpForStart: false,
                showTimePopUpForEnd: false
            },
            {
                slot_day: '',
                slot_start: '',
                slot_end: '',
                slot_cost: '',
                slot_group: '',
                slot_membersonly: false,
                showTimePopUpForStart: false,
                showTimePopUpForEnd: false
            },
            {
                slot_day: '',
                slot_start: '',
                slot_end: '',
                slot_cost: '',
                slot_group: '',
                slot_membersonly: false,
                showTimePopUpForStart: false,
                showTimePopUpForEnd: false
            }
        ]
    }

    handleShowTimePicker = index => {
        const data = this.state.data.map((item, key) => {
                        if(key != index){
                            item.showTimePopUpForEnd = false
                            item.showTimePopUpForStart = false
                        } else {
                            if(item.showTimePopUpForEnd) 
                                item.showTimePopUpForStart = false
                            else if(item.showTimePopUpForStart)
                                item.showTimePopUpForEnd = false
                        }
                        return item
                    })
        this.setState({
            data: data
        })
    }

    handleSubmit = event => {
        var data = this.state.data.filter(item => item.slot_day != '')
        data.map(item => this.props.handleAddTimeSlot(item))
        this.props.handleClose()
    }

    renderRows = (item, index) => (
        <Form.Group widths={3} key={index}>
            <Form.Field className={ index ? null: "required"}width={8}>
                <label>{ index ? null: 'Day'}</label>
                <Dropdown
                    selection
                    placeholder='Choose the type'
                    options={slot_days}
                    onChange={(_, data) => {
                        this.setState(state => ({
                            ...state,
                            data: [
                                ...state.data.slice(0, index),
                                { ...state.data[index], slot_day: data.value },
                                ...state.data.slice(index + 1)
                            ]
                        }))
                    }}
                    value={item.slot_day}
                />
            </Form.Field>
            <Form.Field className={ index ? null: "required"} width={8}>
                <label>{ index ? null : 'Time Window'}</label>
                <Form.Group required widths={2}>
                    <Form.Field required width={8}>
                        <TimePicker
                            icon='time'
                            showPopUp={item.showTimePopUpForStart}
                            handelPopUpChange={popUpState =>
                                this.setState(state => ({
                                    data: [
                                        ...state.data.slice(0, index),
                                        { ...state.data[index], showTimePopUpForStart: popUpState },
                                        ...state.data.slice(index + 1)
                                    ]
                                }), () => this.handleShowTimePicker(index))
                            }
                            placeholder="Start Time"
                            time={item.slot_start}
                            setTime={time => {
                                this.setState(state => ({
                                    ...state,
                                    data: [
                                        ...state.data.slice(0, index),
                                        { ... state.data[index], slot_start: time },
                                        ...state.data.slice(index + 1)
                                    ]
                                }))
                            }}
                        />
                    </Form.Field>
                    <Form.Field className={ index ? null: "required"} width={8}>
                        <TimePicker
                            icon='time'
                            showPopUp={item.showTimePopUpForEnd}
                            handelPopUpChange={popUpState =>
                                this.setState(state => ({
                                    data: [
                                        ...state.data.slice(0, index),
                                        { ...state.data[index], showTimePopUpForEnd: popUpState },
                                        ...state.data.slice(index + 1)
                                    ]
                                }),() => this.handleShowTimePicker(index))
                                
                            }
                            placeholder="End Time"
                            time={item.slot_end}
                            setTime={time => {
                                this.setState(state => ({
                                    ...state,
                                    data: [
                                        ...state.data.slice(0, index),
                                        { ... state.data[index], slot_end: time },
                                        ...state.data.slice(index + 1)
                                    ]
                                }))
                            }}
                        />
                    </Form.Field>
                </Form.Group>
            </Form.Field>
            <Form.Field className={ index ? null: "required"}>
                <label>{ index ? null : 'Guest'}</label>
                <Input
                    icon='rupee'
                    type='number'
                    placeholder='e.g. 300'
                    onChange={e => {
                        this.setState(state => ({
                            ...state,
                            data: [
                                ...state.data.slice(0, index),
                                { ...state.data[index], slot_cost: e.target.value },
                                ...state.data.slice(index + 1)
                            ]
                        }))
                    }}
                    value={item.slot_cost}
                />
            </Form.Field>
            <Form.Field className={ index ? null: "required"}>
                {
                    index ? null : (
                        <Popup
                            trigger={<label>Slot Group</label>}
                            content='Slot Group to be classified for further use in Membership. You can just type to create a new group.'
                        />
                    )
                } 
                <Dropdown
                    search
                    selection
                    placeholder='Group'
                    options={groups}
                    onChange={(e, data) => {
                        this.setState(state => ({
                            ...state,
                            data: [
                                ...state.data.slice(0, index),
                                { ...state.data[index], slot_group: data.value },
                                ...state.data.slice(index + 1)
                            ]
                        }))
                    }}
                    value={item.slot_group}
                />
            </Form.Field>
            <Form.Field className={ index ? null: "required"}>
                <label>{ index ? null : 'Allow members only'}</label>
                <Checkbox
                    toggle
                    onChange={(e, res) => {
                        this.setState(state => ({
                            ...state,
                            data: [
                                ...state.data.slice(0, index),
                                { ... state.data[index], slot_membersonly: res.toggle },
                                ...state.data.slice(index + 1)
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
            <Modal open={open} onClose={handleClose} size='large'>
                <Modal.Header>
                    <center>
                        Add Bulk Timeslots
                    </center>
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <center>
                            Please fill the details carefully here as it will be displayed to end users.
                        </center>
                        <Form>
                            {
                                this.state.data.map((item, key) => (
                                    this.renderRows(item, key)
                                ))
                            }
                        </Form>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <center>
                        <Button
                            color='red'
                            className="cancel"
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

export default BulkAddTimeSlot