import React from 'react'
import { connect } from 'react-redux'
import { Input, Portal } from 'semantic-ui-react'
import * as firebase from 'firebase'
import uuid from 'uuid/v4'
import classes from './Support.local.scss'
import UserListItem from './UserListItem'
import MessageBox from './MessageBox'
import { Users } from './MockSupportData'
import Notification from './Notification'

class Support extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			search: '',
			active: 0,
			activeUser: Users[0],
			users: [...Users],
			conversationIds: null,
			showNotification: false,
			per_users: null,
			notify_users: []
		}
	}

	async componentDidMount() {

		const rootRef = firebase.database()


		//for support team
		if(this.props.currentUser[0].Value == 'f7ca4bc6-9342-40b5-87c3-932ab19e6d86'){
				console.log("From support team");

				//fetch all conversationId of support-team and attach a listener after promise resolves
				await rootRef.ref('support-team/' + 'f7ca4bc6-9342-40b5-87c3-932ab19e6d86' + '/conversations').once('value').then(async snapshot => {
					this.setState({
						conversationIds: await snapshot.val()
					})
				}).then(async () => {
					await rootRef.ref('support-team/' + 'f7ca4bc6-9342-40b5-87c3-932ab19e6d86' + '/conversations').on('value', async snapshot =>{
						this.setState({
							conversationIds: await snapshot.val()
						})
						var users = []
						var id = 0
						//get all users from conversationIds onChange
						for(var item in this.state.conversationIds){
							var zozo = this.state.conversationIds[item]
							zozo['conversationId'] = item
							zozo['id'] = ++id
							users.push(zozo)
						}
						console.log(this.state.active);
						this.setState({
							users: users,
							per_users: users,
							activeUser: users[this.state.active]
						})
					})
				})

				var users = []
				var id = 0
				//get all users from first time
				for(var item in this.state.conversationIds){
					var zozo = this.state.conversationIds[item]
					zozo['conversationId'] = item
					zozo['id'] = ++id
					users.push(zozo)
				}

				console.log(users);

				this.setState({
					users: users,
					per_users: users,
					activeUser: users[0]
				})
				var list = {}
				// fetch the conversations through the conversatipnIds
				// for(var item in this.state.conversationIds){
				// 	await rootRef.ref('conversations/' + item).once('value').then(async snapshot => {
				// 		// list[item] = await snapshot.val()
				// 	})
				// 	.then(async () => {
				// 		await rootRef.ref('conversations/' + item + '/messages').on('value', async snapshot => {
				// 				// list[item]['messages'] = await snapshot.val()
				// 				// this.setState({
				// 				// 	support_conv: list
				// 				// })
				// 				console.log(snapshot.val());
				// 		})
				// 	})
				// }
		} else {

			await rootRef.ref('users/' + this.props.currentUser[0].Value + '/conversations').once('value').then(async snapshot => {
				this.setState({
					conversationIds: await snapshot.val()
				})
			})
			// to get all conversationIds of the user

			if(this.state.conversationIds != null) {
				var test_user = this.state.activeUser
				test_user['conversationId'] = Object.keys(this.state.conversationIds)[0]
				this.setState({
					activeUser: test_user
				})
			}

			if(this.state.conversationIds == null){
				var conversationId = uuid()
				const sagepassCognitoId = 'f7ca4bc6-9342-40b5-87c3-932ab19e6d86'
				const startedOn = new Date().toLocaleString()
				var test_user = this.state.activeUser
				test_user['conversationId'] = conversationId
				await rootRef.ref('support-team/' + sagepassCognitoId + '/conversations/' + conversationId).set({
					startedOn: startedOn,
					user: this.props.currentUser[0].Value,
					name: this.props.currentUser[4].Value
				})
				.then(() => {
					rootRef.ref('users/' + this.props.currentUser[0].Value + '/conversations/' + conversationId).set({
						startedOn: startedOn
					})
				})
				.then(() => {
					rootRef.ref('conversations/' + conversationId + '/messages').set({
						count: 0
					})
				})
				.then(() => this.setState({ conversationIds: conversationId}))
				.then(() => {
					rootRef.ref('conversations/' + conversationId + '/messages').on('value', async snapshot => {
						var list = await snapshot.val()
						var message_list = list.messages
						var arr = Array.from(Object.keys(message_list), k => message_list[k])
						this.setState({
							messages: arr,
							activeUser: test_user
						})
					})
				})
			}
		}
	}

	handelSearchChange = e => {
		this.setState({ [e.target.id]: e.target.value })
	}

	handelUserClick = id => {
		this.setState({
			active: id,
			activeUser: this.state.users[this.findActiveUserIndex(id)],
		})
	}

	findActiveUserIndex = id => this.state.users.findIndex(user => user.id === id)

	getSearchedUser(){
		return this.state.users.filter(res => res.name.indexOf(this.state.search) > -1).map(user => (
			<UserListItem
				onUserClick={this.handelUserClick}
				userId={user.id}
				active={this.state.active === user.id}
				image={user.image}
				name={user.name}
				key={user.id}
			/>
		))
	}

	handleMessageClick = user => {
		// console.log(user)
		var demo = this.state.users.filter(item => item.name.split(' ')[0] == user)
		this.setState({
			active: demo[0].id,
			activeUser: demo[0]
		})
		console.log(this.state.activeUser);
	}

	handleDismiss = e => {
		console.log("removed")
		e.stopPropagation()
	}

	renderNotification = () => {
		return (
			<Portal open={true} className={classes.portal}>
				<div>
					{
						this.state.notify_users.map(user => {
							return (
								<Notification
									username={user}
									handleClick={() => this.handleMessageClick(user)}
									handleDismiss={this.handleDismiss}
								/>	
							)
						})
					}
				</div>	
			</Portal>	
		)
	}

	handleNotification = users => {
		this.setState({
			notify_users: users
		})
	}
	
	render() {
		if(this.state.conversationIds == null){
			return (
				<div>Loading...</div>
			)
		} else {
			return (
				<div className={classes.container}>
					<div className={classes.sidebar}>
						<div className={classes.searchbox}>
							<Input
								className={classes.usersearch}
								icon="search"
								id="search"
								onChange={this.handelSearchChange}
								placeholder="Search users..."
							/>
							{
								this.state.notify_users.length ? 
									this.renderNotification() : null
							}
						</div>
						<div className={classes.userlist}>
							{
								this.getSearchedUser()
							}
						</div>
					</div>
					<div className={classes.messageBox}>
						{
							this.state.activeUser.conversationId ?
								<MessageBox user={this.state.activeUser} handleNotification={this.handleNotification} />
								: null
						}

					</div>
				</div>
			)
		}
	}
}

function mapStateToProps(state){
		return {
			currentUser: state.currentUser
		}
}

export default connect(mapStateToProps, null)(Support)
