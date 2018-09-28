import React from 'react'
import { Modal, Header, Button, Icon } from 'semantic-ui-react'

const DeleteDiscount = ({ open, handleClose, handleDelete }) => (
    <Modal open={open} size='tiny' onClose={handleClose}>
        <Modal.Header>Removing the Discount/Voucher</Modal.Header>
        <Modal.Content>
            <Modal.Description>
                <Header content='Do you want to remove this discount?' color='red' />
                <p>Removing this discount/voucher will prevent the users to use the voucher or avail the discount..</p>
            </Modal.Description>    
        </Modal.Content> 
        <Modal.Actions>
            <Button className="ui positive deny" content="Nope" onClick={handleClose} />
            <Button icon labelPosition='right' color='red' onClick={handleDelete}>
                <Icon name='close' />Yep, Please remove
            </Button>
        </Modal.Actions>       
    </Modal>
)

export default DeleteDiscount;