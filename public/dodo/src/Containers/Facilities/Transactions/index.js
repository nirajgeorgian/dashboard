import React from 'react'
import { Menu, Dropdown, Popup, Input, Segment, Form, Icon, Header } from 'semantic-ui-react'

import classes from './Transactions.local.scss'

import Datetime from 'react-datetime'
import moment from 'moment'
import '../../Membership/AddMembership/DatePicker.scss'

const status = [
    { key:0, text: 'Booked', value:0 },
    { key:1, text: 'Booked-Admin', value: 1},
    { key:2, text: 'Cancelled - User', value: 2},
    { key:3, text: 'Cancelled - Admin', value: 3},
    { key:4, text: 'No Show', value: 4},
    { key:5, text: 'Closed', value: 5},
    { key:6, text: 'Blocked', value: 6}
]

class Transactions extends React.Component {

    state = {
        facilitiesDropdown: [],
        filteredTransactions: [],
        searchFacility: '',
        searchDate: '',
        searchStatus: '',
        searchText: '',
        searchCount: 0,
        transactions: []
    }

    // componentDidMount(){    
    //     var facilities = this.props.facilities.map((item, key) => ({
    //         key: key,
    //         text: item.facility_name,
    //         value: facility_name
    //     }))
    //     this.setState({
    //         facilitiesDropdown: facilities,
    //         filteredTransactions: this.props.transactions 
    //     }, this.setSearchedTransaction())
    // }

    handleDropdown = (e, data) => {
        this.setState({
            [data.id]: data.value
        }, this.setSearchedTransaction())
    }

    handleInputChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        }, this.setSearchedTransaction())
    }

    setSearchedTransaction = () => {
        var transactions = this.props.transactions
                                .filter(item => {
                                    if(
                                        item.facility_name == this.state.searchFacility ||
                                        this.state.searchFacility == ''
                                    )
                                    return item
                                })
                                .filter(item => {
                                    if (
                                        moment(item.booking_date,'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY') == 
                                        moment(this.state.searchDate,'MM,DD,YYYY HH:mm:ss').format('MM/DD/YYYY') ||
                                        this.state.searchDate == ''
                                    )
                                    return item
                                })
                                .filter(item => {
                                    if(
                                        item.booking_status == this.state.searchStatus ||
                                        this.state.searchStatus == ''
                                    )
                                    return item
                                })
                                // .filter(item => {
                                //     if (
                                //         item.person_name == this.state.searchText ||
                                //         this.state.searchText == ''
                                //     )
                                //     return item
                                // })
        this.setState({
            filteredTransactions: transactions,
            searchCount: transactions.length
        })
    }

    renderTransactions = (item, key) => (
        <div key={key}>
            <Form key={key} className={classes.bookingfield}>
                <Form.Group widths={3}>
                    <Form.Field width={3}>
                        <strong style={{ cursor: 'pointer'}}>
                            {item.person_name}
                        </strong>
                        {
                            item.facility ? (
                                <Popup
                                    trigger={<Icon name='wheelchair' />}
                                    content="This user needs wheelchair access."
                                />
                            ) : null
                        }
                    </Form.Field>
                    <Form.Field width={4}>
                        {item.facility_name}
                    </Form.Field>
                    <Form.Field width={3}>
                        {item.fee}
                    </Form.Field>
                    <Form.Field width={3}>
                        {item.booking_status}
                    </Form.Field>
                    <Form.Field>
                        {item.booking_date}
                    </Form.Field>
                    <Form.Field width={2}>
                        <Popup
                            trigger={<Icon name='comment alternate' color='blue' style={{ cursor: 'pointer'}} />}
                            content="Message this user directly."
                        />
                        <Popup
                            trigger={<Icon name='time outline' />}
                            content={`Booking has been made on ${item.booking_date}`}
                        />
                        <Popup
                            trigger={<Icon name='rupee' />}
                            content={item.booking_coupon ? `Coupon ${item.booking_coupon} has been applied` : `No Coupons have been applied`}
                        />
                        <Popup
                            trigger={<Icon name='info' />}
                            content={`Booking ID: ${item.booking_beid}`}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
            <Header dividing />
        </div>
    )

    render() {
        return (
            
            <div>
                <Menu attached='top'>
                    <Dropdown
                        id="searchFacility"
                        placeholder="Choose the Facility"
                        className={classes.noborder}
                        search
                        item
                        selection
                        options={this.state.facilitiesDropdown}
                        onChange={this.handleDropdown}
                    />
                    <Menu.Item>
                        <Datetime
                            // viewMode="years"
                            renderInput={(props, openCalendar, closeCalendar) => (
                                <Input icon="calendar outline alternate" {...props} />
                            )}
                            closeOnSelect={true}
                            inputProps={{ placeholder: 'Date' }}
                            onChange={date => {
                                this.setState({
                                    searchDate: date.format('MM,DD,YYYY HH:mm:ss')
                                }, this.setSearchedBooking() )
                            }}
                            dateFormat="MMM Do YYYY"
                            timeFormat={false}
                        />
                    </Menu.Item>
                    <Dropdown
                        id="searchStatus"
                        placeholder='Choose the status'
                        className={classes.noborder}
                        search
                        item
                        selection
                        options={status}
                        onChange={this.handleDropdown}
                    />
                    <Menu.Item>
                        <Popup
                            trigger={<strong className="green text">{this.state.searchCount > 1 ? `${this.state.searchCount} members` : `${this.state.searchCount} member`}</strong>}
                            content='Number of bookings in the selected facility.'
                        />
                    </Menu.Item>
                    <Menu.Item position='right'>
                        <Input
                            id="searchText"
                            className="transparent"
                            icon='search link'
                            placeholder="Search members..."
                            type="text"
                            onChange={this.handleInputChange}
                        />
                    </Menu.Item>
                </Menu>
                <Segment attached='bottom'>
                    {
                        this.state.filteredTransactions.map((item ,key) => (
                            this.renderTransactions(item, key)
                        ))
                    }
                </Segment>
            </div>
        )
    }
}

export default Transactions