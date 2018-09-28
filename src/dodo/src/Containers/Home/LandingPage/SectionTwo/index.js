import React from 'react'

import classes from './SectionTwo.local.scss'
import onlinePymentIcon from '../../../../assests/img/onlinepayment_icon.png'
import accountsManagementIcon from '../../../../assests/img/accounting.png'
import analyticsIcon from '../../../../assests/img/analytics.png'
import bookingsIcon from '../../../../assests/img/court_icon.png'

const SectionTwo = () => {
  return (
    <div className={classes.container}>
      <div className={classes.contents}>
        <div className={classes.row_one}>
          <div className={classes.content}>
            <div className={classes.image}>
              <img src={onlinePymentIcon} alt="" />
            </div>
            <div className={classes.texts}>
              <h1>Online Payments</h1>
              <p>
                Make your business online and receive payments with us. Have
                uninterrupted access to your funds and define your costs.
              </p>
            </div>
          </div>
          <div className={classes.content}>
            <div className={classes.image}>
              <img src={accountsManagementIcon} alt="" />
            </div>
            <div className={classes.texts}>
              <h1>Accounts Management</h1>
              <p>
                Manage your accounts and every online transactions and bills
                flawless. Know your business profits and progress with details.
              </p>
            </div>
          </div>
        </div>
        <div className={classes.row_two}>
          <div className={classes.content}>
            <div className={classes.image}>
              <img src={bookingsIcon} alt="" />
            </div>
            <div className={classes.texts}>
              <h1>Bookings</h1>
              <p>
                Allow users to book facilities instantly. Define the schedule,
                cost and offers for each facilities.
              </p>
            </div>
          </div>
          <div className={classes.content}>
            <div className={classes.image}>
              <img src={analyticsIcon} alt="" />
            </div>
            <div className={classes.texts}>
              <h1>Business Analytics</h1>
              <p>
                Find the customer interactions and business trends. Fine tune
                your business for optimal success.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionTwo
