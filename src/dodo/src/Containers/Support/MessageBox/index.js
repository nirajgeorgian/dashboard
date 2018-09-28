import React from 'react'
import {
	Header,
	Icon,
	Popup,
	Modal,
	Comment,
	TextArea,
	Button,
	Image,
	Dimmer,
	Message
} from 'semantic-ui-react'
import download from  'downloadjs';
import Cropper, { makeAspectCrop } from 'react-image-crop'
import uuid from 'uuid/v4'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'
import classes from './MessageBox.local.scss'
import BlockUserModal from '../BlockUserModal'
import UserInfoModal from '../UserInfoModal'
import * as firebase from 'firebase'
import { publishMessageToSns, s3UploadChat } from '../../../Config/awsLib'
import { Users } from '../MockSupportData'

var rootRef = null
const conversationId = uuid()
class MessageBox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showBlockUserModal: false,
			showUserInfoModal: false,
			messages: [],
			blocked: false,
			favourite: false,
			blocked_by: '',
			user: { ...props.user },
			crop: {
				x: 20,
				y: 10,
				aspect: 4 / 3
			}
		}
	}

 	async componentDidMount() {
		rootRef = firebase.database()
		var name = ''

		await rootRef.ref('conversations/' + this.state.user.conversationId).on('value',async snapshot => {
			var data = await snapshot.val()
			var users = Object.keys(data.favourites)
			console.log("Got messages: ",data,this.state.user);
			var notify_user = users.filter(item => item != this.props.currentUser[4].Value.split(' ')[0]).filter(item => item!= this.state.user.name.split(' ')[0])
			console.log(notify_user)
			if(this.state.user.name.indexOf(users[0]) > -1 || this.state.user.name.indexOf(users[1]) > -1){
				var list = data.messages
				var obj = {...data.favourites}
				var obj1 = { favourite: false}
				if(Object.keys(obj).length != 0){
					var obj1 = obj[this.props.currentUser[4].Value.split(' ')[0]]
				}
				var arr = Array.from(Object.keys(list), k => list[k])
				this.setState({
					messages: arr,
					blocked: data.blocked,
					blocked_by: data.blocked_by,
					favourite: obj1.favourite
				})
			}

		})
	}


	makeid() {
	  var text = "";
	  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	  for (var i = 0; i < 5; i++)
	    text += possible.charAt(Math.floor(Math.random() * possible.length));

	  return text;
	}

	handleCropCancel = () => {
		this.setState({
			showCropper: false,
			file_src: '',
			image_file: '',
			file: null,
			showCropper: false,
			crop: {
				x: 20,
				y: 10,
				aspect: 4 / 3
			}
		})
	}

	onCropComplete = async (crop, pixelCrop) => {
		const canvas = document.createElement('canvas')
		canvas.width = pixelCrop.width
		canvas.height = pixelCrop.height
		const ctx = canvas.getContext('2d')
		const image = document.querySelector('.ReactCrop__image')
		ctx.drawImage(
			image,
			pixelCrop.x,
			pixelCrop.y,
			pixelCrop.width,
			pixelCrop.height,
			0,
			0,
			pixelCrop.width,
			pixelCrop.height
		)

		const base64Image = canvas.toDataURL()

		const arr = base64Image.split(',')
		const mime = arr[0].match(/:(.*?);/)[1]

		new Promise((resolve, reject) => {
			canvas.toBlob(file => {
				file.name = this.state.filename
				resolve(file)
			})
		}).then(x => {
			const file = new File([x], this.state.filename, { type: mime })
			this.setState({ image_file: URL.createObjectURL(file), file })
		})
	}

	handleDoneCropping = async e => {
		e.preventDefault()

		var file = this.state.file
	  	file['ext'] = this.state.file.type.split('/')[1]
		this.setState({
			file: file
		})
		const zozo = await s3UploadChat(this.state.file,this.state.user.conversationId.substring(1,6))
		// console.log(zozo);
		rootRef.ref('conversations/' + this.props.user.conversationId + '/messages').push({
			type: "image",
			image_url: zozo.Location,
			status: "sent",
			sender: this.props.currentUser[0].Value,
			sender_name: this.props.currentUser[4].Value,
			time: new Date().toLocaleString()
		})
		this.setState({
			showCropper: false,
			crop: {
				x: 20,
				y: 10,
				aspect: 4 / 3
			}
		})
	}

	showBlockUserModal = e => {
		this.setState(state => ({ showBlockUserModal: true }))
	}
	hideBlockUserModal = e => {
		this.setState(state => ({ showBlockUserModal: false }))
	}
	async componentWillReceiveProps(props) {
		await this.setState({ user: { ...props.user } })
		rootRef = firebase.database()

		await rootRef.ref('conversations/' + this.state.user.conversationId).on('value',async snapshot => {
			var data = await snapshot.val()
			var users = Object.keys(data.favourites)
			console.log("Got messages: ",data,this.state.user);
			var notify_user = users.filter(item => item != this.props.currentUser[4].Value.split(' ')[0]).filter(item => item!= this.state.user.name.split(' ')[0])
			console.log(notify_user)
			this.props.handleNotification(notify_user)
			if(this.state.user.name.indexOf(users[0]) > -1 || this.state.user.name.indexOf(users[1]) > -1){
				var list = data.messages
				var obj = {...data.favourites}
				var obj1 = { favourite: false}
				if(Object.keys(obj).length != 0){
					var obj1 = obj[this.props.currentUser[4].Value.split(' ')[0]]
				}
				var arr = Array.from(Object.keys(list), k => list[k])
				this.setState({
					messages: arr,
					blocked: data.blocked,
					blocked_by: data.blocked_by,
					favourite: obj1.favourite
				})
			}
		})
	}

	showUserInfoModal = e => {
		this.setState(state => ({ showUserInfoModal: true }))
	}

	hideUserInfoModal = e => {
		this.setState(state => ({ showUserInfoModal: false }))
	}
	renderBlockUserModal = () => {
		return (
			<BlockUserModal
				name={this.state.user.name}
				open={this.state.showBlockUserModal}
				onClose={this.hideBlockUserModal}
				blockUser={this.handleBlockUser}
			/>
		)
	}

	handleBlockUser = () => {
		rootRef.ref('conversations/' + this.state.user.conversationId).update({
			blocked: true,
			blocked_by: this.props.currentUser[4].Value
		}).then(() => this.hideBlockUserModal())

	}

	onDrop = async files => {
		var file = files[0]
	  	file['ext'] = file.type.split('/')[1]
		await this.setState({
			file: file
		})
		// console.log(this.state.file);
		if(file.type.split('/')[0] == 'image'){
			this.setState({
				file_src: files[0].preview,
				filename: files[0].name,
				showCropper: true
			})
		}
		else {
			this.setState({
				filename: file.name,
				showCropper: false
			})
			// console.log(this.state.file);
			const zozo = await s3UploadChat(this.state.file,this.state.user.conversationId.substring(1,6))
			// console.log(zozo);
		  await rootRef.ref('conversations/' + this.props.user.conversationId + '/messages').push({
				type: this.state.file.type.split('/')[0],
				audio_url: zozo.Location,
				status: "sent",
				filename: this.state.filename,
				sender: this.props.currentUser[0].Value,
				sender_name: this.props.currentUser[4].Value,
				time: new Date().toLocaleString()
			}).then(() => this.setState({ message: ''}))
		}

	}

	renderUserInfoModal = () => (
		<UserInfoModal
			onClose={this.hideUserInfoModal}
			open={this.state.showUserInfoModal}
			user={this.state.user}
		/>
	)

	showCropperModal = () => {
		return (
			<Modal
				size={'small'}
				open={this.state.showCropper}
				closeOnDimmerClick={false}
				className="ui coupled modal mini"
			>
				<Modal.Header className="header">
					<center>
						<div className="row">
							<br />Crop Image
						</div>
					</center>
				</Modal.Header>
				<Modal.Content style={{ width: '100%', position: 'relative' }}>
					<center>
						<Cropper
							onChange={crop => {
								this.setState({ crop })
							}}
							crop={this.state.crop}
							onComplete={this.onCropComplete}
							src={this.state.file_src}
							style={{
								width: 'auto',
								height: '50vh',
								border: '1px dashed #00b5ad'
							}}
							imageStyle={{ width: 'auto', height: '100%' }}
						/>
						<br />
						<br />
						<Button
							icon
							labelPosition="right"
							onClick={this.handleDoneCropping}
							loading={this.state.loading}
							className={'ui blue right labeled icon button '}
						>
							Done Cropping<Icon className="check" />
						</Button>
						<Button
							icon
							labelPosition="right"
							loading={this.state.loading}
							onClick={this.handleCropCancel}
							className={
								'ui red right labeled icon button ' + classes.marginLeft
							}
						>
							Cancel<Icon className="close" />
						</Button>
					</center>
					{/* </Modal.Description> */}
				</Modal.Content>
			</Modal>
		)
	}

	renderMessage = ({ author, time, message, name }) => (
		<Comment className={classes.message_item} key={time}>
			<Comment.Content>
				<Comment.Author as="a">{name}</Comment.Author>
				<Comment.Text>{message}</Comment.Text>
				<Comment.Metadata>
					<div>{time}</div>
				</Comment.Metadata>
			</Comment.Content>
		</Comment>
	)

  	handleFavourite = () => {
		// this.setState(state => ({
		// 	user: { ...state.user, favourite: !state.user.favourite }
		// }))
		this.setState({
			favourite: !this.state.favourite
		})

	  	rootRef.ref('conversations/' + this.state.user.conversationId + '/favourites/' + this.props.currentUser[4].Value.split(' ')[0]).set({
			favourite: !this.state.favourite
		 })
	}

	sendMessage = e => {
		// var messageId = this.makeid()
		const conversationRef = rootRef.ref('conversations/' + this.props.user.conversationId + '/messages').push({
			type: "text",
			text: this.state.message,
			status: "sent",
			sender: this.props.currentUser[0].Value,
			sender_name: this.props.currentUser[4].Value,
			time: new Date().toLocaleString()
		}).then(() => this.setState({ message: ''}))
	}

	handleMessageChange = e => {
		this.setState({
			message: e.target.value
		})
	}

	unBlockUser = () => {
		rootRef.ref('conversations/' + this.state.user.conversationId).update({
			blocked: false,
			blocked_by: ''
		})
	}

	textAreaForBlocked = () => {
		if(this.props.currentUser[4].Value == this.state.blocked_by){
			return (
				<div className={classes.message_input_container}>
					<h4>This user is blocked.<a onClick={this.unBlockUser} style={{ cursor: 'pointer'}}>Click to unblock</a></h4>
				</div>
			)
		} else {
			return (
				<div className={classes.message_input_container}>
					<h4>You have been blocked by this user</h4>
				</div>
			)
		}

	}

	textAreaForNormal = () => {
		return (
			<div className={classes.message_input_container}>
				<TextArea
					placeholder="Type a message..."
					value={this.state.message}
					onChange={this.handleMessageChange}
					className = {classes.messageinput}
				/>
				<Dropzone
					multiple={false}
					onDrop={this.onDrop}
					className={classes.send_image}
				>
					<Icon name="image" />
				</Dropzone>
				<Button className={classes.send_button} primary onClick={this.sendMessage}>
					Send
				</Button>
			</div>
		)
	}

	renderImage = ({ author, time, image_url, name }) => (
		<Comment className={classes.message_item} key={time}>
			<Comment.Content>
				<Comment.Author as="a">{name}</Comment.Author>
				<Image src={image_url} className={classes.chatImage} />
				<Comment.Metadata>
					<div>{time}</div>
				</Comment.Metadata>
			</Comment.Content>
		</Comment>
	)

	renderAudio = ({ author, time, audio_url, name, file_name }) => (
		<Comment className={classes.message_item} key={time}>
			<Comment.Content>
				<Comment.Author as="a">{name}</Comment.Author>
				<Message icon size='small' className={classes.forAudio}>
					<Icon name='download' onClick={() => download(audio_url)} style={{ cursor: 'pointer'}}/>
					<Message.Content>
      				<Message.Header>{file_name}</Message.Header>
					Click the icon to download the file
    				</Message.Content>
				</Message>
				<Comment.Metadata>
					<div>{time}</div>
				</Comment.Metadata>
			</Comment.Content>
		</Comment>
	)

	render() {
		return (
			<div className={classes.container}>
				{this.state.showBlockUserModal && this.renderBlockUserModal()}
				{this.state.showUserInfoModal && this.renderUserInfoModal()}
				<div className={classes.messagebox_header}>
					<Header className={classes.name} as="h4">
						{this.state.user.name}
					</Header>
					<Popup
						trigger={
							<div className={classes.favourite}>
								<Icon
									onClick={this.handleFavourite}
									name={this.state.favourite ? 'star' : 'empty star'}
								/>
							</div>
						}
						content="Favourite"
					/>

					<Popup
						trigger={
							<div
								onClick={this.showUserInfoModal}
								className={classes.user_info}
							>
								<Icon name="user" />
							</div>
						}
						content="User Info"
					/>
					<Popup
						trigger={
							<div
								onClick={this.showBlockUserModal}
								className={classes.block_user}
							>
								<Icon name="ban" />
							</div>
						}
						content="Block"
					/>
				</div>
				<div className={classes.chatbox}>
					<Comment.Group className={classes.message_container}>
						{
							this.state.messages.map((message) =>{
								// console.log(message);
								if(message != 0){
									if(message.type == 'text' && message.filename == undefined) {
										return this.renderMessage({
											author: message.sender,
											time: message.time,
											message: message.text,
											name: message.sender_name
										})
									} else if(message.type == 'image'){
										return this.renderImage({
											author: message.sender,
											time: message.time,
											image_url: message.image_url,
											name: message.sender_name
										})
									} else {
										return this.renderAudio({
											author: message.sender,
											time: message.time,
											audio_url: message.audio_url,
											name: message.sender_name,
											file_name: message.filename,
											mime_type: message.mime_type
										})
									}
								}
							})
						}

					</Comment.Group>
					{
						this.state.blocked ? this.textAreaForBlocked() : this.textAreaForNormal()
					}

				</div>
				{this.state.showCropper && this.showCropperModal()}
			</div>
		)
	}
}

function mapStateToProps(state) {
		return {
			currentUser: state.currentUser
		}
}


export default connect(mapStateToProps,null)(MessageBox)
