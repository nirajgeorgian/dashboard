import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Step, Icon, Form, Segment, Divider, Checkbox, Button, Input, Label } from 'semantic-ui-react'
import classes from './index.local.scss'

class FundInformation extends Component {
  state = {
    agree: false,
    fundsAvailable: 40509,
    amount: 0
  }

  agreeLicence = event => {
    this.setState({
      agree: !this.state.agree
    })
  }

  passAmount = value => {
    // pass amount to third vaiable
  }

  onInpuChange = event => {
    this.setState({
      amount: event.target.value
    })
  }

  onBackClick = event => {
    this.props.history.goBack()
  }

  onNextClick = event => {
    if(this.state.agree) {
      this.props.changeState({
        chooseAccount: false,
        fundInformation: false,
        withdraw: true
      })
      this.props.changeFund(this.state.amount)
    } else {
      console.log("payment failed");
    }
  }
  render() {
    return (
      <React.Fragment>
        <Step.Group attached='top'>

          <Step completed>
            <Icon name='credit card' />
            <Step.Content>
              <Step.Title>Choose Account</Step.Title>
              <Step.Description>Choose or enter the account information to receive funds.</Step.Description>
            </Step.Content>
          </Step>

          <Step active>
            <Icon name='rupee' />
            <Step.Content>
              <Step.Title>Funds Information</Step.Title>
              <Step.Description>Enter the funds you want to withdraw from Business account and submit request.</Step.Description>
            </Step.Content>
          </Step>

          <Step disabled>
            <Icon name='info' />
            <Step.Content>
              <Step.Title>Withdraw Summary</Step.Title>
              <Step.Description>Summary of your withdraw request after submission.</Step.Description>
            </Step.Content>
          </Step>

        </Step.Group>
        <Form>
          <Segment vertical textAlign='center' attached>
            <div className='field'>Please validate the below account information before proceeding to the withdraw information.</div>
            <Divider fitted />
            <div className = { classes.margintop }>
              <center>
                <div className={ classes.label }>
                  Funds Available
                </div>
                <div className= { classes.value }>
                  ₹ {this.state.fundsAvailable}
                </div>
                <br />
                <Form.Field width="3" required>
                  <label htmlFor='amount' className = { classes.label }>Funds to wirhdraw</label>
                  <Input labelPosition='right' type='text' placeholder='Amount'>
                    <Label>₹</Label>
                    <input
                      placeholder='e.g. 4000'
                      id="amount"
                      onChange = { this.onInpuChange}
                    />
                    <Label basic>.00</Label>
                  </Input>
                </Form.Field>
              </center>
            </div>
            <Divider fitted className={ classes.margintop } />
            <div className = { classes.margintop + ' ' + classes.marginnegativetop }>
              <center>
                <div className="field">
                  <Checkbox
                    label='I agree to the Terms & Conditions and confirm to withdraw with funds.'
                    onClick = { this.agreeLicence }
                    checked = { this.state.agree }
                  />
                </div>
                <Button icon labelPosition='right' color='red' onClick = { this.onBackClick }>
                  Back
                  <Icon name='chevron left' />
                </Button>
                <Button icon labelPosition='right' color='blue' onClick = { this.onNextClick }>
                  Proceed to Pay
                  <Icon name='chevron right' />
                </Button>
              </center>
            </div>
          </Segment>
        </Form>
        <Step.Group attached='bottom' className = { classes.removeBorder }>
          <Divider hidden/>
        </Step.Group>
      </React.Fragment>
    )
  }
}

export default withRouter(connect(null, null)(FundInformation))
