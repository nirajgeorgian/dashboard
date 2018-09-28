import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { API } from 'aws-amplify'
import { invokeApig } from '../../Config/awsLib'
import {
	googleLogin,
	getUserBusinesses,
	getBusinessesList
} from '../../Actions/index'
import { Login, Signup } from '../'
import { BusinessList } from '../../Components'
import * as firebase from 'firebase'
import LandingPage from './LandingPage/LandingPage'
import NavBar from '../Navbar/NavBar'

class Home extends Component {
	state = {
		showPaymentModal: false,
		businesses: {},
		new_building: '',
		showHome: true,
		showFacilities: false,
		showBusinessModal: false,
		showAddBuilding: false,
		showAddYoutubeVideoModal: false,
		showUploadImageModal: false,
		showNewNotificationModal: false,
		showOfflineTransactionModal: false,
		showBulkTransactionModal: false,
		showAddEmployeeModal: false,
		showAddAttendanceModal: false
	}

	async componentDidMount() {
		const { isAutenticated } = this.props.state
		if (isAutenticated) {
			try {
				const data = await this.props.getBusinessesList()
				console.log(data)
				this.setState({
					businesses: {
						...data
					}
				})
			} catch (e) {
				return new Error(e)
			}
		}
	}

	componentWillUnMount() {
		console.log('Inside componentWillUnMount')
	}

	getBusiness = () => {
		// return invokeApig({
		//   path: '/listmine'
		// })
		return API.get('business', '/listmine')
	}

	handlePaymentModalOpen = () => {
		this.setState({
			showPaymentModal: true
		})
	}

	handlePaymentModalClose = () => {
		this.setState({
			showPaymentModal: false
		})
	}

	handleHomeOpen = () => {
		this.setState({ showHome: true })
	}

	handleHomeClose = () => {
		this.setState({
			showHome: false
		})
	}

	handleBusinessModalOpen = event => {
		this.setState({ showBusinessModal: true })
	}

	handleBusinessModalClose = event => {
		this.setState({ showBusinessModal: false })
	}

	handleAddBuildingModalOpen = event => {
		this.setState({ showAddBuildingModal: true })
	}

	handleAddBuildingModalClose = async new_building => {
		if (!new_building.facilities) {
			this.setState({ showAddBuildingModal: false })
		} else {
			await this.setState({
				showAddBuildingModal: false,
				new_building: new_building
			})
		}
	}

	toggelAddYoutubeVideoModal = () => {
		this.setState(state => ({
			showAddYoutubeVideoModal: !state.showAddYoutubeVideoModal
		}))
	}
	toggelUploadImageModal = () => {
		this.setState(state => ({
			showUploadImageModal: !state.showUploadImageModal
		}))
	}
	toggleNewNotificationModal = () => {
		console.log('NEW NOTIFICATION')
		this.setState(state => ({
			showNewNotificationModal: !state.showNewNotificationModal
		}))
	}

	toggelOfflineTransactionModal = () =>
		this.setState(state => ({
			showOfflineTransactionModal: !state.showOfflineTransactionModal
		}))

	toggelBulkTransactionModal = () =>
		this.setState(state => ({
			showBulkTransactionModal: !state.showBulkTransactionModal
		}))

	toggleAddEmployeeModal = () =>
		this.setState(state => ({
			showAddEmployeeModal: !state.showAddEmployeeModal
		}))
	toggleAddAttendanceModal = () =>
		this.setState(state => ({
			showAddAttendanceModal: !state.showAddAttendanceModal
		}))
	render() {
		return (
			<NavBar
				handlePaymentModalOpen={this.handlePaymentModalOpen}
				showPayment={this.state.showPaymentModal}
				handlePaymentModalClose={this.handlePaymentModalClose}
				showHome={this.state.showHome}
				showBusinessModal={this.state.showBusinessModal}
				handleBusinessModalOpen={this.handleBusinessModalOpen}
				handleBusinessModalClose={this.handleBusinessModalClose}
				showAddBuildingModal={this.state.showAddBuildingModal}
				handleAddBuildingModalOpen={this.handleAddBuildingModalOpen}
				handleAddBuildingModalClose={this.handleAddBuildingModalClose}
				showAddYoutubeVideoModal={this.state.showAddYoutubeVideoModal}
				toggelAddYoutubeVideoModal={this.toggelAddYoutubeVideoModal}
				showUploadImageModal={this.state.showUploadImageModal}
				toggelUploadImageModal={this.toggelUploadImageModal}
				showNewNotificationModal={this.state.showNewNotificationModal}
				toggleNewNotificationModal={this.toggleNewNotificationModal}
				new_building={this.state.new_building}
				showOfflineTransactionModal={this.state.showOfflineTransactionModal}
				toggelOfflineTransactionModal={this.toggelOfflineTransactionModal}
				showBulkTransactionModal={this.state.showBulkTransactionModal}
				toggelBulkTransactionModal={this.toggelBulkTransactionModal}
				showAddEmployeeModal={this.state.showAddEmployeeModal}
				toggleAddEmployeeModal={this.toggleAddEmployeeModal}
				showAddAttendanceModal={this.state.showAddAttendanceModal}
				toggleAddAttendanceModal={this.toggleAddAttendanceModal}
			/>
		)
	}
}

function mapStateToProps(state) {
	return {
		state
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{ googleLogin, getUserBusinesses, getBusinessesList },
		dispatch
	)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Home)
