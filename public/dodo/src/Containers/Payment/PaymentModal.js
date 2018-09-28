import React, { Component } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import { bindActionCreators } from 'redux'
import classes from './Payment.local.scss'
import {
  Container,
  Form,
  Button,
  Input,
  Message,
  Checkbox,
  Modal,
  Icon,
  Header
} from 'semantic-ui-react'
import PaymentProcess from './paymentProcess/paymentProcess'
import { getCurrentUser } from '../../Config/awsLib'
// import { RedirectPage } from './paymentProcess/redirectPage'
import config from './paymentProcess/config'
import RedirectPage from './paymentProcess/redirectPage'
import Loading from '../../Components/UI/Loading/index'
import paytm_logo from '../../assests/img/paytm_logo.png'

class PaymentModal extends Component {
  state = {
    subscription1Choosen: 'Select',
    subscription2Choosen: 'Select',
    amount: '',
    hidden_text: 'Choose a Plan',
    cssForSubscription1: '',
    cssForSubscription2: '',
    redirectUrl: false,
    formData: []
  }

  selectSubscription1 = event => {
    this.setState({
      subscription1Choosen: 'Chosen',
      subscription2Choosen: 'Select',
      amount: 40,
      // amount: 500,
      hidden_text: '₹7188 a year',
      cssForSubscription1: classes.planselectbox,
      cssForSubscription2: ''
    })
  }

  selectSubscription2 = event => {
    this.setState({
      subscription1Choosen: 'Select',
      subscription2Choosen: 'Chosen',
      amount: 11988,
      hidden_text: '₹11988 a year',
      cssForSubscription1: '',
      cssForSubscription2: classes.planselectbox
    })
  }

  redirectPage = data => {
    return <RedirectPage />
  }

  // generate custom unique id

  onFormSubmit = async event => {
    event.preventDefault()
    let mappedData = {}
    const userId = this.props.currentUser.map(user => {
      mappedData[user.Name] = user.Value
    })
    const beforeData = {
      EMAIL: mappedData.email,
      couponcode: 'DODO12'
    }
    if (this.state.amount) {
      if (beforeData.couponcode) {
        axios
          .get(
            `https://api.sagepass.com/payments/coupon/${beforeData.couponcode}`
          )
          .then(async data => {
            if (data.data.status) {
              const percentage = data.data.data.percentage
              const originalAmount = this.state.amount
              const newAmount =
                this.state.amount - percentage / 100 * this.state.amount
              this.setState({ amount: newAmount })
              const timestamp = Math.floor(new Date() / 1000)
              const newPayment = new PaymentProcess(
                mappedData.sub,
                mappedData.email,
                newAmount,
                'SUBSCRIBE',
                timestamp
              )
              await newPayment
                .returnChecksum()
                .then(data => this.setState({ formData: data }))
                .then(async () => {
                  let newFormData = { ...this.state.formData }
                  newFormData.TXN_AMOUNT = newAmount
                  this.setState({ formData: newFormData })
                  beforeData.ORDERID = this.state.formData.ORDER_ID
                  await axios({
                    method: 'post',
                    url: 'https://api.sagepass.com/payments/before',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    data: beforeData
                  })
                    .then(data => console.log(data))
                    .then(data => this.setState({ redirectUrl: true }))
                    .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
            } else {
              console.log('coupon code not allowed')
            }
          })
          .catch(err => console.log(err))
      } else {
        const timestamp = Math.floor(new Date() / 1000)
        const newPayment = new PaymentProcess(
          mappedData.sub,
          mappedData.email,
          this.state.amount,
          'DEFAULT',
          timestamp
        )
        newPayment
          .returnChecksum()
          // .then(data => console.log(data))
          // send data to mysql and then after payment retrieve it
          .then(data => this.setState({ formData: data }))
          .then(async () => {
            beforeData.ORDERID = this.state.formData.ORDER_ID
            await axios({
              method: 'post',
              url: 'https://api.sagepass.com/payments/before',
              headers: {
                'Content-Type': 'application/json'
              },
              data: beforeData
            })
              .then(data => console.log(data))
              .then(data => this.setState({ redirectUrl: true }))
              .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
      }
    }
  }

  render() {
    if (!this.state.redirectUrl) {
      return (
        <Modal
          open={this.props.showPayment}
          onClose={this.props.handlePaymentModalClose}
          dimmer={'inverted'}
          className="ui modal small paymentmodal"
        >
          <Modal.Header className="header">
            <center>Choose the Plan</center>
          </Modal.Header>
          <Modal.Content>
            <Modal.Description className="column">
              <div className="ui form">
                <div className="field">
                  <center>
                    <b className={'ui text green ' + classes.bolding}>
                      Your Business has been created successfully.
                    </b>
                    <br /> Please choose any of the following plans and start
                    with us.
                  </center>
                </div>
                <div className={'ui two column centered grid ' + classes.bottomdiv}>
                  <div className={'three column centered row ' + classes.columndiv} >
                    <div
                      className={
                        'column animate trans3 ' +
                        classes.plansbox +
                        ' ' +
                        this.state.cssForSubscription1
                      }
                    >
                      <h3>
                        <strong>Standard</strong>
                      </h3>
                      <h4>
                        <strong>For Single Branch</strong>
                      </h4>
                      <a className={classes.pricetext}>&#8377;599</a>
                      <h4>
                        <strong>/ Month</strong>
                      </h4>
                      <br />
                      <h5>
                        <strong>*Paid Annually</strong>
                      </h5>
                      <br />
                      <a
                        className="ui sgcolorhover animate button"
                        onClick={this.selectSubscription1}
                      >
                        {this.state.subscription1Choosen}
                      </a>
                    </div>
                    <div
                      className={
                        'column animate trans3 ' +
                        classes.plansbox +
                        ' ' +
                        this.state.cssForSubscription2
                      }
                    >
                      <h3>
                        <strong>Premium</strong>
                      </h3>
                      <h4>
                        <strong>For Multiple Branches</strong>
                      </h4>
                      <a className={classes.pricetext}>&#8377;999</a>
                      <h4>
                        <strong>/ Month</strong>
                      </h4>
                      <br />
                      <h5>
                        <strong>*Paid Annually</strong>
                      </h5>
                      <br />
                      <a
                        className="ui sgcolorhover animate button"
                        onClick={this.selectSubscription2}
                      >
                        {this.state.subscription2Choosen}
                      </a>
                    </div>
                  </div>
                  <div className={classes.planpaymentinfo}>
                    <center>
                      powered by{' '}
                      <img src={paytm_logo} className={classes.paytmlogo} />
                      <br />
                      <br />
                      <div className="required field">
                        <div className="ui checkbox">
                          <input type="checkbox" />
                          <label>
                            I agree to the <a href="/terms">Terms of Service</a>.
                          </label>
                        </div>
                      </div>
                      <button
                        className="ui sgcolorhover animated fade labeled icon button trans5"
                        tabIndex="0"
                        onClick={this.onFormSubmit}
                      >
                        <div className="visible content">
                          Proceed to Pay
                          <i className="chevron right icon" />
                        </div>
                        <div className="hidden content">
                          {this.state.hidden_text}
                        </div>
                      </button>
                    </center>
                  </div>
                </div>
              </div>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      )
    } else {
      let obj1 = []
      for (let name in this.state.formData) {
        obj1.push({
          [name]: this.state.formData[name]
        })
      }
      let dodoDuck = obj1.map((x, i) => {
        for (let name in x) {
          return (
            <input
              key={name}
              type="hidden"
              name={name}
              defaultValue={x[name]}
            />
          )
        }
      })
      return <RedirectPage open={this.state.redirectUrl} formData={dodoDuck} />
    }
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}

export default withRouter(connect(mapStateToProps, null)(PaymentModal))
