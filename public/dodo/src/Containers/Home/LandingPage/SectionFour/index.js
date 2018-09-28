import React from 'react'

import classes from './SectionFour.local.scss'
import memberShipIcon from '../../../../assests/img/membership_icon.png'
import policyIcon from '../../../../assests/img/policy_icon.png'

const SectionFour = () => {
  return (
    <div className={classes.container}>
      <div className={classes.contents}>
        <div className={classes.row_one}>
          <div className={classes.content}>
            <div className={classes.image}>
              <img src={memberShipIcon} alt="" />
            </div>
            <div className={classes.texts}>
              <h1>Memberships Management</h1>
              <p>
                Collect user information and manage their subscriptions
                automatically. Send notifications or issue offers with ease.
              </p>
            </div>
          </div>
          <div className={classes.content}>
            <div className={classes.image}>
              <img src={policyIcon} alt="" />
            </div>
            <div className={classes.texts}>
              <h1>Rules & Policy Management</h1>
              <p>
                Define your business rules & policies to protect your business
                from getting into risks and user disappointments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionFour
