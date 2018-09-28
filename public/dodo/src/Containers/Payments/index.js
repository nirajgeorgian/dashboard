import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PaymentsPlan from './paymentsPlan/index'
import Footer from '../../Components/UI/Footer/index'

class Payments extends Component {
  onChooseplan = event => {
    this.props.history.push("/payments/chooseplan")
  }
  render() {
    // Checkout
    if(this.props.location.pathname == '/payments/checkout')
    return (
      <PaymentsPlan />
    )

    // Withdraw
    if(this.props.location.pathname == '/payments/withdraw')
    return (
      <div>withdraw</div>
    )

    // Chooseplan
    if(this.props.location.pathname == '/payments/chooseplan')
    return (
      <div>
        <PaymentsPlan />
        <Footer />
      </div>
    )
  }
}

export default withRouter(connect(null, null)(Payments))
