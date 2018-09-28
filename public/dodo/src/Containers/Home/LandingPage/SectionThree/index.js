import React from 'react'

import classes from './SectionThree.local.scss'
import moneyBackIcon from '../../../../assests/img/money_back.png'
import accountsManagementIcon from '../../../../assests/img/accounting.png'
import analyticsIcon from '../../../../assests/img/analytics.png'
import bookingsIcon from '../../../../assests/img/court_icon.png'

const SectionThree = () => {
  return (
    <div className={classes.container}>
      <div className={classes.money_back}>
        <img src={moneyBackIcon} />
        <div className={classes.texts}>
          <h3>Money Back Gaurantee</h3>
          <p className={classes.description}>
            Get your full refund <strong>within 14 Days</strong> after payment
            gateway fees if you are not satisfied.
          </p>
          <p className={classes.no_condition}>No Conditions apply.</p>
        </div>
      </div>
      <div className={classes.plans}>
        <div className={classes.plan}>
          <h3 className={classes.plan_name}>Small</h3>
          <p className={classes.plan_for}>For Single Branch</p>
          <p className={classes.price}>₹599</p>
          <p className={classes.duration}>/ Month</p>
          <p className={classes.text}>*Paid Annually</p>

          <p className={classes.text}>One Branch only</p>

          <p className={classes.text}>All features include</p>
        </div>
        <div className={classes.plan}>
          <h3 className={classes.plan_name}>Big</h3>
          <p className={classes.plan_for}>For Multiple Branches</p>
          <p className={classes.price}>₹999</p>
          <p className={classes.duration}>/ Month</p>
          <p className={classes.text}>*Paid Annually</p>

          <p className={classes.text}>Up to 10 branches</p>

          <p className={classes.text}>All features include</p>
        </div>
      </div>
    </div>
  )
}

export default SectionThree
