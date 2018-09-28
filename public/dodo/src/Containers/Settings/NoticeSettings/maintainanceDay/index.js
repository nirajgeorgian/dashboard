import React, { Component } from 'react'
import { Form, Input } from 'semantic-ui-react'
import Datetime from 'react-datetime'
import TimePicker from '../../../../Components/UI/TimePicker'

export default class Maintenance extends Component {
  render() {
    return (
      <Form.Group widths={3}>
        <Form.Field>
          <Datetime
            disabled = {true}
            id = "m_date"
            defaultValue = {this.props.m_date}
            dateFormat="MMM Do YYYY"
            timeFormat={false}
          />
        </Form.Field>
        <Form.Field>
          <Input
						icon="clock"
						iconPosition="left"
            id = "m_opening_time"
						value = { this.props.m_opening_time }
					/>
        </Form.Field>
        <Form.Field>
          <Input
						icon="clock"
						iconPosition="left"
            id = "m_closing_time"
						value = { this.props.m_closing_time }
					/>
        </Form.Field>
      </Form.Group>
    )
  }
}
