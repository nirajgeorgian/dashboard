import React from 'react'
import { Modal, Header, Icon, Button } from 'semantic-ui-react'

import { API } from 'aws-amplify'
import { connect } from 'react-redux'

class DeleteBuilding extends React.Component {

    state = {
        loading: false
    }

    deleteBuilding = async event => {
        await this.setState({
            loading: true
        })

        try {
            const building = Object.assign({} ,this.props.building)
            const response = await API.del('facility',`/building/delete/${this.props.business.bizid}/${building.buildid}`)
            console.log(response)
            if(response.status) {
                this.props.handleDelete(building)
                this.setState({
                    loading: false
                }, () => this.props.handleClose())
            }
        } catch(e) {
            console.log(e)
            this.setState({
                loading: false
            })
        }
        
    }

    render() {
        return (
            <Modal size='small' open={this.props.open} onClose={this.props.handleClose}>
                <Modal.Header>
                    Delete Building - <a class="red text">Main Sports Hall</a>
                </Modal.Header>    
                <Modal.Content>
                    <Modal.Description>
                        <Header color='red'>You have intended to delete this building.</Header>
                        <p>Deleteing this building will remove all the information about the building and it's associated facilities.</p>
                        <p>Is it okay to delete the building with it's associated facilities?</p>
                    </Modal.Description>    
                </Modal.Content>  
                <Modal.Actions>
                    <Button 
                        positive
                        className="deny"
                        content="Nope"
                        disabled={this.state.loading}
                        onClick={this.props.handleClose}
                    />   
                    <Button
                        color='red'
                        icon
                        labelPosition='right'
                        onClick={this.deleteBuilding}
                        loading={this.state.loading}
                    >   Yep, Please remove
                        <Icon name='close' />
                    </Button> 
                </Modal.Actions>      
            </Modal>
        )
    }
}

const mapStateToProps = state => (
    {
        business: state.currentBusinessList
    }
)

export default connect(mapStateToProps, null)(DeleteBuilding);