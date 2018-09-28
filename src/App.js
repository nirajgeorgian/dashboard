import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { userAuthStartAction } from './actionCreator/user.action.creator'
import NavbarComponent from './components/navbar/navbar.component'

class App extends Component {
  state = {
    username: '',
    password: ''
  }

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  onFormSubmit = async event => {
    event.preventDefault()
    const dodo = await this.props.userAuthStartAction(this.state)
  }

  render() {
    return (
      <React.Fragment>
        <NavbarComponent />
        <main>
          <aside>

          </aside>
          <section>
            <div className="row">
              <form onSubmit={this.onFormSubmit}>
                <input type="text" id="username" onChange={this.onInputChange}/>
                <input type="password" id="password" onChange={this.onInputChange}/>
                <input type="submit" value="Submit"/>
                <Link to="/account">accounts</Link>
              </form>
            </div>
          </section>
        </main>
        <footer>

        </footer>
    </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    ...state
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({userAuthStartAction}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
