import React from 'react'
import { Modal, Header, Button, Icon, Form, Input } from 'semantic-ui-react'

import { setCurrentBusinessListFunc } from '../../../Actions/ActionsCreator/currentBusinessList/currentBusinessList'
import { bindActionCreators } from 'redux'

import { API } from 'aws-amplify'
import { connect } from 'react-redux'

import { showLoading } from '../../../Actions/index'
import moment from 'moment'

class AddYoutubeVideoModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      description: '',
      url: ''
    }
  }

  handelInputChange = e =>
    this.setState({
      [e.target.id]: e.target.value
    })

  handelAddYoutubeVideo = async () => {
    // logic to add youtube video will go here
    const data = Object.assign({}, this.state)
    data['date'] = moment(new Date()).format('D MMMM YYYY hh:mm A')

    this.props.showLoading()

    const business = Object.assign({}, this.props.business)
    const previous_urls = business.gallery.youtube_links ? business.gallery.youtube_links : []
    previous_urls.push(data)

    try {
      const response = await API.put("business", `/update/${this.props.business.bizid}`, {
        body: {
          youtube_links: previous_urls
        }
      })
      console.log(response)
      
      business.gallery.youtube_links = previous_urls
      await this.props.setCurrentBusinessListFunc(business)
      // this.props.handleAddVideo(data)
      this.props.toggelAddYoutubeVideoModal()

    } catch(e) {
      console.log(e)
    }
    this.props.showLoading()
  }

  render() {
    const { open, toggelAddYoutubeVideoModal } = this.props
    {
      return (
        <Modal onClose={toggelAddYoutubeVideoModal} open={open} size="small">
          <Modal.Header>Add YouTube Video</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Group widths={2}>
                <Form.Field width={6} required>
                  <label>Video title</label>
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
                  <label>Video Description</label>
                  <Input
                    action={{
                      color: 'teal',
                      icon: 'info'
                    }}
                    actionPosition="left"
                    type="text"
                    placeholder="e.g. Video explains about the overall sections of the event."
                    id="description"
                    onChange={this.handelInputChange}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Field required>
                <label>YouTube URL</label>
                <Input
                  action={{
                    color: 'teal',
                    icon: 'internet explorer'
                  }}
                  actionPosition="left"
                  type="text"
                  placeholder="e.g. www.youtube.com/watch?v=uGssDv318Oc"
                  id="url"
                  onChange={this.handelInputChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={toggelAddYoutubeVideoModal} negative disabled={this.props.isLoading}>
              Cancel
            </Button>
            <Button
              onClick={this.handelAddYoutubeVideo}
              positive
              icon
              labelPosition="right"
              loading={this.props.isLoading}
            >
              Add
              <Icon name="checkmark" />
            </Button>
          </Modal.Actions>
        </Modal>
      )
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(AddYoutubeVideoModal)
