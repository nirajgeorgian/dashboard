import React from 'react'
import { Segment, Menu, Input, Search, Divider, Icon } from 'semantic-ui-react'
import classes from './AttandanceTab.local.scss'
import Datetime from 'react-datetime'
import moment from 'moment'
import AttandanceItem from './AttendanceItem'
class AttandanceTab extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			fromDate: '',
			toDate: ''
		}
	}

	componentDidMount() {
		document
			.querySelector(`.${classes.fromDate}`)
			.querySelector('.rdtPicker')
			.classList.add(classes.position)
		document
			.querySelector(`.${classes.toDate}`)
			.querySelector('.rdtPicker')
			.classList.add(classes.position)
	}

	render() {
		return (
			<div>
				<Menu attached="top">
					<Menu.Item className={classes.fromDate} name="fromDate">
						<Datetime
							className={classes.fromDatePicker}
							viewMode="years"
							renderInput={(props, openCalendar, closeCalendar) => (
								<Input icon="calendar" {...props} />
							)}
							closeOnSelect={true}
							inputProps={{ placeholder: 'From Date' }}
							onChange={date => {
								this.setState({
									fromDate: date.format('MM,DD,YYYY')
								})
							}}
							dateFormat="MMM Do YYYY"
							timeFormat={false}
							onClick={this.handleFocusChange}
							value={moment(this.state.fromDate, 'DD,MM,YYYY')}
						/>
					</Menu.Item>

					<Menu.Item className={classes.toDate} name="toDate">
						<Datetime
							className={classes.toDatePicker}
							viewMode="years"
							renderInput={(props, openCalendar, closeCalendar) => (
								<Input icon="calendar" {...props} />
							)}
							closeOnSelect={true}
							inputProps={{ placeholder: 'To Date' }}
							onChange={date =>
								this.setState({
									toDate: date.format('MM,DD,YYYY')
								})
							}
							dateFormat="MMM Do YYYY"
							timeFormat={false}
							onClick={this.handleFocusChange}
							value={moment(this.state.toDate, 'DD,MM,YYYY')}
						/>
					</Menu.Item>

					<Menu.Menu position="right">
						<Menu.Item
							className={classes.transactionSearch}
							position="right"
							name="search"
						>
							<Input placeholder="Search Members" icon="search" />
						</Menu.Item>
					</Menu.Menu>
				</Menu>
				<Segment className={classes.container} attached="bottom">
					<AttandanceItem />
					<AttandanceItem />
					<AttandanceItem />
					<AttandanceItem />
					<AttandanceItem />
				</Segment>
			</div>
		)
	}
}

export default AttandanceTab
