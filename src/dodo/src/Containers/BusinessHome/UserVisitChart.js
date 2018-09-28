import React from 'react'
import classes from './BusinessHome.local.scss'
import Chart from 'chart.js'

class UserVisitChart extends React.Component {
	renderChart = (context, data) => {
		const labels = data.map(item => item.date)
		const dataOne = data.map(item => item.data.visitOne)
		const dataTwo = data.map(item => item.data.visitTwo)
		new Chart(context, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label: 'User Visits',
						data: dataOne,
						backgroundColor: '#3f51b5',
						borderColor: '#3f51b5',
						borderWidth: 1,
						fill: 'false',
						borderDash: [5, 5]
					},
					{
						label: 'User Visits',
						data: dataTwo,
						backgroundColor: '#D92B30',
						borderColor: '#D92B30',
						borderWidth: 1,
						fill: 'false'
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
								color: 'rgba(200, 200, 200, 0.2)',
								lineWidth: 1
							}
						}
					],
					yAxes: [
						{
							gridLines: {
								color: 'rgba(200, 200, 200, 0.2)',
								lineWidth: 1
							}
						}
					]
				},
				elements: {
					line: {
						tension: 0.3
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
					text: 'User Visits',
					fontFamily: '"Roboto", sans-serif',
					fontSize: '16',
					fontColor: '#673AB7',
					position: 'bottom',
					display: true
				}
			}
		})
	}
	componentDidMount() {
		const context = document
			.querySelector(`.${classes.userVisitChart}`)
			.getContext('2d')

		document.querySelector(`.${classes.userVisitChart}`).height = '150'

		this.renderChart(context, this.props.data)
	}
	render() {
		return (
			<div className={classes.userVisits}>
				<canvas className={classes.userVisitChart} />
			</div>
		)
	}
}

export default UserVisitChart
