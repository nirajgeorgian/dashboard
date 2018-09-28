import React from 'react'
import { Menu, Segment, Form, Header, TextArea, Popup, Icon, Button, Checkbox } from 'semantic-ui-react'
import classes from './TermsAndConditions.local.scss'
import { connect } from 'react-redux'

import { API } from 'aws-amplify';
import { bindActionCreators } from 'redux'

import { showLoading } from '../../../Actions/index'
import { setCurrentBusinessListFunc } from '../../../Actions/ActionsCreator/currentBusinessList/currentBusinessList'

class TermsAndConditions extends React.Component {

    state = {
        confirm: false,
        terms: [
            {
                content: ''
            }
        ]
    }

    componentDidMount() {
        this.setState({
            terms: this.props.business.terms ? this.props.business.terms : [ { content : '' }]
        })
    }

    deleteRow = index => {
        const terms = this.state.terms.filter((item, key) => key != index)
        this.setState({
            terms: terms
        })
    }

    handleAdd = event => {
        const term = {
            content: ''
        }
        const terms = this.state.terms.map(item => item)
        terms.push(term)
        this.setState({
            terms: terms
        })
    }

    handleReset = event => {
        this.setState({
            confirm: '',
            terms: [
                {
                    content: ''
                }
            ]
        })
    }

    handlePublish = async event => {
        console.log(this.state);
        let business_id = this.props.business.bizid
        this.props.showLoading();
        try {
            const response = await API.put("business", `/update/${business_id}`, {
                body: {
                    business_terms: this.state.terms
                }
            })

            if(response) {
                const business = Object.assign({}, this.props.business)
                business.terms = this.state.terms
                await this.props.setCurrentBusinessListFunc(business)
            }

            console.log(response);

        } catch(e) {
            console.log(e);
        }

        this.props.showLoading()
    }

    renderRows = key => {
        return (
            <Form.Field>
                <Form.Group widths="2">
                    <Form.Field width="15">
                        <TextArea 
                            rows="3" 
                            value={this.state.terms[key].content}
                            onChange={e => {
                                e.persist()
                                this.setState(state => ({
                                    ...state,
                                    terms: [
                                        ...state.terms.slice(0, key),
                                        { ...state.terms[key], content: e.target.value },
                                        ...state.terms.slice(key + 1)
                                    ]
                                }))
                            }}
                            placeholder="e.g. All members must carry a hand towel when training." />
                    </Form.Field>  
                    <Form.Field width="1">
                        <Popup 
                            
                            trigger={<Icon name='trash' size='large' className={classes.iconPadding} color='red' style={{ cursor: 'pointer'}} onClick={() => this.deleteRow(key)}/>}
                            content="Remove this Term or Condition."
                        />    
                    </Form.Field>      
                </Form.Group>
            </Form.Field>    
        )
    }

    render() {
        return (
            <Segment className={classes.segmentHeight}>
                <Form>
                    <Header as='h3' dividing className={classes.sgcolor} content="Terms & Conditions" />
                    {
                        this.state.terms.map((item, key) => (
                            this.renderRows(key)
                        ))
                    }
                    <Form.Field>
                        <center>
                            <Button color='green' size='mini' icon labelPosition='left' onClick={this.handleAdd}>
                                <Icon name='plus' />Add
                            </Button>
                        </center>    
                    </Form.Field>  
                    <Form.Field>
                        <Form.Group widths="2">
                            <Form.Field width="12">
                                <Checkbox 
                                    checked={this.state.confirm}
                                    label='Push notification to active members on apps and mail about this change.'
                                    onChange={(e, data) => {
                                        e.persist()
                                        this.setState({
                                            confirm: data.checked
                                        })
                                    }}
                                />    
                            </Form.Field>
                            <Form.Field width="4">
                                    <Button 
                                        color='red' 
                                        content='Reset' 
                                        onClick={this.handleReset}
                                        disabled={this.props.isLoading} 
                                    />
                                    <Button 
                                        primary 
                                        content='Publish' 
                                        onClick={this.handlePublish} 
                                        loading={this.props.isLoading}
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
    return bindActionCreators({ setCurrentBusinessListFunc, showLoading }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TermsAndConditions);