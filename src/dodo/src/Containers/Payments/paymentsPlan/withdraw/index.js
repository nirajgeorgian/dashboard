import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { API } from 'aws-amplify'
import classes from './index.local.scss'
import ChooseAccount from './chooseAccount/index'
import FundInformation from './fundInformation/index'
import Withdraw from './withdraw/index'

class WithdrawModule extends Component {
  state = {
    chooseAccount: true,
    fundInformation: false,
    withdraw: false,
    person: [],
    fund: 0,
  }

  changeState = (state) => {
    this.setState(state)
  }

  changePerson = person => {
    const oldState = { ...this.state }
    oldState.person.push(person)
    this.setState({
      oldState
    })
  }
  changeFund = fund => {
    this.setState({
      fund
    })
  }

  render() {
    return (
        <div>
        {
          this.state.chooseAccount === true
          ? (<ChooseAccount
            changeState = { this.changeState }
            changePerson = { this.changePerson }
            currentBusinessList = { this.props.currentBusinessList }
          />)
          : null
        }
        {
          this.state.fundInformation === true
          ? <FundInformation changeState = { this.changeState } changeFund = { this.changeFund } currentBusinessList = { this.props.currentBusinessList } />
          : null
        }
        {
          this.state.withdraw === true
          ? <Withdraw changeState = { this.changeState } fund = { this.state.fund } person = { this.state.person } currentBusinessList = { this.props.currentBusinessList } />
          : null
        }
        </div>
      )
  }
}

export default withRouter(connect(null, null)(WithdrawModule))
