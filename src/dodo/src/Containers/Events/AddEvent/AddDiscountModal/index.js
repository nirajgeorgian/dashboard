import React from 'react'
import  { Modal, Icon, Form, Header, Popup, Dropdown, Input, Button } from 'semantic-ui-react'

import Datetime from 'react-datetime'
import moment from 'moment'
import classes from './AddDiscountModal.local.scss'

import './DatePicker.scss'

const options = [
    { key: 0, text: 'All users', value: 'All users'},
    { key: 1, text: 'Custom Voucher', value: 'Custom Voucher'},
    { key: 2, text: 'Domain Name is equal to', value: 'Domain Name is equal to'},
    { key: 3, text: 'Email Address is equal to', value: 'Email Address is equal to'},
    { key: 4, text: 'Age is between', value: 'Age is between'}
]

class AddDiscountModal extends React.Component {

    state = {
        start_date: '',
        end_date: '',
        discount: '',
        voucher_code: '',
        dis_percent: '',
        dis_price: '',
        per_use: 1
    }

    handleFormSubmit = async event => {
        const end_date = this.state.end_date ? this.state.end_date : 'No Limit'
        await this.setState({
            end_date: end_date
        })
        this.props.addDiscount(this.state);    
    }

    handleReset = event => {
        this.setState({
            discount: '',
            voucher_code: '',
            dis_percent: '',
            dis_price: '',
            start_date: '',
            end_date: ''
        })
    }

    handleStartDateChange = date => {
        this.setState({
            start_date: date.format('Do MMM YYYY')
        })
    }

    handleEndDateChange = date => {
        this.setState({
            end_date: date.format('Do MMM YYYY')
        })
    }

    handleDropdown = (e, data) => {
        this.setState({
            discount: data.value
        })
    }

    handleInputChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    render() {
        return (
            <Modal size='small' open={this.props.open} onClose={this.props.handleClose}>
                <Modal.Header><center>Add Discount</center></Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form onSubmit={this.handleFormSubmit} error>
                            <Header size='small' dividing content='Duration' />
                            <Form.Group widths={2}>
                                <Form.Field className="required" width={4}>
                                    <Popup trigger={<label>Start Date</label>} content="Start date of the discount." />
                                    <Datetime
                                    // className={classes.toAge}
                                        dateFormat="MMM Do YYYY"
                                        timeFormat={false}
                                        value={this.state.start_date}
                                        closeOnSelect={true}
                                        onChange={this.handleStartDateChange}
                                        inputProps={{ placeholder: 'From Date' }}
                                        renderInput={(props, openCalendar, closeCalendar) => (
                                        <Input icon="calendar" iconPosition="left" {...props} />
                                        )}
                                    />
                                </Form.Field>
                                <Form.Field width={4}>
                                    <Popup trigger={<label>End Date</label>} content="End date of the discount." />
                                    <Datetime
                                    // className={classes.toAge}
                                        dateFormat="MMM Do YYYY"
                                        timeFormat={false}
                                        value={this.state.end_date}
                                        closeOnSelect={true}
                                        onChange={this.handleEndDateChange}
                                        inputProps={{ placeholder: 'End Date' }}
                                        renderInput={(props, openCalendar, closeCalendar) => (
                                        <Input icon="calendar" iconPosition="left" {...props} />
                                        )}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Header size='small' dividing content='Discount' />
                            <Form.Group widths={2}>
                                <Form.Field>
                                    <Dropdown
                                        className={classes.showBlack}
                                        fluid
                                        search
                                        selection
                                        placeholder="Type"
                                        onChange={this.handleDropdown}
                                        value={this.state.discount}
                                        options={options}
                                    />
                                </Form.Field>  
                                <Form.Field width={6}>
                                    <Input icon='tag' value={this.state.voucher_code} id="voucher_code" iconPosition='left' type="text" placeholder="Voucher Code" onChange={this.handleInputChange}>
                                    </Input>
                                </Form.Field>      
                            </Form.Group>
                            <Popup trigger={<Header dividing size='small'>Pricing</Header>} content="Discount percentage to be applied." />  
                            <Form.Group widths={2}>
                                <Form.Field width={3}>
                                    <Input icon='percent' value={this.state.dis_percent} id="dis_percent" onChange={this.handleInputChange} iconPosition="left" type="text" placeholder="e.g. 10" />
                                </Form.Field>
                                <Form.Field width={1} className={classes.orField}>
                                    OR
                                </Form.Field>
                                <Form.Field width={3}>
                                    <Input icon='rupee' id="dis_price" value={this.state.dis_price} onChange={this.handleInputChange} iconPosition='left' type="text" placeholder="e.g. 500" />
                                </Form.Field>
                                <Form.Field width={9} className={classes.orField}>
                                    ₹2700 (to be paid by users who use this discount).
                                </Form.Field>    
                            </Form.Group>            
                        </Form>
                    </Modal.Description>
                    <Modal.Actions>
                        <center>
                            <Button color='red' className={classes.resetBtn} content='Reset' onClick={this.handleReset}/>
                            <Button color='green' icon labelPosition='right' onClick={this.handleFormSubmit}>
                                <Icon name='check' />Add
                            </Button>
                        </center>    
                    </Modal.Actions>    
                </Modal.Content>        
            </Modal>
        )
    }
}

export default AddDiscountModal;