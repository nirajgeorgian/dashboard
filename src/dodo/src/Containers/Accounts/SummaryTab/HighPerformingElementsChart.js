import React from 'react'
import { Header, Button, Icon } from 'semantic-ui-react'
import Chart from 'chart.js'
import classes from './SummaryTab.local.scss'

const colors = [
	'#009688',
	'#4CAF50',
	'#8BC34A',
	'#CDDC39',
	'#FFEB3B',
	'#FFCC24',
	'#FFBC56',
	'#E36C18',
	'#DE5B49',
	'#DE3C36',
	'#E3380E',
	'#E3380E',
	'#DE0E8B'
]

class HighPerformingElement extends React.Component {
	renderHighPerformingElementChart = (context, data) => {
		const cashbyelementsdata = {
			datasets: [
				{
					label: 'Revnue in ₹',
					data: Object.values(data),
					backgroundColor: colors
				}
			],
			labels: Object.keys(data)
		}

		var cashbyelementschart = new Chart(context, {
			type: 'horizontalBar',
			data: cashbyelementsdata,
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
		const Context = document
			.querySelector(`.${classes.highPerformingElement}`)
			.getContext('2d')

		this.renderHighPerformingElementChart(Context, this.props.data)
	}
	render() {
		return (
			<div style={{ marginTop: '1rem' }}>
				<Header className={classes.header} as="h3" dividing>
					High Performing Elements
				</Header>
				<canvas className={classes.highPerformingElement} />
			</div>
		)
	}
}

export default HighPerformingElement
