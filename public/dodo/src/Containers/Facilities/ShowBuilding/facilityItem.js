import React from 'react'
import { Card , Image, Icon, Popup} from 'semantic-ui-react'

import classes from './FacilityItem.local.scss'

import { withRouter } from 'react-router-dom'

import DeleteFacility from '../DeleteFacility/index'

class FacilityItem extends React.Component {

    state = {
        showDeleteFacility: false,
    }

    getStatusTrigger = state => {
        if(state == 0) {
            return (
                <div>
                    <Icon 
                        name='check circle outline'
                        color='green'
                    />
                    Enabled
                </div>
            )
        } else {
            return (
                <div>
                    <Icon 
                        name='times circle outline'
                        color='red'
                    />
                    Disabled
                </div>
            )
        }
    }

    getStatusText = state => {
        if(state == 0) {
            return "Enabled and receiving bookings."
        } else {
            return "Disabled and Won't accept any bookings."
        }
    }

    handleDelete = (index, buildid) => {
        this.props.handleDelete(index, buildid)
    }

    handleEditFacility = event => {
        this.props.history.push({
            pathname: "/facilities/add",
            edit_facility: {
                facility: this.props.facility,
                buildid: this.props.buildid,
                index: this.props.index
            }
        })
    }

    handleCloneFacility = event => {
        this.props.history.push({
            pathname: "/facilities/add",
            clone_facility: {
                facility: this.props.facility,
                buildid: this.props.buildid
            }
        })
    }

    render() {
        const {
            facility,
            buildid,
            index
        } = this.props
        return (
            <div>
                <Card>
                    <Image src={facility.flogo} />
                    <Card.Content>
                        <Card.Header>
                            {facility.fname}
                        </Card.Header>
                        <Card.Description>
                            {facility.fdesc}
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <span className={classes.icons}>
                            <Popup
                                content='Edit this Facility'
                                trigger={<Icon 
                                            name='edit' 
                                            color='green' 
                                            style={{ cursor: 'pointer' }}
                                            onClick={this.handleEditFacility}
                                        />}
                            />
                            <Popup
                                content='Delete this Facility'
                                trigger={<Icon 
                                            name='trash' 
                                            color='red'
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                this.setState({
                                                    showDeleteFacility: true
                                                })
                                            }}
                                        />}
                            />
                            <Popup
                                content='Clone this Facility'
                                trigger={<Icon 
                                            name='clone' 
                                            color='blue'
                                            style={{ cursor: 'pointer' }}
                                            onClick={this.handleCloneFacility}
                                        />}
                            />
                        </span>
                        <Popup
                            trigger={this.getStatusTrigger(facility.fstate)}
                            content={this.getStatusText(facility.fstate)}
                        />
                    </Card.Content>
                </Card>
                {
                    this.state.showDeleteFacility ? (
                        <DeleteFacility
                            open={this.state.showDeleteFacility}
                            handleClose={() => {
                                this.setState({
                                    showDeleteFacility: false
                                })
                            }}
                            handleDelete={this.handleDelete}
                            facility={facility}
                            buildid={buildid}
                            index={index}
                        />
                    ) : null
                }
            </div>
        )
    }
}

export default withRouter(FacilityItem)