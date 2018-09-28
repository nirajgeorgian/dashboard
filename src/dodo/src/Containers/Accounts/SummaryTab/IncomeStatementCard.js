import React from 'react'
import { Card, Button, Divider, Header } from 'semantic-ui-react'
import classes from './IncomeCard.local.scss'

class IncomeStatementCard extends React.Component {
	render() {
		const { data } = this.props
		return (
			<Card className={classes.incomeStatementCard} centered>
				<Card.Content header="Income Statement" />
				<Card.Content className={classes.mainContent}>
					<div className={classes.content}>
						<div className={classes.item}>
							<p>Revenue</p>
							<p>₹{data.revenue}</p>
						</div>
						<div className={classes.item}>
							<p>COGS</p>
							<p>₹{data.cogs}</p>
						</div>
						<Divider className={classes.divider} />
						<div className={classes.special_item}>
							<p>Gross Profit</p>
							<p>₹{data.grossProfit}</p>
						</div>
						<div className={classes.special_item}>
							<p>OPEX</p>
							<p>₹{data.opex}</p>
						</div>
						<div className={classes.indented}>
							<div className={classes.item}>
								<p>Sales</p>
								<p>₹{data.sales}</p>
							</div>
							<div className={classes.item}>
								<p>Marketing</p>
								<p>₹{data.marketing}</p>
							</div>
							<div className={classes.item}>
								<p>General & Admin</p>
								<p>₹{data.generalAndAdmin}</p>
							</div>
							<div className={classes.item}>
								<p>Other Income</p>
								<p>₹{data.otherIncome}</p>
							</div>
							<div className={classes.item}>
								<p>Other Expenses</p>
								<p>₹{data.otherExpenses}</p>
							</div>
						</div>
						<Divider className={classes.divider} />
						<div className={classes.special_item}>
							<p>Operating Profit (EBIT)</p>
							<p>₹{data.ebit}</p>
						</div>
						<div className={classes.indented}>
							<div className={classes.item}>
								<p>Interest & Tax</p>
								<p>₹{data.tax}</p>
							</div>
						</div>
						<div className={classes.netProfit}>
							<p>Net Profit</p>
							<p>₹{data.netProfit}</p>
						</div>
					</div>
				</Card.Content>
				<Button
					positive
					attached="bottom"
					icon="eye"
					content="View Transactions"
					onClick={() => this.props.tabChange(1)}
				/>
			</Card>
		)
	}
}

export default IncomeStatementCard
