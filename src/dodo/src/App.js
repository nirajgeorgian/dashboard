import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { BrowserRouter as Router, withRouter } from 'react-router-dom'
import { configureStore } from './Store'
import './App.scss'
import './default.scss'

// import PlacesAutoComplete, { geocodeByAddress, getLatLng }  from './Components/UI/AutoComplete/index'
import * as firebase from "firebase";
// Import components
import { Hof, Layout, GoogleTagManager } from './Components'
import { Navbar } from './Containers'
import { Routes } from './Routes'

var config = {
  apiKey: "AIzaSyCN6B8tY_fqgniepbfujSf0zdLx7HJEaTM",
  authDomain: "sagepass-test.firebaseapp.com",
  databaseURL: "https://sagepass-test.firebaseio.com/",
  projectId: "sagepass-test",
  storageBucket: "sagepass-test.appspot.com",
  messagingSenderId: "864308516869"
};

firebase.initializeApp(config)
class App extends Component {

  render() {

    // const messaging = firebase.messaging();
    // messaging.usePublicVapidKey("BDEXAwLiEpv-ofP0FuJDzapv21YUr1u5asyL-5vNbQC8UUUhqfX50g6X5R3mkpSTM0mTqwUruDIxz6Tl5XF-gWU");
		// messaging.requestPermission()
		// .then(function() {
		//   console.log('Have permission');
		//   return messaging.getToken()
		// })
		// .then(function(token) {
		//   console.log(token);
		// })
		// .catch(function() {
		//   console.log('Not granted');
		// })
		// messaging.onMessage(function(payload) {
		//   console.log('on Message: ', payload);
		// })
    return (
      <Hof>
        {/* <Layout className="navbar">
          <Navbar />
        </Layout> */}
        <Layout className="body">
          <GoogleTagManager gtmId='GTM-5FQPXZP' />
          <Routes childProps = { this.props.isAuthenticated } />
        </Layout>
      </Hof>
    )
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.isAuthenticated
  }
}

function mapDispatchToAction(dispatch) {
  return bindActionCreators({/* action goes here */}, dispatch)
}

export default withRouter(connect(mapStateToProps, null)(App))
