import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Step1 from './Steps/Step1/Step1';
import Step2 from './Steps/Step2/Step2';
import Step3 from './Steps/Step3/Step3';
import { bindActionCreators } from 'redux'
import { OneTemp } from '../../Actions/ActionsCreator/FormAction/FormAction'
import FormReducer from '../../Reducers/FormReducer/FormReducer';

class Business extends Component {
  state = {
    state1: {

    },
    step: 1,
  	// "business_name": "",
  	// "business_page" : "",
  	// "business_type" : "",
  	// "business_state" : "",
    //   "business_admin": "",
    //   // "business_promote" : "",
    //   "info_name" : "",
    //   "info_contact":"",
    //   "info_email": "",
    //   "info_description" : "",
    //   "logo_dir" : "",
    //   "logo_file" : "",
    //   "location_address1" : "",
    //   "location_address2" : "",
    //   "location_address3" : "",
    //   "location_code" : "",
    //   "location_lat" :"",
    //   "location_lng" : "",
    //   "urls_facebook": "",
    //   "urls_business" : " ",
    //   "urls_instagram" : "",
    //   "day_start" : "",
    //   "day_end" : "",
    //   "shutday_date": "",
    //   "shutday_month": "",
    //   "shutday_year" : "",
    //   "shutday": "",
  	// "reviews_star": "",
  	// "reviews_author_name" : "",
  	// "reviews_rating" :"",
  	// "reviews_comments": "",
  	// "reviews_time":"",
  	// "photos_dir":"",
  	// "photos_file":"",
  	// "awards_name" : "",
  	// "awards_year" : "",
  	// "accessibility" : "" ,
  	// "facility" : "" ,
  	// "announcements_post" : "",
  	// "announcements_time" : "",
  	// "announcements_expiry" : "",
  	// "rules_text" : "",
  	// "faq_q" : "",
  	// "faq_a": "",
  	// "terms": "",
  	// "club_name": "",
  	// "coach_name": "",
  	// "coach_field": "",
  	// "meetup_date": "",
  	// "meetup_details": "",
  	// "reviews_dir": "",
  	// "reviews_file": ""
  }

  nextStep = (state) => {
    this.setState({
      step: this.state.step + 1,
      state1: { ...this.state.state1, ...state}
    });
  }

  prevStep = () => {
    this.setState({
      step: this.state.step - 1
    });
  }

  getFinalState = () => {
    return this.state.state1
  }

  render(){
    if(this.state.step === 1) {
      return <Step1
      nextStep={this.nextStep}
      step={this.state.step} />

    }

    if(this.state.step === 2) {
      return <Step2
      nextStep={this.nextStep}
      step={this.state.step}
      prevStep={this.prevStep}
      />
    }
    if(this.state.step === 3) {
      return <Step3
      step={this.state.step}
      prevStep={this.prevStep}
      getFinalState={this.getFinalState}
      />
    }
  }
}

function mapStateToProps(state) {
 return state;
}

function mapDispatchToProps(dispatch) {
  // return none
  // return bindActionCreators({ OneTemp }, dispatch)
  return {};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Business))
// export default connect(mapStateToProps, mapDispatchToProps)(Business)
