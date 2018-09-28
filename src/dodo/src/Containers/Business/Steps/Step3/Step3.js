import React, { Component } from 'react';
import { Form, Button, Header } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Datetime from 'react-datetime'
import moment from 'moment'
import "react-datetime/css/react-datetime.css"
import './Step3.css';
import Container from 'semantic-ui-react/dist/commonjs/elements/Container/Container';


// testing
import { invokeApig } from '../../../../Config/awsLib'

// import actions
import { clearMessage, errorMessage, isLoading } from '../../../../Actions'

class Step3 extends Component {
  state = {
    club_name: 'gym freaks',
    coach_name: 'sachin',
    coach_field: 'strength trainer',
    meetup_date: moment(),
    meetup_details: ''
    // date: moment()
}
constructor(){
    super();
    this.handleClickPrev= this.handleClickPrev.bind(this);
    this.handleSubmit= this.handleSubmit.bind(this);
    this.handleDateChange= this.handleDateChange.bind(this);
    this.handleInputChange= this.handleInputChange.bind(this);

}

componentDidMount(){
  const arr = Object.keys(this.state)
  var data = {}
  for(var i=0, len = arr.length;i < len;i++){
    if(localStorage.getItem(arr[i]) !== null){
      data[arr[i]] = JSON.parse(localStorage.getItem(arr[i]))
    }
  }
  this.setState({ ...data })
}

handleDateChange = (date) => {
  this.setState({
    meetup_date: date.format("MM,DD,YYYY")
  })
}

handleClickPrev(){
  const arr = Object.keys(this.state)
  for(var i=0, len = arr.length;i < len;i++){
    localStorage.setItem(arr[i],JSON.stringify(this.state[arr[i]]))
  }
  this.props.prevStep();
}

createBusiness(business) {
  return invokeApig({
    path: '/create',
    method: "POST",
    body: business
  })
}

handleSubmit = async e =>{
    e.preventDefault();
    this.props.isLoading()
    const prev_state = this.props.getFinalState()
    this.setState({
      club_name: this.state.club_name,
      coach_name: this.state.coach_name,
      coach_field: this.state.coach_field,
      meetup_date: this.state.meetup_date,
      meetup_details: this.state.meetup_details,
    })

    const arr = Object.keys(this.state)
    for(var i=0, len = arr.length;i < len;i++){
      localStorage.setItem(arr[i],JSON.stringify(this.state[arr[i]]))
    }

    const final_state = Object.assign({},this.state,prev_state);
    try {
      let dodo = await this.createBusiness(final_state)
      console.log(dodo)
      if(dodo){
        let final = Object.keys(final_state)
        for(var i=0, len = final.length;i < len;++i){
          localStorage.removeItem(final[i])
        }
      }


    } catch(e) {
      console.log(e.message)
    }
    // console.log(this.state.meetup_details.coach_name);
    // this.props.stateOfMainFormByThree(this.state);

}

// handleDateChange = (date) => {
//     this.setState({
//       ...this.state,
//       date: date.format("MM,DD,YYYY")
//     })
//   }

  handleInputChange(event){
    var target = event.target;
    var value = event.target.value;
    var id = target.id;
    this.setState({
      [id]: value
    })
    }

render() {
    return (
      <Container>
      <Form>
        <div id="myProgress3">
          <div id="myBar3"></div>
        </div>
        <Header size="huge">Club and Meetup Details</Header>
        <Form.Field>
          <label>Club Name</label>
          <input
            autoFocus
            type="text"
            placeholder="Club Name"
            id="club_name"
            // defaultValue={this.state.club_name}
            value={this.state.club_name}
            onChange={this.handleInputChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Coach Name</label>
          <input
            type="text"
            placeholder="coach name"
            id="coach_name"
            value={this.state.coach_name}
            // defaultValue={this.state.coach_name}
            onChange={this.handleInputChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Coach Field</label>
          <input
            type="text"
            placeholder="coach field"
            id="coach_field"
            // defaultValue={this.state.coach_field}
            value={this.state.coach_field}
            onChange={this.handleInputChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Meetup Date</label>
          <Datetime
            inputProps={{ placeholder: 'Choose date for meetup'}}
            onChange={this.handleDateChange}
            dateFormat="MMM Do YYYY"
            id="meetup_date"
            timeFormat={false}
          />
        </Form.Field>
        <Form.Field>
          <label>Meetup Details</label>
          <input
            type="text"
            placeholder="meetup details here"
            id="meetup_details"
            value={this.state.meetup_details}
            // defaultValue={this.state.meetup_details}
            onChange={this.handleInputChange}
          />
        </Form.Field>
        <Button type="submit" onClick={this.handleSubmit} >Submit</Button>
        <Button type="button" onClick={this.handleClickPrev}>Previous</Button>
    </Form>
    </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    state
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ isLoading }, dispatch)
}

export default connect(null, null)(Step3)
