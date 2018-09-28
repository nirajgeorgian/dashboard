import React from 'react'
import { Menu, Segment, Card } from 'semantic-ui-react'

import classes from './Membership.local.scss'
import DefinitionCard from './DefinitionCards/index'
import Attendances from './Attandances/index'
import Members from './Members/index'
import Transactions from './Transactions/index'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import moment from 'moment'

import DeleteMembership from './DeleteMembership/index'
import { API } from 'aws-amplify'

const definitions = [
	{
		key: 0,
		color: '#2185d0',
		mems_fee: '₹2999',
		mems_activity: 'Gym Package - Single',
		mems_desc: ' Standard gym package to access all our gym facilities.',
		mems_frequency: 'Month',
		mems_state: 2,
		mems_max_mem: '75'
	},
	{
		key: 1,
		color: '#00b5ad',
		mems_fee: '₹3999',
		mems_activity: 'Gym Package - Couple',
		mems_desc: 'Standard gym package to access all our gym facilities.',
		mems_frequency: 'Month',
		mems_state: 1,
		mems_max_mem: '7'
	},
	{
		key: 2,
		color: '#4054bf',
		mems_fee: '₹3999',
		mems_activity: 'Tennis Package - Junior',
		mems_desc: 'Standard gym package to access all our gym facilities.',
		mems_frequency: 'Month',
		mems_state: 0,
		mems_max_mem: '121'
	},
	{
		key: 3,
		color: '#e91e63',
		mems_fee: '₹1999',
		mems_activity: 'Tennis Package - Senior',
		mems_desc: ' Standard gym package to access all our gym facilities.',
		mems_frequency: 'Month',
		mems_state: 0,
		mems_max_mem: '192'
	},
	{
		key: 4,
		color: '#4054bf',
		mems_fee: '₹2999',
		mems_activity: 'Badminton Package - Adult',
		mems_desc:
			' Standard adult badminton package to book all badminton courts.',
		mems_frequency: '₹ 2999 / Month',
		mems_state: 0,
		mems_max_mem: '251'
	}
]

class MemberShips extends React.Component {
	state = {
		activeItem: 'definitions',
		definitions: definitions,
		loading: false,
		showDeleteMembership: false,
		mems_to_delete: '',
		active_members: [],
		expired_members: [],
		attendances: [],
		transactions: [],
		members: []
	}

	async componentWillMount() {
		var arr = []
		this.setState({
			loading: true
		})
		const response = await API.post('membership', '/get', {
			body: {
				business_id: this.props.business.bizid
			}
		})
		var count = 0

		response.response.map(item => {
			console.log(item)
			var tmp = this.getObjectWithChangedKey(item)
			tmp['color'] = '#2185d0'
			arr[count] = tmp
			++count
		})
		// console.log(arr)
		this.setState({
			definitions: arr
		})
	}

	getObjectWithChangedKey = item => {
		var tmp = {}
		var keys = Object.keys(item)
		for (var j = 0; j < keys.length; j++) {
			var key = keys[j].replace('', 'mems_')
			var _key = keys[j]
			switch (typeof item[_key]) {
				case 'object':
					if (item[_key] != null) {
						if (item[_key].constructor !== Array) {
							var keys1 = Object.keys(item[_key])
							for (var i = 0; i < keys1.length; i++) {
								var key1 = key + '_' + keys1[i]
								tmp[key1] = item[_key][keys1[i]]
							}
						} else {
							tmp[key] = item[_key]
						}
					}
					break

				default:
					tmp[key] = item[_key]
					break
			}
		}
		return tmp
	}

	async componentDidMount() {
		try {
			let business_id = this.props.business.bizid
			const data = await API.get('members', `/list/${business_id}`)
			const transactions = await API.post('members', '/txn', {
				body: {
					business_id: business_id
				}
			})
			const attendances = await API.post('members', '/attendance/list', {
				body: {
					business_id: business_id
				}
			})

			await this.setState({
				members: data.message
			})

			this.handleSplitMembers()

			this.setState({
				loading: false,
				attendances: attendances.message,
				transactions: transactions.message
			})
		} catch (e) {
			console.log(e)
		}
	}

	handleSplitMembers = () => {
		var zozo = this.state.members
			.map(item => {
				if (moment(new Date(item.mem_enddate)) >= moment()) {
					return {
						...item
					}
				}
			})
			.filter(item => item != undefined)

		var zozo1 = this.state.members
			.map(item => {
				if (moment(new Date(item.mem_enddate)) < moment()) {
					return {
						...item
					}
				}
			})
			.filter(item => item != undefined)

		this.setState({
			active_members: zozo,
			expired_members: zozo1
		})
	}

	handleChangeMembers = async members => {
		await this.setState({
			members: members
		})
		this.handleSplitMembers()
	}

	handleAddMember = async member => {
		const members = this.state.members.map(item => item)
		members.push(member)
		await this.setState({
			members: members
		})
		this.handleSplitMembers()
	}

	handleEditMember = async member => {
		const member_index = this.state.members.findIndex(
			item => item.mem_id == member.mem_id
		)
		var members = this.state.members.map(item => item)
		members[member_index] = member
		await this.setState({
			members: members
		})
		this.handleSplitMembers()
	}

	handleDeleteMember = async member => {
		const members = this.state.members.filter(
			item => item.mem_id != member.mem_id
		)
		await this.setState({
			members: members
		})
		this.handleSplitMembers()
	}

	handleItemSelect = async (e, { name }) => {
		await this.setState({
			activeItem: name
		})
		this.props.buttonState(this.state.activeItem)
	}

	handleMembershipClick = membership => {
		this.props.history.push({
			pathname: '/memberships/add',
			edit_membership: membership
		})
	}

	handleDeleteMembershipOpen = membership => {
		console.log(membership)
		this.setState({
			mems_to_delete: membership,
			showDeleteMembership: true
		})
	}

	handleMembershipDeleted = () => {
		var memberships = this.state.definitions.filter(
			item => item.mems_memsid != this.state.mems_to_delete.mems_memsid
		)
		this.setState({
			definitions: memberships
		})
	}

	handleDeleteMembershipClose = event => {
		this.setState({
			mems_to_delete: '',
			showDeleteMembership: false
		})
	}

	render() {
		if (this.state.loading) {
			return <div>loading your memberships...</div>
		} else {
			return (
				<section className={classes.membershipsbox}>
					<Menu secondary pointing>
						<Menu.Item
							className={
								this.state.activeItem === 'definitions'
									? classes.itemColor2
									: classes.itemColor
							}
							name="definitions"
							active={this.state.activeItem === 'definitions'}
							onClick={this.handleItemSelect}
						/>
						<Menu.Item
							className={
								this.state.activeItem === 'active members'
									? classes.itemColor2
									: classes.itemColor
							}
							name="active members"
							active={this.state.activeItem === 'active members'}
							onClick={this.handleItemSelect}
						/>
						<Menu.Item
							className={
								this.state.activeItem === 'expired members'
									? classes.itemColor2
									: classes.itemColor
							}
							name="expired members"
							active={this.state.activeItem === 'expired members'}
							onClick={this.handleItemSelect}
						/>
						<Menu.Item
							className={
								this.state.activeItem === 'attendances'
									? classes.itemColor2
									: classes.itemColor
							}
							name="attendances"
							active={this.state.activeItem === 'attendances'}
							onClick={this.handleItemSelect}
						/>
						<Menu.Item
							className={
								this.state.activeItem === 'transactions'
									? classes.itemColor2
									: classes.itemColor
							}
							name="transactions"
							active={this.state.activeItem === 'transactions'}
							onClick={this.handleItemSelect}
						/>
					</Menu>
					<Segment
						attached="bottom"
						compact={false}
						className={classes.fullSegment}
					>
						{this.state.activeItem === 'definitions' ? (
							<Card.Group itemsPerRow={4} stackable>
								{this.state.definitions.map(item => (
									<DefinitionCard
										itemColor={item.color}
										amount={'₹' + item.mems_fee}
										content={item.mems_activity}
										meta={'₹ ' + item.mems_fee + ' / ' + item.mems_frequency}
										description={item.mems_desc}
										status={item.mems_state}
										members={item.mems_max_mem}
										membership={item}
										handleClick={this.handleMembershipClick}
										handleDelete={this.handleDeleteMembershipOpen}
									/>
								))}
							</Card.Group>
						) : null}
						{this.state.activeItem === 'active members' ? (
							<Members
								showAddMember={
									this.props.button_clicked == 'Add Member' ? true : false
								}
								handleClose={this.props.removeButtonClicked}
								showBulkAdd={
									this.props.button_clicked == 'Add Bulk Member' ? true : false
								}
								showMessage={
									this.props.button_clicked == 'Send Message' ? true : false
								}
								handleDeleteMember={this.handleDeleteMember}
								handleEditMember={this.handleEditMember}
								handleAddMember={this.handleAddMember}
								// handleChangeMembers={this.handleChangeMembers}
								memberships={this.state.definitions}
								members={this.state.active_members}
							/>
						) : null}
						{this.state.activeItem === 'expired members' ? (
							<Members
								showAddMember={
									this.props.button_clicked == 'Add Member' ? true : false
								}
								handleClose={this.props.removeButtonClicked}
								showBulkAdd={
									this.props.button_clicked == 'Add Bulk Member' ? true : false
								}
								showMessage={
									this.props.button_clicked == 'Send Message' ? true : false
								}
								handleDeleteMember={this.handleDeleteMember}
								handleEditMember={this.handleEditMember}
								handleAddMember={this.handleAddMember}
								// handleChangeMembers={this.handleChangeMembers}
								memberships={this.state.definitions}
								expired_members={this.state.expired_members}
							/>
						) : null}
						{this.state.activeItem === 'attendances' ? (
							<Attendances
								showAddAttendance={
									this.props.button_clicked == 'Add Attendance' ? true : false
								}
								memberships={this.state.definitions}
								attendances={this.state.attendances}
								members={this.state.active_members}
								handleAddAttendanceClose={this.props.removeButtonClicked}
							/>
						) : null}
						{this.state.activeItem === 'transactions' ? (
							<Transactions
								transactions={this.state.transactions}
								memberships={this.state.definitions}
								transactions={this.state.transactions}
							/>
						) : null}
						{this.state.showDeleteMembership ? (
							<DeleteMembership
								open={this.state.showDeleteMembership}
								handleClose={this.handleDeleteMembershipClose}
								membership={this.state.mems_to_delete}
								handleMembershipDeleted={this.handleMembershipDeleted}
							/>
						) : null}
					</Segment>
				</section>
			)
		}
	}
}

function mapStateToProps(state) {
	return {
		business: state.currentBusinessList
	}
}

export default withRouter(
	connect(
		mapStateToProps,
		null
	)(MemberShips)
)
