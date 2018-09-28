import React from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import classes from './Facilities.local.scss'

import { API } from 'aws-amplify'
import { connect } from 'react-redux'

import AddBuilding from './AddBuilding/index'
import Bookings from './Bookings/index'
import Transactions from './Transactions/index'
import ShowBuilding from './ShowBuilding/index'

class Facilities extends React.Component {

    state = {
        activeItem: '',
        activeItemIndex: 0,
        buildings: [],
        bookings: []
    }

    async componentDidMount() {
        const { message } = await API.get('facility', `/building/list/${this.props.business.bizid}`) 
        const response = await API.get('facility', `/booking/txns/${this.props.business.bizid}`)
        console.log(response)
        this.setState({
            buildings: message,
            bookings: response.message
        })
    }

    handleItemSelect = async (e, { name, id }) => {
        await this.setState({
            activeItem: name,
            activeItemIndex: id
        })
        this.props.facilitiesButtonState(this.state.activeItemIndex)
    }

    handleAddBuilding = building => {
        const buildings = Array.from(this.state.buildings)
        buildings.push(building)
        this.setState({
            buildings: buildings
        })
    }

    handleModifyBuilding = building => {
        console.log(building)
        const buildings = this.state.buildings.map(item => {
            if(item.buildid == building.buildid) {
                return building
            }
            return item
        })
        this.setState({
            buildings: buildings
        })
    }

    handleDeleteBuilding = building => {
        const buildings = this.state.buildings.filter(item => item.buildid != building.buildid)
        this.setState({
            buildings: buildings
        })
    }

    handleDeleteFacility = (findex, buildid) => {
        const building_index = this.state.buildings.findIndex(item => item.buildid == buildid)
        const buildings = Array.from(this.state.buildings)
        const building = buildings[building_index]
        building['facility'] = building.facility.filter((_, key) => key != findex)
        buildings[building_index] = building
        this.setState({
            buildings: buildings
        })

    }

    getAllFacilities = () => {
        var facilities = []
        this.state.buildings.map(item => {
            facilities.push(...item.facility)
        })
        return facilities
    }

    render() {
        return (
            <section className={classes.facilitiesbox}>
                <Menu secondary pointing>
                    <Menu.Item
                        id="0"
                        className={
                            this.state.activeItemIndex == 0
                                ? classes.itemColor2
                                : classes.itemColor
                        }
                        name="overview"
                        active={this.state.activeItemIndex == 0}
                        onClick={this.handleItemSelect}
                    >
                    </Menu.Item> 
                    <Menu.Item
                        id="1"
                        className={
                            this.state.activeItemIndex == 1
                                ? classes.itemColor2
                                : classes.itemColor
                        }
                        name="bookings"
                        active={this.state.activeItemIndex == 1}
                        onClick={this.handleItemSelect}
                    >
                    </Menu.Item>
                    <Menu.Item
                        id="2"
                        className={
                            this.state.activeItemIndex == 2
                                ? classes.itemColor2
                                : classes.itemColor
                        }
                        name="transactions"
                        active={this.state.activeItem == 2}
                        onClick={this.handleItemSelect}
                    >
                    </Menu.Item>   
                </Menu>
                <Segment
                    attached='bottom'
                    compact={false}
                >
                    {
                        this.state.activeItemIndex == 0 ? (
                            this.state.buildings.map((item, key) => (
                                <ShowBuilding
                                    building={item}
                                    key={key}
                                    handleDelete={this.handleDeleteBuilding}
                                    handleModify={this.handleModifyBuilding}
                                    handleDeleteFacility={this.handleDeleteFacility}
                                />
                            ))
                        ) : null
                    }
                    {
                        this.state.activeItemIndex == 1 ? (
                            <Bookings
                                facilities={this.getAllFacilities()}
                                bookings={this.state.bookings}
                                showAddBooking={this.props.showAddBookingFacilities}
                                handleAddBookingModal={this.props.handleAddBookingModal}
                            />
                        ) : null
                    }
                    {/* {
                        this.state.activeItemIndex == 2 ? (
                            <Transactions

                            />
                        ) : null
                    } */}
                </Segment>
                {
                    this.props.showAddBuildingModal ? 
                    <AddBuilding
                        open={this.props.showAddBuildingModal}
                        handleClose={this.props.handleAddBuildingModal}
                        handleAdd={this.handleAddBuilding}
                    />
                    : null
                }    
            </section>    
        )
    }
}

const mapStateToProps = state => ({
    business: state.currentBusinessList
})

export default connect(mapStateToProps, null)(Facilities)