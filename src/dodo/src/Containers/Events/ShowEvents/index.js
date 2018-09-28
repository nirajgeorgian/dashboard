import React from 'react'
import { Card, Image, Popup, Icon, Label } from 'semantic-ui-react'

class ShowEvents extends React.Component {

    getMetaData = (event) => {
        if(event.event_members_only) 
            return <a>Members Only</a>
        else 
            return <a>₹ {event.event_entryfee}</a>   
    }

    getEventStateText = (state) => {
        if(state == 0) 
            return 'Active'
        else if (state == 1) 
            return 'Stopped taking bookings'
        else 
            return 'Disabled'    
    }

    getEventColor = (state) => {
        if(state == 0)
            return 'green'
        else if(state == 1)
            return 'orange'
        else 
            return 'red'
    }

    render() {
        const { event } = this.props
        console.log(event)
        return (
            <Card link>
                <Image src={event.event_logo ? event.event_logo : 'http://dev.sagepass.com:8081/img/patterns/p3_2_3.jpg'} />
                <Card.Content>
                    <Card.Header content={event.event_name} />
                    <Card.Meta content={this.getMetaData(event)} />
                    <Card.Description content={event.event_description} />   
                </Card.Content>  
                <Card.Content extra>
                    <span className="right floated">
                        <Popup
                            trigger={<Icon name='circle' color={this.getEventColor(event.event_state)} /> }
                            content={this.getEventStateText(event.event_state)}
                        />
                        <Popup
                            trigger={<Icon name='sync' color='green' />}
                            content='Repeating Event'
                        />
                        <Popup
                            trigger={<Icon 
                                        name='edit'
                                        color='green'
                                        onClick={() => this.props.editEvent(event.event_eventid)}
                                    />
                                    }
                            content='Edit this Event'
                        />
                        <Popup
                            trigger={<Icon 
                                        name='trash' 
                                        color='red'
                                        onClick={() => this.props.deleteEvent(event.event_eventid)} 
                                        />
                                    }
                            content='Delete this Event'
                        />
                        <Popup
                            trigger={<Icon 
                                        name='clone' 
                                        color='blue'
                                        onClick={() => this.props.handleCloneEvent(event.event_eventid)}
                                    />
                                    }
                            content='Clone this Event'
                        />        
                    </span>
                    <Popup
                        trigger={<span className="blue text">
                                    <i class="check circle outline icon"></i>
                                    {event.event_max_mem} Bookings
                                </span>}
                        content='Active & upcoming bookings'        
                    />
                </Card.Content>  
            </Card>    
        )
    }
}

export default ShowEvents;