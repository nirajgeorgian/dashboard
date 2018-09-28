import React from 'react'
import {
	Card,
	Image,
	Dimmer,
	Segment,
	Button,
	Icon,
	Modal,
	Header
} from 'semantic-ui-react'

import classes from './LogoCard.local.scss'

class LogoCard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			dimmer_active: false,
			active_modal: false,
			remove_modal: false
		}
	}

	handleActiveModal = () =>
		this.setState(state => ({ active_modal: !state.active_modal }))

	handleRemoveModal = () =>
		this.setState(state => ({ remove_modal: !state.remove_modal }))

	showActiveModal = () => (
		<Modal
			dimmer="inverted"
			onClose={this.handleActiveModal}
			size={'tiny'}
			open={this.state.active_modal}
		>
			<Modal.Header>Make the logo as Active Logo</Modal.Header>
			<Modal.Content>
				<p>
					Is it okay to make this logo as primary display logo for the business?
				</p>
			</Modal.Content>
			<Modal.Actions>
				<Button onClick={this.handleActiveModal} negative>
					Cancel
				</Button>
				<Button
					positive
					labelPosition="right"
					icon="checkmark"
					content="Proceed"
				/>
			</Modal.Actions>
		</Modal>
	)

	showRemoveModal = () => (
		<Modal
			dimmer="inverted"
			onClose={this.handleRemoveModal}
			size={'tiny'}
			open={this.state.remove_modal}
		>
			<Modal.Header>Remove the logo</Modal.Header>
			<Modal.Content>
				<Header color="red">You have intended to remove the logo.</Header>
				<p>Is it okay to delete the logo permanently from sagepass?</p>
			</Modal.Content>
			<Modal.Actions>
				<Button onClick={this.handleRemoveModal} positive>
					Nope
				</Button>
				<Button
					negative
					labelPosition="right"
					icon="close"
					content="Yep, Please remove"
				/>
			</Modal.Actions>
		</Modal>
	)

	handleHide = () => this.setState({ dimmer_active: false })
	handleShow = () => this.setState({ dimmer_active: true })
	render() {
		const { image, date, active } = this.props
		return (
			<Card id="logo_card">
				{this.state.active_modal && this.showActiveModal()}
				{this.state.remove_modal && this.showRemoveModal()}
				<Dimmer.Dimmable
					className={classes.dimmable}
					onMouseEnter={this.handleShow}
					onMouseLeave={this.handleHide}
					blurring
					as={Segment}
					dimmed={this.state.active}
				>
					<Image src={image} />
					<Dimmer inverted active={this.state.dimmer_active}>
						<div className={classes.image_actions}>
							{!active && (
								<Button
									className={classes.image_action}
									content="Make Active"
									positive
									onClick={this.handleActiveModal}
								/>
							)}
							<Button
								onClick={this.handleRemoveModal}
								className={classes.small_btn}
								content="Remove"
								negative
							/>
						</div>
					</Dimmer>
				</Dimmer.Dimmable>
				<Card.Content className={active ? classes.card_extra : ''} extra>
					<div className={classes.content}>
						<p className={classes.date}>{date}</p>
						{active && (
							<p className={classes.checkmark}>
								<Icon name="checkmark" />
							</p>
						)}
					</div>
				</Card.Content>
			</Card>
		)
	}
}

export default LogoCard
