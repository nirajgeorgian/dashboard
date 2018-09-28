<Menu.Menu position="right" className={classes.navright}>
  {this.props.isAutenticated ?
        <Menu.Item>
              <RouteNavItem href="/business">Business</RouteNavItem>
        </Menu.Item>:
        <Menu.Item>
              <RouteNavItem href="/">Business</RouteNavItem>
        </Menu.Item>

  }

  { this.props.isAutenticated
    ? <Menu.Item onClick={this.handleLogout} name="Logout" />
    // : [
    //   <Hof key={1}>
    //     <RouteNavItem href="/login">Login</RouteNavItem>
    //     <RouteNavItem href="/signup">Signup</RouteNavItem>
    //   </Hof>
    //   ]
    : null
    }
</Menu.Menu>
