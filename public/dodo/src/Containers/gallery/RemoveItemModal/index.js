import React from 'react'
import { Modal, Header, Button, Icon } from 'semantic-ui-react'

import { setCurrentBusinessListFunc } from '../../../Actions/ActionsCreator/currentBusinessList/currentBusinessList'
import { bindActionCreators } from 'redux'
import { showLoading } from '../../../Actions/index'
import { API } from 'aws-amplify'
import { connect } from 'react-redux'

class RemoveItemModal extends React.Component {
  
  handleRemove = () => {
    if(this.props.image) {
      this.handleRemoveImage()
    } else {
      this.handleRemoveVideo()
    }
  }

  getVideoId = video => video.url.split('=')[1]

  handleRemoveVideo = async () => {
    this.props.showLoading()

    try {
      const videoId = this.props.videoId
      const youtube_urls = this.props.business.gallery.youtube_links.filter(video => {
        if(this.getVideoId(video) != videoId) {
          return video
        }
      })

      const response = await API.put("business", `/update/${this.props.business.bizid}`, {
        body: {
          youtube_links: youtube_urls
        }
      })

      if(response) {
        const business = Object.assign({}, this.props.business)
        business.gallery.youtube_links = youtube_urls
        await this.props.setCurrentBusinessListFunc(business)
      }

      console.log(response);
      this.props.toggelRemoveItemModal()
    } catch(e) {
      console.log(e)
    }
    this.props.showLoading()
  }

  getImageKey = image => image.substring(64)

  handleRemoveImage = async () => {
    this.props.showLoading()

    try {

      const photos = this.props.business.gallery.photos.filter(photo => {
        if(this.getImageKey(photo.photo_file) != this.getImageKey(this.props.image)) {
          return photo
        }
        
      })
      const response = await API.put("business", `/update/${this.props.business.bizid}`, {
        body: {
          photos: photos
        }
      })

      if(response) {
        const business = Object.assign({}, this.props.business)
        business.gallery.photos = photos
        await this.props.setCurrentBusinessListFunc(business)
      }
      console.log(response)
      this.props.toggelRemoveItemModal()

    } catch(e) {
      console.log(e)
    }
    this.props.showLoading()
  }

  render() {
    const {
      open,
      toggelRemoveItemModal,
      image = true,
      handelRemove
    } = this.props
    return (
      <Modal onClose={toggelRemoveItemModal} open={open} size="tiny">
        <Modal.Header>
          {image ? 'Remove the image' : 'Remove the YouTube Video'}
        </Modal.Header>
        <Modal.Content>
          <Header as="h3" color="red">
            {image
              ? 'You have intended to remove the image.'
              : 'You have intended to remove the video.'}
          </Header>
          <p>
            {image
              ? 'Is it okay to delete the image permanently from sagepass?'
              : 'Is it okay to remove the YouTube video link from your business?'}
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={toggelRemoveItemModal} positive disabled={this.props.isLoading}>
            Nope
          </Button>
          <Button 
            onClick={this.handleRemove} 
            negative 
            icon 
            labelPosition="right"
            loading={this.props.isLoading}>
            Yep, Please remove
            <Icon name="close" />
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
  return bindActionCreators({ setCurrentBusinessListFunc, showLoading }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RemoveItemModal)
