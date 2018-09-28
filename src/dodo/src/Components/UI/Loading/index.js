import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'
import classes from './Loading.local.scss'

const Loading = props => (
    <div className={classes.loadingBox}>
      <Loader active>{props.children}</Loader>
    </div>
)

export default Loading;
