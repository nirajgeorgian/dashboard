import React from 'react'
import { Modal, Form, Input, Dropdown, Checkbox, Button, Icon } from 'semantic-ui-react'

import classes from './AddMemberModal.local.scss'
import '../../AddMembership/DatePicker.scss'
import { showLoading } from '../../../../Actions/index'
import Datetime from 'react-datetime'
import moment from 'moment'

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
 
import { API } from 'aws-amplify'

const memberships  = [
    {key:0 ,text: 'Gym Membership - Single', value: 'Gym Membership - Single'},
    {key:1 ,text: 'Gym Membership - Couple', value: 'Gym Membership - Couple' },
    {key:2 ,text: 'Gym Membership - Family', value: 'Gym Membership - Family' }
]

class AddMemberModal extends React.Component {

    state = {
        mem_email: '',
        mem_mems: '',
        mem_startdate: '',
        mem_enddate: '',
        mem_fullname: '',
        mem_fee: '',
        checkbox: false,
        memberships: '',
        mem_id: ''     
    }

    async componentDidMount() {
        this.setState({
            memberships: this.props.memberships
        })
        if(this.props.member_to_edit) {
            var member = Object.assign({}, this.props.member_to_edit)
            member['mem_startdate'] = moment(member.mem_startdate).format('MM,DD,YYYY')
            member['mem_enddate'] = moment(member.mem_enddate).format('MM,DD,YYYY')
            member['mem_fee'] = String(member.mem_fee)
            await this.setState({
                ...member
            })
        }
    }

    validator = () => {
        return this.state.mem_email.length &&
               this.state.mem_mems.length &&
               this.state.mem_startdate.length &&
               this.state.mem_enddate.length &&
               this.state.mem_fullname.length &&
               this.state.mem_fee.length &&
               this.state.checkbox
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

    handleStartDateChange = date => {
        this.setState({
            mem_startdate: date.format('MM,DD,YYYY')
        })
    }

    handleEndDateChange = date => {
        this.setState({
            mem_enddate: date.format('MM,DD,YYYY')
        })
    }

    handleCheckbox = async (event, data) => {
		await this.setState({
			[data.id]: data.checked
        })
        console.log(this.state);
	}

    handleFormSubmit = async event => {
        this.props.showLoading();
        const data = Object.assign({}, this.state)
        data['business_id'] = this.props.business.bizid
        // data['mem_startdate'] = new Date(this.state.mem_startdate).toISOString().substring(0 ,10)
        // data['mem_enddate'] = new Date(this.state.mem_enddate).toISOString().substring(0, 10)
        data['mem_startdate'] = moment(new Date(this.state.mem_startdate)).format("YYYY-MM-DD")
        data['mem_enddate'] = moment(new Date(this.state.mem_enddate)).format("YYYY-MM-DD")
        try {
            if(this.props.member_to_edit) {
                console.log(data)
                const response = await API.put("members", "/update", {
                    body: data
                })
                this.props.showLoading()
                delete data.memberships;
                delete data.checkbox;
                console.log(response);
                // data['image'] = 'http://dev.sagepass.com:8081/img/chat/michaelfassbender.jpg'
                this.props.handleEditMember(data)

            } else {
                const response = await API.post("members", "/create" , {
                    body: [data]
                })
                this.props.showLoading();
                delete data.memberships;
                delete data.checkbox;
                data['mem_id'] = response.message[0].mem_id
                this.props.handleAddMember(data)
                console.log(response);
            }
            this.props.handleClose()
            
        } catch(e) {
            this.props.showLoading();
            console.log(e);
            // this.props.handleClose();
        }
        
    }

    render() {
        return (
            <Modal dimmer={'inverted'} open={this.props.open} onClose={this.props.handleClose} size='tiny'>
            <Modal.Header><center>Add User</center></Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Form>
                        <Form.Field>
                            <center>Please fill the below details to add user to the membership.</center>
                        </Form.Field>
                        <Form.Group widths={2}>
                            <Form.Field className="required">
                                <label>Email Address</label>
                                <Input placeholder="Email Address" type="email" onChange={this.handleInputChange} id="mem_email" value={this.state.mem_email}/>
                            </Form.Field>
                            <Form.Field className="required">
                                <label>Membership</label>
                                <Dropdown
                                    id="mem_mems"
                                    fluid
                                    search
                                    selection
                                    placeholder="Choose the membership"
                                    options={this.state.memberships}
                                    onChange={this.handleDropdown}
                                    value={this.state.mem_mems}
                                    className={classes.blackDropdown}
                                />    
                            </Form.Field>
                        </Form.Group>   
                        <Form.Group widths={2}>
                            <Form.Field className="required">
                                <label>Start Date</label>
                                <Datetime
                                    dateFormat="MMM Do YYYY"
                                    timeFormat={false}
                                    closeOnSelect={true}
                                    onChange={this.handleStartDateChange}
                                    value={this.state.mem_startdate}
                                    inputProps={{ placeholder: 'Start Date' }}
                                    renderInput={(props, openCalendar, closeCalendar) => (
                                        <Input icon="calendar" iconPosition="left" {...props} />
                                    )}
                                />
                            </Form.Field>
                            <Form.Field className="required">
                                <label>End Date</label>
                                <Datetime
                                    dateFormat="MMM Do YYYY"
                                    timeFormat={false}
                                    closeOnSelect={true}
                                    value={this.state.mem_enddate}
                                    onChange={this.handleEndDateChange}
                                    inputProps={{ placeholder: 'End Date' }}
                                    renderInput={(props, openCalendar, closeCalendar) => (
                                        <Input icon="calendar" iconPosition="left" {...props} />
                                    )}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths={2}>
                            <Form.Field className="required">
                                <label>Full Name</label>
                                <Input icon='user' value={this.state.mem_fullname} iconPosition='left' type="text" placeholder="e.g. Steve Jobs" id="mem_fullname" onChange={this.handleInputChange}/>
                            </Form.Field>
                            <Form.Field className="required">
                                <label>Fee Paid</label>
                                <Input icon='rupee' value={this.state.mem_fee} iconPosition='left' type="text" placeholder="e.g. 300" id="mem_fee" onChange={this.handleInputChange}/>
                            </Form.Field>
                        </Form.Group> 
                        <Form.Field className="required">
                            <center>
                                <Checkbox id="checkbox" onChange={this.handleCheckbox} label={<label>I agree to the <a href="/terms">Terms of Service</a>.</label>} />
                            </center>    
                        </Form.Field>
                        <center>
                            <Button color='green' disabled={!this.validator()} icon labelPosition='right' className="trans5" loading={this.props.isLoading} onClick={this.handleFormSubmit}>
                                <Icon name='check' />{this.props.member_to_edit ? 'Update': 'Add'}
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




export default withRouter(connect(mapStateToProps, { showLoading })(AddMemberModal));