import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Form, Button, Header, Container } from 'semantic-ui-react'
import Datetime from 'react-datetime'
import moment from 'moment'
import "react-datetime/css/react-datetime.css"
import './Step2.css';

class Step2 extends Component {
  constructor(){
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handleClickPrev = this.handleClickPrev.bind(this);
  }
  state = {
    urls_facebook: 'https://www.facebook.com/login/',
    urls_business: 'test.sagepass.com',
    urls_instagram: 'https://www.instagram.com/joelthorpe/?hl=en',
    day_start: '', //8 AM
    day_end: '',   //6 PM,
    shutday_date: 12,    //12 Jan 2018 is off day
    shutday_month: 1,
    shutday_year: 2018,
    shutday: moment(),
    address_1: "",
    address_2: "",
    address_3: "",
    location_code: '',
    location_lat: '',
    location_lng: '',
  }

  componentDidMount(){
    const arr = Object.keys(this.state)
    var data = {}
    for(var i=0, len = arr.length;i < len;i++){
      if(localStorage.getItem(arr[i]) !== null){
        data[arr[i]] = JSON.parse(localStorage.getItem(arr[i]))
        // console.log(arr[i])
      }
    }
    this.setState({ ...data })
  }


validateForm = () => {
  const validate =
         this.state.urls_facebook.length &&
         this.state.urls_business.length &&
         this.state.urls_instagram.length
  return validate
}

handleDateChange = (date) => {
  this.setState({
    shutday: date.format("MM,DD,YYYY")
  })
}

handleInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

handleClick(event){
    event.preventDefault()
    const splitDate = Array.from(this.state.shutday)
    this.setState({
      ...this.state,
      shutday_date: splitDate[0],
      shutday_month:splitDate[1],
      shutday_year: splitDate[2],
    })

    const arr = Object.keys(this.state)
    for(var i=0, len = arr.length;i < len;i++){
      localStorage.setItem(arr[i],JSON.stringify(this.state[arr[i]]))
    }

    this.props.nextStep(this.state);

    // console.log(this.state);


    // this.props.stateOfMainFormByTwo({
    //     facebook: this.state.facebook,
    //     business: this.state.business,
    //     instagram: this.state.instagram
    // },
    // {
    //     business_day:[
    //         {
    //             start: this.state.start,
    //             end: this.state.end
    //         }
    //     ]

    // },
    // {
    //     business_shutday:[
    //         {
    //             date: this.state.date,
    //             month:this.state.month,
    //             year: this.state.year
    //         }
    //     ]
    // });

}

handleClickPrev(event){
    const arr = Object.keys(this.state)
    for(var i=0, len = arr.length;i < len;i++){
      localStorage.setItem(arr[i],JSON.stringify(this.state[arr[i]]))
    }
    this.props.prevStep();
}




render() {
    return (
      <Container>
        <Form>
           <div id="myProgress2">
              <div id="myBar2"></div>
           </div>
          <Header size="huge">Business Details</Header>
          <Form.Field>
            <label>Facebook Url</label>
            <input
              autoFocus
              type="text"
              placeholder="enter your facebook url"
              id="urls_facebook"
              value={this.state.urls_facebook}
              // defaultValue={this.state.urls_facebook}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Business Url</label>
            <input
              type="text"
              placeholder="enter your business url"
              id="urls_business"
              value={this.state.urls_business}
              // defaultValue={this.state.urls_business}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Instagram Url</label>
            <input
              type="email"
              placeholder="enter your instagram url"
              id="urls_instagram"
              value={this.state.urls_instagram}
              // defaultValue={this.state.urls_instagram}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Business Start Time</label>
            <input
              type="text"
              placeholder="business start time"
              id="day_start"
              value={this.state.day_start}
              // defaultValue={this.state.day_start}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Business End Time</label>
            <input
              type="text"
              placeholder="Address goes here"
              id="day_end"
              value={this.state.day_end}
              // defaultValue={this.state.day_end}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Business Shutday</label>
            <Datetime
              inputProps={{ placeholder: 'Choose Shutday for business'}}
              onChange={this.handleDateChange}
              dateFormat="MMM Do YYYY"
              timeFormat={false}
            />
          </Form.Field>
          <Form.Field>
            <label>Address 1</label>
            <input type="text"
                placeholder="Enter address 1"
                id="addr_1"
                value={this.state.address_1}
                // defaultValue={this.state.address_1}
                onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Address 2</label>
            <input type="text"
              placeholder="Enter address 2"
              id="addr_2"
              value={this.state.address_2}
              // defaultValue={this.state.address_2}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Address 3</label>
            <input type="text"
              placeholder="Enter address 3"
              id="addr_3"
              value={this.state.address_3}
              // defaultValue={this.state.address_3}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Postal Code</label>
            <input type="number"
              maxLength="7"
              placeholder="Enter postal code"
              id="postal_code"
              value={this.state.location_code}
              // defaultValue={this.state.location_code}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Latitude</label>
            <input type="text"
              placeholder="Enter latitude"
              id="loc_lat"
              value={this.state.location_lat}
              // defaultValue={this.state.location_lat}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Longitude</label>
            <input type="text"
              placeholder="Enter longitude"
              id="loc_long"
              value={this.state.location_lng}
              // defaultValue={this.state.location_lng}
              onChange={this.handleInputChange}
            />
          </Form.Field>


        <Button type="button" onClick={this.handleClick} disabled={!this.validateForm()} >Save and Continue</Button>
        <Button onClick={this.handleClickPrev} type="button">Previous</Button>
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
  return bindActionCreators({ })
}

export default connect(null, null)(Step2)
