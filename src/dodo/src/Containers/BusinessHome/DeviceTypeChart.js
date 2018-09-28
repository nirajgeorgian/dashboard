import React from 'react'
import classes from './BusinessHome.local.scss'
import Chart from 'chart.js'

class DeviceTypeChart extends React.Component {
	renderChart = (context, data) => {
		const labels = data.map(item => item.type)
		const dataSet = data.map(item => item.count)
		const devicetypedata = {
			datasets: [
				{
					data: dataSet,
					backgroundColor: ['#0057BE', '#2a92ea', '#67c2f7']
				}
			],
			labels
		}
		new Chart(context, {
			type: 'doughnut',
			data: devicetypedata,
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
				},
				title: {
					text: 'Device Types',
					fontFamily: '"Roboto", sans-serif',
					fontSize: '16',
					fontColor: '#673AB7',
					position: 'bottom',
					display: true
				},
				tooltips: {
					callbacks: {
						label: function(tooltipItem, data) {
							const dataset = data.datasets[tooltipItem.datasetIndex]
							const total = dataset.data.reduce(function(
								previousValue,
								currentValue,
								currentIndex,
								array
							) {
								return previousValue + currentValue
							})
							const currentValue = dataset.data[tooltipItem.index]
							const precentage = Math.floor((currentValue / total) * 100 + 0.5)

							return precentage + '%'
						}
					}
				}
			}
		})
	}
	componentDidMount() {
		const context = document
			.querySelector(`.${classes.deviceTypeChart}`)
			.getContext('2d')
		document.querySelector(`.${classes.deviceTypeChart}`).height = '260'
		this.renderChart(context, this.props.data)
	}
	render() {
		return (
			<div className={classes.deviceTypes}>
				<canvas className={classes.deviceTypeChart} />
			</div>
		)
	}
}

export default DeviceTypeChart
