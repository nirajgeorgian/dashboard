import React from 'react'
import { Form, Image, Input, Dropdown, TextArea, Header, Table, Icon, Popup, Button,Modal } from 'semantic-ui-react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'

import { API } from 'aws-amplify'

import classes from './Addfacility.local.scss'
import AddTimeSlot from './AddTimeSlot/index'
import BulkAddTimeSlot from './BulkAddTimeSlot/index'
import DeleteTimeSlot from './DeleteTimeSlot/index'
import Dropzone from 'react-dropzone'
import Cropper, { makeAspectCrop } from 'react-image-crop'
import 'cropperjs/dist/cropper.css'

import { s3Upload } from '../../../Config/awsLib'

import { showLoading } from '../../../Actions/index'

const categories = [
    { key:0, text: 'Gym', value: 'Gym'},
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

const groups = [
    { key:0, text: 'General', value:0 },
    { key:1, text: 'Off-peak Hours', value:1 },
    { key:2, text: 'Peak Hours', value:2 },
    { key:3, text: 'Junior', value:3 },
    { key:4, text: 'Senior', value:4 },
    { key:5, text: 'Adult', value:5 }
]

const states = [
    { key:0, text: 'Enabled', value: 0 },
    { key:1, text: 'Stop taking bookings', value: 1 },
    { key:2, text: 'Disabled', value: 2 }
]

const policies = [
    { key:1, text: 'Free Cancellations', value:1 },
    { key:2, text: 'Free, 12 Hours before', value:2 },
    { key:3, text: 'Free, 24 Hours before', value:3 },
    { key:4, text: 'Custom', value:4 },
    { key:5, text: 'No Refund', value:5 },
    { key:6, text: 'No Cancellations', value:6 }
]

class AddFacility extends React.Component {

    state = {
        fname: '',
        flogo: '',
        fcategory: '',
        fstate: '',
        fdesc: '',
        fbrief: '',
        fcancel_policy: {
            type: '',
            hr_0: '',
            hr_12: '',
            hr_24: '',
            days_2: '',
            days_7: ''
        },
        ftimeslot: [],
        fgallery: [],
        showAddTimeSlot: false,
        showBulkAddTimeSlot: false,
        showDeleteTimeSlot: false,
        slotIndexToDelete: '',
        facility_logo_file: '',
        src: '',
        filename: '',
        file: '',
        image_files: [],
        upload_type: -1,
        showCropperModal: false
    }


    componentWillMount() {
        // console.log("Clone", this.props.location.clone_facility)
        // console.log(this.props.location.building)
        if(this.props.location.clone_facility) {
            this.setFacilityDataForCloneOrEdit(this.props.location.clone_facility)
        } else if(this.props.location.edit_facility) {
            this.setFacilityDataForCloneOrEdit(this.props.location.edit_facility)
        }
    }

    setFacilityDataForCloneOrEdit = (obj) => {
        var facility = obj.facility
        facility.fcancel_policy = { ...facility.fcancel_policy.custom, type: facility.fcancel_policy.type }
        this.setState({
            ...facility
        })
    }

    getSlotGroupText = (key) => {
        return groups.filter(item => item.value == key)[0].text
    }

    handleInputChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleDropdown = (e, data) => {
        this.setState({
            [data.id]: data.value
        })
    }

    handleImageUpload = e => {
        console.log(e.target.files)
    }

    onLogoDrop = files => {
        var file = files[0]
        file['preview'] = URL.createObjectURL(file)
        this.setState({
            upload_type: 1,
            showCropperModal: true,
            src: file.preview,
            filename: file.name
        })
    }

    handleDeleteTimeSlotOpen = index => {
        this.setState({
            showDeleteTimeSlot: true,
            slotIndexToDelete: index
        })
    }

    handleAddTimeSlot = slot => {
        const slots = Array.from(this.state.ftimeslot)
        slots.push(slot)
        this.setState({
            ftimeslot: slots
        })
    }

    handleDeleteTimeSlot = index => {
        const timeslots = this.state.ftimeslot.filter((_, key) => key != index)
        this.setState({
            ftimeslot: timeslots,
            slotIndexToDelete: '',
            showDeleteTimeSlot: false
        })
    }

    getHeaderCell = (text, icon) => (
        <Table.HeaderCell>
            {text}<br />
            <Icon name={icon} />
        </Table.HeaderCell>
    )

    handleImageDrop = event => {
        var file = event.target.files[0]
        file['preview'] = URL.createObjectURL(file)
        this.setState({
            upload_type: 0,
            src: file.preview,
            showCropperModal: true,
            filename: file.name
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

    handleDoneCropping = async e => {
        e.preventDefault()
        this.props.showLoading()
        try {
            if(this.state.upload_type == 0) {
                var response = await s3Upload(this.state.file, "facilitiesGallery")
            //for showing images to users
                var images = Array.from(this.state.fgallery)
                images.push(this.state.file)
                //adding image urls for backend api
                var image_urls = Array.from(this.state.fgallery)
                image_urls.push(response.Location)
                this.setState({
                    image_files: images,
                    fgallery: image_urls
                })
            } else if (this.state.upload_type == 1) {
                var response = await s3Upload(this.state.file, "facilitiesLogos")

                this.setState(state => ({
                    flogo: response.Location,
                    facility_logo_file: state.file
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
    
    handleFormSubmit = async event => {
        this.props.showLoading()

        console.log(this.state)

        try {
            if(this.props.location.building) {
                var buildid = this.props.location.building.buildid
                var response = await API.post("facility",`/create/${this.props.business.bizid}/${buildid}`, {
                    body: this.state
                })
            } else if(this.props.location.clone_facility) {
                var buildid = this.props.location.clone_facility.buildid
                var response = await API.post("facility",`/create/${this.props.business.bizid}/${buildid}`, {
                    body: this.state
                })
            } else if(this.props.location.edit_facility) {
                const obj = this.props.location.edit_facility
                var response = await API
                                    .put("facility", 
                                        `/update/${this.props.business.bizid}/${obj.buildid}/${obj.index}`, {
                                            body: this.state
                                    })
            }

            console.log(response)
            if(response.status) {
                this.props.history.push('/facilities')
            }
        } catch(e) {
            console.log(e)
        }

        this.props.showLoading()
        
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

    handleCancellationInputChange = event => {
        event.persist()
        this.setState(state => ({
            fcancel_policy: {
                ...state.fcancel_policy,
                [event.target.id]: Number(event.target.value)
            }
        }))
    }

    renderCancellationForm = () => (
        <Form.Group widths={5}>
            <Form.Field required>
                <Popup
                    trigger={<label>0 Hours</label>}
                    content='Refund value if cancelled between the event start time and 12 hours before the event.'
                />
                <Input
                    id="hr_0"
                    icon='percent'
                    placeholder='e.g. 0'
                    type='number'
                    iconPosition='left'
                    value={this.state.fcancel_policy.hr_0}
                    onChange={this.handleCancellationInputChange}
                />
            </Form.Field>
            <Form.Field required>
                <Popup
                    trigger={<label>12 Hours</label>}
                    content='Refund value if cancelled between 12 and 24 hours before the event.'
                />
                <Input
                    id="hr_12"
                    icon='percent'
                    placeholder='e.g. 20'
                    type='number'
                    iconPosition='left'
                    value={this.state.fcancel_policy.hr_12}
                    onChange={this.handleCancellationInputChange}
                />
            </Form.Field>
            <Form.Field required>
                <Popup
                    trigger={<label>24 Hours</label>}
                    content='Refund value if cancelled between 24 and 48 hours before the event.'
                />
                <Input
                    id="hr_24"
                    icon='percent'
                    placeholder='e.g. 40'
                    type='number'
                    iconPosition='left'
                    value={this.state.fcancel_policy.hr_24}
                    onChange={this.handleCancellationInputChange}
                />
            </Form.Field>
            <Form.Field required>
                <Popup
                    trigger={<label>2 Days</label>}
                    content='Refund value if cancelled between 48 Hours and 7 Days before the event.'
                />
                <Input
                    id="days_2"
                    icon='percent'
                    placeholder='e.g. 80'
                    type='number'
                    iconPosition='left'
                    value={this.state.fcancel_policy.days_2}
                    onChange={this.handleCancellationInputChange}
                />
            </Form.Field>
            <Form.Field required>
                <Popup
                    trigger={<label>7 Days</label>}
                    content='Refund value if cancelled 7 Days before the event.'
                />
                <Input
                    id="days_7"
                    icon='percent'
                    placeholder='e.g. 100'
                    type='number'
                    iconPosition='left'
                    value={this.state.fcancel_policy.days_7}
                    onChange={this.handleCancellationInputChange}
                />
            </Form.Field>
        </Form.Group>
    )

    renderTimeSlots = (item, index) => (
        <Table.Row key={index}>
            <Table.Cell collapsing>
                <Popup
                    trigger={<Icon name='edit' color='blue' style={{ cursor: 'pointer' }} />}
                    content='Edit this timeslot.'
                />
                <Popup
                    trigger={<Icon 
                                name='trash' 
                                color='red' 
                                style={{ cursor: 'pointer'}} 
                                onClick={() => this.handleDeleteTimeSlotOpen(index)}
                            />}
                    content='Remove this timeslot.'
                />
            </Table.Cell>
            <Table.Cell content={item.slot_day} />
            <Table.Cell content={item.slot_start} />
            <Table.Cell content={item.slot_end} />
            <Table.Cell content={item.slot_cost} />
            <Table.Cell content={this.getSlotGroupText(item.slot_group)} />
            <Table.Cell content={item.slot_membersonly ? 'Yes' : 'No'} />
        </Table.Row>
    )

    render() {
        return (
            <section className={classes.facilitiesbox}>
                <form className="ui large">
                    <div className="content">
                        <Form>
                            {
                                this.state.flogo == '' ? (
                                    <Dropzone
                                        accept="image/*"
                                        multiple={false}
                                        className={classes.facilityLogo}
                                        onDrop={this.onLogoDrop}
                                    />
                                ) : (
                                    <Image
                                        src={this.state.flogo}
                                        size='small'
                                        floated='left'
                                        className={classes.facilityImage}
                                    />
                                )
                            }
                            <Form.Group widths={3}>
                                <Form.Field required>
                                    <label>Facility Name</label>
                                    <Input
                                        id="fname"
                                        icon='tag'
                                        type='text'
                                        iconPosition='left'
                                        placeholder='e.g. Tennis Court 1, Gym Room'
                                        value={this.state.fname}
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Field> 
                                <Form.Field required>
                                    <label>Facility Category</label>
                                    <Dropdown
                                        id="fcategory"
                                        search
                                        fluid
                                        selection
                                        placeholder='e.g. Tennis'
                                        options={categories}
                                        value={this.state.fcategory}
                                        onChange={this.handleDropdown}
                                    />
                                </Form.Field> 
                                <Form.Field required>
                                    <label>State</label>
                                    <Dropdown
                                        id="fstate"
                                        search
                                        selection
                                        placeholder='e.g. Enabled'
                                        options={states}
                                        value={this.state.fstate}
                                        onChange={this.handleDropdown}
                                    />
                                </Form.Field>  
                            </Form.Group>
                            <Form.Group widths={2}>
                                <Form.Field width={16}>
                                    <label>Headline or Short Description</label>
                                    <Input
                                        id="fdesc"
                                        type='text'
                                        icon='file alternate outline'
                                        iconPosition='left'
                                        placeholder='e.g. Gym Room for all your physical activities.'
                                        value={this.state.fdesc}
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Field>    
                            </Form.Group>   
                            <Form.Field>
                                <label>Brief explanation & Guidance</label>
                                <TextArea
                                    id="fbrief"
                                    placeholder='e.g. All members must carry a hand towel when training. We also strongly recommend everyone to carry water when exercising.'
                                    rows={3}
                                    value={this.state.fbrief}
                                    onChange={this.handleInputChange}
                                />
                            </Form.Field> 
                            <Form.Field>
                                <Form.Field>
                                    <Header>
                                        <center>
                                            <strong>Timeslot Information</strong>
                                        </center>
                                    </Header>
                                    <Table
                                        compact
                                        celled
                                        definition
                                        verticalAlign='center'
                                    >
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell />
                                                { this.getHeaderCell('Day','calendar alternate outline') }
                                                { this.getHeaderCell('Start', 'clock outline') }
                                                { this.getHeaderCell('End', 'clock outline') }
                                                { this.getHeaderCell('Cost', 'rupee sign') }
                                                { this.getHeaderCell('Group', 'users sign') }
                                                { this.getHeaderCell('Members Only', 'start outline') }
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {
                                                this.state.ftimeslot.map((item, key) => (
                                                    this.renderTimeSlots(item, key)
                                                ))
                                            }
                                        </Table.Body>
                                        <Table.Footer fullWidth>
                                            <Table.Row>
                                                <Table.HeaderCell colspan={7}>
                                                    <center>
                                                        <Button
                                                            size='tiny'
                                                            color='green'
                                                            icon 
                                                            onClick={() => {
                                                                this.setState({
                                                                    showAddTimeSlot: true
                                                                })
                                                            }}
                                                        >   
                                                            <Icon name='add left' />
                                                            Add
                                                        </Button>
                                                        <Button
                                                            size='tiny'
                                                            color='green'
                                                            icon
                                                            onClick={() => {
                                                                this.setState({
                                                                    showBulkAddTimeSlot: true
                                                                })
                                                            }}
                                                        >
                                                            <Icon name='add left' />
                                                            Bulk Add
                                                        </Button>
                                                    </center>
                                                </Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Footer>
                                    </Table>
                                </Form.Field>    
                            </Form.Field> 
                            <Header dividing>Cancellation Policies</Header>
                            <Form.Group widths={2}>
                                <Form.Field width={5} required>
                                    <label>Cancellation Policy</label>
                                    <Dropdown
                                        id="fcancel_policy"
                                        placeholder='e.g. Free Cancellation'
                                        selection
                                        options={policies}
                                        onChange={(e, data) => {
                                            e.persist()
                                            this.setState(state => ({
                                                fcancel_policy: {
                                                    ...state.fcancel_policy,
                                                    type: data.value
                                                }
                                            }))
                                        }}
                                        value={this.state.fcancel_policy.type}
                                    />
                                </Form.Field>
                                <Form.Field width={11} />
                            </Form.Group>  
                            {
                                this.state.fcancel_policy.type == 4 ? (
                                    this.renderCancellationForm()
                                ) : null
                            }
                            <Header dividing>Images</Header>
                            <Image.Group size='small'>
                                {
                                    this.state.fgallery.map((item ,key) => (
                                        <Image
                                            src={item}
                                            key={key}
                                            className={classes.galleryImages}
                                        />
                                    ))
                                }
                                <div
                                    id="upload_event_image" 
                                    className="ui tiny green labeled icon button"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        document.querySelector('#f_img').click();
                                    }}
                                >
                                    <input 
                                        type="file" 
                                        id="f_img" 
                                        className={classes.uploadInput}
                                        onChange={this.handleImageDrop}
                                    />
                                    <i className="upload icon" />
                                    <label style={{ cursor: 'pointer' }}>Upload</label>
                                </div>
                            </Image.Group>
                            <center>
                                <Button
                                    color='red'
                                    className="trans5"
                                    icon
                                    disabled={this.props.isLoading}
                                    onClick={() => {
                                        this.props.history.push("/facilities")
                                    }}
                                >
                                    <Icon name='chevron left' />Back
                                </Button>
                                <Button
                                    className="sgcolorhover trans5"
                                    icon
                                    labelPosition='right'
                                    loading={this.props.isLoading}
                                    onClick={this.handleFormSubmit}
                                >
                                    { 
                                        this.props.location.edit_facility ? 'Update' : 'Create'
                                    }
                                    <Icon name='check' />
                                </Button>
                            </center>
                        </Form>    
                    </div>
                </form>
                {
                    this.state.showAddTimeSlot ? (
                        <AddTimeSlot
                            open={this.state.showAddTimeSlot}
                            handleClose={() => {
                                this.setState({
                                    showAddTimeSlot: false
                                })
                            }}
                            handleAddTimeSlot={this.handleAddTimeSlot}
                        />
                    ) : null
                }
                {
                    this.state.showDeleteTimeSlot ? (
                        <DeleteTimeSlot
                            open={this.state.showDeleteTimeSlot}
                            handleClose={() => {
                                this.setState({
                                    showDeleteTimeSlot: false
                                })
                            }}
                            index={this.state.slotIndexToDelete}
                            handleDelete={this.handleDeleteTimeSlot}
                        />
                    ) : null
                }
                {
                    this.state.showBulkAddTimeSlot ? (
                        <BulkAddTimeSlot
                            open={this.state.showBulkAddTimeSlot}
                            handleClose={() => {
                                this.setState({
                                    showBulkAddTimeSlot: false
                                })
                            }}
                            handleAddTimeSlot={this.handleAddTimeSlot}
                        />
                    ) : null
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

const mapStateToProps = state => (
    {
        business: state.currentBusinessList,
        isLoading: state.isLoading
    }
)

const mapDispatchToProps = dispatch => (
    bindActionCreators({ showLoading }, dispatch)
)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddFacility))