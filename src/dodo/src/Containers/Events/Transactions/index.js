import React from 'react'
import { Menu, Dropdown, Popup, Segment,Input } from 'semantic-ui-react'

import classes from './Transactions.local.scss'
import Datetime from 'react-datetime'
import moment from 'moment'
import '../../Membership/AddMembership/DatePicker.scss'

import TransactionItem from './TransactionItem/index'

const options = [
    { key:0, text: 'Booked', value: 0 },
    { key:1, text: 'Cancelled', value:1 },
    { key:2, text: 'Attended', value:2 },
    { key:3, text: 'No Show', value:3 },
    { key:4, text: 'Booked - Admin', value: 4 },
    { key:5, text: 'Cancelled - Admin', value:5 }
]

class Transactions extends React.Component {

    state = {
        events_list: [],
        searchEvent: '',
        searchDate: '',
        searchStatus: '',
        searchText: '',
        transactions: [],
        filteredTransactions: [],
        t_count: ''
    }

    componentWillMount() {
        var events = this.props.events.map(event => {
            return {
                key: event.event_eventid,
                text: event.event_name,
                value: event.event_name
            }    
        })
        this.setState({
            events_list: events
        })
    }

    componentDidMount() {
        document
			.querySelector(`.${classes.fromDate}`)
			.querySelector('.rdtPicker')
            .classList.add(classes.position)
        this.setState({
            transactions: this.props.transactions,
            filteredTransactions: this.props.transactions
        }, () => this.setSearchedUser() )
    }

    handleDropdown = (e, data) => {
        this.setState({
            [data.id]: data.value
        }, () => this.setSearchedUser() )

    }

    handleSearchTextChange = e => {
        this.setState({
            searchText: e.target.value
        }, () => this.setSearchedUser() )
    }

    setSearchedUser = () => {
        var transactions = this.state.transactions
            .filter(transaction => {
                if (
                    transaction.purpose == this.state.searchEvent ||
                    this.state.searchEvent == ''
                )
                return transaction
            })
            .filter(transaction => {
                if (
                    moment(transaction.date,'YYYY-MM-DD').format('MM/DD/YYYY') == 
                    moment(this.state.searchDate, 'MM,DD,YYYY HH:mm:ss').format('MM/DD/YYYY') ||
                    this.state.searchDate == ''
                )
                return transaction
            })
            .filter(transaction => {
                if(
                    transaction.status == this.state.searchStatus ||
                    this.state.searchStatus == ''
                )
                return transaction
            })
            .filter(transaction => {
                if(
                    transaction.fname.indexOf(this.state.searchText) > -1 ||
                    transaction.lname.indexOf(this.state.searchText) > -1 ||
                    this.state.searchText == ''
                )
                return transaction
            })
        this.setState({
            filteredTransactions: transactions,
            t_count: transactions.length
        })
    }

    render() {
        return (
            <div>
                <Menu attached="top">
                    <Dropdown
                        id="searchEvent"
                        item
                        search
                        selection
                        placeholder="Choos the Event"
                        className={classes.borderNone}
                        options={this.state.events_list}
                        onChange={this.handleDropdown}
                    /> 
                    <Menu.Item className={classes.fromDate}>
                        <Datetime
							// viewMode="years"
							renderInput={(props, openCalendar, closeCalendar) => (
								<Input icon="calendar" {...props} />
							)}
							closeOnSelect={true}
							inputProps={{ placeholder: 'Date' }}
							onChange={date => {
								this.setState({
									searchDate: date.format('MM,DD,YYYY HH:mm:ss')
                                }, () => this.setSearchedUser() )
							}}
							dateFormat="MMM Do YYYY"
							timeFormat={false}
						/>
                    </Menu.Item>  
                    <Dropdown
                        id="searchStatus"
						item
						search
						selection
						className={classes.borderNone}
						placeholder="Choose the status"
						options={options}
						onChange={this.handleDropdown}
                    />
                    <Menu.Item>
                        <Popup
                           trigger={<strong className={classes.greenText}>{this.state.t_count > 1 ? `${this.state.t_count} transactions`: `${this.state.t_count} transaction`} </strong>}
                           content="Number of bookings in the selected event."
                        />     
                    </Menu.Item>
                    <Menu.Item position='right'>
                        <Input
                            className="transparent"
                            icon='search link'
                            placeholder="Search members..."
                            type="text"
                            onChange={this.handleSearchTextChange}
                        />
                    </Menu.Item>      
                </Menu>
                <Segment attached="bottom">
                    {
                        this.state.filteredTransactions.map((transaction, i) => (
                            <TransactionItem
                                key={i}
                                transaction={transaction}
                                index={i}
                            />
                        ))
                    }
                </Segment>
            </div>
        )
    }
}

export default Transactions