import React, { Component } from 'react'
import { Icon, Step, Segment, Container, Grid, Divider,  Header, Table, Rating, Form, Button, Input, Checkbox } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { API } from 'aws-amplify'
import classes from './index.local.scss'
import findInArray from '../../../../utility/findInArray'

let plan;
let description;
let costPerMonth;

class Checkout extends Component {
  state = {
    discountPrice: 0,
    gstPrice: 0,
    amount: 0,
    agree: false,
    plan: -1
  }
  componentWillMount() {
    const { plan } = this.props.location.state
    this.setState({
      plan
    })
    if(this.props.location.state == undefined) {
      return this.props.history.push("/404")
    }
    if(this.props.location.state.choose1 == 'Chosen') {
      // plan = 'Startup'
      description = ""
      costPerMonth = this.props.location.state.plan1 / 12;
    }
    if(this.props.location.state.choose2 == 'Chosen') {
      // plan = 'Small'
      description = <Table.Cell>Small Plan is for small businesses which are having a single branch.
      <br />
      It will have all the features of sagepass like other plans.
      <br />
      <a className="green text">
        <strong>You are entitled to 14 days money back guarantee.</strong>
      </a>
      <br />
      If you are not satisfied, please contact sagepass support for money back.</Table.Cell>
      costPerMonth = this.props.location.state.plan2 / 12;
    }
    if(this.props.location.state.choose3 == 'Chosen') {
      // plan = 'Big'
      description = ""
      costPerMonth = this.props.location.state.plan3 / 12;
    }
    // compute total Price
    const amount = ((costPerMonth * 12) - (this.state.discountPrice + this.state.gstPrice))
    this.setState({
      amount
    })
  }

  onBackClick = event => {
    this.props.history.goBack()
  }

  agreeLicence = event => {
    this.setState({
      agree: !this.state.agree
    })
  }

  onNextClick = async event => {
    if(this.state.agree) {
      console.log(this.state)
      const data = await API.post("payments", '/b2b/request', {
        body: {
          amount: this.state.amount,
          plan: this.state.plan
        }
      })
      if(data.message.CHECKSUMHASH) {
        this.props.history.push({
          pathname: '/payments/makepayment',
          data: data
        })
      }
    } else {
      console.log("payment failed");
    }
  }

  render() {
    return (
      <div>
        <Step.Group attached='top'>

          <Step>
            <Icon name='telegram plane' />
            <Step.Content>
              <Step.Title>Plan</Step.Title>
              <Step.Description>Create business account and choose your Plan.</Step.Description>
            </Step.Content>
          </Step>

          <Step active>
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
            <div className='field'>Please validate the below plan related information before proceeding to the payment.</div>
              <Table celled padded className = { classes.tablecenter }>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell singleLine>Plan</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell>Cost Per MOnth</Table.HeaderCell>
                    <Table.HeaderCell>Months</Table.HeaderCell>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <Header as='h1' textAlign='center' className = { classes.sgcolor }>{ plan }</Header>
                    </Table.Cell>
                    { description }
                    <Table.Cell>{ costPerMonth }</Table.Cell>
                    <Table.Cell>12</Table.Cell>
                    <Table.Cell>{ costPerMonth * 12 }</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            <Divider fitted />

            <Grid className = { classes.margintop + ' ' + classes.marginnegativebottom }>
              <Grid.Column floated='left' width={10}>
              </Grid.Column>
              <Grid.Column floated='right' width={4}>
                <Input fluid placeholder='Promotional Coupon Code...' />
              </Grid.Column>
              <Grid.Column floated='right' width={2}>
                <Button color='green' className={ classes.marginright }>Apply</Button>
              </Grid.Column>
            </Grid>

            <Grid className = { classes.marginnegativebottom }>
              <Grid.Column floated='left' width={10}>
              </Grid.Column>
              <Grid.Column floated='right' width={4}>
                <Header size='tiny' color='black' floated='right'>Plan Purchase:</Header>
              </Grid.Column>
              <Grid.Column floated='right' width={2}>
                <Header size='tiny' color='black' floated='right' className = { classes.marginleft }>{ (costPerMonth * 12).toFixed(2) }</Header>
              </Grid.Column>
            </Grid>

            <Grid className = { classes.marginnegativebottom }>
              <Grid.Column floated='left' width={10}>
              </Grid.Column>
              <Grid.Column floated='right' width={4}>
                <Header size='tiny' color='green' floated='right'>Discount Price:</Header>
              </Grid.Column>
              <Grid.Column floated='right' width={2}>
                <Header size='tiny' color='green' floated='right'>-₹ {this.state.discountPrice.toFixed(2)}</Header>
              </Grid.Column>
            </Grid>

            <Grid className = { classes.marginnegativebottom }>
              <Grid.Column floated='left' width={10}>
              </Grid.Column>
              <Grid.Column floated='right' width={4}>
                <Header size='tiny' color='blue' floated='right'>Estimated GST:</Header>
              </Grid.Column>
              <Grid.Column floated='right' width={2}>
                <Header size='tiny' color='blue' floated='right'>₹ {this.state.gstPrice.toFixed(2)}</Header>
              </Grid.Column>
            </Grid>

            <Grid className = { classes.marginbottom }>
              <Grid.Column floated='left' width={10}>
              </Grid.Column>
              <Grid.Column floated='right' width={4}>
                <Header size='tiny' color='black' floated='right'>Total Price:</Header>
              </Grid.Column>
              <Grid.Column floated='right' width={2}>
                <Header size='tiny' color='black' floated='right'>₹ {this.state.amount.toFixed(2)}</Header>
              </Grid.Column>
            </Grid>

            <Divider fitted />
            <div className = { classes.margintop + ' ' + classes.marginnegativetop }>
              <center>
                <div className="field">
                  <Checkbox
                    label='I agree to the Terms & Conditions and confirm to proceed with payment.'
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
      </div>
    )
  }
}

export default withRouter(connect(null, null)(Checkout))
