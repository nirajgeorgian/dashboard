import React from 'react';
import { Modal, Button, Icon } from 'semantic-ui-react'
import classes from './DeleteAccessModal.local.scss'

const DeleteAccess = ({ open, handleClose, handleDelete }) => (
    <Modal size="tiny" open={open} onClose={handleClose}>
        <Modal.Header>Removing the access</Modal.Header>
        <Modal.Content>
            <Modal.Description>
            <div className="ui header red text">Do you want to remove this access?</div>
            <p>Removing the access to revoke the permissions to existing members of this membership as well.</p>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <Button className={"ui positive deny " + classes.nopeBtn} content="Nope" onClick={handleClose} />
            <Button icon labelPosition="right" color='red' onClick={handleDelete} >
                <Icon name='close' />Yep, Please remove
            </Button>
        </Modal.Actions>            
    </Modal>
)

export default DeleteAccess;