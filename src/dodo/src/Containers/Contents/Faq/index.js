import React from 'react'
import { Segment, Header, Form, Button, Icon, TextArea, Popup, Input } from 'semantic-ui-react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { showLoading } from '../../../Actions/index'
import { setCurrentBusinessListFunc } from '../../../Actions/ActionsCreator/currentBusinessList/currentBusinessList'


import classes from './Faq.local.scss'

import { API } from 'aws-amplify'

class Faq extends React.Component {

    state = {
        ques_ans: [
            {
                faq_q: '',
                faq_a: ''
            }
        ]
    }

    componentDidMount() {
        this.setState({
            ques_ans: this.props.business.faq ? this.props.business.faq : [ { faq_q: '', faq_a: '' }]
        })
    }

    handleDelete = index => {
        const ques_ans = this.state.ques_ans.filter((_, key) => key != index)
        this.setState({
            ques_ans: ques_ans
        })
    }

    handleAdd = event => {
        const obj = {
            faq_q: '',
            faq_a: ''
        }
        const ques_ans = this.state.ques_ans.map(item => item)
        ques_ans.push(obj)
        this.setState({
            ques_ans: ques_ans
        })
    }

    handleReset = event => {
        this.setState({
            ques_ans: [
                {
                    faq_q: '',
                    faq_a: ''
                }
            ]
        })
    }

    handlePublish = async event => {
        console.log(this.state);
        this.props.showLoading()

        let business_id = this.props.business.bizid
        try {
            const response = await API.put("business", `/update/${business_id}`, {
                body: {
                    business_faq: this.state.ques_ans
                }
            })

            if(response) {
                const business = this.props.business
                business.faq = this.state.ques_ans
                await this.props.setCurrentBusinessListFunc(business)
            }

            console.log(response)
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
                        <Form.Field>
                            <Input 
                                className={classes.faqInput}
                                placeholder='e.g. What is the procedure to book the dance session?'
                                value={this.state.ques_ans[key].faq_q}
                                onChange={e => {
                                    e.persist()
                                    this.setState(state => ({
                                        ...state,
                                        ques_ans: [ 
                                            ...state.ques_ans.slice(0, key),
                                            { ...state.ques_ans[key], faq_q: e.target.value },
                                            ...state.ques_ans.slice(key + 1)
                                        ]    
                                    }))
                                }}
                            />
                            <TextArea 
                                className={classes.faqTextArea}
                                rows="2"
                                placeholder="e.g. Please visit our sagepass business page to book the same under the events section."
                                value={this.state.ques_ans[key].faq_a}
                                onChange={e => {
                                    e.persist()
                                    this.setState(state => ({
                                        ...state,
                                        ques_ans: [ 
                                            ...state.ques_ans.slice(0, key),
                                            { ...state.ques_ans[key], faq_a: e.target.value },
                                            ...state.ques_ans.slice(key + 1)
                                        ]    
                                    }))
                                }}
                            /> 
                        </Form.Field>       
                    </Form.Field>
                    <Form.Field width="1">
                            <Popup 
                                trigger={<Icon name='trash' size='large' className={classes.iconPadding} style={{ cursor: 'pointer' }} color='red' onClick={() => this.handleDelete(key)}/>}
                                content="Remove this faq_q."
                            />    
                    </Form.Field>
                </Form.Group>
            </Form.Field>    
        )
    }


    render(){
        return (
            <Segment>
                <Header dividing as='h3' className={classes.sgcolor} content="Frequently Asked Questions" />
                <Form>
                    {
                        this.state.ques_ans.map((item, key) => (
                            this.renderRows(key)
                        ))
                    }
                    <Form.Field>
                        <center>
                            <Button color='green' size='mini' icon onClick={this.handleAdd}>
                                <Icon name='plus' />  Add
                            </Button>
                        </center>    
                    </Form.Field>
                    <br />
                    <Form.Field>
                        <center>
                            <Button 
                                color='red' 
                                content='Reset' 
                                onClick={this.handleReset} 
                            />
                            <Button 
                                primary 
                                content='Publish' 
                                onClick={this.handlePublish} 
                                loading={this.props.isLoading} 
                            />
                        </center>
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

export default connect(mapStateToProps, mapDispatchToProps)(Faq);