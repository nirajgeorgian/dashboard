import React from 'react'
import { Modal, Header, Segment, Checkbox, Button } from 'semantic-ui-react'

import { connect } from 'react-redux'
import { showLoading } from '../../../../Actions/index'

class NoShowBooking extends React.Component {

    state = {
        issueRefundRegardlessPolicy: false
    }

    handleMarkNoShow = event => {

    }
    
    render() {
        const {
            open,
            handleClose
        } = this.props
        return (
            <Modal size='tiny' open={open} onClose={handleClose} dimmer={'inverted'}>
                <Modal.Header>Mark as No Show</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header color='red' content="You have intended to mark the booking as No Show." />
                        <p>This will issue refund to the users as per the policy. Is it okay to mark the booking as no show?</p>
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
                        content="Cancel"
                        onClick={handleClose}
                        disabled={this.props.isLoading}
                    />
                    <Button
                        color='red'
                        content="Proceed"
                        loading={this.props.isLoading}
                        onClick={this.handleMarkNoShow}
                    />
                </Modal.Actions>        
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    isLoading: state.isLoading
})

export default connect(mapStateToProps, { showLoading })(NoShowBooking)