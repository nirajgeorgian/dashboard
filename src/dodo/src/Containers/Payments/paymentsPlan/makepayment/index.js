import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class MakePayment extends Component {
  formSubmit = event => {
    event.submit()
  }
  render() {
    let obj = this.props.location.data.message
    let obj1 = []
    for (let name in obj) {
      obj1.push({
        [name]: obj[name]
      })
    }
    // let obj1 = Object.entries(obj)
    let dodoDuck = obj1.map((x, i) => {
      for (let name in x) {
        return (
          <input
            key={name}
            type="hidden"
            name={name}
            defaultValue={x[name]}
          />
        )
      }
    })
    return (
      <form method="post" action="https://securegw-stage.paytm.in/theia/processTransaction" name="dodo" ref={this.formSubmit}>
        <h2>Please wait... while we are redirecting</h2>
        {dodoDuck}
      </form>
    )
  }
}

export default withRouter(MakePayment)
