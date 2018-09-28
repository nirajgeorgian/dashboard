import React from 'react';
import { Card, Icon, Popup } from 'semantic-ui-react'
import classes from './DefinitionCards.local.scss'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

const statusText = [
    { key:0, text: 'Active'},
    { key:1, text: 'Stopped taking new registrations'},
    { key:2, text: 'Disabled'}
]

class DefinitionCard extends React.Component {

    getStateColor = () => {
        if(this.props.status == 0)
            return 'green'
        else if(this.props.status == 1) 
            return 'orange'
        else 
            return 'red'        
    }
    
    getStatus = () => {
        const data = statusText.filter(item => item.key == this.props.status);
        if(data[0])
            return data[0].text
    }

    handleCardClick = event => {
        this.props.handleClick(this.props.membership);
    }

    handleMembershipDelete = event => {
        event.stopPropagation();
        this.props.handleDelete(this.props.membership)
    }

    handleClone = event => {
        event.stopPropagation();
        // this.props.handleClone(this.props.membership);
        this.props.history.push({
            pathname: "/memberships/add",
            mems_to_clone: this.props.membership
        })
        // console.log(this.props.membership)
    }

    render() {
        return (
            <Card link onClick={this.handleCardClick}>
                <div className={classes.packagevalue} style={{ backgroundColor: this.props.itemColor}}>{this.props.amount}</div>
                <Card.Content>
                    <Card.Header content={this.props.content}/>
                    <Card.Meta content={this.props.meta} />
                    <Card.Description content={this.props.description} />
                </Card.Content>
                <Card.Content extra>
                <span className="right floated">
                    <Popup trigger={<Icon name='circle' color={this.getStateColor()}/>} content={this.getStatus()} onClick={(e) => e.stopPropagation()}/>
                    <Popup trigger={<Icon name='edit' color='green' />} content='Edit this Membership' />
                    <Popup trigger={<Icon name='trash' color='red' onClick={this.handleMembershipDelete}/>} content='Delete this Membership' />
                    <Popup trigger={<Icon name='clone' color='blue' onClick={this.handleClone} />} content='Clone this Membership' />
                </span>
                <span className={"text " + classes.textColor}>
                    <Icon name='user' />
                    {this.props.members} Members
                </span>    
            </Card.Content>      
        </Card>
        )
    }
}

function mapStateToProps(state) {
    return {
        state
    }
}

export default withRouter(connect(mapStateToProps, null)(DefinitionCard));