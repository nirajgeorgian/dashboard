import React from 'react'
import {
  Modal,
  Header,
  Button,
  Icon,
  Form,
  Input,
  Image,
  Segment,
  Dimmer
} from 'semantic-ui-react'

import classes from './NewNotification.local.scss'

const options = [
  { key: 'am', text: 'Active Members', value: 'Active Members' },
  {
    key: 'aem',
    text: 'Active & Expired Members',
    value: 'Active & Expired Members'
  },
  { key: 'em', text: 'Expired Members', value: 'Expired Members' },
  { key: 'esm', text: 'Expiring Soon Members', value: 'Expiring Soon Members' }
]

class NewNotificationModal extends React.Component {
  state = {
    userGroup: options[0].value,
    message: '',
    checked: false
  }

  sendPushNotification = () => {
    console.log('Sending notification', this.state)
  }

  handelUserGroupChange = (e, { value }) => this.setState({ userGroup: value })
  handelMessageChange = e => this.setState({ [e.target.id]: e.target.value })
  handelCheckbox = () => this.setState(state => ({ checked: !state.checked }))
  render() {
    const { open, toggleNewNotificationModal } = this.props
    {
      return (
        <Modal onClose={toggleNewNotificationModal} open={open} size="small">
          <Modal.Header>
            <div className={classes.header}>
              <div className={classes.header_label}>Notification to users:</div>
              <Form className={classes.form}>
                <Form.Field>
                  <Form.Select
                    onChange={this.handelUserGroupChange}
                    className={classes.form_select}
                    options={options}
                    value={this.state.userGroup}
                    id="userGroup"
                    placeholder="Gender"
                  />
                </Form.Field>
              </Form>
            </div>
          </Modal.Header>
          <Modal.Content>
            <div className={classes.text}>
              This notification will be pushed to the members on their mobile
              apps & emails if subscribed.
            </div>
            <Form>
              <Form.Field>
                <Form.TextArea
                  id="message"
                  className={classes.message}
                  onChange={this.handelMessageChange}
                  placeholder={
                    'e.g. Our Gym services are closed tonight for usage due to maintanance work.'
                  }
                />
              </Form.Field>
              <div className={classes.checkbox}>
                <Form.Field>
                  <Form.Checkbox
                    onClick={this.handelCheckbox}
                    checked={this.state.checked}
                    label={"It's okay for the users to contact me."}
                  />
                </Form.Field>
              </div>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <div className={classes.actions}>
              <Button onClick={toggleNewNotificationModal} negative>
                Cancel
              </Button>
              <Button
                onClick={this.sendPushNotification}
                positive
                icon
                labelPosition="right"
              >
                Push Notification
                <Icon name="bell" />
              </Button>
            </div>
          </Modal.Actions>
        </Modal>
      )
    }
  }
}

export default NewNotificationModal
