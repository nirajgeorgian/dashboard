import React from 'react';
import { Menu, Dropdown, Input, Segment, Form, Popup, Icon, Header } from 'semantic-ui-react'

import classes from './Attandances.local.scss'
import moment from 'moment'
import AddAttendance from './AddAttendanceModal/index'
import DeleteAttendance from './DeleteAttendanceModal/index'

const memberships  = [
    {key:0 ,text: 'Gym Membership - Single', value: 'Gym Membership - Single'},
    {key:1 ,text: 'Gym Membership - Couple', value: 'Gym Membership - Couple' },
    {key:2 ,text: 'Gym Membership - Family', value: 'Gym Membership - Family' }
]

const users = [
    { key:0, name: 'Niraj Georgian', membership: 'Badminton Membership - Single', type: 'Manual', in_out: 'In', date: '24th April 2018', time: '07:46 PM'},
    { key:1, name: 'Rohan Seth', membership: 'Gym Membership - Couple', type: 'Mobile App', in_out: 'Out', date: '24th April 2018', time: '07:46 PM'},
    { key:2, name: 'Raj Das', membership: 'Tennis Membership - Junior', type: 'Online', in_out: 'In', date: '24th April 2018',time: '07:46 PM'}
]

class Attendances extends React.Component {

    state = {
        showDeleteAttendanceModal: false,
        memberships: '',
        mems_dropdown: '',
        members: '',
        attendances: [],
        attendance_to_delete: {},
        search: '',
        searchDropdown: ''
    }

    async componentWillMount() {
        await this.setState({
            memberships: this.props.memberships,
            members: this.props.members,
            attendances: this.props.attendances
        })
        var data = this.state.memberships.map(item => {
            return {
                key: item.mems_memsid,
                text: item.mems_name,
                value: item.mems_name
            }
        })
        this.setState({
            mems_dropdown: data
        })
    }

    handleAdd = attendance => {
        const attendances = this.state.attendances.map(item => item)
        attendances.push(attendance)
        this.setState({
            attendances: attendances
        })
        console.log("Added Attendance:",this.state.attendances)
    }

    handleDelete = attendance => {
        const attendances = this.state.attendances.filter(item => item.sno != attendance.sno)
        this.setState({
            attendances: attendances
        })
    }

    handleDeleteAttendanceModalOpen = attendance => {
        this.setState({
            showDeleteAttendanceModal: true,
            attendance_to_delete: attendance
        })
    }

    handleDeleteAttendanceModalClose = event => {
        this.setState({
            showDeleteAttendanceModal: false,
            attendance_to_delete: {}
        })
    }

    handleDropdown = (e, data) => {
        this.setState({
            [data.id]: data.value
        })
    }

    handleInputChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    getFormattedTime = (time) => {
        const zozo = time.split(":")
        var new_time = zozo[0] > 11 ? 'PM': 'AM'
        const decoded_time = zozo[0] + ':' + zozo[1] + ` ${new_time}`
        return decoded_time;
    }

    renderList = ({ name, membership, type, in_out, date, time, attendance }) => (
        <Form className={classes.attendancefield}>
            <Form.Group widths={3}>
                <Form.Field width={3} className={classes.fields}>
                    <strong>{name}</strong>
                </Form.Field>
                <Form.Field width={4} className={classes.fields}>
                    {membership}
                </Form.Field>  
                <Form.Field width={2} className={classes.fields}>
                    {type}
                </Form.Field>
                <Form.Field width={1} className={classes.fields}>
                    {in_out}
                </Form.Field>
                <Form.Field width={2} className={classes.fields}>
                    {moment(new Date(date)).format("Do MMMM YYYY")}
                </Form.Field>
                <Form.Field width={2} className={classes.fields}>
                    {this.getFormattedTime(time)}
                </Form.Field> 
                <Form.Field width={1} className={classes.fields}>
                    <Popup trigger={<Icon name='comment' color='blue' />} content="Message this user directly." />
                </Form.Field>  
                <Form.Field width={1} className={classes.fields}>
                    <Popup trigger={<Icon name='close' color='red' onClick={() => this.handleDeleteAttendanceModalOpen(attendance)} />} content='Remove this log.' />
                </Form.Field>   
            </Form.Group> 
            <Header className={classes.divider} dividing size='small' />      
        </Form>    
    )

    renderMembers = () => {
        var attendances = this.state.attendances.filter(attendance => {
            if(attendance.mems == this.state.searchDropdown || this.state.searchDropdown == '')
                return attendance
        })
        .filter(attendance => attendance.name.indexOf(this.state.search) > -1)
        
        return attendances.map(data => (
            this.renderList({
                name: data.name,
                membership: data.mems,
                type: data.medium,
                in_out: data.status == 1 ? 'In' : 'Out',
                date: data.checkoutdate ? data.checkoutdate : data.checkindate,
                time: data.checkouttime ? data.checkouttime : data.checkintime,
                attendance: data
            })
        ))
    }

    render() {
        return(
            <div>
                <Menu attached='top'>
                    <Dropdown
                        id="searchDropdown"
                        item
                        search
                        selection
                        onChange={this.handleDropdown}
                        className={classes.borderNone}
                        placeholder="Choose the membership name"
                        options={this.state.mems_dropdown}
                    />
                    <Menu className={classes.borderNone}>
                        <Menu.Item>
                            <Input className="transparent" icon='calendar' placeholder='Date' />
                        </Menu.Item>    
                    </Menu>
                    <Menu.Item position='right'>
                        <Input className="transparent" type="text" icon='search' id="search" onChange={this.handleInputChange} labelPosition='right' placeholder="Search members..." />  
                        <div className="results"/>  
                    </Menu.Item>
                </Menu>
                <Segment attached='bottom'>
                    {
                        this.renderMembers()
                    }
                </Segment>
                {
                    this.props.showAddAttendance ? 
                    <AddAttendance open={this.props.showAddAttendance} members={this.state.members} handleClose={this.props.handleAddAttendanceClose} handleAdd={this.handleAdd}/>
                    : null
                }
                {
                    this.state.showDeleteAttendanceModal ? 
                    <DeleteAttendance open={this.state.showDeleteAttendanceModal} handleClose={this.handleDeleteAttendanceModalClose} attendance={this.state.attendance_to_delete} handleDelete={this.handleDelete}/>
                    : null
                }    
            </div>
        )
    }
}

export default Attendances;