import React, { Component } from 'react';
import crypto from 'crypto'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { Form, Button, Header, Container, Input, Select, TextArea } from 'semantic-ui-react'
import Dropzone from 'react-dropzone'
import config from '../../../../Config/AwsConfig'
import classes from './Step1.local.scss'
import './Step1.css'
import { s3Upload } from '../../../../Config/awsLib'

// testing
import { invokeApig } from '../../../../Config/awsLib'

// import actions
import { clearMessage, errorMessage } from '../../../../Actions'

const businessType = [
  { key: 'Sports Centre | Gym | Business', value: "Sports Centre | Gym | Business", text: "Sports Centre/Gym/Business"},
  // { key: "Club", value: "Club", text: "Club"},
  // { key: "Coaches", value: "Coaches", text: "Coaches"},
  // { key: "Meetup Group", value: "Meetup Group", text: "Meetup Group"}
]

const businessState = [
  { key: "enabled", value: 0, text: "enabled"},
  { key: "disbled", value: 1, text: "disabled"},
  { key: "admin disabled", value: 2, text: "Admin Disabled"}
]

class Step1 extends Component {
  state = {
    "business_name": "",
    "business_page" : "",
    info_name: "",
    info_contact: "",
    info_email: "",
    info_description: "",
    logo_file : "",
    logo_dir : "",
    attachment: ""
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


  file = null;

  handleFileChange = event => {
    event.preventDefault()

  }

  validateForm = () => {
    const validate = this.state.business_name.length &&
           this.state.business_page.length &&
           this.state.info_name.length &&
           this.state.info_contact.length &&
           this.state.info_email.length &&
           this.state.info_description.length
           // this.state.logo_file.length &&
           // this.state.logo_dir.length
    return Boolean(validate)
  }

  onDrop = files => {
    let fileSize = files[0].size
    if(files && files[0].size > config.MAX_ATTACHMENT_LOGO_FILE) {
      return this.props.errorMessage("File size must not be greater than 1MB.")
    }
    crypto.randomBytes(4,async (err, buf) => {
      if (err) throw err
      this.state.logo_file = files[0]
      this.state.logo_dir = buf.toString('hex')
      console.log(this.state.logo_file);
      try {
        const uploadedFilename = this.state.logo_file.name
        ? (await s3Upload(this.state.logo_file)).Location
        : null
        this.setState({
          attachment: uploadedFilename
        })
      } catch (e) {
        console.log(e.message)
      }
    })
  }
  // onFileChange = async event => {
  //   console.log(event.target.files);
  //   this.file = event.target.files[0]
  //   crypto.randomBytes(4,async (err, buf) => {
  //     if (err) throw err
  //     this.state.logo_file = this.file
  //     this.state.logo_dir = buf.toString('hex')
  //     // console.log(this.logo);
  //     // if(this.props.errorMessage !== "") {
  //     //   this.props.errorMessage("")
  //     // }
  //     console.log(this.state.logo_file);
  //     try {
  //       const uploadedFilename = this.state.logo_file.name
  //       ? (await s3Upload(this.state.logo_file)).Location
  //       : null
  //       this.setState({
  //         attachment: uploadedFilename
  //       })
  //     } catch (e) {
  //       console.log(e)
  //     }
  //   })
  // }

  handleInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSelectChange = event => {
    if(event.target.lastChild) {
      this.setState({
        [event.target.parentElement.parentElement.getAttribute("id")]: event.target.lastChild.innerHTML
      })
    }
  }

  // createBusiness(business) {
  //   return invokeApig({
  //     path: '/create',
  //     method: "POST",
  //     body: business
  //   })
  // }

  handleClick = async event => {
    event.preventDefault()

    // this.props.stateOfMainFormByOne(this.state)
    // console.log(this.state)
    // let dodo = await this.createBusiness(this.state)
    // let dodo = await invokeApig({
    //   path:this.setState({ arr[i]: JSON.parse(localStorage.getItem(arr[i]))})this.setState({ arr[i]: JSON.parse(localStorage.getItem(arr[i]))}) '/list',
    //   method: 'get'
    // })
    // console.log(dodo);
    const arr = Object.keys(this.state)
    for(var i=0, len = arr.length;i < len;i++){
      localStorage.setItem(arr[i],JSON.stringify(this.state[arr[i]]))
    }
    this.props.nextStep(this.state)
  }

  render() {
    return (
      <Container>
        <Form>
          <div id="myProgress1">
            <div id="myBar1"></div>
          </div>
          <Header size="huge">Business Info</Header>
          <Form.Field>
            <label>Business Logo</label>
            <Dropzone multiple={false} onDrop={this.onDrop} className={classes.formInput}>
              <p>Please choose or drag your logo here to upload</p>
            </Dropzone><br />
            {/* <input name="myFile" type="file" onChange={this.onFileChange} /> */}
            {/* <small>{this.state.logo_file}</small> */}
          </Form.Field>
          <Form.Field>
            <label htmlFor="business_name">Buisness Name</label>
            <Input
              autoFocus
              type="text"
              placeholder="enter your business name"
              id="business_name"
              value={this.state.business_name}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label htmlFor="business_page">Business Page</label>
            <Input
              type="text"
              placeholder="enter your business page address"
              id="business_page"
              value={this.state.business_page}
            // defaultValue={this.state.business_info.contact}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label htmlFor="business_type">Business Type</label>
            <Select
              placeholder="enter your business type"
              id="business_type"
              options={businessType}
              // value={this.state.business_type}
            // defaultValue={this.state.business_info.email}
              onChange={this.handleSelectChange}
            />
          </Form.Field>
          {/* <Form.Field>
            <label htmlFor="business_state">Business State</label>
            <Select
              placeholder="enter your business state"
              id="business_state"
              options={businessState}
            // defaultValue={this.state.business_info.description}
              onChange={this.handleSelectChage}
            />
          </Form.Field> */}
          <Form.Field>
            <label htmlFor="info_description">Business Page Description</label>
            <TextArea
              type="text"
              placeholder="enter your business page description"
              id="info_description"
              value={this.state.info_description}
            // defaultValue={this.state.business_info.contact}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label htmlFor="info_name">Contact Name</label>
            <Input
              type="text"
              placeholder="enter your business page provider name"
              id="info_name"
              value={this.state.info_name}
            // defaultValue={this.state.business_info.contact}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label htmlFor="info_contact">Contact Number</label>
            <Input
              type="number"
              placeholder="enter your business page provider contact number"
              id="info_contact"
              value={this.state.info_contact}
            // defaultValue={this.state.business_info.contact}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label htmlFor="info_email">Contact Email</label>
            <Input
              type="text"
              placeholder="enter your business page provider email"
              id="info_email"
            // defaultValue={this.state.business_info.contact}
              value={this.state.info_email}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          {/* <Form.Field>
            <label>Address</label>
            <input
              type="text"
              placeholder="Address goes here"
              id="temp_business_location"
            // defaultValue={this.state.temp_business_location}
            // onChange={this.handleInputChange}
            />
          </Form.Field> */}

          <Button type="button" onClick={this.handleClick} disabled={!this.validateForm()}>Save and Continue</Button>
          {/* <Button type="button" onClick={this.handleClick} disabled={!this.validateForm()} >Save and Continue</Button> */}
        </Form>
      </Container>
    );
  }
}

function mapStateToProps(state,ownProps) {
  return {
    isLoading: state.isLoading,
    isAutenticated: state.isAutenticated,
    errorMessage: state.errorMessage
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ errorMessage, clearMessage }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Step1))
