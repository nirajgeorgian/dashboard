import React from 'react'
import { Header, Form, Input, Icon, Button } from 'semantic-ui-react'
// API import
import { API } from 'aws-amplify'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import compare from '../../../utility/compare'
import { setCurrentBusinessListFunc } from '../../../Actions/ActionsCreator/currentBusinessList/currentBusinessList'
import classes from './LinksSettings.local.scss'
import LoadingComponent from '../Loading'

class LinksSettings extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			businessName: this.props.businessName,
			urls_website: this.props.currentBusinessList.urls.website == null ? '' : this.props.currentBusinessList.urls.website,
			urls_facebook: this.props.currentBusinessList.urls.facebook == null ? '' : this.props.currentBusinessList.urls.facebook,
			urls_googleplus: this.props.currentBusinessList.urls.googleplus == null ? '' : this.props.currentBusinessList.urls.googleplus,
			urls_youtube: this.props.currentBusinessList.urls.youtube == null ? '' : this.props.currentBusinessList.urls.youtube,
			urls_instagram: this.props.currentBusinessList.urls.instagram == null ? '' : this.props.currentBusinessList.urls.instagram,
			urls_twitter: this.props.currentBusinessList.urls.twitter == null ? '' : this.props.currentBusinessList.urls.twitter,
			businessName: this.props.businessName
		}
	}

	componentWillReceiveProps(nextProps) {
		if(compare(nextProps.currentBusinessList.urls, this.state) == false) {
			const data = nextProps.currentBusinessList
			this.setState({
				urls_website: data.urls.website == null ? '' : data.urls.website,
				urls_facebook: data.urls.facebook == null ? '' : data.urls.facebook,
				urls_googleplus: data.urls.googleplus == null ? '' : data.urls.googleplus,
				urls_youtube: data.urls.youtube == null ? '' : data.urls.youtube,
				urls_instagram: data.urls.instagram == null ? '' : data.urls.instagram,
				urls_twitter: data.urls.twitter == null ? '' : data.urls.twitter
			})
			return true
		}
		return false
	}

	onFormSubmit = async event => {
		event.preventDefault()
		this.props.setLoading(true)
		const id = this.props.currentBusinessList.bizid
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
			console.log("Succesfully updated " + updateData);
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
				<Header className={classes.link_settings_header} dividing>
					External Links
				</Header>
				<Form loading = { this.props.loading}>
					<Form.Field>
						<label>Business Website URL</label>
						<Input
							placeholder="e.g. www.example.com"
							icon = 'internet explorer'
							iconPosition='left'
							value = { this.state.urls_website }
							onChange={e => this.setState({ urls_website: e.target.value })}
						/>
					</Form.Field>
				<Header as="h4" dividing className={classes.link_settings_header}>
					Social Media
				</Header>
					<Form.Field>
						<label>Facebook Page Name</label>
						<Input
							placeholder="e.g. thesagepass"
							action={{
								icon: <Icon className={classes.fb_icon} name="facebook" />,
								content: (
									<p style={{ color: '#4468B0' }}>https://www.facebook.com/</p>
								)
							}}
							value = { this.state.urls_facebook }
							onChange={e => this.setState({ urls_facebook: e.target.value })}
							actionPosition="left"
						/>
					</Form.Field>
					<Form.Field>
						<label>Twitter Username</label>
						<Input
							placeholder="e.g. thesagepass"
							action={{
								icon: <Icon className={classes.tw_icon} name="twitter" />,
								content: (
									<p style={{ color: '#1488BC' }}>https://twitter.com/</p>
								)
							}}
							value = { this.state.urls_twitter }
							onChange={e => this.setState({ urls_twitter: e.target.value })}
							actionPosition="left"
						/>
					</Form.Field>
					<Form.Field>
						<label>Instagram Username</label>
						<Input
							placeholder="e.g. thesagepass"
							action={{
								icon: <Icon className={classes.insta_icon} name="instagram" />,
								content: (
									<p style={{ color: '#c5317e' }}>https://www.instagram.com/</p>
								)
							}}
							value = { this.state.urls_instagram }
							onChange={e => this.setState({ urls_instagram: e.target.value })}
							actionPosition="left"
						/>
					</Form.Field>
					<Form.Field>
						<label>Youtube Channel</label>
						<Input
							placeholder="e.g. UCeTKJSW1NTAkf27nNmjWt5A"
							action={{
								icon: <Icon name="youtube play" />,
								content: (
									<p>https://www.youtube.com/channel/</p>
								)
							}}
							value = { this.state.urls_youtube }
							onChange={ e => this.setState({ urls_youtube: e.target.value })}
							actionPosition="left"
						/>
					</Form.Field>
					<Form.Field>
						<label>Google+ Profile</label>
						<Input
							placeholder="e.g. 111533022480506985888"
							action={{
								icon: <Icon name="google plus" />,
								content: (
									<p>https://plus.google.com/u/0/</p>
								)
							}}
							value = { this.state.urls_googleplus }
							onChange={ e => this.setState({ urls_googleplus: e.target.value })}
							actionPosition="left"
						/>
					</Form.Field>
				</Form>
				<div className={classes.actions}>
					<Button color="red" content="Reset" />
					<Button primary content="Apply" onClick={this.onFormSubmit}/>
				</div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LinksSettings))
