import React from 'react'
import { Modal, Header, Checkbox, Button, Icon } from 'semantic-ui-react'

import { API } from 'aws-amplify'

import { showLoading } from '../../../Actions/index'
import { connect } from 'react-redux';

class DeleteEventModal extends React.Component {

    state = {
        checked: false
    }

    handleCheckBox = (e, data) => {
        this.setState({
            checked: data.checked
        })
    }

    handleDeleteEvent = async e => {
        this.props.showLoading()

        let event_id = this.props.event_id
        try {
            const response = await API.del("events", "/delete", {
                body: {
                    event_id: event_id,
                    business_id: this.props.business.bizid
                }
            })
            console.log(response)
            this.props.showLoading()
            this.props.handleDeleteEvent(event_id)
        } catch(e) {
            console.log(e)
            this.props.showLoading()
        }
        
    }

    render() {
        const { open, handleClose } = this.props
        return(
            <Modal open={open} size='tiny' onClose={handleClose}>
                <Modal.Header>Remove Event</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header color='red' content='You have intended to remove the event.' />
                        <p>It will remove all the account information, bookings and history of this event. Is it okay to remove the event?</p>
                        <Checkbox
                            onChange={this.handleCheckBox} 
                            label='I understand the consequences of my decision.' 
                        />
                    </Modal.Description>    
                </Modal.Content>
                <Modal.Actions>
                    <Button 
                        positive
                        className="deny"
                        onClick={handleClose}
                        content='Nope'
                    />
                    <Button
                        className="red right"
                        icon 
                        labelPosition='right'
                        loading={this.props.isLoading}
                        disabled={!this.state.checked}
                        onClick={this.handleDeleteEvent}
                    >
                        <Icon name='close' />
                        Yep, Please remove
                    </Button>    
                </Modal.Actions>        
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        isLoading: state.isLoading,
        business: state.currentBusinessList
    }
}

export default connect(mapStateToProps, { showLoading })(DeleteEventModal);