import React from 'react';
import { Modal, Form, Header, Dropdown, Input, Button, Icon } from 'semantic-ui-react'

import classes from './AddAccessControlModal.local.scss'

const options = [
    { key:0, text: 'All Members', value: 'All Members'},
    { key:1, text: 'Email is equal to', value: 'Email is equal to'},
    { key:2, text: 'Domain name is equal to', value: 'Domain name is equal to'},
    { key:3, text: 'DUration is betwwen', value: 'Duration is betwwen'},
    { key:4, text: 'Age is between', value: 'Age is between'}
]

const facilities = [
    { key:0, text:'Gym Room', value: 'Gym Room'},
    { key:1, text: 'Gym Special Room', value: 'Gym Special Room'},
    { key:2, text: 'Tennis Court 1', value: 'Tennis Court 1'},
    { key:3, text: 'Badminton Court 1', value: 'Badminton Court 1'},
    { key:4, text: 'Squash Court 2', value: 'Squash Court 2'}
]

const slots = [
     { key:0, text: 'Adult', value:'Adult'},
     { key:1, text: 'Junior', value: 'Junior'},
     { key:2, text: 'Senior', value: 'Senior'},
     { key:3, text: 'Offpeak', value: 'Offpeak'},
     { key:4, text: 'Peer Hours', value: 'Peer Hours'}
]

class AddAccessControl extends React.Component {

    state= {
        condition: '',
        Value: '',
        facility: '',
        slots: [],
        price: ''
    }

    componentDidMount() {
        console.log(this.props.access)
        if(this.props.access) {
            const access = this.props.access

            this.setState({
                condition: access.Condition,
                Value: access.Value,
                facility: access.Facility_Type,
                price: access.price
            })
        } 
    }

    handleFormSubmit = event => {
        var obj = {
            Condition: this.state.condition + ' ',
            Facility_Type: this.state.facility + ' ',
            Value: this.state.Value,
            price: this.state.price == '-' ? this.state.price : '₹' + this.state.price,
            Slots: this.state.slots
        }
        if(this.props.access) {
            this.props.editAccess(obj)
        } else {
            this.props.addAccess(obj);
        }
    }

    handleDropdown = (e, data) => {
        this.setState({
            [data.id]: data.value
        })
    }

    handleOnChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }
    
    render() {
        return (
                <Modal open={this.props.open} onClose={this.props.handleClose} size="small">
                    <Modal.Header>
                        <center>Add Access</center>
                    </Modal.Header> 
                    <Modal.Content>
                    <Modal.Description>
                        <Form onSubmit={this.handleFormSubmit} error>
                            <Form.Field>
                                <center>
                                Please fill the details to provide access to the members of this membership.
                                </center>    
                            </Form.Field>
                            <Header dividing size='small' content='Condition' />
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <Dropdown
                                        className={classes.showBlack}
                                        id="condition"
                                        fluid
                                        selection
                                        placeholder="Condition Type"
                                        options={options}
                                        value={this.state.condition}
                                        onChange={this.handleDropdown}
                                    />    
                                </Form.Field>
                                <Form.Field className="required">
                                    <Input type="text" placeholder="Value" value={this.state.Value} onChange={this.handleOnChange} id="Value"/>
                                </Form.Field>    
                            </Form.Group>  
                            <Header dividing size='small' content='Facilities' />
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <Dropdown
                                        className={classes.showBlack}
                                        id="facility"
                                        search
                                        fluid
                                        selection
                                        placeholder="e.g. Court 1"
                                        options={facilities}
                                        value={this.state.facility}
                                        onChange={this.handleDropdown}
                                    />    
                                </Form.Field> 
                                <Form.Field>
                                    <Dropdown
                                        className={classes.showBlack}
                                        id="slots"
                                        fluid
                                        search
                                        selection
                                        placeholder="Slot Group"
                                        multiple
                                        options={slots}
                                        onChange={this.handleDropdown}
                                        value={this.state.slots}
                                    />    
                                </Form.Field>       
                            </Form.Group>  
                            <Header dividing size='small' content='Pricing' />
                            <Form.Field width={3}>
                                <Input type="text" placeholder="e.g. 200" onChange={this.handleOnChange} id="price" value={this.state.price}/>
                            </Form.Field>
                        </Form>
                    </Modal.Description>     
                    </Modal.Content> 
                    <Modal.Actions>
                        <center>
                            <Button className={"ui red reset " + classes.resetBtn} content="Reset"/>
                            <Button color='green' icon labelPosition='right' onClick={this.handleFormSubmit}>
                                <Icon name='check' />Add
                            </Button>
                        </center>    
                    </Modal.Actions>          
                </Modal>
        )
    }
}


export default AddAccessControl;