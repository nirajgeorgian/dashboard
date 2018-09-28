import React from 'react'
import { Segment, Header, TextArea, Form, Input, Popup, Icon, Button, Checkbox } from 'semantic-ui-react';
import classes from './AboutUs.local.scss'

import { connect } from 'react-redux'
import { API } from 'aws-amplify'
import { bindActionCreators } from 'redux'

import { showLoading } from '../../../Actions/index'
import { setCurrentBusinessListFunc } from '../../../Actions/ActionsCreator/currentBusinessList/currentBusinessList'

class AboutUs extends React.Component {

    state = {
        about: '',
        general_info: '',
        history: '',
        confirm: false,
        achievements: [
            {
                awards_name: '',
                awards_year: '',
                awards_comment: ''
            }
        ]
    }

    componentDidMount() {
        const business = this.props.business
        this.setState({
            about: business.about,
            general_info: business.biz_info,
            history: business.history,
            achievements: business.awards
        })
    }

    componentWillReceiveProps(props) {
        const business = props.business
        this.setState({
            about: business.about,
            general_info: business.biz_info,
            history: business.history,
            achievements: business.awards
        })
    }

    handleInputChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    hanldeCheckbox = (e, data) => {
        this.setState({
            [data.id]: data.checked
        })
    }

    handleReset = event => {
        this.setState({
            about: '',
            general_info: '',
            history: '',
            confirm: false,
            achievements: [
                {
                    awards_name: '',
                    awards_year: '',
                    awards_comment: ''
                }
            ]
        })

    }

    handleAdd = event => {
        const achievement = {
            awards_name: '',
            awards_year: '',
            awards_comment: ''
        }
        const achievements = Array.from(this.state.achievements)
        achievements.push(achievement);
        this.setState({
            achievements: achievements
        })
    }

    removeRow = index => {
        const achievements = this.state.achievements.filter(( _,key) => key != index )
        this.setState({
            achievements: achievements
        })
    }

    renderRows = key => {
        return (
            <Form.Group widths="4">
                <Form.Field className="teal required" width="5">
                    <Input 
                        iconPosition='left' 
                        icon='trophy' 
                        type='text' 
                        placeholder='e.g. Best Club of the Year 2018' 
                        value={this.state.achievements[key].awards_name}
                        onChange={e => {
                            e.persist()
                            this.setState(state => ({
                                ...state,
                                achievements: [
                                    ...state.achievements.slice(0, key),
                                    { ...state.achievements[key], awards_name: e.target.value},
                                    ...state.achievements.slice(key + 1)
                                ]
                            }))
                        }}
                    />
                </Form.Field>
                <Form.Field className="teal required" width="3">
                    <Input 
                        iconPosition='left' 
                        icon='calendar alternate outline' 
                        type='text' 
                        placeholder='Month acheived' 
                        value={this.state.achievements[key].awards_year}
                        onChange={e => {
                            e.persist()
                            this.setState(state => ({
                                ...state,
                                achievements: [
                                    ...state.achievements.slice(0, key),
                                    { ...state.achievements[key], awards_year: e.target.value},
                                    ...state.achievements.slice(key + 1)
                                ]
                            }))
                        }}    
                    />
                </Form.Field>
                <Form.Field className="teal required" width="7">
                    <Input
                        type='text'  
                        placeholder='e.g. We performed well and got this award for 2018.' 
                        value={this.state.achievements[key].awards_comment}
                        onChange={e => {
                            e.persist()
                            this.setState(state => ({
                                ...state,
                                achievements: [
                                    ...state.achievements.slice(0, key),
                                    { ...state.achievements[key], awards_comment: e.target.value},
                                    ...state.achievements.slice(key + 1)
                                ]
                            }))
                        }}
                    />
                </Form.Field>
                <Form.Field width="1">
                    <Popup 
                        trigger={<Icon name='file image outline' style={{ cursor: 'pointer'}} color='blue' className={classes.iconPadding}/>} 
                        content='Click here to upload the image of the recognition.' 
                    />
                    <Popup 
                        trigger={<Icon name='trash' style={{ cursor: 'pointer'}} color='red' className={classes.iconPadding} onClick={() => this.removeRow(key)}/>} 
                        content='Click here to remove this recognition.' 
                    />
                </Form.Field>
            </Form.Group>
        )
    }

    handleSave = async event => {
        console.log(this.state);
        this.props.showLoading();

        // const data = Object.assign({}, this.state)
        let business_id = this.props.business.bizid
        try {
            const response = await API.put("business", `/update/${business_id}`, {
                body: {
                    business_about: this.state.about,
                    business_history: this.state.history,
                    business_info: this.state.general_info,
                    business_awards : this.state.achievements
                }
            })

            if(response) {
                const business = Object.assign({}, this.props.business)
                business.about = this.state.about
                business.history = this.state.history
                business.biz_info = this.state.general_info
                business.awards = this.state.achievements

                await this.props.setCurrentBusinessListFunc(business)
            }

            console.log(response);
        } catch(e) {
            console.log(e);
        }

        this.props.showLoading()
    }

    render() {
        return(
            <Segment attached='bottom'>  
                <Form>
                    <Header as='h3' dividing className={classes.sgcolor}>About your business</Header>
                    <Form.Field>
                        <TextArea 
                            rows="5" 
                            id="about" 
                            value={this.state.about} 
                            placeholder="Explain about your business and its facilities in detail." 
                            onChange={this.handleInputChange}
                        />
                    </Form.Field>    
                    <Header as='h3' dividing className={classes.sgcolor}>General Information</Header>
                    <Form.Field>
                        <TextArea 
                            rows="5" 
                            id="general_info"
                            value={this.state.general_info} 
                            placeholder="General information to the users which can provide more information about memberships & events" 
                            onChange={this.handleInputChange}
                        />
                    </Form.Field>    
                    <Header as='h3' dividing className={classes.sgcolor}>History</Header>
                    <Form.Field>
                        <TextArea 
                            rows="5" 
                            id="history" 
                            value={this.state.history} 
                            placeholder="If you have a history, Please mention here." 
                            onChange={this.handleInputChange}
                        />
                    </Form.Field>    
                    <Header as='h3' dividing className={classes.sgcolor}>Awards & Recognition</Header>
                    <Form.Field>
                        {
                            this.state.achievements.map((_, key) => {
                                return this.renderRows(key)
                            })
                        }
                    </Form.Field>
                    <center>
                        <Form.Field className="required">
                            <Button color='green' size='tiny' content='Add' onClick={this.handleAdd}/>
                        </Form.Field>
                    </center>  
                    <br />
                    <Form.Field>
                        <Form.Group widths="2">
                            <Form.Field width="12" className="required">
                                <Checkbox 
                                    label='I confirm the above mentioned information are correct.' 
                                    id="confirm" 
                                    checked={this.state.confirm}
                                    onChange={this.hanldeCheckbox} 
                                />
                            </Form.Field>
                            <Form.Field width="4">
                                <Button color='red' content='Reset' onClick={this.handleReset}/>
                                <Button 
                                    primary 
                                    content='Save' 
                                    onClick={this.handleSave} 
                                    loading={this.props.isLoading} 
                                    disabled={!this.state.confirm}
                                />
                            </Form.Field>
                        </Form.Group>
                    </Form.Field>          
                </Form>    
            </Segment>    
        )
    }
}

function mapStateToProps(state) {
    return {
        isLoading: state.isLoading,
        business: state.currentBusinessList
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ showLoading, setCurrentBusinessListFunc }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutUs);