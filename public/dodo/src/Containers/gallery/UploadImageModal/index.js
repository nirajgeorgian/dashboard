import React from 'react'
import {
	Modal,
	Header,
	Button,
	Icon,
	Form,
	Input,
	Image,
	Segment,
	Dimmer
} from 'semantic-ui-react'
// import Cropper from 'react-cropper'

// import { Cropper } from 'react-image-cropper'
import Cropper, { makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/lib/ReactCrop.scss'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import moment from 'moment'

import { setCurrentBusinessListFunc } from '../../../Actions/ActionsCreator/currentBusinessList/currentBusinessList'
import { bindActionCreators } from 'redux'

import config from '../../../Config/AwsConfig'
import classes from './UploadImageModal.local.scss'

import { API } from 'aws-amplify'
import { s3Upload } from '../../../Config/awsLib'

class UploadImageModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			title: '',
			description: '',
			file_src: '',
			filename: '',
			showCropper: false,
			show_dimmer: false,
			file: null,
			image_file: '',
			loading: false,
			crop: {
				x: 20,
				y: 10,
				aspect: 4 / 3
			}
		}
	}

	handleCropCancel = () => {
		this.setState({
			showCropper: false,
			file_src: '',
			image_file: '',
			crop: {
				x: 20,
				y: 10,
				aspect: 4 / 3
			}
		})
		// this.setState({ showCropper: false })
	}
	handleCropShow = () => {
		this.setState({ showCropper: true })
	}

	handelInputChange = e =>
		this.setState({
			[e.target.id]: e.target.value
		})

	handelUploadImage = async () => {
		// logic to add youtube video will go here
		await this.setState({
			loading: true
		})

		try {
			const uploadedImage = await s3Upload(this.state.file,"gallery")
			const photoData = {
				title: this.state.title,
				description: this.state.description,
				photo_dir: "gallery",
				photo_file: uploadedImage.Location,
				date: moment(new Date()).format('D MMMM YYYY hh:mm A')
			}

			const business = Object.assign({}, this.props.business)
			const previousPhotos = business.gallery.photos ? business.gallery.photos : []
			previousPhotos.push(photoData)
		
			const response = await API.put("business", `/update/${this.props.business.bizid}`, {
				body: {
					photos: previousPhotos
				}
			})
			
			business.gallery.photos = previousPhotos
			await this.props.setCurrentBusinessListFunc(business)
			console.log(response)
			
			this.setState({
				loading: false
			}, () => this.props.toggelUploadImageModal())

		} catch(e) {
			console.log(e)
			this.setState({
				loading: false
			})
		}
		
	}

	onDrop = files => {
		// let fileSize = files[0].size
		// this.props.showerrorMessage('')
		if (files && files[0].size > config.MAX_ATTACHMENT_LOGO_FILE) {
			// return
			// return this.props.showerrorMessage(
			//   'File size should not be greater than 300KB. Please upload a smaller size logo.'
			// )
		}
		console.log('file', files[0].preview)
		this.setState({
			file_src: files[0].preview
		})
		this.setState({ showCropper: true, filename: files[0].name })
	}
	_crop = () => {
		this.setState({
			file_src_data_url: this.refs.cropper.getCroppedCanvas().toDataURL()
		})
	}

	onReady = () => {
		const data = this.refs.cropper.getCropBoxData()
		if (data.height < data.width) data.width = data.height
		else {
			data.height = data.width
		}
		this.refs.cropper.setCropBoxData(data)
	}

	onCropEnd = () => {
		const data = this.refs.cropper.getCropBoxData()
		if (data.height < data.width) data.width = data.height
		else {
			data.height = data.width
		}
		this.refs.cropper.setCropBoxData(data)
	}

	dataURLtoFile(dataurl, filename) {
		let arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n)
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n)
		}
		return new File([u8arr], filename, { type: mime })
	}

	handleDoneCropping = e => {
		e.preventDefault()

		this.setState({
			showCropper: false,
			crop: {
				x: 20,
				y: 10,
				aspect: 4 / 3
			}
		})
	}

	handleShow = () => this.setState({ show_dimmer: true })
	handleHide = () => this.setState({ show_dimmer: false })

	showImageDimmer = () => {
		console.log(this.state.image_file === '')
		return (
			<Dimmer.Dimmable
				className={
					this.state.image_file === ''
						? classes.dropzone_wrapper
						: classes.dropzone_wrapper_wo_border
				}
				onMouseEnter={this.handleShow}
				onMouseLeave={this.handleHide}
				blurring
				as={Segment}
				dimmed={this.state.show_dimmer}
			>
				<Image className={classes.img} src={this.state.image_file} />
				<Dimmer inverted active={this.state.show_dimmer}>
					<Button onClick={this.removeImage} content="Remove" negative />
					<Button content="Change" positive />
				</Dimmer>
			</Dimmer.Dimmable>
		)
	}

	removeImage = e => {
		e.stopPropagation()
		this.setState({ image_file: '' })
	}

	handelImageLoaded = image => {
		console.log(image)

		this.setState({
			crop: makeAspectCrop(
				{
					x: 20,
					y: 5,
					aspect: 4 / 3,
					height: 50
				},
				4 / 3
			)
		})
	}

	onCropComplete = async (crop, pixelCrop) => {
		// console.log('onCropComplete, pixelCrop:', pixelCrop)
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
		// console.log(base64Image)

		// const file = await this.dataURLtoFile(base64Image, this.state.filename)

		// this.setState({
		//   image_file: URL.createObjectURL(file),
		//   file
		// })

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

	render() {
		const { open, toggelUploadImageModal } = this.props
		{
			return (
				<Modal onClose={toggelUploadImageModal} open={open} size="large">
					<Modal.Header>Upload Image</Modal.Header>
					<Modal.Content>
						<Form>
							<Form.Group widths={2}>
								<Form.Field width={6} required>
									<label>Image title</label>
									<Input
										action={{
											color: 'teal',
											icon: 'tag'
										}}
										actionPosition="left"
										type="text"
										placeholder="e.g. Tour of the Sports Centre"
										id="title"
										onChange={this.handelInputChange}
									/>
								</Form.Field>
								<Form.Field width={10} required>
									<label>Image Description</label>
									<Input
										action={{
											color: 'teal',
											icon: 'info'
										}}
										actionPosition="left"
										type="text"
										placeholder="e.g. Video explains about the overall sections of the building."
										id="description"
										onChange={this.handelInputChange}
									/>
								</Form.Field>
							</Form.Group>
							<Dropzone
								accept="image/*"
								multiple={false}
								onDrop={this.onDrop}
								className={
									this.state.image_file === ''
										? classes.dropzone_wrapper
										: classes.dropzone_wrapper_wo_border
								}
							>
								{this.state.image_file === '' ? (
									<p>Drag & Drop you image or Click here to upload image.</p>
								) : (
									this.showImageDimmer()
								)}
							</Dropzone>
						</Form>
					</Modal.Content>
					<Modal.Actions>
						<Button onClick={toggelUploadImageModal} negative disabled={this.state.loading}>
							Cancel
						</Button>
						<Button
							onClick={this.handelUploadImage}
							positive
							icon
							labelPosition="right"
							loading={this.state.loading}
						>
							Add
							<Icon name="checkmark" />
						</Button>
					</Modal.Actions>
					{this.state.showCropper && this.showCropperModal()}
				</Modal>
			)
		}
	}
}

function mapStateToProps(state) {
	return {
		business: state.currentBusinessList
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ setCurrentBusinessListFunc }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadImageModal)
