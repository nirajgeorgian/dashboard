import React from 'react'
import { Modal, Form, Input, Icon, Button } from 'semantic-ui-react'

import { API } from 'aws-amplify'
import { setCurrentBusinessListFunc } from '../../../Actions/ActionsCreator/currentBusinessList/currentBusinessList'
import { showLoading } from '../../../Actions/index'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class ModiyItem extends React.Component {

    state = {
        title: '',
        description: '',
        itemIndex: ''
    }

    getVideoId = video_url => video_url.split('=')[1]

    getImageKey = image => image.substring(64)

    async componentWillMount() {
        const business = this.props.business
        if(this.props.image) {
            const index = await business.gallery.photos.
                    findIndex(photo => this.getImageKey(photo.photo_file) == this.getImageKey(this.props.item))
            this.setState({
                itemIndex: index,
                title: business.gallery.photos[index].title,
                description: business.gallery.photos[index].description
            })
        } else {
            const index = await business.gallery.youtube_links.
                    findIndex(video => this.getVideoId(video.url) == this.getVideoId(this.props.item))
            this.setState({
                itemIndex: index,
                title: business.gallery.youtube_links[index].title,
                description: business.gallery.youtube_links[index].description
            })
        }
    }

    validator = () => {
        return this.state.title.length &&
                this.state.description.length
    }

    handleInputChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleUpdate = e => {
        if(this.props.image) {
            this.handleUpdateImageData()
        } else {
            this.handleUpdateVideoData()
        }
    }

    handleUpdateImageData = async () => {
        this.props.showLoading()

        try {
            const business = Object.assign({}, this.props.business)
            const photos = Array.from(business.gallery.photos)
            const photoObject = photos[this.state.itemIndex]
            photoObject['title'] = this.state.title
            photoObject['description'] = this.state.description
            photos[this.state.itemIndex] = photoObject

            const response = await API.put("business", `/update/${business.bizid}`, {
                body: {
                    photos
                }
            })
            console.log(response)
            if(response) {
                business.gallery.photos = photos
                await this.props.setCurrentBusinessListFunc(business)
                this.props.handleClose()
            }
            
        } catch (e) {
            console.log(e)
        }

        this.props.showLoading()
    }

    handleUpdateVideoData = async () => {
        this.props.showLoading()

        try {
            const business = Object.assign({}, this.props.business)
            const youtube_links = Array.from(business.gallery.youtube_links)
            const linkObject = youtube_links[this.state.itemIndex]
            linkObject['title'] = this.state.title
            linkObject['description'] = this.state.description
            youtube_links[this.state.itemIndex] = linkObject

            const response = await API.put("business",`/update/${business.bizid}`, {
                body: {
                    youtube_links
                }
            })

            console.log(response)
            if(response) {
                business.gallery.youtube_links = youtube_links
                await this.props.setCurrentBusinessListFunc(business)
                this.props.handleClose()
            }
            
        } catch (e) {
            console.log(e)
        }

        this.props.showLoading()
    }

    render() {
        return (
            <Modal open={this.props.open} onClose={this.props.handleClose} size='tiny' dimmer={'inverted'}>
                <Modal.Header>Modify Content</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form>
                            <Form.Field required>
                                <label>{this.props.image ? 'Image Title' : 'Video Title'}</label>
                                <Input 
                                    id="title"
                                    icon='tag' 
                                    type="text" 
                                    iconPosition='left' 
                                    value={this.state.title}
                                    onChange={this.handleInputChange}
                                />
                            </Form.Field>
                            <Form.Field required>
                                <label>{this.props.image ? 'Image Description' : 'Video Description'}</label>
                                <Input 
                                    id="description"
                                    icon='info' 
                                    type='text' 
                                    iconPosition='left' 
                                    value={this.state.description}
                                    onChange={this.handleInputChange}
                                />
                            </Form.Field>    
                        </Form>    
                    </Modal.Description>
                </Modal.Content> 
                <Modal.Actions>
                    <Button
                        color='red'
                        className="deny"
                        content='Cancel'
                        disabled={this.props.isLoading}
                        onClick={this.props.handleClose}
                    />
                    <Button
                        positive
                        icon
                        labelPosition='right'
                        disabled={!this.validator()}
                        loading={this.props.isLoading}
                        onClick={this.handleUpdate}
                    >   Update
                        <Icon name='checkmark' />
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        business: state.currentBusinessList,
        isLoading: state.isLoading
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setCurrentBusinessListFunc, showLoading },dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ModiyItem)

