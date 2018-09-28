import React, { Component } from 'react'
import { Icon, Step, Segment, Container, Grid, Divider, Button, Form } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import classes from './index.local.scss'
import findInArray from '../../../../utility/findInArray'

class ChoosePlan extends Component {
  state = {
    plan1: '',
    plan2: '',
    plan3: '',
    choose1: 'Select',
    choose2: 'Select',
    choose3: 'Select',
    plan: -1
  }
  onNextClick = event => {
    const arr = Object.keys(this.state)
    const result = findInArray(this.state, arr, "Chosen")
    if(result != 'nothing found') {
      this.props.history.push({
        pathname: '/payments/checkout',
        state: this.state
      })
    } else {
      console.log("you need to select a plan")
    }
  }

  startup = event => {
    const value = 299 * 12;
    this.setState({
      plan1: value,
      plan2: '',
      plan3: '',
      choose1: 'Chosen',
      choose2: 'Select',
      choose3: 'Select',
      plan: 1
    })
  }

  small = event => {
    const value = 599 * 12;
    this.setState({
      plan1: '',
      plan2: value,
      plan3: '',
      choose1: 'Select',
      choose2: 'Chosen',
      choose3: 'Select',
      plan: 2
    })
  }

  big = event => {
    const value = 999 * 12;
    this.setState({
      plan1: '',
      plan2: '',
      plan3: value,
      choose1: 'Select',
      choose2: 'Select',
      choose3: 'Chosen',
      plan: 3
    })
  }
  render() {
    return (
      <div>
        <Step.Group attached='top'>

          <Step active>
            <Icon name='telegram plane' />
            <Step.Content>
              <Step.Title>Plan</Step.Title>
              <Step.Description>Create business account and choose your Plan.</Step.Description>
            </Step.Content>
          </Step>

          <Step disabled>
            <Icon name='info' />
            <Step.Content>
              <Step.Title>Order Summary</Step.Title>
              <Step.Description>Verify your order information before payment.</Step.Description>
            </Step.Content>
          </Step>

          <Step disabled>
            <Icon name='payment' />
            <Step.Content>
              <Step.Title>Make Payment</Step.Title>
              <Step.Description>Payment to be completed with paytm.</Step.Description>
            </Step.Content>
          </Step>

        </Step.Group>
        <Form>
          <Segment vertical textAlign='center' attached>
            <div className='field'>Please choose the plan according to your needs.</div>
            <Grid container columns={5} centered>
              <Grid.Row columns={3}>
                <Grid.Column>
                  <div className = { classes.plansbox + ' ' + ((this.state.choose1 === 'Chosen') ? classes.planselectbox : '')}>
                    <h3><strong>Startup*</strong></h3>
                    <h4><strong>For New Startup</strong></h4>
                    <a className={ classes.pricetext }>&#8377;299</a>
                    <h4><strong>/ Month</strong></h4>
                    <h5><strong>*Paid Annually</strong></h5>
                    <Button
                      className = { classes.buttonSelect }
                      onClick = { this.startup }
                    >{ this.state.choose1 }</Button>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <div className = { classes.plansbox + ' ' + ((this.state.choose2 === 'Chosen') ? classes.planselectbox : '')}>
                    <h3><strong>Small</strong></h3>
                    <h4><strong>For Single Branch</strong></h4>
                    <a className={ classes.pricetext }>&#8377;599</a>
                    <h4><strong>/ Month</strong></h4>
                    <h5><strong>*Paid Annually</strong></h5>
                    <Button
                      className = { classes.buttonSelect }
                      onClick = { this.small }
                    >{ this.state.choose2 }</Button>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <div className = { classes.plansbox + ' ' + ((this.state.choose3 === 'Chosen') ? classes.planselectbox : '')}>
                    <h3><strong>Big</strong></h3>
                    <h4><strong>For Multiple Branches</strong></h4>
                    <a className={ classes.pricetext }>&#8377;999</a>
                    <h4><strong>/ Month</strong></h4>
                    <h5><strong>*Paid Annually</strong></h5>
                    <Button
                      className = { classes.buttonSelect }
                      onClick = { this.big }
                    >{ this.state.choose3 }</Button>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Divider fitted className = { classes.marginremove } />
            <div className = { classes.marginbottom }>
              <center>
                <div className="field">
                  You can review your order in the next page before making the payment.
                </div>
                <Button
                  icon
                  labelPosition='right'
                  color='blue'
                  onClick = { this.onNextClick }
                  className = { classes.paytmcolor }
                >
                  Next
                  <Icon name='chevron right' />
                </Button>
              </center>
            </div>
          </Segment>
        </Form>
        <Step.Group attached='bottom' className = { classes.removeBorder }>
          <Divider hidden/>
        </Step.Group>
      </div>
    )
  }
}

export default withRouter(connect(null, null)(ChoosePlan))
