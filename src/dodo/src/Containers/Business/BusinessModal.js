import crypto from 'crypto'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
// import Cropper from 'react-cropper'
import Cropper, { makeAspectCrop } from 'react-image-crop'
import 'cropperjs/dist/cropper.css'
import {
	Modal,
	Image,
	Header,
	Form,
	Input,
	Label,
	TextArea,
	Dropdown,
	Checkbox,
	Button,
	Icon,
	Dimmer
} from 'semantic-ui-react'
import config from '../../Config/AwsConfig'
import wireframe from '../../assests/img/wireframe.png'
import { invokeApig, s3Upload, invokeTestApig } from '../../Config/awsLib'
import {
	clearMessage,
	isLoading,
	userLogout,
	showerrorMessage
} from '../../Actions'
import DatePicker from 'react-datepicker'
import classes from './businessModel.local.scss'
import Datetime from 'react-datetime'
import moment from 'moment'
import TimePopup from '../../Components/UI/TimePopup/index'
import TimePicker from '../../Components/UI/TimePicker'
import { API } from 'aws-amplify'
import { getBusinessesList } from '../../Actions/ActionsCreator/BusinessList/BusinessListAction'

import { showLoading } from '../../Actions/ActionsCreator/LoginAction/LoginAction'

import AutoComplete, {
	geocodeByAddress,
	getLatLng,
	getDetails
} from '../../Components/UI/AutoComplete/index'

var dropzoneRef

const country = [
	{ key: 'india', value: 'India', text: 'India', flag: 'in' },
	{ key: 'uk', value: 'UK', text: 'UK', flag: 'gb' }
]

const types = [
	{ key: '0', value: '0', text: 'Gym' },
	{ key: '1', value: '1', text: 'Sports Centre' },
	{ key: '2', value: '2', text: 'Sports Club' }
]

const branches = [
	{ key: '0', value: '0', text: '1' },
	{ key: '1', value: '1', text: '2' },
	{ key: '2', value: '2', text: '3' },
	{ key: '3', value: '3', text: '4 & More' }
]

const timing = [
	{ key: '0', value: '0', text: '24 Hours x 7 Days' },
	{ key: '1', value: '1', text: 'All Days' },
	{ key: '2', value: '2', text: 'Weekdays Only' },
	{ key: '3', value: '3', text: 'All Days except Sunday' }
]
var file_src = ''

var checkedUrl = false

class BusinessModal extends Component {
	state = {
		closingTimePopUp: false,
		openingTimePopUp: false,
		business_name: '',
		business_page: '',
		info_name: '',
		info_contact: '',
		info_email: '',
		info_description: '',
		location_address1: '',
		postal_code: '',
		business_branch: '',
		location_address2: '',
		country: '',
		operating_hours: '',
		business_state: '',
		operating_time: '', //moment(),
		closing_time: '',
		uploadedImageUrl: '',
		filename: '',
		checkbox: false,
		location_lat: 0,
		location_lng: 0,
		urlValid: false,
		timerState: false,
		isUrlValid: true,
		logo_file: '',
		loading_page_state: false,
		url_icon: '',
		showCropper: false,
		src: '',
		loading: false,
		show_dimmer: false,
		crop: {
			x: 20,
			y: 10,
			aspect: 1
		},
		image_file: '',
		file: null
	}

	async componentDidMount() {
		const arr = Object.keys(this.state)
		var data = {}
		for (var i = 0, len = arr.length; i < len; i++) {
			try {
				if (localStorage.getItem(arr[i]) !== null) {
					data[arr[i]] = JSON.parse(localStorage.getItem(arr[i]))
				}
			} catch (e) {
				console.log(e.message)
			}
			// console.log(arr[i])
		}
		this.setState({ ...data })
		if (this.state.business_state == 0) {
			this.setState({
				operating_time: '12:00 AM',
				closing_time: '12:00 AM',
				timerState: true
			})
		}
	}

	_crop = () => {
		file_src = this.refs.cropper.getCroppedCanvas().toDataURL()
	}

	onDrop = files => {
		// let fileSize = files[0].size
		this.props.showerrorMessage('')
		if (files && files[0].size > config.MAX_ATTACHMENT_LOGO_FILE) {
			return this.props.showerrorMessage(
				'File size should not be greater than 300KB. Please upload a smaller size logo.'
			)
		}
		this.setState({
			src: files[0].preview
		})
		// // crypto.randomBytes(4,async (err, buf) => {
		// //   if (err) throw err
		// //   this.state.logo_file = files[0]
		// //   this.state.logo_dir = buf.toString('hex')
		// //   try {
		// //     const uploadedFilename = this.state.logo_file.name
		// //     if(uploadedFilename) {
		// //       const dodo = await s3Upload(this.state.logo_file)
		// //       this.setState({
		// //         uploadedImageUrl: dodo.Location
		// //       })
		// //     }
		// //     // ? console.log((await s3Upload(this.state.logo_file)))
		// //     // : null
		// //     this.setState({
		// //       attachment: uploadedFilename
		// //     })
		// //   } catch (e) {
		// //     console.log(e.message)
		// //   }
		// // })
		this.setState({ showCropper: true, filename: files[0].name })
	}

	validator = () => {
		return (
			this.state.business_name.length &&
			this.state.business_page.length &&
			this.state.info_name.length &&
			this.state.info_contact.length &&
			this.state.info_email.length &&
			this.state.info_description.length &&
			this.state.location_address1.length &&
			this.state.postal_code.length &&
			this.state.location_address2.length &&
			this.state.country.length &&
			this.state.operating_hours.length &&
			this.state.business_branch.length &&
			this.state.business_state.length &&
			this.state.isUrlValid &&
			this.state.checkbox
		)
	}
	handleInputChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		})
		localStorage.setItem(event.target.id, JSON.stringify(event.target.value))
	}

	checkPageUrl = s => {
		// console.log('checking')
		return /^[a-zA-Z0-9_]+$/g.test(s)
	}

	// handleUrlChange = async event => {
	//   this.setState({
	//     [event.target.id]: event.target.value
	//   })

	//   const value = event.target.value
	//   console.log('checked url', checkedUrl)
	//   setTimeout(() => {
	//     console.log('Inside timeout')
	//     if (this.checkPageUrl(value)) checkedUrl = true
	//     else checkedUrl = false
	//   }, 2000)

	//   if (checkedUrl) {
	//     console.log(this.checkPageUrl(event.target.value))
	//     this.setState({
	//       url_icon: '',
	//       loading_page_state: false,
	//       isUrlValid: false
	//     })
	//     localStorage.setItem(event.target.id, JSON.stringify(event.target.value))
	//   } else {
	//     console.log(checkedUrl)
	//     console.log('Wrong value')
	//   }
	// }

	handleUrlChange = async e => {
		const value = e.target.value
		e.persist()

		if (value === '')
			return this.setState({
				[e.target.id]: value,
				isUrlValid: true,
				url_icon: ''
			})

		const response = await API.post('business', '/page', {
			body: {
				url: value
			}
		})

		// console.log(response);
		// console.log('response: ', response)

		const { Page_Exists } = response

		setTimeout(() => {
			const isUrlValid = this.checkPageUrl(value)

			this.setState({
				[e.target.id]: value,
				isUrlValid: isUrlValid && !Page_Exists,
				url_icon: isUrlValid && !Page_Exists ? '' : 'close'
			})
		}, 1000)
	}

	handleDropbox = (e, data) => {
		if (data.id == 'business_state') {
			if (data.value == 0) {
				this.setState({
					operating_time: '12:00 AM',
					closing_time: '12:00 AM',
					timerState: true
				})
			} else {
				this.setState({
					operating_time: '06:00 AM',
					closing_time: '10:00 PM',
					timerState: false
				})
			}
		}
		localStorage.setItem(data.id, JSON.stringify(data.value))
		return this.setState({ [data.id]: data.value })
	}

	handleCheckbox = (event, data) => {
		this.setState({
			[data.id]: data.checked
		})
	}

	checkUrl = url => {
		console.log(url)
		if (checkedUrl) {
			return API.post('business', '/page', {
				body: {
					url: url
				}
			})
		}
	}

	createBusiness = business => {
		console.log(business)
		return API.post('business', '/create', {
			body: business
		})
	}

	handleFormSubmit = async event => {
		event.preventDefault()
		console.log(this.state)
		this.props.showLoading()
		try {
			const data = await s3Upload(this.state.file, 'businesslogos')
			console.log(data)
			this.setState({
				logo_file: data.Location
			})
			let businessData = await this.createBusiness(this.state)
			await this.props.getBusinessesList()
			console.log(businessData)
			let final = Object.keys(this.state)
			for (var i = 0, len = final.length; i < len; ++i) {
				localStorage.removeItem(final[i])
			}
			this.props.showLoading()
			if (this.props.match.path == '/') this.props.history.push('/home')
		} catch (e) {
			this.props.showLoading()
			console.log(e.message)
		}
	}

	dropZone = () => {
		return (
			<Dropzone
				accept="image/*"
				multiple={false}
				onDrop={this.onDrop}
				className={
					this.state.uploadedImageUrl === ''
						? 'ui small left floated ' + classes.img_responsive
						: 'ui small left floated ' + classes.img_responsive_without_border
				}
			>
				{<p>Please click here to upload or Drag & drop your logo.</p>}
			</Dropzone>
		)
	}
	onChange = address => {
		this.setState({
			location_address1: address
		})
	}

	dataURLtoFile(dataurl, filename) {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n)
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n)
		}
		return new File([u8arr], filename, { type: mime })
	}

	// handleDoneCropping = async e => {
	//   e.preventDefault()
	//   this.setState({ loading: true })
	//   var file = await this.dataURLtoFile(file_src, this.state.filename)

	//   let fileSize = file.size
	//   crypto.randomBytes(4, async (err, buf) => {
	//     if (err) throw err
	//     this.state.logo_file = file
	//     this.state.logo_dir = buf.toString('hex')
	//     try {
	//       const uploadedFilename = this.state.logo_file.name
	//       if (uploadedFilename) {
	//         const dodo = await s3Upload(this.state.logo_file)
	//         this.setState({
	//           uploadedImageUrl: dodo.Location,
	//           loading: false,
	//           showCropper: false
	//         })
	//       }
	//     } catch (e) {
	//       console.log(e.message)
	//     }
	//   })
	// }

	handleDoneCropping = e => {
		e.preventDefault()

		this.setState({
			showCropper: false,
			crop: {
				x: 20,
				y: 10,
				aspect: 1
			}
		})
	}

	onCropComplete = async (crop, pixelCrop) => {
		// console.log('onCropComplete, pixelCrop:', pixelCrop)
		const canvas = document.createElement('canvas')
		const image = document.querySelector('.ReactCrop__image')

		canvas.width = pixelCrop.width
		canvas.height = pixelCrop.height

		const ctx = canvas.getContext('2d')
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
			var file = new File([x], this.state.filename, { type: mime })
			file['ext'] = file.type.split('/')[1]
			this.setState({ image_file: URL.createObjectURL(file), file })
		})
	}

	handleCancel = e => {
		if (this.state.image_file !== '') {
			this.setState({
				image_file: ''
			})
		}
		this.setState({
			showCropper: false,
			crop: {
				x: 20,
				y: 10,
				aspect: 1
			}
		})
	}

	onFileInputChange = e => {
		e.preventDefault()
		let files
		if (e.dataTransfer) {
			files = e.dataTransfer.files
		} else if (e.target) {
			files = e.target.files
		}
		const reader = new FileReader()
		reader.onload = () => {
			this.setState({ src: reader.result, showCropper: true })
		}
		reader.readAsDataURL(files[0])
		this.setState({
			filename: files[0].name
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

	handleMouseEnter = () => {
		this.setState({ show_dimmer: true })
	}

	handleMouseLeave = () => {
		this.setState({ show_dimmer: false })
	}

	onImageChangeClick = e => {
		var element = ReactDOM.findDOMNode(this.refs.input_ref).click()
	}

	onImageRemoveClick = () => {
		this.setState({ image_file: '' })
	}

	handleImageChange = e => {
		var files = e.target.files
		if (files && files[0].size > config.MAX_ATTACHMENT_LOGO_FILE) {
			return this.props.showerrorMessage(
				'File size not be greater than 300 KB. Please upload a smaller size logo.'
			)
		}

		// var blob = new Blob(files[0], {type : 'image/*'});
		// console.log(blob);
		var url = URL.createObjectURL(files[0])
		this.setState({
			src: url
		})
		this.setState({ showCropper: true, filename: files[0].name })
	}

	showImageDimmer = () => {
		return (
			<div
				className={classes.img_responsive_without_border}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
			>
				<Dimmer.Dimmable as={Image} dimmed={this.state.show_dimmer}>
					<Dimmer
						active={this.state.show_dimmer}
						onClickOutside={this.handleMouseLeave}
					>
						<Icon
							name="exchange"
							size="large"
							onClick={this.onImageChangeClick}
						>
							<input
								type="file"
								ref="input_ref"
								style={{ display: 'none' }}
								onChange={this.handleImageChange}
							/>
						</Icon>
						<Icon name="close" size="large" onClick={this.onImageRemoveClick} />
					</Dimmer>
					<Image
						src={this.state.image_file}
						floated="left"
						className={classes.img_responsive_without_border}
					/>
				</Dimmer.Dimmable>
			</div>
		)
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
				<Modal.Content style={{ width: '100%' }}>
					<Modal.Description className="content" style={{ width: '100%' }}>
						<center>
							{/* <Cropper
                background={false}
                ref="cropper"
                viewMode={1}
                modal={false}
                minCropBoxWidth={200}
                minCropBoxHeight={200}
                ready={this.onReady}
                cropend={this.onCropEnd}
                src={this.state.src}
                style={{ height: 400, width: '100%' }}
                aspectratio={16 / 9}
                guides={false}
                crop={this._crop}
              /> */}
							<Cropper
								onChange={crop => {
									this.setState({ crop })
								}}
								crop={this.state.crop}
								onComplete={this.onCropComplete}
								src={this.state.src}
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
								loading={this.props.loading}
								onClick={this.handleDoneCropping}
								loading={this.state.loading}
								className={'ui blue right labeled icon button '}
							>
								Done Cropping<Icon className="check" />
							</Button>
							<Button
								icon
								labelPosition="right"
								loading={this.props.loading}
								onClick={this.handleCancel}
								className={
									'ui red right labeled icon button ' + classes.marginLeft
								}
							>
								Cancel<Icon className="close" />
							</Button>
						</center>
					</Modal.Description>
				</Modal.Content>
			</Modal>
		)
	}

	handleSelect = address => {
		this.setState({
			location_address1: address
		})
		var a = {}
		geocodeByAddress(this.state.location_address1)
			.then(results => {
				a = this.state.location_address1.split(',')
				return getDetails(results, a[a.length - 2].trim())
			})
			.then(data => {
				var city = a[a.length - 3].trim()
				var country = a[a.length - 1].trim()
				if (data.postal_code != null) {
					this.setState({
						country: country,
						location_address2: city,
						postal_code: data.postal_code,
						location_lat: data.lat,
						location_lng: data.lng
					})
				} else {
					this.setState({
						country: country,
						location_address2: city,
						location_lat: data.lat,
						location_lng: data.lng
					})
				}

				localStorage.setItem(
					'location_address1',
					JSON.stringify(this.state.location_address1)
				)
				localStorage.setItem('country', JSON.stringify(this.state.country))
				localStorage.setItem(
					'location_address2',
					JSON.stringify(this.state.location_address2)
				)
				localStorage.setItem(
					'postal_code',
					JSON.stringify(this.state.postal_code)
				)
				localStorage.setItem(
					'location_lat',
					JSON.stringify(this.state.location_lat)
				)
				localStorage.setItem(
					'location_lng',
					JSON.stringify(this.state.location_lng)
				)
			})
			.catch(error => console.error('Error', error))
	}

	handleLogout = event => {
		event.preventDefault()
		this.props.userLogout().then(() => {
			this.props.handleBusinessModalClose()
		})
	}

	handleStartTimeChange = time => {
		this.setState({
			operating_time: time.format('h:mm a')
		})
		localStorage.setItem(
			'operating_time',
			JSON.stringify(this.state.operating_time)
		)
	}

	handleEndTimeChange = time => {
		this.setState({
			closing_time: time.format('h:mm a')
		})
		console.log(this.state.closing_time)
		localStorage.setItem(
			'closing_time',
			JSON.stringify(this.state.closing_time)
		)
	}

	// handleBlur = async e => {
	//   if (
	//     !this.state.isUrlValid &&
	//     this.state.business_page.length &&
	//     checkedUrl
	//   ) {
	//     this.setState({ url_icon: '', loading_page_state: true })
	//     const data = await this.checkUrl(this.state.business_page)
	//     if (data.Page_Exists)
	//       this.setState({
	//         isUrlValid: false,
	//         url_icon: 'close',
	//         loading_page_state: false
	//       })
	//     else
	//       this.setState({
	//         isUrlValid: true,
	//         url_icon: 'check',
	//         loading_page_state: false
	//       })
	//   }
	// }

	handleUrlBlur = async e => {
		const value = e.target.value
		if (value === '') {
			return false
		}
		console.log(value)
		const { Page_Exists } = await API.post('business', '/page', {
			body: {
				url: value
			}
		})
		setTimeout(() => {
			const isUrlValid = this.checkPageUrl(value)
			this.setState({
				isUrlValid: isUrlValid && !Page_Exists,
				url_icon: isUrlValid && !Page_Exists ? '' : 'close'
			})
		}, 1000)
	}

	handleBusinessModalClose = () => {
		console.log('Business Modal closed')
		this.props.showerrorMessage('')
		this.props.handleBusinessModalClose()
	}
	render() {
		const inputProps = {
			value: this.state.location_address1,
			onChange: this.onChange
		}

		// this.props.closeOnDimmerClick
		return (
			<Modal
				open={this.props.showBusinessModal}
				onClose={this.handleBusinessModalClose}
				closeOnDimmerClick={
					this.props.closeOnDimmerClick &&
					!this.state.closingTimePopUp &&
					!this.state.openingTimePopUp
				}
				className="ui coupled modal large bzsetupmodal1"
				dimmer={'inverted'}
			>
				<Modal.Header className="header">
					<center>Business Setup</center>
				</Modal.Header>
				<Modal.Content>
					{this.state.showCropper ? this.showCropperModal() : null}
					<Form onSubmit={this.handleFormSubmit}>
						{this.props.showUserLogout && (
							<Form.Field>
								<center>
									<strong className="ui text green">
										Thanks for your interest in choosing sagepass.
									</strong>{' '}
									Please set up your business to continue further.
								</center>
							</Form.Field>
						)}
						<Form.Group>
							{/* <Form.Field> */}
							{this.state.image_file === ''
								? this.state.showCropper
									? this.showCropperModal()
									: this.dropZone()
								: this.showImageDimmer()
							// <Image src={this.state.uploadedImageUrl} size="small" floated='left' className={classes.img_responsive_without_border}/>
							// this.state.uploadedImageUrl === ""
							// ? this.dropZone()
							// : <Image src={this.state.uploadedImageUrl} size="small" floated='left'/>
							}
							{/* </Form.Field> */}
							<Form.Group className={classes.form_group_two}>
								<Form.Group className={classes.form_group_one} widths={'equal'}>
									<Form.Field className="required">
										<label>Business Name</label>
										<Input
											icon = 'building outline'
											iconPosition="left"
											type="text"
											id="business_name"
											value={this.state.business_name}
											onChange={this.handleInputChange}
											loading={this.props.isLoading}
											placeholder="Business Name"
										/>
									</Form.Field>
									<Form.Field
										error={!this.state.isUrlValid}
										className="required"
									>
										<label>Sagepass URL</label>
										<Input
											action={{
												content: 'https://www.sagepass.com/'
											}}
											actionPosition="left"
											autoComplete="off"
											type="text"
											id="business_page"
											icon={this.state.url_icon}
											onBlur={this.handleUrlBlur}
											onChange={this.handleUrlChange}
											loading={
												this.props.isLoading || this.state.loading_page_state
											}
											placeholder="Desired Page Name"
										/>
									</Form.Field>
								</Form.Group>
								<Form.Group className={classes.form_group_one} widths={'equal'}>
									<Form.Field className="required">
										<label>Contact Person Name</label>
										<Input
											icon = 'user'
											iconPosition="left"
											type="text"
											id="info_name"
											value={this.state.info_name}
											onChange={this.handleInputChange}
											loading={this.props.isLoading}
											placeholder="Contact Person Name"
										/>
									</Form.Field>
									<Form.Field className="required">
										<label>Contact Number</label>
										<Input
											icon = 'phone'
											iconPosition='left'
											type="text"
											id="info_contact"
											value={this.state.info_contact}
											onChange={this.handleInputChange}
											loading={this.props.isLoading}
											placeholder="Contact Number"
										/>
									</Form.Field>
									<Form.Field className="required">
										<label>Contact E-Mail</label>
										<Input
											icon = 'building outline'
											iconPosition='left'
											type="text"
											id="info_email"
											value={this.state.info_email}
											onChange={this.handleInputChange}
											loading={this.props.isLoading}
											placeholder="Contact E-Mail"
										/>
									</Form.Field>
								</Form.Group>
							</Form.Group>
						</Form.Group>

						<Form.Group className={classes.groupPadding}>
							<Form.Field className="required" width={4}>
								<TextArea
									type="text"
									className={classes.textArea}
									placeholder="More about your business."
									id="info_description"
									// defaultValue={this.state.business_info.contact}
									value={this.state.info_description}
									onChange={this.handleInputChange}
								/>
							</Form.Field>
							<Form.Field width={6}>
								<Form.Group width="equal">
									<Form.Field className="required" width={10}>
										<label>Billing Address</label>
										<AutoComplete
											type="text"
											placeholder="Street Address"
											id="location_address1"
											value={this.state.location_address1}
											inputProps={inputProps}
											onSelect={this.handleSelect}
											onChange={this.handleInputChange}
											loading={this.props.isLoading}
										/>
									</Form.Field>
									<Form.Field className={classes.postCode} width={6}>
										<Input
											type="number"
											className={classes.removeArrow}
											maxLength="7"
											id="postal_code"
											value={this.state.postal_code}
											onChange={this.handleInputChange}
											loading={this.props.isLoading}
											placeholder="Post Code"
										/>
									</Form.Field>
								</Form.Group>
							</Form.Field>
							<Form.Field width={6}>
								<Form.Group>
									<Form.Field className="required" width={8}>
										<label>City</label>
										<Input
											type="text"
											placeholder="City"
											id="location_address2"
											value={this.state.location_address2}
											// defaultValue={this.state.business_info.contact}
											onChange={this.handleInputChange}
											loading={this.props.isLoading}
										/>
									</Form.Field>
									<Form.Field className="required" width={8}>
										<label>Country</label>
										<Dropdown
											fluid
											selection
											placeholder="Select Country"
											id="country"
											value={this.state.country}
											options={country}
											onChange={this.handleDropbox}
											loading={this.props.isLoading}
										/>
									</Form.Field>
								</Form.Group>
							</Form.Field>
						</Form.Group>
						<h4 className="ui dividing header">Type & Operating Hours</h4>
						<Form.Group>
							<Form.Field className="required" width={4}>
								<label>Business Type</label>
								<Dropdown
									fluid
									selection
									placeholder="Select Type"
									id="operating_hours"
									options={types}
									value={this.state.operating_hours}
									onChange={this.handleDropbox}
									loading={this.props.isLoading}
								/>
							</Form.Field>
							<Form.Field className="required" width={4}>
								<label>Branches</label>
								<Dropdown
									fluid
									selection
									placeholder="Number Of Branches"
									id="business_branch"
									options={branches}
									value={this.state.business_branch}
									onChange={this.handleDropbox}
									loading={this.props.isLoading}
								/>
							</Form.Field>
							<Form.Field className="required" width={4}>
								<label>Operating Hours</label>
								<Dropdown
									fluid
									selection
									placeholder="Choose the type"
									id="business_state"
									options={timing}
									value={this.state.business_state}
									onChange={this.handleDropbox}
									loading={this.props.isLoading}
								/>
							</Form.Field>
							<Form.Field className="required" width={4}>
								<Form.Group width="equal">
									<Form.Field
										required
										disabled={this.state.timerState}
										width={8}
									>
										<label
											style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
										>
											Opening Time
										</label>
										<TimePicker
											showPopUp={this.state.openingTimePopUp}
											handelPopUpChange={popUpState =>
												this.setState({ openingTimePopUp: popUpState })
											}
											setTime={time => this.setState({ operating_time: time })}
											time={this.state.operating_time}
										/>
										{/* <Datetime
                      className={classes.rdtPicker}
                      inputProps={{
                        placeholder: 'Time',
                        className: classes.inputClass
                      }}
                      onChange={this.handleStartTimeChange}
                      dateFormat={false}
                      value={this.state.operating_time}
                      timeFormat={true}
                      onClick={this.handleFocusChange}
                    /> */}
									</Form.Field>
									<Form.Field
										required
										disabled={this.state.timerState}
										width={8}
									>
										<label
											style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
										>
											Closing Time
										</label>
										<TimePicker
											showPopUp={this.state.closingTimePopUp}
											handelPopUpChange={popUpState =>
												this.setState({ closingTimePopUp: popUpState })
											}
											setTime={time => this.setState({ closing_time: time })}
											time={this.state.closing_time}
										/>
										{/* <Datetime
                      className={classes.rdtPicker}
                      inputProps={{
                        placeholder: 'Time',
                        className: classes.inputClass
                      }}
                      onChange={this.handleEndTimeChange}
                      dateFormat={false}
                      value={this.state.closing_time}
                      timeFormat={true}
                      onClick={this.handleFocusChange}
                    /> */}
									</Form.Field>
								</Form.Group>
							</Form.Field>
						</Form.Group>
						<center>
							<div className="required field">
								<div className="ui checkbox">
									<Checkbox
										id="checkbox"
										label="I agree to the Terms of Service."
										onChange={this.handleCheckbox}
									/>
								</div>
							</div>
							{this.props.errorMessage !== '' ? (
								<center className="field row show">
									<strong className="ui red text">
										{this.props.errorMessage}
									</strong>
								</center>
							) : null}
							{this.props.showUserLogout ? (
								<Button
									icon
									labelPosition="right"
									loading={this.props.loading}
									onClick={this.handleLogout}
									className={'ui red right labeled icon button '}
								>
									Logout<Icon className="sign out" />
								</Button>
							) : null}
							<Button
								icon
								loading={this.state.isLoading}
								labelPosition="right"
								type="submit"
								disabled={!this.validator()}
								className="ui sgcolorhover right labeled icon button trans5"
							>
								Submit<i className="chevron right icon" />
							</Button>
						</center>
					</Form>
				</Modal.Content>
			</Modal>
		)
	}
}

function mapStateToProps(state) {
	return {
		isLoading: state.isLoading,
		isAutenticated: state.isAutenticated,
		errorMessage: state.errorMessage
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{ showLoading, userLogout, showerrorMessage, getBusinessesList },
		dispatch
	)
}

// function mapDispatchToActions(dispatch) {
//   return bindActionCreators({clearMessage, errorMessage}, dispatch)
// }

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(BusinessModal)
)
