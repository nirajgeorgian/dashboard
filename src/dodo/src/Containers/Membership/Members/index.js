import React from 'react'
import {
	Menu,
	Segment,
	Dropdown,
	Popup,
	Input,
	Icon,
	Form,
	Image,
	Header,
	Checkbox
} from 'semantic-ui-react'

import moment from 'moment'

import classes from './Members.local.scss'
import AddMemberModal from './AddMemberModal/index'
import AddBulkMember from './AddBulkMember/index'
import DeleteMember from './DeleteMemberModal/index'
import UserInfoModal from '../../Support/UserInfoModal/index'
import MessageUser from './MessageMember/index'
import { Z_DEFAULT_STRATEGY } from 'zlib'

var memberships = [
	{ key: 0, text: 'Gym Membership - Single', value: 'Gym Membership - Single' },
	{ key: 1, text: 'Gym Membership - Couple', value: 'Gym Membership - Couple' },
	{ key: 2, text: 'Gym Membership - Family', value: 'Gym Membership - Family' }
]

const members = [
	{
		key: 0,
		mem_fullname: 'Niraj Georgian',
		mem_email: 'nirajgeorgian01@gmail.com',
		mem_mems: 'Swim Adult',
		mem_enddate: '25,07,2018',
		mem_fee: 300,
		image: 'http://dev.sagepass.com:8081/img/chat/michaelfassbender.jpg'
	},
	{
		key: 1,
		mem_fullname: 'Raj Babu Das',
		mem_email: 'mail.rajdas@gmail.com',
		mem_mems: 'Swim Adult',
		mem_enddate: '30,06,2018',
		mem_fee: 400,
		image: 'http://dev.sagepass.com:8081/img/chat/emilyblunt.jpg'
	}
]

const Users = [
	{
		id: 0,
		name: 'Support Team',
		image: 'http://dev.sagepass.com:8081/img/chat/sp_logo.png',
		MemberSince: '29 May 2017',
		Membership: 'Monthly Plan',
		ContactNumber: '08998 73578',
		EmailAddress: 'hello@sagepass.com',
		Address: '62, Palash Building, Near Dutta Mandir, Wakad, Pune',
		favourite: false,
		age: 33,
		cognitoId: '1432-4522-5464-7676'
	}
]

var member_count = 0

class Members extends React.Component {
	state = {
		showDeleteMember: false,
		showUserInfo: false,
		showMessageUser: false,
		active_members: members,
		member_to_delete: '',
		member_to_edit: '',
		memberships: '',
		membershipDropdown: memberships,
		parentCheckbox: false,
		showEditMember: false,
		search: '',
		searchDropdown: '',
		filteredMembers: []
	}

	async componentWillMount() {
		await this.setState({
			memberships: this.props.memberships
		})
		var data = this.state.memberships.map(item => {
			return {
				key: item.mems_memsid,
				text: item.mems_name,
				value: item.mems_name
			}
		})
		this.setState({
			membershipDropdown: data
		})
	}

	async componentWillReceiveProps(props) {
		if (props.members) {
			await this.setState({
				active_members: props.members
			})
		} else if (props.expired_members) {
			await this.setState({
				active_members: props.expired_members
			})
		}
		this.renderMembers()
	}

	async componentDidMount() {
		if (this.props.members) {
			await this.setState({
				active_members: this.props.members.map(item => item)
			})
		} else if (this.props.expired_members) {
			await this.setState({
				active_members: this.props.expired_members.map(item => item)
			})
		}
		this.renderMembers()
	}

	handleEditMemberOpen = member => {
		this.setState({
			showEditMember: true,
			member_to_edit: member
		})
	}

	handleEditMemberClose = event => {
		this.setState({
			showEditMember: false,
			member_to_edit: ''
		})
	}

	handleAddMember = new_member => {
		this.props.handleAddMember(new_member)
	}

	handleEditMember = member => {
		this.props.handleEditMember(member)
	}

	handleDeleteMember = member => {
		this.props.handleDeleteMember(member)
	}

	handleDeleteMemberModalOpen = member => {
		this.setState({
			showDeleteMember: true,
			member_to_delete: member
		})
	}

	handleDeleteMemberModalClose = event => {
		this.setState({
			showDeleteMember: false,
			member_to_delete: ''
		})
	}

	handleShowUserInfoModalOpen = event => {
		this.setState({
			showUserInfo: true
		})
	}

	handleShowUserInfoModalClose = event => {
		this.setState({
			showUserInfo: false
		})
	}

	handleShowMessageUserOpen = event => {
		this.setState({
			showMessageUser: true
		})
	}

	handleShowMessageUserClose = event => {
		this.setState({
			showMessageUser: false
		})
	}

	renderList = ({ name, membership, expiry, image, member }) => {
		return (
			<div>
				<Form className={classes.memberslistfield}>
					<Form.Group widths={3}>
						<Form.Field width={1}>
							<Icon name="square outline pointer" />
						</Form.Field>
						<Form.Field width={1}>
							<Image className={classes.memberimg} src={image} />
						</Form.Field>
						<Form.Field width={3} onClick={this.handleShowUserInfoModalOpen}>
							<strong className="pointer">{name}</strong>
						</Form.Field>
						<Form.Field width={4}>{membership}</Form.Field>
						<Form.Field width={4}>{expiry}</Form.Field>
						<Form.Field width={1}>
							<Popup
								trigger={
									<Icon
										name="comment"
										color="blue"
										onClick={this.handleShowMessageUserOpen}
									/>
								}
								content="Message this user directly."
							/>
						</Form.Field>
						<Form.Field width={1}>
							<Popup
								trigger={
									<Icon
										name="undo"
										color="green"
										onClick={() => this.handleEditMemberOpen(member)}
									/>
								}
								content="Update this membership."
							/>
						</Form.Field>
						<Form.Field width={1}>
							<Popup
								trigger={
									<Icon
										name="trash"
										color="red"
										onClick={() => this.handleDeleteMemberModalOpen(member)}
									/>
								}
								content="Remove membership for this user."
							/>
						</Form.Field>
					</Form.Group>
					<Header className={classes.divider} dividing size="small" />
				</Form>
			</div>
		)
	}

	handleParentCheckboxClick = event => {
		this.setState({
			parentCheckbox: !this.state.parentCheckbox
		})
	}

	getExpiryText = enddate => {
		if (this.props.expired_members) {
			return 'Expired on ' + moment(new Date(enddate)).format('Do MMMM')
		} else if (this.props.members) {
			return 'Expires on ' + moment(new Date(enddate)).format('Do MMMM')
		}
	}

	renderMembers = async () => {
		var members = this.state.active_members
			.filter(member => {
				if (
					member.mem_mems == this.state.searchDropdown ||
					this.state.searchDropdown == ''
				)
					return member
			})
			.filter(member => member.mem_fullname.indexOf(this.state.search) > -1)

		// member_count = members.length

		await this.setState({
			filteredMembers: members
		})

		// return members.map(user => (
		//     this.renderList({
		//         name: user.mem_fullname,
		//         membership: user.mem_mems,
		//         expiry: this.getExpiryText(user.mem_enddate),
		//         image: user.image,
		//         member: user
		//     })
		// ))
	}

	handleInputChange = async event => {
		await this.setState({
			[event.target.id]: event.target.value
		})
		this.renderMembers()
	}

	handleDropdown = async (e, data) => {
		await this.setState({
			[data.id]: data.value
		})
		this.renderMembers()
	}

	render() {
		return (
			<div>
				<Menu attached="top">
					<Dropdown
						open={false}
						item
						icon={
							this.state.parentCheckbox
								? 'check square outline'
								: 'square outline'
						}
						onClick={this.handleParentCheckboxClick}
					/>
					{/* <Menu.Item><Checkbox fitted/></Menu.Item> */}
					<Dropdown
						id="searchDropdown"
						item
						search
						selection
						className={classes.borderNone}
						placeholder="Choose the membership name"
						options={this.state.membershipDropdown}
						onChange={this.handleDropdown}
					/>
					<Menu.Item>
						<Popup
							trigger={
								<strong className={classes.strongText}>
									{this.state.filteredMembers.length}
									{this.state.filteredMembers.length == 1
										? ' member'
										: ' members'}
								</strong>
							}
							content="Number of users in the selected membership."
						/>
					</Menu.Item>
					<Menu.Item position="right">
						<Input
							className="transparent"
							id="search"
							type="text"
							icon="search"
							labelPosition="right"
							placeholder="Search members..."
							onChange={this.handleInputChange}
						/>
						<div className="results" />
					</Menu.Item>
				</Menu>
				<Segment attached="bottom">
					{/* {
                        this.renderMembers()
                    } */}
					{this.state.filteredMembers.map(user =>
						this.renderList({
							name: user.mem_fullname,
							membership: user.mem_mems,
							expiry: this.getExpiryText(user.mem_enddate),
							image: user.image,
							member: user
						})
					)}
				</Segment>
				{this.props.showAddMember ? (
					<AddMemberModal
						open={this.props.showAddMember}
						handleClose={this.props.handleClose}
						handleAddMember={this.handleAddMember}
						memberships={this.state.membershipDropdown}
					/>
				) : null}
				{this.state.showEditMember ? (
					<AddMemberModal
						open={this.state.showEditMember}
						handleClose={this.handleEditMemberClose}
						memberships={this.state.membershipDropdown}
						member_to_edit={this.state.member_to_edit}
						handleEditMember={this.handleEditMember}
					/>
				) : null}
				{this.props.showBulkAdd ? (
					<AddBulkMember
						open={this.props.showBulkAdd}
						handleClose={this.props.handleClose}
						memberships={this.state.membershipDropdown}
						handleAddMember={this.handleAddMember}
					/>
				) : null}
				{this.state.showDeleteMember ? (
					<DeleteMember
						open={this.state.showDeleteMember}
						handleClose={this.handleDeleteMemberModalClose}
						member_to_delete={this.state.member_to_delete}
						handleDeleteMember={this.handleDeleteMember}
					/>
				) : null}
				{this.state.showUserInfo ? (
					<UserInfoModal
						open={this.state.showUserInfo}
						user={Users}
						onClose={this.handleShowUserInfoModalClose}
					/>
				) : null}
				{this.props.showMessage ? (
					<MessageUser
						open={this.props.showMessage}
						handleClose={this.props.handleClose}
					/>
				) : null}
				{this.state.showMessageUser ? (
					<MessageUser
						open={this.state.showMessageUser}
						handleClose={this.handleShowMessageUserClose}
					/>
				) : null}
			</div>
		)
	}
}

export default Members
