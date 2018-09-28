import React from 'react'
import { Modal, Header, Button, Icon, Form, Input } from 'semantic-ui-react'

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

  handelAddYoutubeVideo = () => {
    // logic to add youtube video will go here
    this.props.handleAddVideo(this.state)
  }

  render() {
    const { open, handleClose } = this.props
    {
      return (
        <Modal onClose={handleClose} open={open} size="small">
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
            <Button onClick={handleClose} negative>
              Cancel
            </Button>
            <Button
              onClick={this.handelAddYoutubeVideo}
              positive
              icon
              labelPosition="right"
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

export default AddYoutubeVideoModal
