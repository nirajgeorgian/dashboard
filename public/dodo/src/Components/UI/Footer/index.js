import React, { Component } from 'react'
import classes from './footer.local.scss'
import spiezlogoletter from '../../../assests/img/spiezlogoletter.png'

class Footer extends Component {
  render() {
    return (
      <div className={classes.footer}>
        {/* <span className={classes.landfooterdivider} /> */}
        <div className={classes.content}>
          <div className={classes.landcompanydiv}>
            <img src={spiezlogoletter} className={classes.landcompanylogo} />
          </div>
          <div className={classes.landprivacy}>
            <a href="privacy">Privacy Policy</a>
            <a href="terms">Terms of use</a>
            <a className={classes.legal_text}>Copyright © 2018</a>
          </div>
          <div className={classes.landsocialmedia}>
            <span>Connect with sagepass: </span>
            <div className={classes.icons}>
              <a
                target="_blank"
                href="https://www.facebook.com/thesagepass/"
                className="ui circular facebook icon button"
              >
                <i className="facebook icon" />
              </a>
              <a
                target="_blank"
                href="https://www.instagram.com/thesagepass/"
                className="ui circular instagram icon button"
              >
                <i className="instagram icon" />
              </a>
              <a
                target="_blank"
                href="https://twitter.com/sagepass"
                className="ui circular twitter icon button"
              >
                <i className="twitter icon" />
              </a>
              <a
                target="_blank"
                href="https://plus.google.com/105246061977425569709"
                className="ui circular google plus icon button"
              >
                <i className="google plus icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Footer
