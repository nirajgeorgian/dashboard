import React from 'react'

import { Message } from 'semantic-ui-react'

const Notification = ({ handleDismiss, username, handleClick }) => {
    return (
        <Message 
            style={{ zIndex: '10', cursor: 'pointer'}}
            positive
            size='small'
            onClick={handleClick}
            onDismiss={handleDismiss}
            header={`New message from ${username}`}
            content={`Click to view the messages from ${username}`}
        />    
    )
}

export default Notification;