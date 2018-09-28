import React, { Component } from 'react'
import { Navbar, Button, InputGroup, Alignment } from '@blueprintjs/core'
import './navbar.style.css'

class NavbarComponent extends Component {
  render() {
    return (
      <header className="container">
        <nav className="bp3-navbar bp3-dark">
          <Navbar fixedToTop={true}>
            <div className="nav-navbar">
              <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Heading>Dashboard</Navbar.Heading>
                <Navbar.Divider />
                <InputGroup leftIcon="search" type="text" placeholder="Search ..." rightElement={<Button icon="arrow-right" minimal={true} />}>
                </InputGroup>
              </Navbar.Group>
              <Navbar.Group align={Alignment.RIGHT}>
                <Button icon="home" text="home" minimal={true}/>
                <Button icon="document" text="reports" minimal={true}/>
                <Navbar.Divider />
                <Button icon="user" minimal={true}/>
                <Button icon="notifications" minimal={true}/>
                <Button icon="cog" minimal={true}/>
              </Navbar.Group>
            </div>
          </Navbar>
        </nav>
      </header>
    )
  }
}

export default NavbarComponent
