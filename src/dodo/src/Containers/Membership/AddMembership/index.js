import React from 'react'
import { withRouter } from 'react-router-dom'
import { Container, Form, Image, Icon, Input, Dropdown, Popup, TextArea, Header, Table, Button, AccordionTitle } from 'semantic-ui-react'
import logo from '../../../assests/img/wireframe.png'
import classes from './AddMembership.local.scss'
import Datetime from 'react-datetime'
import moment from 'moment'
import { connect } from 'react-redux'

import AccessControl from './AccessControl/index'
import AddAccessControlModal from './AddAccessControlModal/index'

import './DatePicker.scss'
import AddAccessControl from './AddAccessControlModal';
import DeleteAccess from './DeleteAccessModal/index'
import DeleteDiscount from './DeleteDiscountModal/index'
import AddDiscount from './AddDiscountModal/index'
import { showLoading } from '../../../Actions/index'

import { API } from 'aws-amplify'

const options = [
    { key: '0', text: 'Monthly', value: 'Monthly'},
    { key: '1',  text: 'Annually', value: 'Annually'},
    { key: '2',  text: 'Weekly', value: 'Weekly'},
]

const activities = [
    { key: '0', text: 'Gym', value: 'Gym'},
    { key: '1', text: 'Tennis', value: 'Tennis'},
    { key: '2', text: 'Badminton', value: 'Badminton'},
    { key: '3', text: 'Cricket', value: 'Cricket'},
    { key: '4', text: 'Football', value: 'Football'},
    { key: '5', text: 'Swimming', value: 'Swimming'},
    { key: '6', text: 'Volley Ball', value: 'Volley Ball'},
    { key: '7', text: 'Hockey', value: 'Hockey'},
    { key: '8', text: 'Ice Hockey', value: 'Ice Hockey'},
    { key: '9', text: 'Dancing', value: 'Dancing'},
    { key: '10', text: 'Yoga', value: 'Yoga'},
    { key: '11', text: 'Rowing', value: 'Rowing'},
    { key: '12', text: 'Table Tennis', value: 'Table Tennis'}
]

const states = [
    { key: '0', text: 'Enabled', value: 0},
    { key: '1', text: 'Stop taking memberships', value: 1},
    { key: '2', text: 'Disabled', value: 2},
]

const demo = [
    { key: 0, Condition: 'All Members', Value:'', Facility_Type: 'Gym Room', Slots: 'Slots Saturday 10:00AM, 11:30AM & 05:00PM', price: '-'},
    { key: 1, Condition: 'Domain name is equal to', Value:'spiez.in', Facility_Type: `Badminton Court 1`, Slots: 'Slots: All Slots', price: '₹200'},
    { key: 2, Condition: 'Email is equal to', Value: 'mailrajdas@gmail.com.', Facility_Type: 'Squash Court 2', Slots: 'Slots Saturday 10:00AM, 11:30AM & 05:00PM', price: '₹200'},
    { key: 3, Condition: 'All Members', Value:' and time between Saturday 09:00 AM and Sunday 18:00 PM.', Facility_Type: 'Gym Special Room', Slots: 'Slots Saturday 10:00AM, 11:30AM & 05:00PM', price: '-'}
]

const discounts = [
    { key: 0, start_date:'1st May 2018', end_date: '30th Sept 2018', discount: 'Voucher', voucher_code:'STARTUP10',dis_price: '₹2700', dis_percent:'-10%',peruse: 1},
    { key: 1, start_date: '1st May 2018', end_date:'No Limit.', discount: 'All Members',voucher_code:'', dis_price: '₹2700', dis_percent: '10%', peruse: 2},
    { key: 2, start_date: '1st May 2018', end_date: 'No Limit.', discount: 'Domain name is equal to', voucher_code:'sagepass.com.', dis_price: '₹2700', dis_percent: '-10%', peruse: 1},
    { key: 3, start_date: '1st Aug 2018', end_date:'31st Jan 2019', discount: 'Voucher',voucher_code:'BIGBIZ25', dis_price: '₹2250', dis_percent: '-25%', peruse: 1}
]

class AddMembership extends React.Component {
    state = {
        showAddAccessModal: false,
        access_to_delete: '',
        discount_to_delete: '',
        showDeleteAccessModal: false,
        showEditAccessModal: false,
        showDeleteDiscountModal: false,
        showAddDiscountModal: false,
        edit_access: '',
        mems_name: '',
        mems_frequency: '',
        mems_fee: '',
        mems_desc: '',
        mems_activity: '',
        mems_state: '',
        mems_max_mem: '',
        mems_age_from: '',
        mems_age_to: '',
        mems_period_from: '',
        mems_period_to: '',
        mems_welcome_mes: '',
        mems_leaving_mes: '',
        mems_discount: discounts,
        mems_access_control: demo
    }

    async componentDidMount() {
        if(this.props.location.edit_membership) {
            const membership = Object.assign({}, this.props.location.edit_membership)
            console.log(membership);
            await this.setState({
                ...membership
            })
        } else if(this.props.location.mems_to_clone) {
            console.log(this.props.location.mems_to_clone);
            await this.setState({
                ...this.props.location.mems_to_clone
            })
        }
    }

    handleAddAccessModalOpen = event => {
        this.setState({
            showAddAccessModal: true
        })
    }

    handleAddAccessModalClose = event => {
        this.setState({
            showAddAccessModal: false
        })
    }

    handleDeleteAccessModalOpen = data => {
        this.setState({
            showDeleteAccessModal: true,
            access_to_delete: data
        })
    }

    handleDeleteAccessModalClose = event => {
        this.setState({
            showDeleteAccessModal: false,
            access_to_delete: ''
        })
    }

    handleEditAccessModalOpen = (access) => {
        // console.log(access)
        this.setState({
            showEditAccessModal: true,
            edit_access: access
        })
    }

    handleEditAccessModalClose = event => {
        this.setState({
            showEditAccessModal: false
        })
    }

    handleDeleteDiscountModalOpen = (discount) => {
        this.setState({
            showDeleteDiscountModal: true,
            discount_to_delete: discount
        })
    }

    handleDeleteDiscountModalClose = event => {
        this.setState({
            showDeleteDiscountModal: false,
            discount_to_delete: ''
        })
    }

    handleAddDiscountModalOpen = event => {
        this.setState({
            showAddDiscountModal: true
        })
    }

    handleAddDiscountModalClose = event => {
        this.setState({
            showAddDiscountModal: false
        })
    }

    handleBack = event => {
        // this.props.history.push('/memberships')
    }

    handleDeleteAccess = id => {
        console.log(id);
    }

    handleInputChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleDropdownChange = async (e, data) => {
        await this.setState({
            [data.id]: data.value
        })
        console.log(this.state.mems_state)
    }

    handleFromDateChange = date => {
        this.setState({
            mems_period_from: date.format('MM,DD,YYYY')
        })
    }

    handleToDateChange = date => {
        this.setState({
            mems_period_to: date.format('MM,DD,YYYY')
        })
    }

    handleAddAccess = async data => {
        data['key'] = this.state.mems_access_control.length
        await this.setState({
            mems_access_control: [...this.state.mems_access_control,{ ...data }]
        })
        this.handleAddAccessModalClose();
    }

    handleAccessDelete = async event => {
        await this.setState({
            mems_access_control: this.state.mems_access_control.filter(item => item.Value != this.state.access_to_delete.Value)
        })
        this.handleDeleteAccessModalClose();
    }

    handleEditAccess = async data => {
        var access_index = this.state.mems_access_control.findIndex(item => item.Value == data.Value)
        var accesses = [...this.state.mems_access_control]
        accesses[access_index] = data
        await this.setState({
            mems_access_control: accesses
        })
        this.handleEditAccessModalClose();
    }

    handleAddDiscount = async data => {
        data['key'] = this.state.mems_discount.length
        await this.setState({
            mems_discount: [...this.state.mems_discount, { ...data }]
        })
        this.handleAddDiscountModalClose();
    }

    handleDiscountDelete = async event => {
        const obj = Object.assign({}, this.state.discount_to_delete)
        await this.setState({
            mems_discount: this.state.mems_discount.filter(item => item.voucher_code != obj.voucher_code)
        })
        this.handleDeleteDiscountModalClose();
    }

    handleEditDiscount = async data => {
        var discount_index = this.state.mems_discount.findIndex(item => item.price == data.price && item.Discount == data.Discount)
        var discounts = [...this.state.mems_discount]
        discounts[discount_index] = data
        await this.setState({
            mems_discount: discounts
        })
        // this.handleEditDiscountModalClose()
    }

    handleFormSubmit = async event => {
        this.props.showLoading();
        const membership = Object.assign({}, this.state);
        membership['business_id'] = this.props.business.bizid
        membership['mems_fee'] = Number(this.state.mems_fee)
        membership['mems_max_mem'] = Number(this.state.mems_max_mem)
        membership['mems_age_from'] = Number(this.state.mems_age_from)
        membership['mems_age_to'] = Number(this.state.mems_age_to)
        membership.mems_access_control.map(item => {
            if(item.Value == '') {
                return item.Value = null
            }
        })
        membership.mems_discount.map(item => {
            if(item.voucher_code == '') {
                return item.voucher_code = null
            }
        })
        console.log(membership);
        try {
            if(this.props.location.edit_membership) {
                membership['memsid'] = membership.mems_memsid
                const response = await API.put("membership", "/update", {
                    body: membership
                })
                this.props.showLoading();
                this.props.history.push({
                    pathname: "/memberships",
                    edited_membership: response.message
                })
                console.log(response)

            } else {
                const response = await API.post("membership", "/create", {
                    body: membership
                })
                this.props.showLoading();
                console.log(response);
                this.props.history.push({
                    pathname: "/memberships",
                    new_membership: response.message
                })
            }
            
        } catch(e) {
            console.log(e);
            this.props.showLoading();
        }    
    }

    render() {
        return (
            <Container fluid={true} className={classes.membershipsbox}>
                <Form>
                    <Image src={logo} size='small' floated='left' className={classes.logo}/>
                    <Form.Group >
                        <Form.Field width={6} className="required">
                            <label>Membership Name</label>
                            <Input icon='suitcase' iconPosition='left' placeholder='e.g. Gym Adult' id="mems_name" value={this.state.mems_name} onChange={this.handleInputChange}/>
                        </Form.Field> 
                        <Form.Field className="required" width={5}>
                            <label>Frequency</label>
                            <Dropdown
                                id="mems_frequency"
                                fluid
                                search
                                selection
                                placeholder="e.g. Monthly"
                                onChange={this.handleDropdownChange}
                                options={options}
                                value={this.state.mems_frequency}
                            />    
                        </Form.Field>
                        <Form.Field className="required" width={5}>
                            <label>Activity</label>
                            <Dropdown
                                id="mems_activity"
                                fluid
                                search
                                selection
                                placeholder="e.g. Tennis"
                                options={activities}
                                onChange={this.handleDropdownChange}
                                value={this.state.mems_activity}
                            />    
                        </Form.Field>    
                    </Form.Group>
                    <Form.Group>
                        <Form.Field width={5} className="required">
                            <label>State</label>
                            <Dropdown
                                id="mems_state"
                                search
                                selection
                                placeholder="e.g. Enabled"
                                options={states}
                                onChange={this.handleDropdownChange}
                                value={this.state.mems_state}
                            />    
                        </Form.Field>
                        <Form.Field width={11} className="required">
                            <label>Description</label>
                            <Input id="mems_desc" value={this.state.mems_desc} placeholder='e.g. Standard adult badminton package to book all badminton courts.' onChange={this.handleInputChange} />
                        </Form.Field>
                    </Form.Group>  
                    <Form.Group>
                        <Form.Field width={3} className="required">
                            <Popup trigger={<label>Fee</label>} content='General price to displayed to the guest users.' />
                            <Input id="mems_fee" icon='rupee' iconPosition='left' value={this.state.mems_fee} placeholder='e.g. 300' onChange={this.handleInputChange}/>
                        </Form.Field>
                        <Form.Field width={3}>
                            <Popup trigger={<label>Maximum members</label>} content='Maxium number of users to sign up to this membership.' />
                            <Input  id="mems_max_mem" value={this.state.mems_max_mem} placeholder='e.g. 300' onChange={this.handleInputChange} />
                        </Form.Field>
                        <Form.Field width={2}>
                            <Popup trigger={<label>Allow ages</label>} content='Users with below age range are only allowed to book this event.' />
                            <Input id="mems_age_from" value={this.state.mems_age_from} onChange={this.handleInputChange} placeholder='From Age' />
                        </Form.Field>
                        <Form.Field width={2}>
                            <Input id="mems_age_to" value={this.state.mems_age_to} placeholder='To Age' className={classes.toAge} onChange={this.handleInputChange}/>
                        </Form.Field>
                        <Form.Field width={3}>
                            <Popup trigger={<label>Valid Period</label>} content='Allow users to signup only between these membership dates.' />
                            <Datetime
                                id="mems_period_from"
                                dateFormat="MMM Do YYYY"
                                timeFormat={false}
                                onChange={this.handleFromDateChange}
                                closeOnSelect={true}
                                value={this.state.mems_period_from}
                                inputProps={{ placeholder: 'From Date' }}
                                renderInput={(props, openCalendar, closeCalendar) => (
                                    <Input icon="calendar" iconPosition="left" {...props} />
                                )}
                            />   
                        </Form.Field>
                        <Form.Field width={3}>
                            <Datetime
                                id="mems_period_to"
                                className={classes.toAge}
                                onChange={this.handleToDateChange}
                                dateFormat="MMM Do YYYY"
                                timeFormat={false}
                                closeOnSelect={true}
                                value={this.state.mems_period_to}
                                inputProps={{ placeholder: 'To Date' }}
                                renderInput={(props, openCalendar, closeCalendar) => (
                                    <Input icon="calendar" iconPosition="left" {...props} />
                                )}
                            />   
                        </Form.Field>
                    </Form.Group>
                    <br />
                    <Form.Field className="required">
                        <label>Brief about membership</label>
                        <TextArea rows="3" id="mems_brief" value={this.state.mems_brief} placeholder="e.g. This membership is for Intermediate members only. We have club nights on every Tuesday 7:40 PM. " onChange={this.handleInputChange}/>
                    </Form.Field> 
                    <Header dividing={true} size="small" content='Access Control' />
                    <Form.Field>
                        <Table compact celled definition striped>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell />
                                    <Table.HeaderCell>Condition</Table.HeaderCell>
                                    <Table.HeaderCell>Facilities</Table.HeaderCell>
                                    <Table.HeaderCell width={2}>Price</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header> 
                            <Table.Body>
                                {
                                    this.state.mems_access_control.map(data => (
                                        <AccessControl
                                            line1={data.Condition + data.Value}
                                            line2={data.Facility_Type + data.Slots}
                                            line3={data.price}
                                            handleDelete={() => this.handleDeleteAccessModalOpen(data)}
                                            handleEdit={() => this.handleEditAccessModalOpen(data)}
                                        />
                                    ))
                                }  
                            </Table.Body>
                            <Table.Footer fullWidth={true}>
                                <Table.Row>
                                    <Table.HeaderCell />
                                    <Table.HeaderCell colSpan={4}>
                                        <Button primary icon labelPosition='left' floated='right' size='tiny' onClick={this.handleAddAccessModalOpen} id="add_access">
                                            <Icon name='plus' />Add Access
                                        </Button>
                                    </Table.HeaderCell>    
                                </Table.Row>    
                            </Table.Footer>    
                        </Table>
                    </Form.Field>
                    <Form.Field>    
                        <Header dividing={true} size="small" content='Discounts' />
                        <Table compact celled definition striped>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell />
                                    <Table.HeaderCell>Duration</Table.HeaderCell>
                                    <Table.HeaderCell>Discount</Table.HeaderCell>
                                    <Table.HeaderCell>Price</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {
                                    this.state.mems_discount.map(data => (
                                        <AccessControl
                                            line1={'From ' + data.start_date + ' to ' + data.end_date}
                                            line2={data.discount + ' ' + data.voucher_code}
                                            line3={data.dis_percent + `(${data.dis_price})`}
                                            handleDelete={() => this.handleDeleteDiscountModalOpen(data)}
                                            handleEdit={() => this.handleEditDiscountModalOpen(data)}
                                        />    
                                    ))
                                }
                            </Table.Body>  
                            <Table.Footer fullWidth={true}>
                                <Table.Row>
                                    <Table.HeaderCell />
                                    <Table.HeaderCell colSpan={4}>
                                        <Button primary icon labelPosition='left' floated='right' size='tiny' onClick={this.handleAddDiscountModalOpen} id="add_discount">
                                            <Icon name='plus' />Add Discount
                                        </Button>
                                    </Table.HeaderCell>    
                                </Table.Row>    
                            </Table.Footer>   
                        </Table>    
                        <Header dividing={true} size="small" content='Gallery' />
                        <Image.Group size='small'>
                            <Image src={logo} className={classes.logo}/>
                            <Image src={logo} className={classes.logo}/>
                            <Image src={logo} className={classes.logo}/>
                            <Image src={logo} className={classes.logo}/>
                            <Button icon color='green' size='small' labelPosition='left'>
                                <Icon name='upload' />Upload
                            </Button>            
                        </Image.Group>    
                    </Form.Field>       
                    <Header dividing={true} size="small" content='Welcome Message' />
                    <Form.Field className="required">
                        <TextArea rows={2} id="mems_welcome_mes" onChange={this.handleInputChange} value={this.state.mems_welcome_mes} placeholder='Congratulations!!! We heartly thank and welcome you to our family. Our reception is available to help you always.' />
                    </Form.Field>    
                    <Header dividing={true} size="small" content='Leaving Message' />
                    <Form.Field>
                        <TextArea rows={2} id="mems_leaving_mes" onChange={this.handleInputChange} value={this.state.mems_leaving_mes} placeholder='We are sorry to see you leaving us. If you change your mind later, please contact us to get 20% discount.' />
                    </Form.Field>    
                    <center>
                        <Button icon color='red' labelPosition='left' className={"trans5 " + classes.backButton} onClick={this.handleBack}>
                            <Icon name='chevron left' />Back
                        </Button>
                        <Button icon labelPosition='left' className="ui sgcolorhover right labeled trans5" onClick={this.handleFormSubmit} loading={this.props.isLoading}>
                            <Icon name='check' />Create
                        </Button>
                    </center>    
                </Form> 
                { this.state.showAddAccessModal ? 
                    <AddAccessControlModal open={this.state.showAddAccessModal} handleClose={this.handleAddAccessModalClose} addAccess={this.handleAddAccess}/>
                    : null
                } 
                { this.state.showDeleteAccessModal ? 
                    <DeleteAccess open={this.state.showDeleteAccessModal} handleClose={this.handleDeleteAccessModalClose} handleDelete={this.handleAccessDelete}/>
                    : null
                }  
                { this.state.showEditAccessModal ? 
                    <AddAccessControlModal open={this.state.showEditAccessModal} handleClose={this.handleEditAccessModalClose} access={this.state.edit_access} editAccess={this.handleEditAccess} />
                    : null
                }
                { this.state.showDeleteDiscountModal ? 
                    <DeleteDiscount open={this.state.showDeleteDiscountModal} handleClose={this.handleDeleteDiscountModalClose} handleDelete={this.handleDiscountDelete}/>
                    : null
                }
                { this.state.showAddDiscountModal ? 
                    <AddDiscount open={this.state.showAddDiscountModal} handleClose={this.handleAddDiscountModalClose} addDiscount={this.handleAddDiscount} />
                    : null
                }
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        business: state.currentBusinessList,
        isLoading: state.isLoading
    }
}

export default withRouter(connect(mapStateToProps, { showLoading })(AddMembership));