import React from 'react'
import { Segment, Menu, Input, Search } from 'semantic-ui-react'
import classes from './TransactionsTab.local.scss'
import Datetime from 'react-datetime'
import moment from 'moment'
import TransactionItem from './TransactionItem'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class TransactionsTab extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			fromDate: '',
			toDate: '',
			searchString: ''
		}
	}

	sortTransactions = (a, b) => {
		const atimestamp = moment(a.timestamp, 'MMM DD YYYY hh:mm:ss')
		const btimestamp = moment(b.timestamp, 'MMM DD YYYY hh:mm:ss')
		if (atimestamp.isBefore(btimestamp)) return -1
		if (btimestamp.isBefore(atimestamp)) return 1
		return 0
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

	sortAndSearchTransactions = () => {
		let transactions = this.props.transactions
		transactions.sort(this.sortTransactions)

		if (this.state.fromDate !== '') {
			const fromDate = this.state.fromDate
			transactions = transactions.filter(txn => {
				const txnTime = moment(txn.timestamp, 'MMM DD YYYY hh:mm:ss')
				return txnTime.isSameOrAfter(fromDate)
			})
		}
		if (this.state.toDate !== '') {
			const toDate = this.state.toDate
			transactions = transactions.filter(txn => {
				const txnTime = moment(txn.timestamp, 'MMM DD YYYY hh:mm:ss')
				return txnTime.isSameOrBefore(toDate)
			})
		}

		if (this.state.searchString !== '') {
			const regx = new RegExp(this.state.searchString, 'gi')
			transactions = transactions.filter(txn => {
				return (
					(txn.name ? txn.name.match(regx) : txn.custid.match(regx)) ||
					txn.comment.match(regx)
				)
			})
		}
		return transactions
	}
	render() {
		const transactions = this.sortAndSearchTransactions()
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
									fromDate: date
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
									toDate: date
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
							<Input
								onChange={(_, data) =>
									this.setState({ searchString: data.value })
								}
								placeholder="Search Transactions"
								icon="search"
							/>
						</Menu.Item>
					</Menu.Menu>
				</Menu>
				<Segment className={classes.container} attached="bottom">
					{transactions.map((data, i) => (
						<TransactionItem key={data.id || data.orderid} data={data} />
					))}
				</Segment>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		transactions: state.transactions
	}
}

export default connect(mapStateToProps)(TransactionsTab)
