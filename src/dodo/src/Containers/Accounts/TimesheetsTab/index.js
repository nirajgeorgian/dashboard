import React from 'react'
import { Table, Popup } from 'semantic-ui-react'
import classes from './TimesheetsTab.local.scss'

import EmployeeCell from './EmployeeCell'

export default class TimesheetsTab extends React.Component {
	renderWeeklyTable = () => {
		return (
			<Table definition>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell />
						<Table.HeaderCell textAlign="center">Mon</Table.HeaderCell>
						<Table.HeaderCell textAlign="center">Tue</Table.HeaderCell>
						<Table.HeaderCell textAlign="center">Wed</Table.HeaderCell>
						<Table.HeaderCell textAlign="center">Thu</Table.HeaderCell>
						<Table.HeaderCell textAlign="center">Fri</Table.HeaderCell>
						<Table.HeaderCell textAlign="center">Sat</Table.HeaderCell>
						<Table.HeaderCell textAlign="center">Sun</Table.HeaderCell>
						<Table.HeaderCell textAlign="center">Totals</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					<Table.Row>
						<Table.Cell className={classes.employeeCell}>
							<EmployeeCell />
						</Table.Cell>
						<Popup
							trigger={
								<Table.Cell textAlign="center" selectable>
									7:30
								</Table.Cell>
							}
							content="Add users to your feed"
						/>
						<Popup
							trigger={
								<Table.Cell textAlign="center" selectable>
									7:30
								</Table.Cell>
							}
							content="Add users to your feed"
						/>
						<Popup
							trigger={
								<Table.Cell textAlign="center" selectable>
									7:00
								</Table.Cell>
							}
							content="Add users to your feed"
						/>
						<Popup
							trigger={
								<Table.Cell textAlign="center" selectable>
									8:00
								</Table.Cell>
							}
							content="Add users to your feed"
						/>
						<Popup
							trigger={
								<Table.Cell textAlign="center" selectable>
									7:30
								</Table.Cell>
							}
							content="Add users to your feed"
						/>
						<Popup
							trigger={
								<Table.Cell textAlign="center" selectable>
									0:00
								</Table.Cell>
							}
							content="Add users to your feed"
						/>
						<Popup
							trigger={
								<Table.Cell textAlign="center" selectable>
									0:00
								</Table.Cell>
							}
							content="Add users to your feed"
						/>

						<Table.Cell textAlign="center" selectable>
							35:00
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table>
		)
	}
	render() {
		return (
			<div className={classes.container}>
				{this.props.isAccountsTimesheetWeekly && this.renderWeeklyTable()}
				{!this.props.isAccountsTimesheetWeekly &&
					'monthly' + ' ' + this.props.timesheetFirstDate}
				<div className={classes.text}>Employee</div>
			</div>
		)
	}
}
