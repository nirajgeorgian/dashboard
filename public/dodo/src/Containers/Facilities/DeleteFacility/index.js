import React from 'react'
import { Modal, Header, Checkbox, Button, Icon } from 'semantic-ui-react'

import { API } from 'aws-amplify'
import { connect } from 'react-redux'
import { showLoading } from '../../../Actions/index'

class DeleteFacility extends React.Component {
    
    state = {
        checked: false
    }

    handleSubmit = async () => {

        this.props.showLoading()

        try {
            const { business, index, buildid } = this.props
            const response = await API.del("facility",`/delete/${business.bizid}/${index}/${buildid}`)
            console.log(response)

            if(response.status) {
                this.props.handleDelete(index, buildid)
                this.props.handleClose()
            }
        } catch(e) {
            console.log(e)
        }
    }

    render() {
        const {
            open,
            handleClose
        } = this.props
        return (
            <Modal size='small' open={open} onClose={handleClose}>
                <Modal.Header>
                    Delete Facility - <a className='red text'>Gym Room</a>
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header color='red'>You have intended to delete this facility.</Header>
                        <p>Deleteing this facility will remove all the information about the facility and it's associated schedule information.</p>
                        <p>Is it okay to delete the facility with it's associated information & schedule?</p>
                        <Checkbox
                            style={{ tabIndex: '0'}}
                            label='I understand the consequences of my decision.'
                            onChange={(e, data) => {
                                this.setState({
                                    checked: data.checked
                                })
                            }}
                        />
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        positive
                        className="deny"
                        content='Nope'
                        disabled={this.props.isLoading}
                        onClick={handleClose}
                    />
                    <Button
                        color='red'
                        labelPosition='right'
                        icon
                        disabled={!this.state.checked}
                        loading={this.props.isLoading}
                        onClick={this.handleSubmit}
                    >
                        Yep, Please remove
                        <Icon name='close' />
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    business: state.currentBusinessList,
    isLoading: state.isLoading
})

export default connect(mapStateToProps, { showLoading })(DeleteFacility)