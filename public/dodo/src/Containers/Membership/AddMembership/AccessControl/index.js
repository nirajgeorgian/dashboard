import React from 'react'
import { Table, Tab, Icon, Popup } from 'semantic-ui-react'

const AccessControl = ({ line1 , line2, line3, handleDelete, handleEdit}) => (
    <Table.Row>
        <Table.Cell collapsing>
            <Popup trigger={<Icon name='edit' color='blue' onClick={handleEdit}/>} content='Edit this access.' />
            <Popup trigger={<Icon name='trash' color='red' onClick={handleDelete}/>} content='Remove this access.' />
        </Table.Cell>
        <Table.Cell>{line1}</Table.Cell>
        <Table.Cell>{line2}</Table.Cell>
        <Table.Cell>{line3}</Table.Cell>    
    </Table.Row>    
)

export default AccessControl;