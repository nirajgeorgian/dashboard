import React, { Component } from 'react';
import { Container, Form, Button, Input } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { paymentRequest } from '../../Actions/index';

import { invokeApig } from '../../Config/awsLib'

class Payment extends Component{

  state = {
    buyer_name: '',
    email: '',
    phone: '',
    purpose: '',
    amount: '',
    redirect_url: 'http://www.example.com',
    send_email: false,
    send_sms: false,
    allow_repeated_payments: false,
    webhook: 'http://www.example.com'
  }

  handleInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleForm = async event => {
    event.preventDefault()
    this.props.paymentRequest(this.state)
  }
  validateForm = () => {
    const validate = this.state.name.length &&
            this.state.email.length &&
            this.state.phone.length &&
            this.state.purpose.length &&
            this.state.amount.length

    return validate
  }

  render(){
    return (
      <Container className={"authform"}>
        <Form onSubmit={this.handleForm} error>
          <Form.Field>
            <label>Buyer Name</label>
            <Input
              autoFocus
              type="text"
              placeholder="Enter your name"
              id="buyer_name"
              onChange={this.handleInputChange}
              loading={this.props.isLoading}
            />
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <Input
              autoFocus
              type="email"
              placeholder="Enter your email"
              id="email"
              onChange={this.handleInputChange}
              loading={this.props.isLoading}
            />
          </Form.Field>
          <Form.Field>
            <label>Phone</label>
            <Input
              autoFocus
              type="number"
              placeholder="Enter contact"
              id="phone"
              onChange={this.handleInputChange}
              loading={this.props.isLoading}
            />
          </Form.Field>
          <Form.Field>
            <label>Purpose</label>
            <Input
              autoFocus
              type="text"
              placeholder="Enter purpose"
              id="purpose"
              onChange={this.handleInputChange}
              loading={this.props.isLoading}
            />
          </Form.Field>
          <Form.Field>
            <label>Amount</label>
            <Input
              autoFocus
              type="number"
              placeholder="Enter amount"
              id="amount"
              onChange={this.handleInputChange}
              loading={this.props.isLoading}
            />
          </Form.Field>
          <Button loading={this.props.isLoading} type="submit">Submit</Button>
        </Form>
    </Container>
    )
  }
}

function mapStateToProps(state){
  return {
    isLoading: state.isLoading,
    paymentStatus: state.paymentStatus
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ paymentRequest }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
