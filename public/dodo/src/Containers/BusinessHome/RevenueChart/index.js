import React from 'react'
import { Icon } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import classes from './RevenueChart.local.scss'
import Chart from 'chart.js'

class RevenueChart extends React.Component {
	renderChart = (context, data) => {
		const labels = data.map(item => item.date)
		const dataOne = data.map(item => item.data.cashFlowOne)
		const dataTwo = data.map(item => item.data.cashFlowTwo)
		new Chart(context, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label: 'Cash Flow',
						data: dataOne,
						backgroundColor: 'rgba(233,30,99,0.9)',
						borderColor: 'rgba(233,30,99,0.9)',
						borderWidth: 1,
						fill: 'origin',
						radius: 0
					},
					{
						label: 'Cash Flow',
						data: dataTwo,
						backgroundColor: '#673AB7',
						borderColor: '#673AB7',
						borderWidth: 1,
						fill: 'origin',
						radius: 0
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				animation: {
					easing: 'easeInOutQuad',
					duration: 520
				},
				scales: {
					xAxes: [
						{
							gridLines: {
								color: 'rgba(200, 200, 200, 0.25)',
								lineWidth: 1
							}
						}
					],
					yAxes: [
						{
							display: false
						}
					]
				},
				elements: {
					line: {
						tension: 0.6
					}
				},
				legend: {
					display: false
				},
				point: {
					backgroundColor: 'white'
				},
				tooltips: {
					backgroundColor: 'rgba(0,0,0,0.3)',
					caretSize: 5,
					cornerRadius: 2,
					xPadding: 10,
					yPadding: 10,
					mode: 'index',
					intersect: false
				},
				title: {
					text: 'Revenue',
					fontFamily: '"Roboto", sans-serif',
					fontSize: '18',
					fontColor: '#673AB7',
					display: true,
					position: 'bottom'
				},
				layout: {
					padding: {
						bottom: 20,
						top: 10
					}
				}
			}
		})
	}
	componentDidMount() {
		const context = document
			.querySelector(`.${classes.revenueChart}`)
			.getContext('2d')

		document.querySelector(`.${classes.revenueChart}`).height = '100'

		this.renderChart(context, this.props.data)
	}
	render() {
		const { cash, activeMembers, eventBookings, views } = this.props
		return (
			<div className={classes.container}>
				<div className={classes.statistics}>
					<div
						onClick={() => this.props.history.push('/accounts')}
						className={classes.rupees}
					>
						<div>{cash}</div>
						<p className={classes.text}>RUPEES</p>
					</div>
					<div
						onClick={() => this.props.history.push('/memberships')}
						className={classes.activeMembers}
					>
						<div>
							<Icon name="user" />
							<p>{activeMembers}</p>
						</div>
						<p className={classes.text}>ACTIVE MEMBERS</p>
					</div>
					<div
						onClick={() => this.props.history.push('/events')}
						className={classes.eventBookings}
					>
						<div>
							<Icon name="check" />
							<p>{eventBookings}</p>
						</div>
						<p>EVENT BOOKINGS</p>
					</div>
					<div className={classes.pageVisits}>
						<div>
							<Icon name="eye" />
							<p>{views}</p>
						</div>
						<p>PAGE VISITS</p>
					</div>
				</div>

				<canvas className={classes.revenueChart} />
			</div>
		)
	}
}

export default withRouter(RevenueChart)
