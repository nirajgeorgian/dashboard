import React from 'react'
import { Header, Button, Icon } from 'semantic-ui-react'
import Chart from 'chart.js'
import classes from './SummaryTab.local.scss'

class NetWorthChart extends React.Component {
	renderNetWorthChart = (context, data) => {
		new Chart(context, {
			type: 'doughnut',
			data: {
				datasets: [
					{
						data: data,
						backgroundColor: ['#9C27B0', '#E91E63', '#F44336']
					}
				],
				labels: ['Eligible ₹', 'In progress ₹', 'Offline ₹']
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				rotation: 1 * Math.PI,
				circumference: 1 * Math.PI,
				cutoutPercentage: 85,
				legend: {
					position: 'top'
				},
				centerText: {
					display: true,
					text: '250'
				}
			}
		})
	}
	componentDidMount() {
		const netWorthContext = document
			.querySelector(`.${classes.netWorth}`)
			.getContext('2d')

		this.renderNetWorthChart(netWorthContext, this.props.data)
	}
	render() {
		return (
			<div>
				<Header className={classes.header} as="h3" dividing>
					Net Worth
				</Header>
				<div className={classes.netWorthDiv}>
					<canvas className={classes.netWorth} />
					<div className={classes.withdrawAmmount}>₹ {this.props.data[0]}</div>
					<Button
						className={classes.withdrawBtn}
						icon
						size="tiny"
						color="purple"
						labelPosition="left"
					>
						<Icon name="rupee" />
						Withdraw
					</Button>
				</div>
			</div>
		)
	}
}

export default NetWorthChart
