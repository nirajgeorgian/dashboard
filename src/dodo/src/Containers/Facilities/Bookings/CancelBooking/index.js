import React from 'react'
import { Modal, Checkbox, Segment, Header, Button, Icon } from 'semantic-ui-react'

import { connect } from 'react-redux'
import { showLoading } from '../../../../Actions/index'

class CancelBooking extends React.Component {
    state = {
        issueRefundRegardlessPolicy: false
    }

    handleCancelBooking = event => {

    }

    render() {
        const {
            open,
            handleClose
        } = this.props
        return (
            <Modal size='tiny' open={open} onClose={handleClose} dimmer={'inverted'}>
                <Modal.Header>Cancelling the booking</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header color='red' content="You have intended to cancel the booking." />
                        <p>This will issue refund to the users as per the policy. Is it okay to cancel the booking?</p>
                        <Segment>
                            <div className="inline field">
                                <Checkbox
                                    label="Issue full refund (after the service fee) regardless of the policy."
                                    onChange={(_, data) => {
                                        this.setState({
                                            issueRefundRegardlessPolicy: data.checked
                                        })
                                    }}
                                />
                            </div>
                        </Segment>    
                    </Modal.Description>    
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        positive
                        className="deny"
                        content="Back"
                        onClick={handleClose}
                        disabled={this.props.isLoading}
                    />
                    <Button
                        color='red'
                        content="Cancel Booking"
                        loading={this.props.isLoading}
                        onClick={this.handleCancelBooking}
                    />
                </Modal.Actions>        
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    isLoading: state.isLoading
})

export default connect(mapStateToProps, { showLoading })(CancelBooking)