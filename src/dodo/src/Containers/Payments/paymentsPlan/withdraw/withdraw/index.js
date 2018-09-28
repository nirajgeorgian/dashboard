import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { API } from 'aws-amplify'
import { Step, Icon, Form, Segment, Divider, Checkbox, Button, Card } from 'semantic-ui-react'
import classes from './index.local.scss'

class Withdraw extends Component {
  state = {
    person: null
  }

  componentWillMount() {
    const person = this.props.person[0]
    person.bizid = this.props.currentBusinessList.bizid
    person.fullname = person.name
    person.withdrawamount = this.props.fund
    this.setState({
      person: person
    })
  }

  onSubmitPay = async () => {
    const data = API.post("accounts", "/withdraw", {
      body: this.state.person
    })
    console.log(data)
  }
  
  render() {
    const [ person ] = this.props.person
    const fund = this.props.fund
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

          <Step completed>
            <Icon name='rupee' />
            <Step.Content>
              <Step.Title>Funds Information</Step.Title>
              <Step.Description>Enter the funds you want to withdraw from Business account and submit request.</Step.Description>
            </Step.Content>
          </Step>

          <Step active>
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
                    Funds Withdrawn
                  </div>
                  <div className= { classes.value }>
                    ₹ {fund}
                  </div>
                  <br />
                  <Form.Field width="3" required>
                    <div className = { classes.label }>Account Used</div>
                      <Card centered>
                        <Card.Content>
                          <Card.Header>{ person.name }</Card.Header>
                          <Card.Meta>{ person.acctype }</Card.Meta>
                          <Card.Description textAlign='center'>
                            <p>IFSC Code: { person.ifsc }</p>
                            <p>Account Number: { person.accno }</p>
                            <p>Branch: { person.bankname + ', ' + person.branchname }</p>
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra textalign='center'>
                          <Icon name='university'/>
                          { person.branchname }
                        </Card.Content>
                      </Card>
                  </Form.Field>
                </center>
              </div>
              <Divider fitted className={ classes.margintop }/>
              <div className = { classes.margintop + ' ' + classes.marginnegativetop }>
                <center>
                  <Button icon labelPosition='right' color='green' onClick = { this.onSubmitPay }>
                    Proceed to Accounts
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

const mapStateToProps = state => {
	return {
		currentBusinessList: state.currentBusinessList,
	}
}

export default withRouter(connect(mapStateToProps, null)(Withdraw))
