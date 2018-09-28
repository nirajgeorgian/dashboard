import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

const LoadingComponent = props => (
  <div>
    <Dimmer active inverted>
      <Loader size='medium'>Loading...</Loader>
    </Dimmer>
  </div>
);

export default LoadingComponent
