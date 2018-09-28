import React from 'react'

import { Modal, Form, Input, Dropdown, Card, Button, Popup, Icon } from 'semantic-ui-react'
import classes from './AddBuilding.local.scss'

import { API } from 'aws-amplify'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const accessibilities = [
    { key: '0', icon:'wheelchair', text: 'Wheelchair', value: 'Wheelchair' },
    { key: '1', icon: 'shower', text: 'Shower', value: 'Shower'},
    { key: '2', icon: 'lock', text: 'Locker Facility', value: 'Locker Facility'},
    { key: '3', icon: 'universal access', text: 'Universal Access', value: 'Universal Access'},
    { key: '4', icon: 'medkit', text: 'Firstaid', value: 'Firstaid'},
    { key: '5', icon: 'user secret', text: 'Security Staff', value: 'Security Staff'},
    { key: '6', icon: 'video', text: 'CCTV', value: 'CCTV'},
    { key: '7', icon: 'fire extinguisher', text: 'Fire Extinguisher', value: 'Fire Extinguisher'},
    { key: '8', icon: 'car', text: 'Parking', value: 'Parking'},
    { key: '9', icon: 'info', text: 'Reception', value: 'Reception'},
    { key: '10', icon: 'coffee', text: 'Cafeteria', value: 'Cafeteria'},
    { key: '11', icon: 'braille', text: 'Vending Machine', value: 'Vending Machine'},
  
]

const term = {
    content: ''
}

class AddBuilding extends React.Component {

    state = {
        name: '',
        desc: '',
        accessibility: '',
        rules: [
            term,
            term
        ],
        loading: false
    }

    componentDidMount() {
        if(this.props.building) {
            console.log(this.props.building)
            this.setState({
                ...this.props.building
            })
        }
    }

    handleInputChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleDropdown = (e, data) => {
        e.persist()
        this.setState({
            [data.id]: data.value
        })
    }

    handleAddTerms = e => {
        e.preventDefault()
        e.stopPropagation()
        const terms = Array.from(this.state.rules)
        terms.push(term)
        this.setState({
            rules: terms
        })
    }

    handleRemoveTerms = (index) => {
        const terms = this.state.rules.filter((_, key) => key != index)
        this.setState({
            rules: terms
        })
    }

    handleSubmit = async event => {
        await this.setState({
            loading: true
        })

        try {
            if(this.props.building) {
                var building = Object.assign({}, this.props.building)
                building = { ...this.state }
                const response = await API.put("facility", `/building/update/${this.props.business.bizid}/${building.buildid}`, {
                    body: this.state
                })
                
                console.log("Building:",building)
                if(response.status) {
                    this.props.handleModify(building)
                    this.setState({
                        loading: false
                    }, () => this.props.handleClose())
                }

            } else {
                const response = await API.post("facility",`/building/create/${this.props.business.bizid}`, {
                    body: this.state
                })
                if(response.status) {
                    console.log(response)
                    this.props.handleAdd(response.message)
                    this.setState({
                        loading: false
                    }, () => this.props.handleClose() )
                }
            }
        } catch(e) {
            console.log(e)
            this.setState({
                loading: false
            })
        }

    }

    renderTerms = (item, key) => {
        // console.log(item, key)
        return (
            <Form.Field key={key}>
                <Form.Group inline>
                    <label>{key + 1}.</label>
                    <Input
                        width={14}
                        placeholder="e.g. This sports hall is only for adult players." 
                        onChange={e => {
                            e.persist()
                            this.setState(state => ({
                                ...state,
                                rules: [
                                    ...state.rules.slice(0, key),
                                    { ...state.rules[key], content: e.target.value },
                                    ...state.rules.slice(key + 1)
                                ]
                            }))
                        }}
                        value={item.content}
                    />
                    <Popup
                        trigger={<Icon 
                                    name='trash' 
                                    color='red'
                                    style={{ cursor: 'pointer'}} 
                                    onClick={() => this.handleRemoveTerms(key)}
                                />}
                        content="Remove this terms or conditions."
                    />
                </Form.Group>
            </Form.Field>
        )
    }

    render() {
        return (
            <Modal size='small' open={this.props.open} onClose={this.props.handleClose}>
                <Modal.Header>
                    <center>
                        Add Building
                    </center>
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form>
                            <Form.Group widths={3}>
                                <Form.Field required width={5}>
                                    <label>Building Name</label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Main Sports Hall"
                                        type="text"
                                        icon='building outline'
                                        iconPosition='left'
                                        onChange={this.handleInputChange}
                                        loading={this.state.loading}
                                        value={this.state.name}
                                    />
                                </Form.Field>
                                <Form.Field required width={11}>
                                    <label>Description</label>
                                    <Input
                                        id="desc"
                                        placeholder="e.g. Sports hall to have badminton & squash activities."
                                        type="text"
                                        icon='info'
                                        iconPosition='left'
                                        onChange={this.handleInputChange}
                                        loading={this.state.loading}
                                        value={this.state.desc}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths={3}>
                                <Form.Field required width={16}>
                                    <label>Accessibilities</label>
                                    <Dropdown
                                        id="accessibility"
                                        placeholder="e.g. Wheelchair, Shower"
                                        fluid
                                        search
                                        multiple
                                        selection
                                        options={accessibilities}
                                        onChange={this.handleDropdown}
                                        value={this.state.accessibility}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Field width={16}>
                                <Card fluid>
                                    <Card.Content>
                                        <Card.Header content="Instructions, Rules & Conditions" />
                                        <Card.Meta content="Please provide all the instructions, guidances, directions, rules & conditions related information here." />
                                        <Card.Description>
                                            {
                                                this.state.rules.map((item, i) => (
                                                    this.renderTerms(item, i)
                                                ))
                                            }
                                            <div>
                                                <center>
                                                    <Button
                                                        color='green'
                                                        className="trans5"
                                                        content="Add"
                                                        onClick={this.handleAddTerms}
                                                    />
                                                </center>
                                            </div>    
                                        </Card.Description>    
                                    </Card.Content>    
                                </Card>
                            </Form.Field>
                        </Form>   
                        <center>
                            <Button
                                color='red'
                                className="trans5"
                                content="Close"
                                disabled={this.state.loading}
                                onClick={this.props.handleClose}
                            />
                            <Button
                                icon
                                animated
                                className="sgcolorhover"
                                labelPosition='left'
                                loading={this.state.loading}
                                onClick={this.handleSubmit}
                            >
                                <Icon name='chevron right' />
                                Add Building
                            </Button>
                        </center>     
                    </Modal.Description>    
                </Modal.Content>            
            </Modal>    
        )
    }
}

const mapStateToProps = state => (
    {
        isLoading: state.isLoading,
        business: state.currentBusinessList
    }
)

const mapDispatchToProps = dispatch => (
    bindActionCreators({}, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(AddBuilding)