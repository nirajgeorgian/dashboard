import React from 'react'
import {
	Form,
	Input,
	Button,
	Icon,
	Modal,
	TextArea,
	Rating
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import classes from './SectionFive.local.scss'

class SectionFive extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showFeedBackModal: false,
			feedbackMessage: '',
			rating: 10
		}
	}

	toggleFeedbackModal = () =>
		this.setState(state => ({ showFeedBackModal: !state.showFeedBackModal }))

	renderFeedBackModal = () => {
		return (
			<Modal
				onClose={this.toggleFeedbackModal}
				open={this.state.showFeedBackModal}
				size="tiny"
				dimmer="inverted"
			>
				<Modal.Header>
					<center>Feedback</center>
				</Modal.Header>
				<Modal.Content>
					<Form>
						<Form.Field>
							<p style={{ fontWeight: 'bold' }}>
								Hello, we'd love to hear your feedback about our website...
							</p>
						</Form.Field>
						<Form.Field>
							<p>
								How would you rate our site where 10 is excellent and 1 is very
								poor?
							</p>
							<center>
								<Rating
									icon="heart"
									maxRating={10}
									size="massive"
									onRate={(e, { rating, maxRating }) =>
										this.setState({ rating })
									}
									rating={this.state.rating}
								/>
							</center>
						</Form.Field>
						<Form.Field>
							<label>Please write your feedback/suggestion (optional)</label>
							<TextArea
								value={this.state.feedbackMessage}
								onChange={(_, data) =>
									this.setState({ feedbackMessage: data.value })
								}
								style={{ minHeight: 100 }}
							/>
						</Form.Field>
						<Form.Field>
							<p style={{ fontSize: '0.85rem' }}>
								Please note, any information provided is treated as feedback
								only. We may publish your feedback in our marketing material
								including social media.If you have an outstanding issue or wish
								to make a complaint, please contact us and we will follow up on
								it.
							</p>
						</Form.Field>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<center>
						<Button negative onClick={this.toggleFeedbackModal}>
							Cancel
						</Button>
						<Button positive icon labelPosition="left">
							Submit
							<Icon name="send" />
						</Button>
					</center>
				</Modal.Actions>
			</Modal>
		)
	}

	handelInputChange = e => this.setState({ [e.target.id]: e.target.value })

	render() {
		return (
			<div className={classes.container}>
				{this.state.showFeedBackModal && this.renderFeedBackModal()}
				<Link className={classes.contact} to="/contact">
					<p>CUSTOMER CARE</p>
					<Icon name="facebook messenger" />
				</Link>
				<div onClick={this.toggleFeedbackModal} className={classes.feedback}>
					<Icon name="thumbs up" />
					<p>FEEDBACK</p>
				</div>
			</div>
		)
	}
}

export default SectionFive
