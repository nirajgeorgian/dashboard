import React from 'react'
import SocialLogin from 'react-social-login'
import { Button } from 'semantic-ui-react'

import classes from './SocialButton.local.scss'

const LoginButton = ({ children, triggerLogin, ...props }) => (
  <div className={classes.socialLoginBtn}>
    <Button onClick={triggerLogin} {...props}>
      {children}
    </Button>
  </div>
)

export default SocialLogin(LoginButton)
