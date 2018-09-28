import React from 'react'
import { Header, Form, Input, Checkbox, Button } from 'semantic-ui-react'
import { API } from 'aws-amplify'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentBusinessListFunc } from '../../../Actions/ActionsCreator/currentBusinessList/currentBusinessList'
import compare from '../../../utility/compare'
import classes from './LegalSettings.local.scss'
import LoadingComponent from '../Loading'

class LegalSettings extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			director1: this.props.currentBusinessList.legal.director1 == null ? '' : this.props.currentBusinessList.legal.director1,
			director2: this.props.currentBusinessList.legal.director2 == null ? '' : this.props.currentBusinessList.legal.director2,
			gstin: this.props.currentBusinessList.legal.gstin == null ? '' : this.props.currentBusinessList.legal.gstin,
			legalname: this.props.currentBusinessList.legal.legalname == null ? '' : this.props.currentBusinessList.legal.legalname,
			pan: this.props.currentBusinessList.legal.pan == null ? '' : this.props.currentBusinessList.legal.pan,
			refno: this.props.currentBusinessList.legal.refno == null ? '' : this.props.currentBusinessList.legal.refno,
			tan: this.props.currentBusinessList.legal.tan == null ? '' : this.props.currentBusinessList.legal.tan,
			confirm: false,
			businessName: this.props.businessName
		}
	}

	componentWillReceiveProps(nextProps) {
		if(compare(nextProps.currentBusinessList.legal, this.state) == false) {
			const data = nextProps.currentBusinessList
			this.setState({
				director1: data.legal.director1 == null ? '' : data.legal.director1,
				director2: data.legal.director2 == null ? '' : data.legal.director2,
				gstin: data.legal.gstin == null ? '' : data.legal.gstin,
				legalname: data.legal.legalname == null ? '' : data.legal.legalname,
				pan: data.legal.pan == null ? '' : data.legal.pan,
				refno: data.legal.refno == null ? '' : data.legal.refno,
				tan: data.legal.tan == null ? '' : data.legal.tan,
			})
			return true
		}
		return false
	}

	reset = () => this.setState({ ...initialState })

	handleInputChange = e => this.setState({ [e.target.id]: e.target.value })

	handleSubmit = async (event) => {
		event.preventDefault()
		this.props.setLoading(true)
		const id = this.props.currentBusinessList.bizid
		console.log(this.state)
		const updateData = await API.put("business", `/update/${id}`, {
			body: this.state
		})
		if(updateData) {
			const data = await API.get("business", '/listmine')
			// ?or else get it from state
			const business = await data.filter(singleBusiness => {
				return singleBusiness.bizname == this.props.currentBusinessList.bizname
			})
			await this.props.setCurrentBusinessListFunc(business[0])
			await this.props.setCurrentBusinessList(business[0])
			console.log("Success");
			this.props.setLoading(false)
		} else {
			console.log("failed updating");
			this.props.setLoading(false)
		}
	}

	render() {
		return (
			this.props.isLoading === false ?
			<div>
				<Header dividing className={classes.legal_settings_header}>
					Legal Information
				</Header>
				<Form loading = { this.props.loading }>
					<Form.Field className={classes.text}>
						Please fill the below legal information very carefully. It will be
						validated by Sagepass Support and necessary actions shall be taken.
						Incorrect information will lead to deactivating the account
						temporarily.
					</Form.Field>
					<Form.Field required>
						<label>Registration Information</label>
						<Input
							value={this.state.legalname}
							id="legalname"
							value = { this.state.legalname }
							onChange={this.handleInputChange}
							className={classes.input}
							action={{
								content: 'Business Legal Name'
							}}
							actionPosition="left"
							placeholder="e.g. Spiez Web Services Private Limited"
						/>
					</Form.Field>
					<Form.Field>
						<Input
							value={this.state.refno}
							id="refno"
							onChange={this.handleInputChange}
							className={classes.input}
							value = { this.state.refno }
							action={{
								content: 'LLPIN/CIN/Form INC-1 Ref No'
							}}
							actionPosition="left"
							placeholder="e.g. U67190TN2014PTC096978"
						/>
					</Form.Field>
					<Form.Field required>
						<label>Directors Information</label>
						<Form.Group widths={2}>
							<Form.Field>
								<Input
									value={this.state.director1}
									id="director1"
									onChange={this.handleInputChange}
									className={classes.input}
									value = { this.state.director1 }
									action={{
										content: 'Director 1',
										icon: 'user'
									}}
									actionPosition="left"
									placeholder="e.g. Bill Gates"
								/>
							</Form.Field>
							<Form.Field>
								<Input
									value={this.state.director2}
									id="director2"
									onChange={this.handleInputChange}
									className={classes.input}
									value = { this.state.director2 }
									action={{
										content: 'Director 2',
										icon: 'user'
									}}
									actionPosition="left"
									placeholder="e.g. Steve Jobs"
								/>
							</Form.Field>
						</Form.Group>
					</Form.Field>
					<Form.Field className={classes.text}>
						If you have not registered your business legally, Please contact
						Sagepass Support. We can assist you to get your business registered
						for a minimal cost starting from 1,499/- INR.
					</Form.Field>
					<Header as="h4" dividing className={classes.legal_settings_header}>
						Tax Information
					</Header>
					<Form.Field required>
						<Form.Group widths={2}>
							<Form.Field>
								<Input
									value={this.state.pan}
									id="pan"
									onChange={this.handleInputChange}
									className={classes.input}
									value = { this.state.pan }
									action={{
										content: 'Business PAN'
									}}
									actionPosition="left"
									placeholder="e.g. AAAPL1234C"
								/>
							</Form.Field>
							<Form.Field>
								<Input
									value={this.state.tan}
									id="tan"
									onChange={this.handleInputChange}
									className={classes.input}
									value = { this.state.tan }
									action={{
										content: 'Business TAN'
									}}
									actionPosition="left"
									placeholder="e.g. NGPO02911G"
								/>
							</Form.Field>
						</Form.Group>
					</Form.Field>
					<Form.Field>
						<Input
							value={this.state.gstin}
							id="gstin"
							onChange={this.handleInputChange}
							className={classes.input}
							value = { this.state.gstin }
							action={{
								content: 'GSTIN'
							}}
							actionPosition="left"
							placeholder="e.g. 22AAAAA0000A1Z5"
						/>
					</Form.Field>
					<Form.Field>
						<center>
							If you have not registered your business for GST, You can register
							it just for 2,499/- INR.
						</center>
					</Form.Field>
					<Form.Field>
						<center className={classes.red_text}>
							Above information won't be shared with anyone else as a part of
							GDPR regulations.
						</center>
					</Form.Field>
					<Form.Field>
						<center>
							<Checkbox
								checked={this.state.confirm}
								onChange={(e, data) => this.setState({ confirm: data.checked })}
								label="I confirm the above mentioned information are correct."
							/>
						</center>
					</Form.Field>
					<Form.Field>
						<center>
							<Button onClick={this.reset} content="Reset" color="red" />
							<Button content="Apply" primary onClick={this.handleSubmit} disabled={!this.state.confirm}/>
						</center>
					</Form.Field>
				</Form>
			</div>
			: <LoadingComponent />
		)
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ setCurrentBusinessListFunc }, dispatch)
}

const mapStateToProps = state => {
	return {
		isLoading: state.isLoading
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LegalSettings))
