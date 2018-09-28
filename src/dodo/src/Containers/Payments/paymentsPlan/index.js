import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ChoosePlan from './chooseplan/index'
import Checkout from './checkout/index'
import WithdrawModule from './withdraw/index'
import classes from './index.local.scss'
import Footer from '../../../Components/UI/Footer/index'
import NotFound from '../../../Components/UI/404/NotFound'
import MakePayment from './makepayment'

class PaymentsPlan extends Component {
  state = {

  }

  render() {
    return (
      <div className = { classes.middiv }>
        {
          this.props.match.path === '/payments/chooseplan'
          && <ChoosePlan />
        }
        {
          this.props.match.path === '/payments/checkout'
          && <Checkout />
        }
        {
          this.props.match.path === '/payments/withdraw'
          && <WithdrawModule />
        }
        {
          this.props.match.path === '/payments/makepayment'
          && <MakePayment />
        }
      </div>
    )
  }
}





export default withRouter(connect(null, null)(PaymentsPlan))
