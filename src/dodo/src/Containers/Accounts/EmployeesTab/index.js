import React from 'react'
import { Header, Card, Button, Image, Popup, Icon } from 'semantic-ui-react'
import ActiveEmployeeCard from './ActiveEmployeeCard'
import LeftEmployeeCard from './LeftEmployeeCard'
import classes from './EmployeesTab.local.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

class EmployeeTab extends React.Component {
	sortEmployees = () => {
		const { employees } = this.props
		const active = []
		const left = []

		employees.map(emp => {
			if (!emp.empend) return active.push(emp)

			const start = moment(emp.empstart, 'YYYY/MM/DD')
			const end = moment(emp.empend, 'YYYY/MM/DD')
			const now = moment()

			if (end.isBefore(start)) {
				emp['empend'] = ''
				return active.push(emp)
			}
			if (now.isAfter(end)) return left.push(emp)

			return active.push(emp)
		})

		return [active, left]
	}
	render() {
		const [active, left] = this.sortEmployees()
		return (
			<div className={classes.container}>
				{active.length > 0 && (
					<div>
						<Header as="h4" dividing>
							Active Employees
						</Header>
						<Card.Group itemsPerRow={3} stackable>
							{active.map((activeEmployees, i) => (
								<ActiveEmployeeCard
									key={activeEmployees.empid}
									employee={activeEmployees}
								/>
							))}
						</Card.Group>
					</div>
				)}
				{left.length > 0 && (
					<div className={classes.leftEmployeeContainer}>
						<Header as="h4" dividing>
							Left Employees
						</Header>
						<Card.Group itemsPerRow={3} stackable>
							{left.map((leftEmployees, i) => (
								<LeftEmployeeCard key={i} employee={leftEmployees} />
							))}
						</Card.Group>
					</div>
				)}
			</div>
		)
	}
}

const mapStateToProps = state => ({
	employees: state.employees
})

export default connect(mapStateToProps)(EmployeeTab)
