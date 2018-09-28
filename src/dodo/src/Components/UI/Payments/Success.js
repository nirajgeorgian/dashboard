import React from 'react'
import { Image, Icon } from 'semantic-ui-react'
import payment_success from '../../../assests/img/payment_success.png'
import logoImg from '../../../assests/img/sp_logo.png'
import classes from './Payments.local.scss'
import spiez_logo from '../../../assests/img/spiezlogoletter.png'
import Footer from '../Footer'
import Navbar from '../NavBar'
import { Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { compose, bindActionCreators } from 'redux'
import { userLogout } from '../../../Actions'

class PaymentSuccess extends React.Component {
  state = {
    showDropDown: false
  }

  handleLogOut = (event, data) => {
    this.props.userLogout().then(() => {
      this.props.history.push('/')
    })
  }

  handleDropDown = event => {
    this.setState({ showDropDown: true })
  }
  hideDropDown = event => {
    this.setState({ showDropDown: false })
  }

  render() {
    return (
      <div className={classes.container}>
        <div className={classes.header}>
          <div className={classes.logo}>
            <Link to="/">
              <img src={logoImg} />
              <p className={classes.sagepass}>sagepass</p>
            </Link>
          </div>
          <div className="userbox">
            <div id="userlogo" className="ui pointing dropdown userlogo">
              <a href="profile" />
              <img
                src={spiez_logo}
                className="logoimg userlogo"
                onClick={this.handleDropDown}
              />
              <div className="userdivide" />
              <a className={classes.username} onClick={this.handleDropDown}>
                Spiez Web Services
                {/* {this.props.user[4].Value} */}
              </a>
              <Dropdown
                open={this.state.showDropDown}
                onClose={this.hideDropDown}
                pointing
                icon={null}
                className={classes.username}
              >
                <Dropdown.Menu>
                  <Dropdown.Item onClick={this.handleEditProfile}>
                    <a className={'item ' + classes.changeColor}>
                      <Icon className="edit" />Edit Profile
                    </a>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={this.handleAccountSettings}>
                    <a className={'item ' + classes.changeColor}>
                      <Icon className="settings" />Account Settings
                    </a>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={this.support}>
                    <a className={'item ' + classes.changeColor}>
                      <Icon className="life ring" />Support
                    </a>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={this.termsAndConditions}>
                    <a className={'item ' + classes.changeColor}>
                      <Icon className="legal" />Terms & Conditions
                    </a>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={this.handleLogOut}>
                    <a className={'item ' + classes.changeColor}>
                      <Icon className="sign out" />Logout
                    </a>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        {/* <Image alt="Page Not Found" src={notfound_logo} /> */}
        <div className={classes.body}>
          <img src={payment_success} />
        </div>
        <Footer />
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ userLogout }, dispatch)
}

export default compose(withRouter, connect(null, mapDispatchToProps))(
  PaymentSuccess
)
