import React from 'react'
import { Header, Form, Button, Icon, Modal, Table } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import LoadingComponent from '../Loading'
import classes from './BillingSettings.local.scss'
import { PlanDetails, paymentHistory } from './MockData'

class BillingSettings extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			cancel_modal: false,
			businessName: this.props.businessName
		}
	}
	handleContactSupport = () => {
		this.props.history.push('/support')
	}

	handleCancelModal = () =>
		this.setState(state => ({ cancel_modal: !state.cancel_modal }))

	showCancelModal = () => (
		<Modal
			onClose={this.handleCancelModal}
			size={'tiny'}
			open={this.state.cancel_modal}
		>
			<Modal.Header>Cancel Subscription</Modal.Header>
			<Modal.Content>
				<Header color="red">
					You have intended to cancel the subscription renewal.
				</Header>
				<p>
					Cancelling the subscription renewal will disable your business account
					after the expiry date. You will need to make the payment later to
					enable the same.{' '}
				</p>
				<strong>
					Your business contents will be with us for 60 days before destruction.
				</strong>
				<br />
				<p>Are you sure to cancel the subscription renewal?</p>
			</Modal.Content>
			<Modal.Actions>
				<Button onClick={this.handleCancelModal} positive>
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

	render() {
		return (
			this.props.isLoading === false ?
			<div>
				{this.state.cancel_modal && this.showCancelModal()}
				<Header className={classes.billing_settings_header} dividing>
					Billing Overview
				</Header>
				<Form>
					<Form.Group widths={2}>
						<Form.Field className={classes.plan_status} width={4}>
							Plan Status:
						</Form.Field>
						{PlanDetails.plan_active ? (
							<Form.Field className={classes.plan_status_value} width={12}>
								Active
							</Form.Field>
						) : (
							<Form.Field
								className={classes.plan_status_value_negetive}
								width={12}
							>
								Not Active
							</Form.Field>
						)}
					</Form.Group>
					<Form.Group widths={2}>
						<Form.Field className={classes.current_plan_status} width={4}>
							Current Plan:
						</Form.Field>
						<Form.Field width={12}>
							{PlanDetails.plan_type}
							<div className={classes.billing_actions}>
								{PlanDetails.plan_type === 'Small Business' && (
									<Button size="mini" positive>
										Upgrade
										<Icon className={classes.billing_action} name="arrow up" />
									</Button>
								)}
							</div>
						</Form.Field>
					</Form.Group>
					<Form.Group widths={2}>
						<Form.Field className={classes.validity} width={4}>
							Plan Validity:
						</Form.Field>
						<Form.Field width={12}>
							Until {PlanDetails.validity}
							<div className={classes.billing_actions}>
								<Button color="yellow" size="mini">
									Renew
									<Icon className={classes.billing_action} name="refresh" />
								</Button>
								<Button negative size="mini" onClick={this.handleCancelModal}>
									Cancel
									<Icon className={classes.billing_action} name="close" />
								</Button>
							</div>
						</Form.Field>
					</Form.Group>
					<center>
						<Button primary onClick={this.handleContactSupport}>
							Contact Support
							<Icon name="comments" className={classes.billing_action} />
						</Button>
					</center>
				</Form>
				<Header className={classes.plan_history_header} as="h4" dividing>
					Payments History
				</Header>
				<Table celled striped>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell colSpan="4">Payments</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{paymentHistory.map((payment, i) => (
							<Table.Row key={i}>
								<Table.Cell>
									{payment.state === 'Success' ? (
										<Icon name="checkmark" />
									) : (
										<Icon name="close" />
									)}
									{payment.state}
								</Table.Cell>
								<Table.Cell>{payment.details}</Table.Cell>
								<Table.Cell>₹{payment.price}</Table.Cell>
								<Table.Cell>₹{payment.time}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</div>
			: <LoadingComponent />
		)
	}
}

const mapStateToProps = state => {
	return {
		isLoading: state.isLoading
	}
}

export default withRouter(connect(mapStateToProps, null)(BillingSettings))
