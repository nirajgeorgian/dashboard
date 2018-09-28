import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react'

class RedirectPage extends Component {
  formSubmit = event => {
    event.submit()
  }
  render() {
    const { open, formData } = this.props
    return (
      <Modal open={open} dimmer={'inverted'}>
        <form method="post" action="https://pguat.paytm.com/oltp-web/processTransaction" name="dodo" ref={this.formSubmit}>
          {formData}
        </form>
      </Modal>
    )
  }
}

export default RedirectPage
