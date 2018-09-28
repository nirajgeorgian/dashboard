import React, { Component } from 'react'
import { Container, Header, Form, Input, Select } from 'semantic-ui-react'

const gender = [
  { key: 'male', value: "Male", text: "Male"},
  { key: 'female', value: "Female", text: "Female"},
  { key: 'Other', value: "Other", text: "Other"},
]

class ProfileView extends Component {
  state = {

  }

  componentDidMount() {
    // before rendering set the value
    this.props.currentUser.map((user) => {
      this.setState({
        [user.Name]: user.Value
      })
    })
  }
  handleSelectChage = event => {
    if(event.target.lastChild) {
      this.setState({
        [event.target.parentElement.parentElement.getAttribute("id")]: event.target.lastChild.innerHTML
      })
    }
  }

  handleInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }
  render() {
    const { currentUser, profileType } = this.props
    // it it's view profile view list item
    if(profileType === 'view') {
      const dodo = currentUser.map((user, i) => {
        return <li key={i}>
          {user.Name} - {user.Value}
        </li>
      }, 0)
      return (
        <Container>
          <Header as='h2'>Your Profile details</Header>
          <ul>
            { dodo }
          </ul>
        </Container>
      )
    }
    if(profileType === 'edit') {
      // if it's edit profile view edit form
      return (
        <Container>
          <Header as='h2'>Edit your profile below</Header>
          <Form>
            {
              currentUser.map((user, i) => {
                if(user.Name !== 'gender') {
                  return (
                    <Form.Field key={user.Name + i}>
                      <label>{ user.Name }</label>
                      <Input
                        type="text"
                        value={this.state[user.Name]}
                        id={user.Name}
                        onChange={this.handleInputChange}
                      />
                    </Form.Field>
                  )
                }
              })
            }
            {
              currentUser.map((user, i) => {
                if(user.Name === 'gender') {
                  return (
                    <Form.Field key={user.Name + i}>
                      <Select
                        placeholder="Choose Your Gender"
                        options={gender} id="gender"
                        onChange={this.handleSelectChage}
                      />
                    </Form.Field>
                  )
                }
              })
            }
          </Form>
        </Container>
      )
    }
  }
}

export default ProfileView
