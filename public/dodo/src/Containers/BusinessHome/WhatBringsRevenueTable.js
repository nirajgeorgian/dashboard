import React from 'react'
import { Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import classes from './BusinessHome.local.scss'

class WhatBringsRevenueTable extends React.Component {
	render() {
		return (
			<div className={classes.revenueTableContainer}>
				<Table className={classes.revenueTable} basic>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell width={11}>Element</Table.HeaderCell>
							<Table.HeaderCell width={5}>Revenue (₹)</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{this.props.data.map((data, i) => (
							<Table.Row keu={i}>
								<Table.Cell className={classes.links} width={11}>
									<Link to={`/${data.type}`}>{data.element}</Link>
								</Table.Cell>
								<Table.Cell width={5}>{data.revenue}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</div>
		)
	}
}

export default WhatBringsRevenueTable
