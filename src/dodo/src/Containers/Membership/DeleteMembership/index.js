import React from 'react'
import { Modal, Header, Checkbox, Button, Icon } from 'semantic-ui-react'

import { connect } from 'react-redux'

import { showLoading } from '../../../Actions/index'
import { API } from 'aws-amplify'

class DeleteMemberShip extends React.Component {

    state = {
        checkbox: false
    }

    handleCheckBox = (e, data) => {
        this.setState({
            checkbox: data.checked
        })
    }

    handleDeleteClicked = async event => {
        this.props.showLoading();
        try {
            const response = await API.del("membership","/delete", {
                body: {
                    business_id: this.props.membership.mems_bizid,
                    memsid: this.props.membership.mems_memsid
                }
            })
            // console.log(response);
            this.props.handleMembershipDeleted()
            this.props.showLoading();
            this.props.handleClose();

        } catch(e) {
            console.log(e)
            this.props.showLoading();
        }
    }

    render() {
        return (
            <Modal size='tiny' open={this.props.open} onClose={this.props.handleClose}>
                <Modal.Header>Remove Membership</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header color='red' content='You have intended to remove the membership.' />
                        <p>It will remove all the members, bookings and history of this membership. Is it okay to remove the membership?</p>
                        <Checkbox label='I understand the consequences of my decision.' onChange={this.handleCheckBox}/>
                    </Modal.Description>    
                </Modal.Content>    
                <Modal.Actions>
                    <Button positive className="deny" onClick={this.props.handleClose}>Nope</Button>
                    <Button color='red' icon labelPosition='right' disabled={!this.state.checkbox} onClick={this.handleDeleteClicked} loading={this.props.isLoading}>
                        <Icon name='close' />Yep, Please remove
                    </Button>
                </Modal.Actions>    
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        isLoading: state.isLoading
    }
}

export default connect(mapStateToProps, { showLoading })(DeleteMemberShip);