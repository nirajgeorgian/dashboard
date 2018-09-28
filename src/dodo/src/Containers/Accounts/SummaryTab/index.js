import React from 'react'
import { Grid, Header, Button, Icon } from 'semantic-ui-react'
import Chart from 'chart.js'
import classes from './SummaryTab.local.scss'
import NetWorthChart from './NetWorthChart'
import HighPerformingElementChart from './HighPerformingElementsChart'
import CashFlowChart from './CashFlowChart'
import IncomeStatementCard from './IncomeStatementCard'
import RevenueTypeChart from './RevenueTypeChart'

const netWorthMockData = [29890, 10000, 9800]
const cashFlowMockData = {
	'1 May': 24000,
	'5 May': 10000,
	'10 May': 35000,
	'15 May': 59000,
	'20 May': 30500,
	'25 May': 40000,
	'30 May': 36000
}

const highPerformingElementsMockData = {
	'How to create a startup!': 5890,
	'Tennis Court 1': 4600,
	'Gym Adult Membership': 5000,
	'Badminton Annual Membership': 6750,
	'Zumba Class': 6000,
	'Badminton Monthly Membership': 6830,
	'Yoga Class': 5632
}

const incomeStatementMockData = {
	revenue: '39,990',
	cogs: '9,990',
	grossProfit: '30,000',
	opex: '25,000',
	sales: '13,990',
	marketing: '5,900',
	generalAndAdmin: '5,450',
	otherIncome: '7,450',
	otherExpenses: '2,990',
	ebit: '12,000',
	tax: '2,250',
	netProfit: '24,000'
}

const revenueTypeMockData = {
	Memberships: 29800,
	Events: 15000,
	Facilities: 9500
}
class SummaryTab extends React.Component {
	render() {
		return (
			<div className={classes.container}>
				<Grid celled="internally">
					<Grid.Row>
						<Grid.Column width={9}>
							<div className={classes.column}>
								<NetWorthChart data={netWorthMockData} />
								<CashFlowChart data={cashFlowMockData} />
								<HighPerformingElementChart
									data={highPerformingElementsMockData}
								/>
							</div>
						</Grid.Column>
						<Grid.Column width={7}>
							<IncomeStatementCard
								data={incomeStatementMockData}
								tabChange={this.props.tabChange}
							/>
							<RevenueTypeChart data={revenueTypeMockData} />
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		)
	}
}

export default SummaryTab
