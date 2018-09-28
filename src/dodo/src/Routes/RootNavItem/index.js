import React from 'react'
import { Route, Link } from 'react-router-dom'

export default props =>
  <Route
    path={props.href}
    exact
    children={({ match, history }) =>
      <Link
        to={props.href}
        className={match ? "active item": 'item'}
        {...props}
      >{props.children}</Link>
  }
  />
