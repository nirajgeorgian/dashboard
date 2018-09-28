import React from 'react'
import { Tab, Menu, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import classes from './Settings.local.scss'
import GeneratSettings from './GeneralSettings'
import LogoSettings from './LogosSettings'
import BillingSettings from './BillingSettings'
import NoticeSettings from './NoticeSettings'
import LinksSettings from './LinksSettings'
import LegalSettings from './LegalSettings'
import AdvancedSettings from './AdvancedSettings'

class Settings extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			activePaneIndex: 0,
			businessName: this.props.currentBusinessList ? this.props.currentBusinessList.bizname : {},
			currentBusinessList: this.props.currentBusinessList,
			loading: false
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.currentBusinessList.bizname !== this.state.businessName) {
			this.setState({
				businessName: nextProps.currentBusinessList.bizname,
				currentBusinessList: nextProps.currentBusinessList
			})
			return true
		}
		return false
	}

	setLoading = bool => {
		this.setState({
			loading: bool
		})
	}

	setCurrentBusinessList = (list) => {
		this.setState({
			currentBusinessList: list,
			businessName: list.bizname
		})
	}

	getPanes = () => [
		{
			menuItem: (
				<Menu.Item
					className={this.state.activePaneIndex === 0 ? classes.active_tab : ''}
					key="general"
				>
					General <Icon name="info" />
				</Menu.Item>
			),
			render: () => (
				<Tab.Pane className={classes.tab_pane}>
					<GeneratSettings
						businessName = {this.state.businessName}
						currentBusinessList = {this.state.currentBusinessList}
						setCurrentBusinessList = { this.setCurrentBusinessList }
						loading = { this.state.loading }
						setLoading = { this.setLoading }
						/>
				</Tab.Pane>
			)
		},
		{
			menuItem: (
				<Menu.Item
					className={this.state.activePaneIndex === 1 ? classes.active_tab : ''}
					key="logos"
				>
					Logos <Icon name="image" />
				</Menu.Item>
			),
			render: () => (
				<Tab.Pane className={classes.tab_pane}>
					<LogoSettings
						businessName = {this.state.businessName}
						currentBusinessList = {this.state.currentBusinessList}
						setCurrentBusinessList = { this.setCurrentBusinessList }
						loading = { this.state.loading }
						setLoading = { this.setLoading }
						/>
				</Tab.Pane>
			)
		},
		{
			menuItem: (
				<Menu.Item
					className={this.state.activePaneIndex === 2 ? classes.active_tab : ''}
					key="billing"
				>
					Billing <Icon name="flag checkered" />
				</Menu.Item>
			),
			render: () => (
				<Tab.Pane className={classes.tab_pane}>
					<BillingSettings
						businessName = {this.state.businessName}
						currentBusinessList = {this.state.currentBusinessList}
						setCurrentBusinessList = { this.setCurrentBusinessList }
						loading = { this.state.loading }
						setLoading = { this.setLoading }
						/>
				</Tab.Pane>
			)
		},
		{
			menuItem: (
				<Menu.Item
					className={this.state.activePaneIndex === 3 ? classes.active_tab : ''}
					key="notice"
				>
					Notice <Icon name="bullhorn" />
				</Menu.Item>
			),
			render: () => (
				<Tab.Pane className={classes.tab_pane}>
					<NoticeSettings
						businessName = {this.state.businessName}
						currentBusinessList = {this.state.currentBusinessList}
						setCurrentBusinessList = { this.setCurrentBusinessList }
						loading = { this.state.loading }
						setLoading = { this.setLoading }
						/>
				</Tab.Pane>
			)
		},
		{
			menuItem: (
				<Menu.Item
					className={this.state.activePaneIndex === 4 ? classes.active_tab : ''}
					key="links"
				>
					Links <Icon name="linkify" />
				</Menu.Item>
			),
			render: () => (
				<Tab.Pane className={classes.tab_pane}>
					<LinksSettings
						businessName = {this.state.businessName}
						currentBusinessList = {this.state.currentBusinessList}
						setCurrentBusinessList = { this.setCurrentBusinessList }
						loading = { this.state.loading }
						setLoading = { this.setLoading }
						/>
				</Tab.Pane>
			)
		},
		{
			menuItem: (
				<Menu.Item
					className={this.state.activePaneIndex === 5 ? classes.active_tab : ''}
					key="legal"
				>
					Legals <Icon name="legal" />
				</Menu.Item>
			),
			render: () => (
				<Tab.Pane className={classes.tab_pane}>
					<LegalSettings
						businessName = {this.state.businessName}
						currentBusinessList = {this.state.currentBusinessList}
						setCurrentBusinessList = { this.setCurrentBusinessList }
						loading = { this.state.loading }
						setLoading = { this.setLoading }
						/>
				</Tab.Pane>
			)
		},
		{
			menuItem: (
				<Menu.Item
					className={this.state.activePaneIndex === 6 ? classes.active_tab : ''}
					key="advanced"
				>
					Advanced <Icon name="grid layout" />
				</Menu.Item>
			),
			render: () => (
				<Tab.Pane className={classes.tab_pane}>
					<AdvancedSettings
						businessName = {this.state.businessName}
						currentBusinessList = {this.state.currentBusinessList}
						setCurrentBusinessList = { this.setCurrentBusinessList }
						loading = { this.state.loading }
						setLoading = { this.setLoading }
						/>
				</Tab.Pane>
			)
		}
	]

	render() {
		if(Object.keys(this.state.currentBusinessList).length === 0) {
			return <div>You need to create business first</div>
		} else {
				return (
				<div className={classes.container}>
					<Tab
						activeIndex={this.state.activePaneIndex}
						onTabChange={(_, data) =>
							this.setState({ activePaneIndex: data.activeIndex })
						}
						menu={{ fluid: true, vertical: true, tabular: true }}
						panes={this.getPanes()}
					/>
				</div>
			)
		}
	}
}

const mapStateToProps = state => {
	return {
		currentBusinessList: state.currentBusinessList,
		businessesList: state.businessesList
	}
}

export default withRouter(connect(mapStateToProps, null)(Settings))
