import React, { Component } from 'react'
import { Container, Header, Menu, Input, Select, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter, Link } from 'react-router-dom'
import { Hof } from '../../Components'
import { RouteNavItem } from '../../Routes'
import classes from './Navbar.local.scss'
import './Navbar.scss'
import logo from '../../assests/img/sp_logo.png'
import spiex_logo from '../../assests/img/spiez_logo.png'

import Payment from '../Payment/index'

// import actions
import { userLogout } from '../../Actions'

const options = []

class Navbar extends Component {

  state = {
    showPayment: false
  }

  componentWillMount() {
    (this.props.getBusinessesList).forEach((x, i) => {
      let y = {
  		key: i,
  		value: x.bizname,
  		text: x.bizname
      }
    options.push(y)
  })
  }

  handleLogout = event => {
    event.preventDefault()
    localStorage.removeItem("id_token")
    this.props.userLogout()
    this.props.history.push('/')
  }

  handlePayment = event => {
    this.setState({showPayment: true})
  }
  // handleSideNav = event => {
  //   this.slideDiv.style.width = "0px"
  // }
  render() {
    let asideClasses
    if(this.state.slide === 'open') {
      asideClasses = classes.Open
    }
    if(this.state.slide === 'close') {
      asideClasses = classes.Close
    }
    // let list
    // if(!this.props.isAutenticated) {
    //   return (
    //     <Hof>
    //       <li><a href="#">Login</a></li>
    //       <li><a href="#">Signup</a></li>
    //     </Hof>
    //   )
    // } else {
    //   return (
    //     <Hof>
    //       <li><a onClick={this.handleLogout} href="#">Signout</a></li>
    //       <li><a href="#">Business</a></li>
    //     </Hof>
    //   )
    // }
    return (
      <div>
      <header>
        <div className={classes.logobox}>
          <img src={logo} className={classes.logoimg}/>
          <Link to="/" className={classes.logoletter}>
          </Link>
        </div>
        <Select options={options} className={classes.choosebranch} />
        <div className={classes.userbox}>
          <img src={spiex_logo} className={classes.logoimg + " " + classes.userlogo} />
          <div className={classes.userdivide}></div>
          <i className={classes.useralarm + " " + "alarm outline icon"}></i>
          <div className={classes.userdivide}></div>
          <a className={classes.username}>Spiez Web Services</a>
        </div>
      </header>
        <aside>
          {
            this.state.slide === 'close'
            ? <div className={classes.iconSlide + " "}>
                <Icon name="angle right" size="big" onClick={() => this.setState({ slide: "open" })}/>
              </div>
            : <div className={classes.sidebar + " " + asideClasses}>
                <div className={classes.sidebarpin}>
                  <Icon name="angle left" size="big" onClick={() => this.setState({ slide: "close" })}/>
                </div>
                <div className={"item " + classes.sidebaritem + " active"}>
                  <i className="tv icon"></i>
                  <a>HOME</a>
                </div>
                <div className={"item " + classes.sidebaritem}>
                  <i className="table icon"></i>
                  <a>ACCOUNTS</a>
                </div>
                <div className={"item " + classes.sidebaritem}>
                  <i className="rupee icon"></i>
                  <a>PAYMENTS</a>
                </div>
                <div className={"item " + classes.sidebaritem}>
                  <i className="users icon"></i>
                  <a>MEMBERSHIPS</a>
                </div>
                <div className={"item " + classes.sidebaritem}>
                  <i className="building icon"></i>
                  <a>FACILITIES</a>
                </div>
                <div className={"item " + classes.sidebaritem}>
                  <i className="users icon"></i>
                  <a>STAFFS</a>
                </div>
                <div className={"item " + classes.sidebaritem}>
                  <i className="settings icon"></i>
                  <a>SETTINGS</a>
                </div>
              </div>
          }
        </aside>
        <div className={classes.sidebar} >
          <div className={classes.sidebar} >
            <div className={classes.sidebarpin}>
              <i className="angle left icon"></i>
            </div>
            <div className={"item " + classes.sidebaritem + " active"}>
              <i className="tv icon"></i>
              <a>HOME</a>
            </div>
            <div className={"item " + classes.sidebaritem}>
              <i className="table icon"></i>
              <a>ACCOUNTS</a>
            </div>
            <div className={"item " + classes.sidebaritem} onClick={this.handlePayment}>
              <i className="rupee icon" ></i>
              <a>PAYMENTS</a>
            </div>
            <div className={"item " + classes.sidebaritem}>
              <i className="users icon"></i>
              <a>MEMBERSHIPS</a>
            </div>
            <div className={"item " + classes.sidebaritem}>
              <i className="building icon"></i>
              <a>FACILITIES</a>
            </div>
            <div className={"item " + classes.sidebaritem}>
              <i className="line chart icon"></i>
              <a>ANALYTICS</a>
            </div>
            <div className={"item " + classes.sidebaritem}>
              <i className="users icon"></i>
              <a>STAFFS</a>
            </div>
            <div className={"item " + classes.sidebaritem}>
              <i className="settings icon"></i>
              <a>SETTINGS</a>
            </div>
          </div>
        </div>
        <div className={classes.componentContainer}>
          {
            this.state.showPayment ? <Payment /> : null
          }
        </div>
    </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isAutenticated: state.isAutenticated,
    cognitoUser: state.cognitoUser,
    getBusinessesList: this.state.businessesList
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ userLogout }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar))
