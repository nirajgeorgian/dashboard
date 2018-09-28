import React from 'react'
import { Modal, Header, Button, Icon } from 'semantic-ui-react';

import { connect } from 'react-redux'
import { showLoading } from '../../../../Actions/index'

import { API } from 'aws-amplify'


class DeleteMember extends React.Component {

    handleDelete = async event => {
        this.props.showLoading()
        console.log(this.props.member_to_delete);
        try {
            const response = await API.del("members", "/delete", {
                body: {
                    mem_id: this.props.member_to_delete.mem_id
                }
            })
            console.log(response);
            this.props.showLoading();     
            this.props.handleDeleteMember(this.props.member_to_delete)
            this.props.handleClose();
        } catch(e) {
            console.log(e);
            this.props.showLoading(); 
        }
        // console.log(this.props.member_to_delete);
        console.log("Inside delete");
    }

    render() {
        return (
            <Modal size='tiny'open={this.props.open} onClose={this.props.handleClose}>
            <Modal.Header>Remove user's membership</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Header color='red' content='You have intended to remove the membership of this user.' />
                    <p>Is it okay to remove the membership for the user?</p>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button positive className="deny" content='Nope' onClick={this.props.handleClose} />
                <Button color='red' icon labelPosition='right' onClick={this.handleDelete} loading={this.props.isLoading}>
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

export default connect(mapStateToProps, { showLoading })(DeleteMember);