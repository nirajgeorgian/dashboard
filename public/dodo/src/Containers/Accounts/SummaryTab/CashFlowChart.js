import React from 'react'
import { Header, Button, Icon } from 'semantic-ui-react'
import Chart from 'chart.js'
import classes from './SummaryTab.local.scss'

class CashFlowChart extends React.Component {
	renderCashFlowChart = (context, data) => {
		const bordergradientStroke = context.createLinearGradient(500, 0, 100, 0)
		bordergradientStroke.addColorStop(0, '#2B98F0')
		bordergradientStroke.addColorStop(1, '#2B98F0')

		const bggradientStroke = context.createLinearGradient(0, 0, 0, 250)
		bggradientStroke.addColorStop(0, '#2B98F0')
		bggradientStroke.addColorStop(1, 'white')
		context.fillStyle = bggradientStroke
		context.fillRect(20, 20, 150, 100)

		new Chart(context, {
			type: 'line',
			data: {
				labels: Object.keys(data),
				datasets: [
					{
						label: '₹',
						data: Object.values(data),
						backgroundColor: bggradientStroke,
						borderColor: bordergradientStroke,
						borderWidth: 1,
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
								color: 'rgba(200, 200, 200, 0.1)',
								lineWidth: 1
							}
						}
					],
					yAxes: [
						{
							ticks: {
								beginAtZero: true
							},
							gridLines: {
								color: 'rgba(200, 200, 200, 0.1)',
								lineWidth: 1
							}
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
				}
			}
		})
	}
	componentDidMount() {
		const cashFlowContext = document
			.querySelector(`.${classes.cashflow}`)
			.getContext('2d')

		this.renderCashFlowChart(cashFlowContext, this.props.data)
	}
	render() {
		return (
			<div>
				<Header className={classes.header} as="h3" dividing>
					Cash Flow
				</Header>
				<canvas className={classes.cashflow} />
			</div>
		)
	}
}

export default CashFlowChart
