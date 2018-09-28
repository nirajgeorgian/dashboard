import React from 'react'
import { Header, Button, Icon } from 'semantic-ui-react'
import Chart from 'chart.js'
import classes from './SummaryTab.local.scss'

class RevenueTypeChart extends React.Component {
	renderRevenueTypeChart = (context, data) => {
		const cashbytypedata = {
			datasets: [
				{
					data: Object.values(data),
					backgroundColor: [
						'#6D46B5',
						'#3525B5',
						'#2196F3',
						'#03A9F4',
						'#4DF4F2'
					]
				}
			],
			labels: Object.keys(data).map(key => `${key} ₹`)
		}

		const chart = new Chart(context, {
			type: 'doughnut',
			data: cashbytypedata,
			options: {
				responsive: true,
				maintainAspectRatio: true,
				cutoutPercentage: 80,
				legend: {
					position: 'bottom'
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
			.querySelector(`.${classes.revenueType}`)
			.getContext('2d')

		document.querySelector(`.${classes.revenueType}`).height = 250

		this.renderRevenueTypeChart(netWorthContext, this.props.data)
	}
	render() {
		return (
			<div>
				<Header className={classes.header} as="h3" dividing>
					Revenue by Type
				</Header>
				<canvas className={classes.revenueType} />
			</div>
		)
	}
}

export default RevenueTypeChart
