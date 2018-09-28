import React from 'react'
import { Form, Popup, Icon, Header } from 'semantic-ui-react'

import classes from './TransactionItem.local.scss'
import moment from 'moment'

const bookingOptions = [
    { key:0, text: 'Booked', value: 0},
    { key:1, text: 'Cancelled', value: 1},
    { key:2, text: 'Attended', value: 2},
    { key:3, text: 'No Show', value: 3}
]

class TransactionItem extends React.Component {

    getBookingStatusText = (status) => {
        return bookingOptions
                .filter(item => item.value == status)[0].text
    }

    render() {
        const {
            fname,
            lname,
            purpose,
            amount,
            status,
            date,
            beid,
            couponcode
        } = this.props.transaction
        return (
            <div key={this.props.index}>
                <Form className={classes.bookingfield}>
                    <Form.Group widths={3}>
                        <Form.Field width={3}>
                            <strong className="pointer">
                                {fname} {lname}
                            </strong>
                            {fname == "Niraj" ?
                                <Icon 
                                    name='wheelchair' 
                                    color='red' 
                                    style={{ cursor: pointer }} 
                                /> 
                                : null
                            }
                        </Form.Field>
                        <Form.Field width={4}>
                            {purpose}
                        </Form.Field>
                        <Form.Field width={1}>
                            ₹{amount}
                        </Form.Field>  
                        <Form.Field width={3}>
                            {this.getBookingStatusText(status)}
                        </Form.Field>
                        <Form.Field width={3}>
                            {moment(date).format("Do MMMM hh:mm A")}
                        </Form.Field>
                        <Form.Field width={2}>
                            <Popup
                                trigger={<Icon 
                                    name='comment alternate pointer'
                                    color='blue'
                                />}
                                content="Message this user directly."
                            />
                            <Popup
                                trigger={<Icon name='time outline' />}
                                content={`Booking has been made on ${moment(date).format("Do MMMM hh:mm A")}`}
                            />
                            <Popup
                                trigger={<Icon name='rupee' />}
                                content={couponcode ? `Coupon ${couponcode} has been applied` : 'No coupons have been applied.'}
                            />
                            <Popup
                                trigger={<Icon name='info' />}
                                content={`Booking ID: ${beid}`}
                            />
                        </Form.Field>
                    </Form.Group>    
                </Form>  
                <Header dividing className={classes.header}/>  
            </div>    
        )
    }
}

export default TransactionItem