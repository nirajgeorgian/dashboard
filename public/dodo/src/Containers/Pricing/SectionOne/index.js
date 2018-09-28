import React from 'react'
import {
	Icon,
	Form,
	Input,
	TextArea,
	Button,
	Popup,
	Card,
	Header,
	Divider
} from 'semantic-ui-react'
import classes from './SectionOne.local.scss'
import { withRouter } from 'react-router-dom'

class SectionOne extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		return (
			<div className={classes.businessPlansContainer}>
				<Header className={classes.businessPLansHeader} size="huge">
					Business Plans
				</Header>
				<Card.Group
					stackable
					itemsPerRow={3}
					className={classes.businessPlanCards}
					centered
				>
					<Card raised>
						<Card.Content>
							<Card.Header
								className={classes.businessCardsHeader}
								textAlign="center"
							>
								Small
							</Card.Header>
							<Card.Meta textAlign="center">One Branch only</Card.Meta>
							{/* <Divider fitted className={classes.divider} horizontal>
								₹599 / monthOr
							</Divider> */}
						</Card.Content>
						<Card.Content extra>
							<Button primary fluid>
								Get Started
							</Button>
						</Card.Content>
					</Card>
					<Card raised>
						<Card.Content>
							<Card.Header
								className={classes.businessCardsHeader}
								textAlign="center"
							>
								Big
							</Card.Header>
							<Card.Meta textAlign="center">Upto 10 Branches</Card.Meta>
							{/* <Divider fitted className={classes.divider} horizontal>
								₹999 / month
							</Divider> */}
						</Card.Content>
						<Card.Content extra>
							<Button primary fluid>
								Get Started
							</Button>
						</Card.Content>
					</Card>
					<Card raised>
						<Card.Content>
							<Card.Header
								className={classes.businessCardsHeader + ' ' + classes.special}
								textAlign="center"
							>
								Enterprise
							</Card.Header>
							<Card.Meta textAlign="center">Unlimited Branches</Card.Meta>
							{/* <Divider fitted className={classes.divider} horizontal>
								Contact Sales
							</Divider> */}
						</Card.Content>
						<Card.Content extra>
							<Button
								onClick={() => this.props.history.push('/contact')}
								positive
								fluid
							>
								Contact Sales
							</Button>
						</Card.Content>
					</Card>
				</Card.Group>
			</div>
		)
	}
}

export default withRouter(SectionOne)
