import React from 'react';
import { Menu, Segment, Dropdown, Input, Icon, Header, Form, Popup } from 'semantic-ui-react';

import classes from './Transactions.local.scss'
import moment from 'moment'

const memberships  = [
    {key:0 ,text: 'Gym Membership - Single', value: 'Gym Membership - Single'},
    {key:1 ,text: 'Gym Membership - Couple', value: 'Gym Membership - Couple' },
    {key:2 ,text: 'Gym Membership - Family', value: 'Gym Membership - Family' }
]

const transaction_types = [
    { key:0, text: 'Online Signup', value: 'Online Signup'},
    { key:1, text: 'Manual Signup', value: 'Manual Signup'},
    { key:2, text: 'Auto-Renewal', value: 'Auto-Renewal'},
    { key:3, text: 'Manual Extension', value: 'Manual Extension'},
    { key:4, text: 'Manual Change', value: 'Manual Change'},
    { key:5, text: 'Cancellation', value: 'Cancellation'},
    { key:6, text: 'Expired', value: 'Expired'}
]

const users = [
    { key:0, name: 'Niraj Kishore', membership: 'Badminton Membership - Single', mode: 'Online Signup', price: '₹3000', date: '24th April 2018', time: '07:46 PM'},
    { key:1, name: 'Rohan Seth', membership: 'Gym Membership - Couple', mode: 'Manual Signup', price: '₹5000', date: '24th April 2018', time: '07:46 PM'},
    { key:2, name: 'Raj Das', membership: 'Tennis Membership - Junior', mode: 'Manual Extension', price: '₹2500', date: '24th April 2018', time: '07:46 PM'},
    { key:3, name: 'Prithwee Das', membership: 'Tennis Membership - Junior', mode: 'Expired', price: '-', date: '24th April 2018', time: '07:46 PM'}
]

class Transactions extends React.Component {

    state = {
        memberships: '',
        mems_dropdown: '',
        transactions: []
    }

    async componentWillMount() {
        await this.setState({
            memberships: this.props.memberships,
            transactions: this.props.transactions
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
        console.log(this.state.transactions)
    }

    renderUser = ({ name, membership, mode, price, date, time}) => (
        <Form className={classes.transactionfield}>
            <Form.Group widths={3} className={classes.fields}>
                <Form.Field width={3}>
                    <strong className="pointer">{name}</strong>
                </Form.Field >
                <Form.Field className={classes.fields} width={4}>
                    {membership}
                </Form.Field>    
                <Form.Field className={classes.fields} width={3}>
                    {mode}
                </Form.Field>  
                <Form.Field className={classes.fields} width={1}>
                    {price}
                </Form.Field>
                <Form.Field className={classes.fields} width={2}>
                    {date}
                </Form.Field>
                <Form.Field className={classes.fields} width={2}>
                    {time}
                </Form.Field>
                <Form.Field className={classes.fields} width={1}>
                    <Popup trigger={<Icon name='comment' color='blue' />} content="Message this user directly." />
                </Form.Field>    
            </Form.Group>
            <Header className={classes.divider} dividing size='small' />   
        </Form>        
    )

    getFormattedTime = (time) => {
        const zozo = time.split(":")
        var new_time = zozo[0] > 11 ? 'PM': 'AM'
        const decoded_time = zozo[0] + ':' + zozo[1] + ` ${new_time}`
        return decoded_time;
    }

    render() {
        return(
            <div>
                <Menu attached='top'>
                    <Dropdown
                        item
                        search
                        selection
                        className={classes.borderNone}
                        placeholder="Choose the membership name"
                        options={this.state.mems_dropdown}
                    />
                    <Dropdown
                        item
                        search
                        selection
                        className={classes.borderNone}
                        placeholder="Transaction Type"
                        options={transaction_types}
                    />
                    <Menu className={classes.borderNone}>
                        <Menu.Item>
                            <Input className="transparent" icon='calendar' placeholder='Date' />
                        </Menu.Item>    
                    </Menu>
                    <Menu.Item position='right'>
                        <Input className="transparent" type="text" icon='search' labelPosition='right' placeholder="Search members..." />  
                        <div className="results"/>  
                    </Menu.Item>
                </Menu>
                <Segment attached='bottom'>
                    {
                        this.state.transactions.map(data => {
                            return this.renderUser({
                                name: data.fullname,
                                membership: data.mems,
                                mode: data.purpose,
                                price: '₹' + data.amount,
                                date: moment(new Date(data.date)).format("Do MMMM YYYY"),
                                time: this.getFormattedTime(data.date.split("T")[1].split(".")[0])
                            })
                        })
                    }
                </Segment>    
            </div>
        )
    }
}

export default Transactions;