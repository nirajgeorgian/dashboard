import React, { Component } from 'react'
import { Tab, Menu } from 'semantic-ui-react'
import classes from './Accounts.local.scss'
import SummaryTab from './SummaryTab'
import EmployeesTab from './EmployeesTab'
import TransactionsTab from './TransactionsTab'
import AttandanceTab from './AttandanceTab'
import TimesheetsTab from './TimesheetsTab'
import { API } from 'aws-amplify'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { transactionLoad } from '../../Actions/ActionsCreator/TransactionActions'
import { employeeLoad } from '../../Actions/ActionsCreator/EmployeeActions'
import { format } from 'path'
import moment from 'moment'
class Accounts extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true
		}
	}

	loadEmployees = async () => {
		const response = await API.get(
			'employee',
			`/list/${this.props.currentBusiness.bizid}`,
			{}
		)
		if (response.status) this.props.employeeLoad(response.message)
	}
	loadTransactions = async () => {
		try {
			const response = await API.post('accounts', '/txn/list', {
				body: {
					bizid: this.props.currentBusiness.bizid
				}
			})

			const offlineTransactions = response.message.offline[0].map(txn => {
				txn.offline = true
				return txn
			})
			const onlineTransactions = response.message.online[0].map(txn => {
				txn.offline = false
				const date = txn.date.split('T')[0]
				const time = txn.date.split('T')[1].split('.')[0]
				const timestamp = moment(
					`${date} ${time}`,
					'YYYY-MM-DD hh:mm::ss'
				).format('MMM DD YYYY hh:mm:ss')
				txn.timestamp = timestamp
				return txn
			})
			this.props.transactionLoad([
				...offlineTransactions,
				...onlineTransactions
			])
		} catch (err) {
			console.log(err)
		}
	}
	componentDidMount = async () => {
		await this.loadTransactions()
		await this.loadEmployees()
		// const res = await API.put('employee', '/update', {
		// 	body: {
		// 		emp_id: '15303063723971',
		// 		emp_fname: 'Saha',
		// 		bizid: this.props.currentBusiness.bizid
		// 	}
		// })
		// console.log('update', res)

		this.setState({ loading: false })
	}

	getPanes = () => [
		{
			menuItem: (
				<Menu.Item
					className={
						this.props.activeIndex === undefined || this.props.activeIndex === 0
							? classes.active_tab
							: ''
					}
					key="Summary"
				>
					Summary
				</Menu.Item>
			),
			render: () => (
				<Tab.Pane className={classes.panes} attached={false}>
					<SummaryTab tabChange={this.props.handleTabChange} />
				</Tab.Pane>
			)
		},
		{
			menuItem: (
				<Menu.Item
					className={this.props.activeIndex === 1 ? classes.active_tab : ''}
					key="Transaction"
				>
					Transactions
				</Menu.Item>
			),
			render: () => (
				<Tab.Pane className={classes.panes} attached={false}>
					<TransactionsTab />
				</Tab.Pane>
			)
		},
		{
			menuItem: (
				<Menu.Item
					className={this.props.activeIndex === 2 ? classes.active_tab : ''}
					key="Employees"
				>
					Employees
				</Menu.Item>
			),
			render: () => (
				<Tab.Pane className={classes.panes} attached={false}>
					<EmployeesTab />
				</Tab.Pane>
			)
		},
		{
			menuItem: (
				<Menu.Item
					className={this.props.activeIndex === 3 ? classes.active_tab : ''}
					key="Employee Attendance"
				>
					Employee Attendance
				</Menu.Item>
			),
			render: () => (
				<Tab.Pane className={classes.panes} attached={false}>
					<AttandanceTab />
				</Tab.Pane>
			)
		},
		{
			menuItem: (
				<Menu.Item
					className={this.props.activeIndex === 4 ? classes.active_tab : ''}
					key="Timesheets"
				>
					Timesheets
				</Menu.Item>
			),
			render: () => (
				<Tab.Pane className={classes.panes} attached={false}>
					<TimesheetsTab
						isAccountsTimesheetWeekly={this.props.isAccountsTimesheetWeekly}
						timesheetFirstDate={this.props.timesheetFirstDate}
						timesheetLastDate={this.props.timesheetLastDate}
					/>
				</Tab.Pane>
			)
		}
	]

	handleTabChange = (e, { activeIndex }) => {
		this.props.handleTabChange(activeIndex)
	}

	render() {
		const activeIndex = this.props.activeIndex || 0

		return this.state.loading ? (
			<div>Accounts is loading</div>
		) : (
			<div className={classes.container}>
				<Tab
					activeIndex={activeIndex}
					onTabChange={this.handleTabChange}
					menu={{ secondary: true, pointing: true }}
					panes={this.getPanes()}
				/>
			</div>
		)
	}
}

const mapStateToPops = state => ({
	currentBusiness: state.currentBusinessList
})

const mapActionToProps = dispatch =>
	bindActionCreators(
		{
			transactionLoad,
			employeeLoad
		},
		dispatch
	)

export default connect(
	mapStateToPops,
	mapActionToProps
)(Accounts)
