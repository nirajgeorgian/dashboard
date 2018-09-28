import React from 'react'
import { Modal, Header, Button, Icon } from 'semantic-ui-react'

const DeleteTimeSlotModal = ({ open, handleClose, handleDelete, index }) => (
    <Modal open={open} onClose={handleClose} size='tiny'>
        <Modal.Header>Removing the slot</Modal.Header>
        <Modal.Content>
            <Modal.Description>
                <Header color='red' content='Do you want to remove this slot?' />
                <p>You will not be able to revert this change if you proceed.</p>
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
                color='red'
                labelPosition='right'
                icon
                onClick={() => handleDelete(index)}
            >
                Yep, Please remove
                <Icon name='close' />
            </Button>
        </Modal.Actions>
    </Modal>
)

export default DeleteTimeSlotModal