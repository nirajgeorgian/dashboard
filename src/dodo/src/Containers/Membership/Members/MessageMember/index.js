import React from 'react'
import ReactDOM from 'react-dom'
import {
	Modal,
	Form,
	TextArea,
	Checkbox,
	Button,
	Icon
} from 'semantic-ui-react'

class MessageMember extends React.Component {
	handleRef = c => {
		if (c) {
			c.focus()
		}
	}

	render() {
		return (
			<Modal
				dimmer={'inverted'}
				size="tiny"
				open={this.props.open}
				onOpen={this.handleOpen}
				onClose={this.props.handleClose}
			>
				<Modal.Header>
					<center>Send Message & Notification</center>
				</Modal.Header>
				<Modal.Content>
					<Modal.Description>
						<center>
							<div className="ui red text">
								This message will be pushed to the members on their mobile apps
								& emails if subscribed.
							</div>
						</center>
					</Modal.Description>
					<br />
					<Form>
						<Form.Field>
							<TextArea
								ref={this.handleRef}
								rows={4}
								placeholder="e.g. Dear User, We would like to discuss with you about our new offers."
							/>
						</Form.Field>
						<Form.Field>
							<center>
								<Checkbox
									checked
									label="It's okay for the users to contact me."
								/>
							</center>
						</Form.Field>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<center>
						<Button color="red" className="deny" content="Cancel" />
						<Button positive icon labelPosition="right">
							<Icon name="bell outline" />Send
						</Button>
					</center>
				</Modal.Actions>
			</Modal>
		)
	}
}

export default MessageMember
