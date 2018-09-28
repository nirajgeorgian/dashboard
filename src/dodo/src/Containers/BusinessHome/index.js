import React from 'react'
import Loading from '../../Components/UI/Loading/index'
import {} from 'semantic-ui-react'
import classes from './BusinessHome.local.scss'
import RevenueChart from './RevenueChart'
import UserVisitChart from './UserVisitChart'
import DeviceTypeChart from './DeviceTypeChart'
import WhatBringsRevenueTable from './WhatBringsRevenueTable'
import ActivitiesUserDoTable from './ActivitiesUsersDoTable'
import {
	activitiesUsersDo,
	whatBringsRevenueData,
	revenueChartData,
	userVisitChartData,
	deviceTypeChartData
} from './MockData'

class BusinessHome extends React.Component {
	render() {
		return (
			<div>
				<RevenueChart
					cash="63,457"
					activeMembers="837"
					eventBookings="87"
					views="22K"
					data={revenueChartData}
				/>

				<h2 className={classes.lighter}>Analytics</h2>
				<div className={classes.analytics}>
					<UserVisitChart data={userVisitChartData} />
					<DeviceTypeChart data={deviceTypeChartData} />
				</div>
				<div className={classes.extra}>
					<div className={classes.whatBringsRevenue}>
						<h2 className={classes.lighter}>What brings you revenue?</h2>
						<WhatBringsRevenueTable data={whatBringsRevenueData} />
					</div>
					<div className={classes.whatUsersDo}>
						<h2 className={classes.lighter}>
							What activities do your users do?
						</h2>
						<ActivitiesUserDoTable data={activitiesUsersDo} />
					</div>
				</div>
			</div>
		)
	}
}

export default BusinessHome
