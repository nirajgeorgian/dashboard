import React from 'react'
import { Segment, Card, List, Popup, Icon } from 'semantic-ui-react'

import Facility from './facilityItem'
import classes from './Building.local.scss'

import DeleteBuilding from '../DeleteBuilding/index'
import ModifyBuilding from '../AddBuilding/index'
import { withRouter } from 'react-router-dom'

const icons = [
    { key:0, text: 'Weelchair Access available on demand.', value: 'Wheelchair', icon: 'wheelchair'},
    { key:1, text: 'Shower facility is available here.', value: 'Shower', icon: 'shower'},
    { key:2, text: 'Locker facility is available here.', value: 'Locker Facility', icon: 'lock'},
    { key:3, text: 'Universal Access to the facilities.', value: 'Universal Access', icon: 'universal access'},
    { key:4, text: 'First-aid boxes are available in case of an emergency.', value: 'Firstaid', icon: 'medkit'},
    { key:5, text: 'Security Gaurd is available for protection.', value: 'Security Staff', icon: 'user secret'},
    { key:6, text: 'CCTV in operation for security purposes.', value: 'CCTV', icon: 'video'},
    { key:7, text: 'Fire extinguishers are located which will help during an emergency.', value: 'Fire Extinguisher', icon: 'fire extinguisher'},
    { key:8, text: 'Car Parking facility is available for the members.', value: 'Parking', icon: 'car'},
    { key:9, text: 'Reception available for more information & help.', value: 'Reception', icon: 'info'},
    { key:10, text: 'Cafeteria is available during business hours.', value: 'Cafeteria', icon: 'coffee'},
    { key:11, text: 'Vending Machine is available here.', value: 'Vending Machine', icon: 'braille'}
]

class Building extends React.Component {

    state = {
        facilities: [],
        showDeleteBuilding: false,
        showModifyBuilding: false
    }

    handleDeleteBuildingOpen = event => {
        this.setState({
            showDeleteBuilding: true
        })
    }

    handleModifyBuildingOpen = event => {
        this.setState({
            showModifyBuilding: true
        })
    }

    handleDeleteBuilding = building => {
        this.props.handleDelete(building)
    }

    handleModifyBuilding = building => {
        this.props.handleModify(building)
    }

    handleAddFacility = event => {
        this.props.history.push({
            pathname: '/facilities/add',
            building: this.props.building
        })
    }

    handleDeleteFacility = (index, buildid) => {
        this.props.handleDeleteFacility(index, buildid)
    }


    getIconWithPopup = (item ,key) => {
        const { text, icon } = icons.filter(data => data.value == item)[0]
        return (
            <Popup
                key={key}
                trigger={<Icon name={icon} />}
                content={text}
            />
        )
    }

    render() {
        const {
            building
        } = this.props
        return (
            // <Segment>
            <div>
                <Card.Group>
                    <Card className={classes.buildingdiv}>
                        <Card.Content>
                            <Card.Header>
                                {building.name}
                            </Card.Header>
                            <Card.Meta>
                                {building.desc}
                            </Card.Meta>
                            <Card.Description>
                                <Segment className={classes.facilitydiv}>
                                    <Card.Group stackable itemsPerRow={3}>
                                        {
                                            building.facility.map((item, key) => (
                                                <Facility
                                                    key={key}
                                                    facility={item}
                                                    index={key}
                                                    buildid={building.buildid}
                                                    handleDelete={this.handleDeleteFacility}
                                                />
                                            ))
                                        }
                                    </Card.Group>
                                </Segment>
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <List>
                                {
                                    building.rules.map((item, key) => (
                                        <List.Item key={key}>
                                            {key + 1}. {item.content}
                                        </List.Item>
                                    ))
                                }
                                <List.Item />
                            </List>
                        </Card.Content>
                        <Card.Content extra className={classes.buildingicons}>
                            {
                                building.accessibility.map((item, key) => (
                                    this.getIconWithPopup(item, key)
                                ))
                            }
                        </Card.Content>
                        <div class="ui four bottom attached buttons">
                            <div 
                                className="ui sgcolorhover button"
                                onClick={this.handleAddFacility}
                            ><i clasNames="add icon"></i>Add Facility</div>
                            <div 
                                className="ui green button"
                                onClick={this.handleModifyBuildingOpen}
                            ><i className="edit icon"></i>Modify</div>
                            <div 
                                className="ui red button"
                                onClick={this.handleDeleteBuildingOpen}
                            ><i className="close icon"></i>Remove</div>
                        </div>
                    </Card>
                </Card.Group>
                {
                    this.state.showDeleteBuilding ? (
                        <DeleteBuilding
                            open={this.state.showDeleteBuilding}
                            handleClose={() => {
                                this.setState({
                                    showDeleteBuilding: false
                                })
                            }}
                            building={building}
                            handleDelete={this.handleDeleteBuilding}
                        />
                    ) : null
                }
                {
                    this.state.showModifyBuilding ? (
                        <ModifyBuilding
                            open={this.state.showModifyBuilding}
                            handleClose={() => {
                                this.setState({
                                    showModifyBuilding: false
                                })
                            }}
                            building={building}
                            handleModify={this.handleModifyBuilding}
                        />
                    ) : null
                }
            </div>
            // </Segment>
        )
    }
}

export default withRouter(Building);