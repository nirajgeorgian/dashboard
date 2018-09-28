import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Step, Icon, Form, Segment, Divider, Checkbox, Button, Modal, Header, Dropdown, Input } from 'semantic-ui-react'
import { API } from 'aws-amplify'
import { connect } from 'react-redux'
import PersonCard from './personCard'
import classes from './index.local.scss'

const accountOptions = [
  {key: 'Dm', value: 'Domestic', text: 'Domestic'},
  {key: 'Sv', value: 'Savings', text: 'Savings'},
  {key: 'Cr', value: 'Current', text: 'Current'},
  {key: 'Nr', value: 'NRO', text: 'NRO'}
]



class ChooseAccount extends Component {
  state = {
    agree: false,
    agreePerson: false,
    modelOpen: false,
    person: {
      name: '',
      bankname: '',
      branchname: '',
      ifsc: '',
      acctype: '',
      accno: ''
    },
    persons: [],
    loading: true,
    cardNo: -1
  }

  setCardCount = cardNo => this.setState({ cardNo })

  async componentWillMount() {
    const id = this.props.currentBusinessList.bizid
    const getData = await API.get("accounts", `/paymentmode/list/${id}`)
    if(Object.keys(getData.response).length !== 0) {
      const bankLists = getData.response.Item.accdetails.bankacc
      const mappedBankLists = bankLists.map((obj, i) => ({
        id: i,
        name: obj.fullname,
        acctype: obj.acctype,
        ifsc: obj.ifsc,
        accno: obj.accno,
        branchname: obj.branchname,
        bankname: obj.bankname
      }))
      const oldState = { ...this.state }
      oldState.persons = mappedBankLists
      oldState.loading = false
      this.setState(oldState)
      console.log(this.state);
    } else {
      this.setState({
        loading: false
      })
    }
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  agreeLicence = event => {
    this.setState({
      agree: !this.state.agree
    })
  }

  agreePersonCreate = event => {
    this.setState({
      agreePerson: !this.state.agreePerson
    })
  }

  onBackClick = event => {
    this.props.history.goBack()
  }

  onNextClick = event => {
    if(this.state.agree) {
      this.props.changeState({
        chooseAccount: false,
        fundInformation: true,
        withdraw: false
      })
    } else {
      console.log("payment failed");
    }
  }

  onInputChange = (event, data) => {
    const id = event.target.id
    const stateClone = { ...this.state }
    stateClone.person[id] = data.value
    this.setState({
      stateClone
    })
  }

  onAccountType = (event, data) => {
    const stateClone = { ...this.state }
    if(data.value.trim().length != 0) {
      stateClone.person.acctype = data.value
      this.setState({
        stateClone
      })
    }
  }

  addPerson = async event => {
    let person = this.state.person
    for(let values in Object.values(person)) {
      if(values.trim() == '') {
        return false;
      }
    }
    // every thing is alright
    if(this.state.agreePerson) {
      const stateClone = { ...this.state }
      stateClone.persons.push(person)
      for(let values in Object.keys(stateClone.person)) {
        stateClone.person.values = ''
      }
      const data = Object.assign({}, this.state.person, {
        type: 1,
        bizid: this.props.currentBusinessList.bizid
      })
      data.fullname = data.name
      const personAdd = await API.post("accounts", "/paymentmode/add", {
        body: data
      })
      stateClone.agreePerson = false
      this.setState(stateClone)
      this.handleClose()
    }
  }

  onPersonSelect = event => {

  }

  render() {
    return (
      <React.Fragment>
        <Step.Group attached='top'>

          <Step active>
            <Icon name='credit card' />
            <Step.Content>
              <Step.Title>Choose Account</Step.Title>
              <Step.Description>Choose or enter the account information to receive funds.</Step.Description>
            </Step.Content>
          </Step>

          <Step disabled>
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
          <Segment vertical attached>
            <div className={ classes.textCenter }>Please validate the below account information before proceeding to the withdraw information.</div>
            <Divider fitted />
            <div className = { classes.personCard }>
              {
                this.state.loading
                ? <div>Loading ...</div>
                : (
                    <PersonCard
                      persons = { this.state.persons }
                      onClick = { this.onPersonSelect }
                      changePerson = { this.props.changePerson }
                      setCardCount = { this.setCardCount }
                      id = { this.state.cardNo }
                    />
                  )
              }
              <br />
              <br />
              <Modal dimmer='inverted' onClose={this.handleClose} open={this.state.modalOpen } centered={true} trigger ={
                  <Button positive icon labelPosition = 'left' onClick = { this.handleOpen }>
                    <Icon name='university' />
                    Add Back Account
                  </Button>
              }>
                <Modal.Header className={ classes.center }>Add Receiver Bank Account</Modal.Header>
                <Modal.Content>
                  <Form>
                    <Form.Group widths='equal'>
                      <Form.Field required>
                        <label>Full Name</label>
                        <Input
                          icon='user'
                          iconPosition='left'
                          placeholder='e.g. Steve Jobs'
                          id = 'name'
                          onChange = { this.onInputChange }
                        />
                      </Form.Field>
                      <Form.Field required>
                        <label>Bank Name</label>
                        <Input
                          icon='university'
                          iconPosition='left'
                          placeholder='e.g. Citi Bank'
                          id = 'bankname'
                          onChange = { this.onInputChange }
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Group widths='equal'>
                      <Form.Field required>
                        <label>Branch Name</label>
                        <Input
                          icon='code branch'
                          iconPosition='left'
                          placeholder='e.g. Mumbai'
                          id = 'branchname'
                          onChange = { this.onInputChange }
                        />
                      </Form.Field>
                      <Form.Field required>
                        <label>IFSC Code</label>
                        <Input
                          icon='code'
                          iconPosition='left'
                          placeholder='e.g. CITI0000003'
                          id = 'ifsc'
                          onChange = { this.onInputChange }
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Group widths='equal'>
                      <Form.Field required>
                        <label>Account Type</label>
                        <Dropdown
                          placeholder='e.g Savings'
                          selection
                          options = {accountOptions}
                          onChange = { this.onAccountType }
                        />
                      </Form.Field>
                      <Form.Field required>
                        <label>Account Number</label>
                        <Input
                          icon='calculator'
                          iconPosition='left'
                          placeholder='e.g. 123456789'
                          id = 'accno'
                          onChange = { this.onInputChange }
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Field className={classes.center}>
                      <Checkbox
                        label='I agree to the Terms and Conditions'
                        onClick = { this.agreePersonCreate }
                        checked = { this.state.agreePerson }
                      />
                    </Form.Field>
                    <Form.Field className={classes.center}>
                      <Button positive icon labelPosition = 'right' onClick = { this.addPerson }>
                        <Icon name='checkmark' />
                        Add
                      </Button>
                    </Form.Field>
                  </Form>
                </Modal.Content>
              </Modal>
            </div>
            <Divider fitted />
            <div className = { classes.margintop + ' ' + classes.marginnegativetop }>
              <center>
                <div className="field">
                  <Checkbox
                    label='I confirm that the account chosen is correct and undersand the consequences of providing incorrect information.'
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

const mapStateToProps = state => {
	return {
		currentBusinessList: state.currentBusinessList,
	}
}

export default withRouter(connect(mapStateToProps, null)(ChooseAccount))
