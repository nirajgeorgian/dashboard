import React from 'react';
import { Menu, Segment, Card } from 'semantic-ui-react'
import classes from './Events.local.scss'

import { API } from 'aws-amplify'
import moment from 'moment'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import ShowEvents from './ShowEvents'
import DeleteEvent from './DeleteEventModal/index'
import AddBookingModal from './AddBookingModal/index'
import BulkAddBookingModal from './BulkBookingModal/index'
import Bookings from './Bookings/index'
import Transactions from  './Transactions/index'

import getObjectWithChangedKey from  '../../utility/setPrefix'

function changeObjectKeys(item) {

    var obj = {}
    obj = { ...item, ...item.location, ...item.info, ...item.validation, ...item.time }
    delete obj.location
    obj['location'] = item.location.location
    delete obj.info
    delete obj.validation
    delete obj.time
    var event = getObjectWithChangedKey(obj, 'event_')
    console.log(event)
    return event
}


class Events extends React.Component {

    state = {
        activeItem: 'active events',
        activeItemIndex: 0,
        events: [],
        active_events: [],
        expired_events: [],
        showDeleteEvent: false,
        event_id_to_del: '',
        bookings: [],
        transactions: []
    }

    async componentDidMount() {
        try {
            var data = {
                business_id: this.props.business.bizid
            }
            const response = await API.post("events", "/list", {
                body: data
            })
            const booking_response = await API.post("events", "/bookings_list", {
                body: data
            })
            const transactions = await API.post("events", "/txn", {
                body: data
            })
            const events = await response.response.map(item => {
                return changeObjectKeys(item)
            })
            await this.setState({
                events: events
            })

            const bookings = booking_response.message.map(item => {
                return this.addEventNameKeyToBooking(item)
            })
            await this.setState({
                bookings: bookings,
                transactions: transactions
            })
            this.handleSplitEvents()

        } catch(e) {
            console.log(e)
        }
    }

    addEventNameKeyToBooking(booking) {
        booking['event'] = this.state.events[this.state.events.findIndex(item => item.event_eventid == booking.eid )].event_name
        return getObjectWithChangedKey(booking, "booking_")
    }

    handleSplitEvents = () => {
        var zozo = this.state.events.map(item => {
            if(moment(new Date(item.event_valid_period_to)) >= moment() || (item.event_state == 0 || item.event_state == 1)) {
                return {
                    ...item
                }
            }
        }).filter(item => item != undefined)

        var zozo1 = this.state.events.map(item => {
            if(moment(new Date(item.event_valid_period_to)) < moment() || item.event_state == 2) {
                return {
                    ...item
                }
            }
        }).filter(item => item != undefined)

        this.setState({
            active_events: zozo,
            expired_events: zozo1
        })

    }


    handleItemSelect = async (e, { name, id }) => {
        await this.setState({
            activeItem: name,
            activeItemIndex: id
        })
        this.props.eventsButtonState(this.state.activeItemIndex)
    }

    handleDeleteEvent = event_id => {
        this.setState({
            showDeleteEvent: true,
            event_id_to_del: event_id
        })
    }

    handleEventDeleted = event_id => {
        const events = this.state.events.filter(event => event.event_id != event_id)
        console.log(events)
        console.log(event_id)
        this.setState({
            events: events
        })
        this.handleSplitEvents()
    }

    handleCloneEvent = event_id => {
        const event = this.state.events.filter(event => event.event_eventid == event_id)[0]
        delete event['event_id']
        this.props.history.push({
            pathname: "/events/add",
            clone_event: event
        })
    }

    handleEditEvent = event_id => {
        const event = this.state.events.filter(event => event.event_eventid == event_id)[0]
        console.log("Event Edit:", event)
        this.props.history.push({
            pathname: "/events/add",
            edit_event: event
        })
    }

    handleAddBooking = booking => {
        console.log(booking)
    }

    handleChangeBooking = (booking) => {
        const bookings = Array.from(this.state.bookings)
        let index = bookings.findIndex(item => item.booking_beid == booking.booking_beid)
        bookings[index] = booking
        this.setState({
            bookings: bookings
        })
    }

    render() {
        return (
            <section className={classes.eventsbox}>
                <Menu secondary pointing>
                    <Menu.Item
                        id="0"
                        className={
                            this.state.activeItem === 'active events'
                                ? classes.itemColor2
                                : classes.itemColor
                        }
                        name="active events"
                        active={this.state.activeItem === 'active events'}
                        onClick={this.handleItemSelect}
                    />
                    <Menu.Item
                        id="1"
                        className={
                            this.state.activeItem === 'expired events'
                                ? classes.itemColor2
                                : classes.itemColor
                        }
                        name="expired events"
                        active={this.state.activeItem === 'expired events'}
                        onClick={this.handleItemSelect}
                    />
                    <Menu.Item
                        id="2"
                        className={
                            this.state.activeItem === 'bookings'
                                ? classes.itemColor2
                                : classes.itemColor
                        }
                        name="bookings"
                        active={this.state.activeItem === 'bookings'}
                        onClick={this.handleItemSelect}
                    />
                    <Menu.Item
                        id="3"
                        className={
                            this.state.activeItem === 'transactions'
                                ? classes.itemColor2
                                : classes.itemColor
                        }
                        name="transactions"
                        active={this.state.activeItem === 'transactions'}
                        onClick={this.handleItemSelect}
                    />    
                </Menu>
                <Segment
                    attached='bottom'
                    compact={false}
                    className={classes.fullSegment}
                >
                { this.state.activeItemIndex == 0 ? 
                    <Card.Group itemsPerRow={4} stackable>
                        {
                            this.state.active_events.map((event, key) => (
                                <ShowEvents 
                                    key={key}
                                    event={event}
                                    editEvent={this.handleEditEvent}
                                    deleteEvent={this.handleDeleteEvent}
                                    handleCloneEvent={this.handleCloneEvent}
                                />
                            ))
                        }
                    </Card.Group>
                    : null
                }
                { this.state.activeItemIndex == 1 ?
                    <Card.Group itemsPerRow={4} stackable>
                        {
                            this.state.expired_events.map((event, key) => (
                                <ShowEvents 
                                    key={key}
                                    event={event}
                                    editEvent={this.handleEditEvent}
                                    deleteEvent={this.handleDeleteEvent}
                                    handleCloneEvent={this.handleCloneEvent}
                                />
                            ))
                        }
                    </Card.Group>
                    : null
                }
                {
                    this.state.activeItemIndex == 2 ?
                    <Bookings
                        bookings={this.state.bookings}
                        events={this.state.active_events}
                        handleChangeBooking={this.handleChangeBooking}
                        showCancelBookingModal={this.props.showCancelBookingModal}
                        handleCancelBookingModalClose={this.props.handleCancelBookingModalClose}
                        showNoShowBookingModal={this.props.showNoShowBookingModal}
                        handleNoShowBookingModalClose={this.props.handleNoShowBookingModalClose}
                        showAttendBookingModal={this.props.showAttendBookingModal}
                        handleAttendBookingModalClose={this.props.handleAttendBookingModalClose}
                        showRescheduleBookingModal={this.props.showRescheduleBookingModal}
                        handleRescheduleBookingModalClose={this.props.handleRescheduleBookingModalClose}
                    />
                    : null
                }
                {
                    this.state.activeItemIndex == 3 ?
                    <Transactions 
                        events={this.state.active_events}
                        transactions={this.state.transactions}
                    />
                    : null
                }
                </Segment>
                {
                    this.state.showDeleteEvent ? 
                    <DeleteEvent
                        open={this.state.showDeleteEvent}
                        handleClose={
                            () => this.setState({
                                showDeleteEvent: false,
                                event_id_to_del: ''
                            })
                        } 
                        event_id={this.state.event_id_to_del}
                        handleDeleteEvent={this.handleEventDeleted}
                    />
                    : null
                }
                {
                    this.props.showAddBookingModal ? 
                    <AddBookingModal 
                        open={this.props.showAddBookingModal}
                        handleClose={this.props.handleAddBookingModalClose}
                        events={this.state.active_events}
                        handleAddBooking={this.handleAddBooking}
                    />
                    : null    
                }
                {
                    this.props.showBulkAddBookingModal ? 
                    <BulkAddBookingModal
                        open={this.props.showBulkAddBookingModal}
                        events={this.state.active_events}
                        handleClose={this.props.handleBulkAddBookingModalClose}
                    />
                    : null
                }
            </section>    
        )
    }
}

function mapStateToProps(state) {
    return {
        business: state.currentBusinessList
    }
}

export default withRouter(connect(mapStateToProps, null)(Events));