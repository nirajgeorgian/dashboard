import React from 'react'
import { Table } from 'semantic-ui-react'
import classes from './BusinessHome.local.scss'

class ActivitiesUserDoTable extends React.Component {
	render() {
		return (
			<div className={classes.activitiesTableContainer}>
				<Table className={classes.activitiesTable} basic>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell width={1}>Page</Table.HeaderCell>
							<Table.HeaderCell width={4}>Action Type</Table.HeaderCell>
							<Table.HeaderCell width={2}>Count</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{this.props.data.map((data, i) => (
							<Table.Row keu={i}>
								<Table.Cell width={8}>{data.page}</Table.Cell>
								<Table.Cell width={5}>{data.action}</Table.Cell>
								<Table.Cell width={3}>{data.count}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</div>
		)
	}
}

export default ActivitiesUserDoTable
