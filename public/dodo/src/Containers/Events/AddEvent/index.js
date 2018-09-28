import React from 'react'
import { Dropdown, Container, Form, Image, Input, Icon, Popup, TextArea, Checkbox, Header, Card, Button, Table, Tab, Modal } from 'semantic-ui-react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import classes from './AddEvent.local.scss'

import TimePicker from '../../../Components/UI/TimePicker'
import moment from 'moment'
import Datetime from 'react-datetime'
import '../../Membership/AddMembership/DatePicker.scss'
import YoutubeVideoModal from './AddYoutubeVideoModel/index'
import AddDiscount from './AddDiscountModal/index'
import DeleteDiscount from './DeleteDiscountModal/index'
import AutoComplete, {
    geocodeByAddress,
	getLatLng,
	getDetails
} from '../../../Components/UI/AutoComplete/index'

import logo from '../../../assests/img/wireframe.png'
import { s3Upload } from '../../../Config/awsLib'

import { showLoading } from '../../../Actions/index'
import AddDiscountModal from './AddDiscountModal/index'
import Dropzone from 'react-dropzone'
import Cropper, { makeAspectCrop } from 'react-image-crop'
import 'cropperjs/dist/cropper.css'

import { API } from 'aws-amplify'
// import { read } from 'fs';

//upload_type 
// 0 - gallery
// 1- logo

//members only
// 0 - false
// 1 - true


const repeatOptions = [
    { key: 0, text: 'No Repeat', value: 'No Repeat'},
    { key: 1, text: 'Daily', value: 'Daily'},
    { key: 2, text: 'Weekly', value: 'Weekly'},
    { key: 3, text: 'Monthly', value: 'Monthly'}
]

const bookingTypeOptions = [
    { key:0, text: 'Class', value: 'Class'},
    { key:1, text: 'Session', value: 'Session'},
    { key:2, text: 'Meetup', value: 'Meetup'},
    { key:3, text: 'Tour', value: 'Tour'}
]

const eventStates = [
    { key:0, text: 'Enabled', value: 0},
    { key:1, text: 'Stop taking bookings', value: 1},
    { key:2, text: 'Disabled', value: 2}
]

const categoryOptions = [
    { key:0, text: 'Gym', value:'Gym'},
    { key:1, text: 'Tennis', value: 'Tennis'},
    { key:2, text: 'Badminton', value: 'Badminton'},
    { key:3, text: 'Cricket', value: 'Cricket'},
    { key:4, text: 'Football', value: 'Football'},
    { key:5, text: 'Swimming', value: 'Swimming'},
    { key:6, text: 'Volley Ball', value: 'Volley Ball'},
    { key:7, text: 'Hockey', value: 'Hockey'},
    { key:8, text: 'Ice Hockey', value: 'Ice Hockey'},
    { key:9, text: 'Dancing', value: 'Dancing'},
    { key:10, text: 'Yoga', value: 'Yoga'},
    { key:11, text: 'Rowing', value: 'Rowing'},
    { key:12, text: 'Table Tennis', value: 'Table Tennis'}

]

const policies = [
    { key:0, text: 'Free Cancellations', value: 0},
    { key:1, text: 'Free, 12 Hours before the event', value: 1},
    { key:2, text: 'Free, 24 Hours before the event', value: 2},
    { key:3, text: 'Custom', value: 3},
    { key:4, text: 'No Refund', value: 4},
    { key:5, text: 'No Cancellations', value: 5}
]

const event_host_info = [
    {key: 0, host_email: 'sherlock@gmail.com' ,host_name: 'Sherlock Holmes', host_image: 'http://dev.sagepass.com:8081/img/chat/sherlock.jpg', host_bio: 'Sherlock is an highly experienced and only Criminal Detective'},
    {key: 1, host_email: 'steve@apple.com' ,host_name: 'Steve Jobs', host_image: 'http://dev.sagepass.com:8081/img/chat/michaelfassbender.jpg', host_bio: 'Steve Jobs is one of the successful entrepreneur and the CEO of Apple.'}
]

function getTwentyFourHourTime(amPmString) { 
    var d = new Date("1/1/2013 " + amPmString); 
    return d.getHours() + ':' + d.getMinutes() + ':00'; 
}

function getTwelveHourTime(timeString) {
    return moment(new Date("1/1/2013 " + timeString)).format("h:mm a")
     
}

class AddEvent extends React.Component {

    state= {
        event_logo_file: '',
        event_logo: '',
        event_name: '',
        event_start_time: '',
        event_end_time: '',
        event_repeat: '',
        event_entryfee: '',
        event_bookingType: '',
        event_location: '',
        event_state: '',
        event_description: '',
        event_brief: '',
        event_max_mem: '',
        event_age_period_from: '',
        event_age_period_to: '',
        event_valid_period_from: '',
        event_valid_period_to: '',
        event_lat: '',
        event_lng: '',
        event_host_info: event_host_info,
        event_discounts: [],
        event_welcome_message: '',
        event_gallery: [],
        event_cancellation_policy: '',
        event_youtube_link: [],
        event_categories: [],
        event_members_only: false,
        showTimePopUpForStart: false,
        showTimePopUpForEnd: false,
        showAddDiscount: false,
        showDeleteDiscount: false,
        showCropperModal: false,
        discount_to_delete: '',
        host_name: '',
        host_email: '',
        host_bio: '',
        crop: {
			x: 20,
			y: 10,
			aspect: 1
        },
        src: '',
        filename: '',
        file: '',
        image_files: [],
        upload_type: -1
    }

    setStateForCloneAndEdit(event) {
        console.log(event)
        this.setState({
            ...event,
            event_cancellation_policy: event.event_cancallation,
            event_valid_period_from: moment(event.event_valid_period_from).format("MMM Do YYYY"),
            event_valid_period_to: moment(event.event_valid_period_to).format("MMM Do YYYY"),
            event_members_only: event.event_members_only ? true: false,
            event_start_time: getTwelveHourTime(event.event_start_time),
            event_end_time: getTwelveHourTime(event.event_end_time),
            event_gallery: event.event_gallery ? event.event_gallery : []
        })
    }

    componentDidMount() {
        if(this.props.location.clone_event) {
            this.setStateForCloneAndEdit(this.props.location.clone_event)
        } else if(this.props.location.edit_event) {
            this.setStateForCloneAndEdit(this.props.location.edit_event)
        }
    }

    hostValidator = event => {
        return  this.state.host_email.length &&
                this.state.host_name.length &&
                this.state.host_bio.length
    }

    handleInputChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleDropdown = (e, data) => {
        this.setState({
            [data.id]: data.value
        })
    }

    handleAddHost = () => {
        const hosts = Array.from(this.state.event_host_info)
        const host = {
            host_name: this.state.host_name,
            host_email: this.state.host_email,
            host_bio: this.state.host_bio,
            host_image: 'http://dev.sagepass.com:8081/img/chat/sherlock.jpg'
        }
        hosts.push(host)
        this.setState({
            event_host_info: hosts
        })
    }

    handleDeleteHost = index => {
        const hosts = this.state.event_host_info.filter((item, key) => key != index)
        this.setState({
            event_host_info: hosts
        })
    }

    handleAddDiscount = discount => {
        var discounts = this.state.event_discounts.map(item => item)
        discounts.push(discount)
        this.setState({
            event_discounts: discounts,
            showAddDiscount: false
        })
    }

    handleEditDiscount = index => {
        //TODO: Edit a discount
    }

    handleDeleteDiscount = event => {
        const discounts = this.state.event_discounts.filter((item, key) => key != this.state.discount_to_delete)
        this.setState({
            event_discounts: discounts,
            showDeleteDiscount: false
        })
    }

    handleAddVideo = video => {
        var links = Array.from(this.state.event_youtube_link)
        links.push(video)
        this.setState({
            event_youtube_link: links
        })
    }

    handleLocationSelect = async address => {
        await this.setState({
            event_location: address
        })
        var a = {}
        geocodeByAddress(this.state.event_location)
            .then(results => {
                a = this.state.event_location.split(',')
                console.log(results);
                if(a.length == 1) {
                    return getDetails(results, a)
                }
				return getDetails(results, a[a.length - 2].trim())
            })
            .then(data => {
                this.setState({
                    event_lat: data.lat,
                    event_lng: data.lng
                })
            })
            .catch(e => {
                console.log(e)
            })
    }

    onChange = address => {
		this.setState({
			event_location: address
		})
	}

    handleImageDrop = event => {
        var file = event.target.files[0]
        file['preview'] = URL.createObjectURL(file)
        this.setState({
            upload_type: 0,
            src: file.preview,
            showCropperModal: true,
            filename: file.name
        })
        // if(file.size > 5242880) {
        //     return 
        // }
    }

    onLogoDrop = files => {
        var file = files[0]
        this.setState({
            upload_type: 1,
            src: file.preview,
            showCropperModal: true,
            filename: file.name
        })
    }

    handleDoneCropping = async e => {
        e.preventDefault()
        this.props.showLoading()
        try {
            if(this.state.upload_type == 0) {
                var response = await s3Upload(this.state.file, "eventsGallery")
            //for showing images to users
                var images = Array.from(this.state.image_files)
                images.push(this.state.file)
                //adding image urls for backend api
                var image_urls = Array.from(this.state.event_gallery)
                image_urls.push(response.Location)
                this.setState({
                    image_files: images,
                    event_gallery: image_urls
                })
            } else if (this.state.upload_type == 1) {
                var response = await s3Upload(this.state.file, "eventsLogos")

                this.setState(state => ({
                    event_logo: response.Location,
                    event_logo_file: state.file
                }))
            }
            
            this.props.showLoading();
        } catch(e) {
            console.log(e);
            this.props.showLoading()
        }
        

		this.setState({
			showCropperModal: false,
			crop: {
				x: 20,
				y: 10,
				aspect: 1
			}
		})
    }

    handleCancel = e => {
		if (this.state.image_file !== '') {
			this.setState({
				image_file: ''
			})
		}
		this.setState({
			showCropperModal: false,
			crop: {
				x: 20,
				y: 10,
				aspect: 1
			}
		})
	}
    
    onCropComplete = async (crop, pixelCrop) => {
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

    renderCropperModal = () => {
        return (
            <Modal
                size={'small'}
                open={this.state.showCropperModal}
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
                <Modal.Content style={{ width: '100%'}}>
                    <Modal.Description className="content" style={{ width: '100%'}}>
                        <center>
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
								loading={this.props.isLoading}
								onClick={this.handleDoneCropping}
								className={'ui blue right labeled icon button '}
							>
								Done Cropping<Icon className="check" />
							</Button>
							<Button
								icon
								labelPosition="right"
								disabled={this.props.isLoading}
								onClick={this.handleCancel}
								className={
									'ui red right labeled icon button '
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

    renderHosts = (host, key) => {
        return (
            <Card key={key}>
                <Card.Content>
                    <center>
                        <Header content={host.host_name} />
                        <Card.Description content={<p>{host.host_bio}</p>} />
                    </center>    
                </Card.Content>    
                <Card.Content extra>
                    <center>
                        <Image avatar src={host.host_image} />{host.host_name.split(" ")[0]}
                        <Popup
                            trigger={<Icon name='trash' color='red' style={{ cursor : 'pointer'}} onClick={() => this.handleDeleteHost(key)} />}
                            content="Remove this host"
                        />    
                    </center>    
                </Card.Content>
            </Card>       
        )
    }

    renderPriceColumn = (discount) => {
        if(discount.dis_price) {
            return (
                <Table.Cell>{discount.dis_percent}%(₹{discount.dis_price})
                </Table.Cell>            
            )
        } else {
            return (
                <Table.Cell>
                    {discount.dis_percent}%
                </Table.Cell>    
            )
        }
    }

    handleDeleteClick = key => {
        this.setState({ 
            showDeleteDiscount: true,
            discount_to_delete: key
        })
    }

    renderDiscounts = (discount, key) => {
        return (
            <Table.Row key={key}>
                <Table.Cell collapsing>
                    <Popup 
                        trigger={<Icon name='edit' color='blue' onClick={() => this.handleEditDiscount(key)} />}
                        content='Edit this discount.'
                    />
                    <Popup
                        trigger={<Icon 
                                    name='trash' 
                                    color='red' 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => this.handleDeleteClick(key)}
                                />
                                }           
                        content='Remove this discount'
                    />        
                </Table.Cell>
                <Table.Cell>From {discount.start_date} to {discount.end_date}</Table.Cell>
                <Table.Cell>{discount.discount} {discount.voucher_code}</Table.Cell>
                { this.renderPriceColumn(discount) }
            </Table.Row>    
        )
    }

    handleFormSubmit = async event => {

        this.props.showLoading();
        const data = Object.assign({}, this.state)
        console.log(this.state);
        data['business_id'] = this.props.business.bizid
        
        data['event_age_period_from'] = Number(data.event_age_period_from)
        data['event_age_period_to'] = Number(data.event_age_period_to)
        data['event_entryfee'] = Number(data.event_entryfee)
        data['event_members_only'] = data.event_members_only ? 1 : 0  
        data['event_start_time'] = getTwentyFourHourTime(data.event_start_time)
        data['event_end_time'] = getTwentyFourHourTime(data.event_end_time)
        // console.log(data)
        try {
            
            if(this.props.location.edit_event) {

                data['event_valid_period_from'] = moment(data.event_valid_period_from,'MMM Do YYYY').format('YYYY-MM-DD HH:mm:ss')
                data['event_valid_period_to'] = moment(data.event_valid_period_to,'MMM Do YYYY').format('YYYY-MM-DD HH:mm:ss')
                console.log("Date:", data)
                data['event_id'] = this.props.location.edit_event.event_eventid
                const response = await API.put("events", "/update", {
                    body: data
                })
                this.props.history.push("/events")
                console.log(response)
            } else {
                data['event_valid_period_from'] = moment(data.event_valid_period_from).format('YYYY-MM-DD HH:mm:ss')
                data['event_valid_period_to'] = moment(data.event_valid_period_to).format('YYYY-MM-DD HH:mm:ss')
                const response = await API.post("events", "/create_demo", {
                    body: data
                })
                this.props.history.push("/events")
                console.log(response);
            }
            
        } catch(e) {
            console.log(e)
        }
        this.props.showLoading()
    }

    render() {
        const inputProps = {
			value: this.state.event_location,
            onChange: this.onChange,
            icon: 'map pin',
            iconPosition: 'left'
		}
        return (
            <section className={classes.eventsbox}>
                <Container fluid={true}>
                    <Form>
                        {
                            this.state.event_logo == '' ? 
                            <Dropzone
                                className={classes.eventLogo}
                                accept="image/*"
                                multiple={false}
                                onDrop={this.onLogoDrop}
                                ><p>Upload or Drop event logo here</p>
                            </Dropzone>
                            : <Image size='small' floated='left' src={this.state.event_logo} />
                        }
                        <Form.Group widths="3">
                            <Form.Field width="6" className="required">
                                <label>Event Name</label>
                                <Input 
                                    id="event_name"
                                    icon='tag'
                                    type='text' 
                                    floated='left'
                                    iconPosition='left'
                                    placeholder='e.g. Yoga Monday Session'
                                    onChange={this.handleInputChange}
                                    value={this.state.event_name}
                                    loading={this.props.isLoading}
                                />    
                            </Form.Field>
                            <Form.Field width="9">
                                <Form.Group widths="2">
                                    <Form.Field className="required">
                                        <Popup 
                                            trigger={<label>Start Time</label>}
                                            content="Event Start Date & Time"
                                        />    
                                        <TimePicker
                                            icon='calendar alternate outline'
                                            showPopUp={this.state.showTimePopUpForStart}
                                            handelPopUpChange={popUpState =>
                                                this.setState({ showTimePopUpForStart: popUpState })
                                            }
                                            placeholder="From Time"
                                            time={this.state.event_start_time}
                                            setTime={time => this.setState({ event_start_time: time })}
									    />   
                                    </Form.Field>
                                    <Form.Field className="required">
                                        <Popup 
                                            trigger={<label>End Time</label>}
                                            content="Event End Date & Time"
                                        />    
                                        <TimePicker
                                            icon='calendar alternate outline'
                                            showPopUp={this.state.showTimePopUpForEnd}
                                            handelPopUpChange={popUpState =>
                                                this.setState({ showTimePopUpForEnd: popUpState })
                                            }
                                            placeholder="End Time"
                                            time={this.state.event_end_time}
                                            setTime={time => this.setState({ event_end_time: time })}
									    />    
                                    </Form.Field>
                                </Form.Group>
                            </Form.Field>
                            <Form.Field className="required" width="3">
                                <label>Repeat</label>
                                <Dropdown
                                    id="event_repeat"
                                    placeholder='e.g. Weekly'
                                    fluid
                                    selection
                                    search
                                    value={this.state.event_repeat}
                                    options={repeatOptions}
                                    onChange={this.handleDropdown}
                                />    
                            </Form.Field>    
                        </Form.Group>
                        <Form.Group widths="2">
                            <Form.Field width="3" className="required">
                                <label>Entry Fee</label>
                                <Input
                                    id="event_entryfee"
                                    iconPosition='left'
                                    icon='rupee'
                                    floated='left'
                                    type='text'
                                    placeholder='e.g. 200'
                                    onChange={this.handleInputChange}
                                    isLoading={this.state.isLoading}
                                    value={this.state.event_entryfee}
                                />            
                            </Form.Field> 
                            <Form.Field className="required" width="3">
                                <label>Booking type</label>
                                <Dropdown
                                    id="event_bookingType"
                                    placeholder="e.g. Meetup"
                                    fluid
                                    search
                                    selection
                                    options={bookingTypeOptions}
                                    onChange={this.handleDropdown}
                                    value={this.state.event_bookingType}
                                />    
                            </Form.Field>
                            <Form.Field width="6" className="required">
                                <label>Location</label>
                                <AutoComplete
                                    type="text"
                                    placeholder="e.g. Rivermead Complex, Reading"
                                    id="event_location"
                                    value={this.state.event_location}
                                    onSelect={this.handleLocationSelect}
                                    onChange={this.handleInputChange}
                                    inputProps={inputProps}
                                    loading={this.props.isLoading}
                                />
                                {/* <Input
                                    id="event_location"
                                    iconPosition='left'
                                    placeholder="e.g. Rivermead Complex, Reading"
                                    icon='map pin'
                                    onChange={this.handleInputChange}
                                    value={this.state.event_location}
                                    loading={this.props.isLoading}
                                />     */}
                            </Form.Field>
                            <Form.Field width="3" className="required">
                                <label>State</label>
                                <Dropdown
                                    search
                                    selection
                                    id="event_state"
                                    placeholder="e.g. Enabled"
                                    options={eventStates}
                                    value={this.state.event_state}
                                    onChange={this.handleDropdown}
                                />    
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths="2">
                            <Form.Field width="5" className="required">
                                <label>Event Categories</label>
                                <Dropdown
                                    id="event_categories"
                                    placeholder="e.g. Tennis, Yoga, Meetup"
                                    fluid
                                    selection
                                    multiple
                                    search
                                    options={categoryOptions}
                                    onChange={this.handleDropdown}
                                    value={this.state.event_categories}
                                />    
                            </Form.Field>
                            <Form.Field width="11" className="required">
                                <label>Short Description</label>
                                <Input
                                    id="event_description"
                                    type='text'
                                    placeholder="e.g. Hackathon event is all about blockchain & serverless technologies."
                                    onChange={this.handleInputChange}
                                    value={this.state.event_description}
                                    loading={this.props.isLoading}
                                />    
                            </Form.Field>
                        </Form.Group>
                        <Form.Field className="required">
                            <label>Brief about event</label>
                            <TextArea
                                id="event_brief"
                                rows="3"
                                placeholder="e.g. Yoga classes helds in our facilities every week. We have an instructor who can assist and guide through out the class."
                                onChange={this.handleInputChange}
                                value={this.state.event_brief}
                            />    
                        </Form.Field>
                        <Form.Field>
                            <Form.Group widths="6">
                                <Form.Field width="3">
                                    <Popup
                                        trigger={<label>Maxium members</label>}
                                        content="Maxium number of users allowed to book this event."
                                    />   
                                    <Input
                                        id="event_max_mem"
                                        type="number"
                                        placeholder="e.g. 300"
                                        onChange={this.handleInputChange}
                                        loading={this.props.isLoading}
                                        value={this.state.event_max_mem}
                                    />         
                                </Form.Field>
                                <Form.Field width="2">
                                    <Popup
                                        trigger={<label>Age Restriction</label>}
                                        content="Users with below age range are only allowed to book this event."
                                    />   
                                    <Input
                                        id="event_age_period_from"
                                        type="number"
                                        placeholder="From Age"
                                        onChange={this.handleInputChange}
                                        loading={this.props.isLoading}
                                        value={this.state.event_age_period_from}
                                    />         
                                </Form.Field>
                                <Form.Field width="2">
                                    <label><br /></label>  
                                    <Input
                                        id="event_age_period_to"
                                        type="number"
                                        placeholder="To Age"
                                        onChange={this.handleInputChange}
                                        loading={this.props.isLoading}
                                        value={this.state.event_age_period_to}
                                    />         
                                </Form.Field>
                                <Form.Field width="3">
                                    <Popup
                                        trigger={<label>Valid Period</label>}
                                        content="Allow users to book the event only between these dates."
                                    />   
                                    <Datetime
                                        onChange={date => {
                                            this.setState({
                                                event_valid_period_from: date
                                            })
                                        }}
                                        dateFormat="MMM Do YYYY"
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        value={this.state.event_valid_period_from}
                                        inputProps={{ placeholder: 'From Date' }}
                                        renderInput={(props, openCalendar, closeCalendar) => (
                                            <Input icon="calendar" iconPosition="left" {...props} />
                                        )}
                                    />             
                                </Form.Field>
                                <Form.Field width="3">
                                    <label><br /></label>   
                                    <Datetime
                                        onChange={date => {
                                            this.setState({
                                                event_valid_period_to: date
                                            })
                                        }}
                                        dateFormat="MMM Do YYYY"
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        value={this.state.event_valid_period_to}
                                        inputProps={{ placeholder: 'To Date' }}
                                        renderInput={(props, openCalendar, closeCalendar) => (
                                            <Input icon="calendar" iconPosition="left" {...props} />
                                        )}
                                    />             
                                </Form.Field>
                                <Form.Field width="3">
                                    <Popup
                                        trigger={<Checkbox 
                                                    className={classes.adjustCheckbox}
                                                    label="Members only"
                                                    checked={this.state.event_members_only}
                                                    onChange={(e, data) => {
                                                        this.setState({
                                                            event_members_only: data.checked
                                                        })
                                                    }}
                                                />}
                                        content="If checked, Please ensure that membership access control has been updated to access this event."
                                    />    
                                </Form.Field>
                            </Form.Group>
                            <Header dividing size='small' content='Cancellation Policies' />
                            <Form.Group widths="2">
                                <Form.Field className="required" width="5">
                                    <label>Cancellation Policy</label>
                                    <Dropdown
                                        id="event_cancellation_policy"
                                        selection
                                        placeholder="e.g. Free Cancellation"
                                        onChange={this.handleDropdown}
                                        options={policies}
                                        value={this.state.event_cancellation_policy}
                                    />    
                                </Form.Field>
                                <Form.Field width="11" className={classes.cancellationpolicytext}>
                                </Form.Field>    
                            </Form.Group>
                            <Header dividing size='small' content='Host Information' />
                            <Card.Group>
                                {
                                    this.state.event_host_info.map((item, key) => {
                                        return this.renderHosts(item, key)
                                    })
                                }
                            </Card.Group>
                            <br />
                            <Form.Field>
                                <Form.Group widths="3">
                                    <Form.Field className="required" width="4">
                                        <Input 
                                            floated='left'
                                            iconPosition='left'
                                            icon='at'
                                            type='text'
                                            placeholder="e.g. steve@apple.com"
                                            onChange={e => {
                                                this.setState({
                                                    host_email: e.target.value
                                                })
                                            }}
                                        />    
                                    </Form.Field>
                                    <Form.Field className="required" width="3">
                                        <Input 
                                            floated='left'
                                            iconPosition='left'
                                            icon='user'
                                            type='text'
                                            placeholder="e.g. Steve Jobs"
                                            onChange={e => {
                                                this.setState({
                                                    host_name: e.target.value
                                                })
                                            }}
                                        />    
                                    </Form.Field>
                                    <Form.Field className="required" width="7">
                                        <Input 
                                            floated='left'
                                            type='text'
                                            placeholder="e.g. He is the CEO of Apple."
                                            onChange={e => {
                                                this.setState({
                                                    host_bio: e.target.value
                                                })
                                            }}
                                        />    
                                    </Form.Field>
                                    <Form.Field width="1" className="required">
                                        <Button 
                                            size='tiny' 
                                            color='green' 
                                            content='Add' 
                                            onClick={this.handleAddHost}
                                            disabled={!this.hostValidator()}
                                        />    
                                    </Form.Field>
                                </Form.Group>
                            </Form.Field>   
                            <Header dividing size='small' content="Discounts" /> 
                            <Form.Field>
                                <Table
                                    compact
                                    celled
                                    definition
                                    striped
                                >
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell />
                                            <Table.HeaderCell>Duration</Table.HeaderCell>
                                            <Table.HeaderCell>Discount</Table.HeaderCell>
                                            <Table.HeaderCell>Price</Table.HeaderCell>
                                        </Table.Row>    
                                    </Table.Header>   
                                    <Table.Body>
                                        {
                                            this.state.event_discounts.map((item, key) => (
                                                this.renderDiscounts(item, key)
                                            ))
                                        }
                                    </Table.Body>  
                                    <Table.Footer>
                                        <Table.Row>
                                            <Table.HeaderCell />
                                            <Table.HeaderCell colspan="4">
                                                <Button 
                                                    id="add_discount"
                                                    floated='right'
                                                    size='tiny'
                                                    primary
                                                    icon
                                                    labelPosition='left'
                                                    onClick={() => this.setState({
                                                        showAddDiscount: true
                                                    })}
                                                >
                                                    <Icon name='plus' />Add Discount
                                                </Button>    
                                            </Table.HeaderCell> 
                                        </Table.Row>    
                                    </Table.Footer>       
                                </Table>    
                            </Form.Field> 
                            <Header dividing as='h4' content="Gallery" />
                            <Image.Group size='small'>
                                {
                                    this.state.event_gallery.map(item => (
                                        <Image 
                                            src={item} 
                                            className={classes.galleryImages}
                                        />
                                    ))                
                                }
                                <div
                                    id="upload_event_image" 
                                    className="ui tiny green labeled icon button"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        document.querySelector('#img').click();
                                    }}
                                >
                                    <input 
                                        type="file" 
                                        id="img" 
                                        className={classes.uploadInput}
                                        onChange={this.handleImageDrop}
                                    />
                                    <i className="upload icon" />
                                    <label style={{ cursor: 'pointer' }}>Upload</label>
                                </div>    
                            </Image.Group>   
                            <Header dividing content ='Welcome Message' as='h4' />
                            <Form.Field className="required">
                                <TextArea
                                    id="event_welcome_message" 
                                    rows="2"
                                    placeholder="Congratulations!!! We heartly thank and welcome you to our family. Our reception is available to help you always."
                                    onChange={this.handleInputChange}
                                    value={this.state.event_welcome_message}
                                />    
                            </Form.Field>
                            <center>
                                <Button 
                                    color='red'
                                    icon
                                    labelPosition='left'
                                    className="trans5"
                                    onClick={() => {
                                        this.props.history.push("/events")
                                    }}
                                >
                                    <Icon name='chevron left' />Back
                                </Button>
                                <Button
                                    icon
                                    labelPosition='right'
                                    className="sgcolorhover trans5"
                                    loading={this.props.isLoading}
                                    onClick={this.handleFormSubmit}
                                >
                                    <Icon name='check' />{this.props.location.edit_event ? 'Update': 'Create'}
                                </Button>        
                            </center>              
                        </Form.Field>    
                    </Form>   
                </Container>
                {
                    this.state.showAddDiscount ? 
                    <AddDiscountModal 
                        addDiscount={this.handleAddDiscount}
                        open={this.state.showAddDiscount} 
                        handleClose={
                            () => this.setState({ showAddDiscount: false })
                        }
                    />
                    : null
                }
                {
                    this.props.showYoutubeVideoModal ? 
                    <YoutubeVideoModal 
                        open={this.props.showYoutubeVideoModal}
                        handleClose={this.props.handleYoutubeVideoModal}
                        handleAddVideo={this.handleAddVideo}
                    /> 
                    : null   
                } 
                {
                    this.state.showDeleteDiscount ? 
                    <DeleteDiscount
                        open={this.state.showDeleteDiscount}
                        handleDelete={this.handleDeleteDiscount}
                        handleClose={
                            () => 
                            this.setState({ 
                                showDeleteDiscount: false, 
                                discount_to_delete: '' 
                            })
                        }
                    />
                    : null    
                }
                {
                    this.state.showCropperModal ? 
                    this.renderCropperModal()
                    : null
                }
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        isLoading: state.isLoading,
        business: state.currentBusinessList
    }
}

export default withRouter(connect(mapStateToProps, { showLoading })(AddEvent));