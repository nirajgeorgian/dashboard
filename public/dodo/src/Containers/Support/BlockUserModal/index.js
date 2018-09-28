import React from 'react'
import { Modal, Header, Button, Icon } from 'semantic-ui-react'

import classes from './BlockUserModal.local.scss'

export default ({ open, name, onClose, blockUser }) => {
	return (
		<Modal
			onClose={onClose}
			open={open}
			size="small"
			closeOnDimmerClick={false}
		>
			<Modal.Header>
				Block the user -<span className={classes.name}> {name}</span>
			</Modal.Header>
			<Modal.Content>
				<Header as="h3" color="red">
					You have intended to block
					{' ' + name}
				</Header>
				<p>Blocking the user will remove the conversation history.</p>
				<p>
					Blocked user won't be notified about this. Is it okay to block the
					user?
				</p>
			</Modal.Content>
			<Modal.Actions>
				<Button onClick={onClose} positive>
					Nope
				</Button>
				<Button onClick={blockUser} negative icon labelPosition="right">
					Yes, Please block
					<Icon name="ban" />
				</Button>
			</Modal.Actions>
		</Modal>
	)
}
