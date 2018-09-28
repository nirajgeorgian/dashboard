import React from 'react'
import { Modal, Input, Icon, Form, Dropdown, Button } from 'semantic-ui-react'

import '../../AddMembership/DatePicker.scss'

import Datetime from 'react-datetime'
import moment from 'moment'
import { showLoading } from '../../../../Actions/index'
import { connect } from 'react-redux'

import classes from './AddBulkMember.local.scss'

import { API } from 'aws-amplify'

const arr = [0, 1, 2, 3, 4]

const memberships  = [
    {key:0 ,text: 'Gym Membership - Single', value: 'Gym Membership - Single'},
    {key:1 ,text: 'Gym Membership - Couple', value: 'Gym Membership - Couple' },
    {key:2 ,text: 'Gym Membership - Family', value: 'Gym Membership - Family' }
]

class BulkAddMember extends React.Component {

    state = {
        memberships: [],
        data: [
            {
                mem_email: '',
                mem_mems: '',
                mem_startdate: '',
                mem_enddate: '',
                mem_fullname: '',
                mem_fee: '',
            },
            {
                mem_email: '',
                mem_mems: '',
                mem_startdate: '',
                mem_enddate: '',
                mem_fullname: '',
                mem_fee: '',
            },
            {
                mem_email: '',
                mem_mems: '',
                mem_startdate: '',
                mem_enddate: '',
                mem_fullname: '',
                mem_fee: '',
            },
            {
                mem_email: '',
                mem_mems: '',
                mem_startdate: '',
                mem_enddate: '',
                mem_fullname: '',
                mem_fee: '',
            },
            {
                mem_email: '',
                mem_mems: '',
                mem_startdate: '',
                mem_enddate: '',
                mem_fullname: '',
                mem_fee: '',
            }
        ]
    }

    componentWillMount() {
        this.setState({
            memberships: this.props.memberships
        })
    }

    validator = () => {
        var a = this.state.data.map(item => {
                    if(item.mem_email || item.mem_enddate || item.mem_mems || item.mem_startdate || item.mem_fullname || item.mem_fee) {
                        if(item.mem_email && item.mem_enddate && item.mem_mems && item.mem_startdate && item.mem_fullname && item.mem_fee) {
                            return true
                        } else {
                            return false
                        }
                    }
                }).filter(item => item != undefined)
        // False values in array "a" should be used to show error about a row
        if(a.length == 0) {
            return false
        } else {
            return a.reduce((result, val) => { return result && val })
        }
    }

    handleFormSubmit = async event => {
        this.props.showLoading();
        try {
            let business_id = this.props.business.bizid
            var members = this.state.data.filter(item => item.mem_email != '').map(item => {
                item['business_id'] = business_id
                return item
            })
            const response = await API.post("members", "/create", {
                body: members
            })
            console.log(members)
            console.log(response);
            for(let member in response.message) {
                this.props.handleAddMember(member)
            }
            this.props.showLoading();
            this.props.handleClose();
        } catch(e) {
            console.log(e);
            this.props.showLoading()
        }
    }

    renderRows = key => (
        <Form.Group widths={6} key={key}>
            <Form.Field width={3} className={ key ? null: "required"}>
                <label>{ key ? null: 'Email Address'}</label>
                <Input
                    placeholder="Email Address"
                    type="email"
                    onChange={e => {
                        e.persist()
                        this.setState(state => ({
                            ...state,
                            data: [
                                ...state.data.slice(0, key),
                                { ...state.data[key], mem_email: e.target.value },
                                ...state.data.slice(key + 1)
                            ]
                        }))
                    }}
                />
            </Form.Field>
            <Form.Field width={3} className={ key ? null : "required"}>
                <label>{ key ? null: 'Full Name'}</label>
                <Input
                    placeholder="e.g. Steve Jobs"
                    type="text"
                    onChange={e => {
                        e.persist()
                        this.setState(state => ({
                            ...state,
                            data: [
                                ...state.data.slice(0, key),
                                { ...state.data[key], mem_fullname: e.target.value },
                                ...state.data.slice(key + 1)
                            ]
                        }))
                    }}
                />
            </Form.Field>
            <Form.Field width={4} className={ key ? null: "required"}>
                <label>{ key ? null: 'Membership'}</label>
                <Dropdown
                    className={classes.blackDropdown}
                    fluid
                    search
                    selection
                    placeholder="Membership"
                    options={this.state.memberships}
                    onChange={(e, data) => {
                        e.persist()
                        this.setState(state => ({
                            ...state,
                            data: [
                                ...state.data.slice(0, key),
                                { ...state.data[key], mem_mems: data.value },
                                ...state.data.slice(key + 1)
                            ]
                        }))
                    }}
                />
            </Form.Field>
            <Form.Field width={2} className={ key ? null : "required"}>
                <label>{ key ? null: 'Fee Paid'}</label>
                <Input
                    placeholder="e.g. 300"
                    type="text"
                    onChange={e => {
                        e.persist()
                        this.setState(state => ({
                            ...state,
                            data: [
                                ...state.data.slice(0, key),
                                { ...state.data[key], mem_fee: e.target.value },
                                ...state.data.slice(key + 1)
                            ]
                        }))
                    }}
                />
            </Form.Field>
            <Form.Field width={2} className={ key ? null: "required"}>
                <label>{ key ? null : 'Start Date'}</label>
                <Datetime
                    dateFormat="MMM Do YYYY"
                    timeFormat={false}
                    closeOnSelect={true}
                    inputProps={{ placeholder: 'Start Date' }}
                    onChange={date => {
                        this.setState(state => ({
                            ...state,
                            data: [
                                ...state.data.slice(0, key),
                                { ...state.data[key], mem_startdate: date.format('YYYY-MM-DD') },
                                ...state.data.slice(key + 1)
                            ]
                        }))
                    }}
                    renderInput={(props, openCalendar, closeCalendar) => (
                        <Input icon="calendar" iconPosition="left" {...props} />
                    )}
                />
            </Form.Field>
            <Form.Field width={2} className={ key ? null: "required"}>
                <label>{ key ? null: 'End Date'}</label>
                <Datetime
                    dateFormat="MMM Do YYYY"
                    timeFormat={false}
                    closeOnSelect={true}
                    inputProps={{ placeholder: 'End Date' }}
                    onChange={date => {
                        this.setState(state => ({
                            ...state,
                            data: [
                                ...state.data.slice(0, key),
                                { ...state.data[key], mem_enddate: date.format('YYYY-MM-DD') },
                                ...state.data.slice(key + 1)
                            ]
                        }))
                    }}
                    renderInput={(props, openCalendar, closeCalendar) => (
                        <Input icon="calendar" iconPosition="left" {...props} />
                    )}
                />
            </Form.Field>
        </Form.Group>
    )

    render() {
        return (
                <Modal dimmer={'inverted'} open={this.props.open} onClose={this.props.handleClose} size='fullscreen'>
                    <Modal.Header><center>Add Bulk Members</center></Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Form>
                                <Form.Field>
                                    <center>
                                    Please fill the below details to add user to the membership.
                                    </center>
                                </Form.Field>
                                {
                                    arr.map((data, key) => {
                                        // console.log(key);
                                        return this.renderRows(key)
                                    })
                                }
                                <Modal.Actions>
                                    <center>
                                        <Button className="ui red deny" content='Cancel' onClick={this.props.handleClose}/>
                                        <Button positive icon labelPosition='right' disabled={!this.validator()} onClick={this.handleFormSubmit} loading={this.props.isLoading}>
                                            <Icon name='check' />Add
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

export default connect(mapStateToProps, { showLoading })(BulkAddMember);
