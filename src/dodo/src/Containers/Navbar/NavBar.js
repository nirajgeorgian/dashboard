import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {
	Container,
	Header,
	Menu,
	Input,
	Select,
	Icon,
	Dropdown,
	Button
} from 'semantic-ui-react'
import { getBusinessesList } from '../../Actions/ActionsCreator/BusinessList/BusinessListAction'
import classes from './Navbar.local.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import logo from '../../assests/img/sp_logo.png'
import spiez_logo from '../../assests/img/spiez_logo.png'
import { userLogout } from '../../Actions/index'
import UploadImageModal from '../gallery/UploadImageModal'
import NewNotificationModal from '../Support/NewNotificationModal'
import AddYoutubeVideoModal from '../gallery/AddYoutubeVideoModal'
import OfflineTransactionModal from '../Accounts/OfflineTransactionModal'
import AddEmployeeModal from '../Accounts/AddEmployeeModal'
import AddAttendanceModal from '../Accounts/AddAttendanceModal'
import BulkTransactionModal from '../Accounts/BulkTransactionModal'
import PaymentModal from '../Payment/PaymentModal'
import BusinessHome from '../BusinessHome/index'
import BusinessModal from '../Business/BusinessModal'
import Loading from '../../Components/UI/Loading/index'
import Facilities from '../Facilities/index'
import Gallery from '../gallery'
import Support from '../Support'
import Settings from '../Settings'
import MemberShips from '../Membership'
import AddMembership from '../Membership/AddMembership/index'
import AddBuilding from '../Facilities/AddBuilding/index'
import AddFacility from '../Facilities/AddFacility'
// import DeleteBuilding from '../Facilities/DeleteBuilding'
import Events from '../Events/index'
import AddEvent from '../Events/AddEvent/index'
import Accounts from '../Accounts'
import Contents from '../Contents/index'
import { setCurrentBusinessListFunc } from '../../Actions/ActionsCreator/currentBusinessList/currentBusinessList'
import { API } from 'aws-amplify'
import moment from 'moment'

const navOptions = []
// {
// 	key: "i",
// 	value: "x.bizname",
// 	text: "x.bizname"
// },
// {
// 	key: "j",
// 	value: "x.bighzname",
// 	text: "x.bizname"
// }


String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1)
}

const monthMap = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
]

class NavBar extends Component {
	constructor(props) {
		super(props)
		const accountsTimesheetLastDate = moment().endOf('isoweek')
		const accountsTimesheetFirstDate = moment().startOf('isoweek')
		this.state = {
			onLoadValue: '',
			showDropDown: false,
			contentLoaded: true,
			showHome: false,
			showFacilities: false,
			definitions: true,
			active_members: false,
			attendances: false,
			transactions: false,
			button_clicked: '',
			eventsTabIndex: 0,
			accountTabIndex: 0,
			facilitiesTabIndex: 0,
			isAccountsTimesheetWeekly: true,
			accountsTimesheetLastDate: accountsTimesheetLastDate,
			accountsTimesheetFirstDate: accountsTimesheetFirstDate,
			showYoutubeVideoModal: false,
			showAddBookingModal: false,
			showBulkAddBookingModal: false,
			showCancelBookingModal: false,
			showNoShowBookingModal: false,
			showAttendBookingModal: false,
			showRescheduleBookingModal: false,
			showYoutubeVideoModalGallery: false,
			showImageUploadModalGallery: false,
			showAddBuildingModal: false,
			showAddBookingFacilities: false
			// loading: false
		}
	}

	componentWillMount() {
		this.props.businessesList.forEach((x, i) => {
			let y = {
				key: i,
				value: x.bizname,
				text: x.bizname
			}
			navOptions.push(y)
		})
		if (Object.keys(this.props.currentBusinessList).length === 0) {
			console.log("setting current business list")
			this.props.setCurrentBusinessListFunc(this.props.businessesList[0])
		} else {
			console.log("setting an empty business")
			this.props.setCurrentBusinessListFunc({})
		}
	}

	componentDidUpdate(prevProps, prevState) {}

	handleAddFacilityBack = () => this.props.history.goBack()

	handleAccountsTabChange = index => {
		return this.setState({ accountTabIndex: index })
	}

	handleAddBuildingModal = e => {
		this.props.handleAddBuildingModalOpen()
	}

	handelAddYoutubeVideoModal = () => {
		console.log('YOUTUBE')
		this.props.toggelAddYoutubeVideoModal()
	}
	handelUploadImageModal = () => {
		console.log('Image')
		this.props.toggelUploadImageModals()
	}

	hanldePaymentModalOpen = () => {
		// setTimeout(this.props.handlePaymentModalOpen(),3000)
		this.props.handlePaymentModalOpen()
	}

	renderHomeButtons = () => {
		const now = moment()
		const month = now.month()
		const year = now.year()
		return (
			<div className={classes.accountsBtns}>
				<div>
					<Dropdown
						className={classes.entireAccount}
						placeholder="Entire Account"
						selection
						options={[
							{
								key: 'All Branches',
								value: 'All Branches',
								text: 'All Branches'
							},
							{
								key: 'Reading, UK',
								value: 'Reading, UK',
								text: 'Reading, UK'
							},
							{
								key: 'London, UK',
								value: 'London, UK',
								text: 'London, UK'
							}
						]}
					/>
					<Dropdown
						className={classes.entireAccount}
						placeholder="This month"
						selection
						options={[
							{
								key: `${monthMap[month]} ${year}`,
								value: `${monthMap[month]} ${year}`,
								text: `${monthMap[month]} ${year}`
							},
							{
								key: `FY ${year - 1}-${`${year}`.slice(2)}`,
								value: `FY ${year - 1}-${`${year}`.slice(2)}`,
								text: `FY ${year - 1}-${`${year}`.slice(2)}`
							},
							{ key: 'All Time', value: 'All Time', text: 'All Time' },
							{
								key: `${monthMap[month - 1]} ${year}`,
								value: `${monthMap[month - 1]} ${year}`,
								text: `${monthMap[month - 1]} ${year}`
							},
							{
								key: `${monthMap[month - 2]} ${year}`,
								value: `${monthMap[month - 2]} ${year}`,
								text: `${monthMap[month - 2]} ${year}`
							}
						]}
					/>
				</div>
			</div>
		)
	}

	renderAccountsButtons = () => {
		const {
			accountTabIndex,
			accountsTimesheetLastDate,
			accountsTimesheetFirstDate
		} = this.state

		if (accountTabIndex === 0) {
			const now = moment()
			const month = now.month()
			const year = now.year()
			return (
				<div className={classes.accountsBtns}>
					<div>
						<Dropdown
							className={classes.entireAccount}
							placeholder="Entire Account"
							selection
							options={[
								{
									key: 'All Branches',
									value: 'All Branches',
									text: 'All Branches'
								},
								{
									key: 'Reading, UK',
									value: 'Reading, UK',
									text: 'Reading, UK'
								},
								{
									key: 'London, UK',
									value: 'London, UK',
									text: 'London, UK'
								}
							]}
						/>
						<Dropdown
							className={classes.entireAccount}
							placeholder="This month"
							selection
							options={[
								{
									key: `${monthMap[month]} ${year}`,
									value: `${monthMap[month]} ${year}`,
									text: `${monthMap[month]} ${year}`
								},
								{
									key: `FY ${year - 1}-${`${year}`.slice(2)}`,
									value: `FY ${year - 1}-${`${year}`.slice(2)}`,
									text: `FY ${year - 1}-${`${year}`.slice(2)}`
								},
								{ key: 'All Time', value: 'All Time', text: 'All Time' },
								{
									key: `${monthMap[month - 1]} ${year}`,
									value: `${monthMap[month - 1]} ${year}`,
									text: `${monthMap[month - 1]} ${year}`
								},
								{
									key: `${monthMap[month - 2]} ${year}`,
									value: `${monthMap[month - 2]} ${year}`,
									text: `${monthMap[month - 2]} ${year}`
								}
							]}
						/>
					</div>
				</div>
			)
		} else if (accountTabIndex === 1) {
			return (
				<div className={classes.accounts_buttons}>
					<div
						className={
							'ui tiny green button right floated ' + classes.accountsButton
						}
						onClick={this.props.toggelBulkTransactionModal}
					>
						<Icon name={'add'} />
						Add Bulk Transaction
					</div>
					<div
						className={
							'ui tiny green button right floated ' + classes.accountsButton
						}
						onClick={this.props.toggelOfflineTransactionModal}
					>
						<Icon name={'add'} />
						Add Offline Transaction
					</div>
				</div>
			)
		} else if (accountTabIndex === 2) {
			return (
				<div className={classes.accounts_buttons}>
					<div
						className={
							'ui tiny green button right floated ' + classes.accountsButton
						}
						onClick={this.props.toggleAddEmployeeModal}
					>
						<Icon name={'add'} />
						Add Employee
					</div>
				</div>
			)
		} else if (accountTabIndex === 3) {
			return (
				<div className={classes.accounts_buttons}>
					<div
						className={
							'ui tiny green button right floated ' + classes.accountsButton
						}
						onClick={this.props.toggleAddAttendanceModal}
					>
						<Icon name={'add'} />
						Add Attendance
					</div>
				</div>
			)
		} else if (accountTabIndex === 4) {
			return (
				<div className={classes.accounts_buttons}>
					<Button.Group
						size="tiny"
						color="blue"
						className={classes.accountsButton}
					>
						<Button
							onClick={this.previousTimesheetSpan}
							size="tiny"
							icon="left chevron"
						/>
						<Button size="tiny">
							{this.state.isAccountsTimesheetWeekly
								? `${accountsTimesheetFirstDate.format(
										'D MMM'
								  )} - ${accountsTimesheetLastDate.format('D MMM YYYY')}`
								: `${accountsTimesheetLastDate.format('MMMM YYYY')}`}
						</Button>
						<Button
							size="tiny"
							disabled={
								accountsTimesheetLastDate.format('D MMM YYYY') ===
								moment().format('D MMM YYYY')
							}
							onClick={this.nextTimesheetSpan}
							icon="right chevron"
						/>
					</Button.Group>
					<Button.Group size="tiny" className={classes.accountsButton}>
						<Button
							size="tiny"
							primary
							basic={!this.state.isAccountsTimesheetWeekly}
							onClick={this.setTimeSheetToWeekly}
						>
							Weekly
						</Button>
						<Button
							size="tiny"
							primary
							basic={this.state.isAccountsTimesheetWeekly}
							color="blue"
							onClick={this.setTimeSheetToMonthly}
						>
							Monthly
						</Button>
					</Button.Group>
				</div>
			)
		}
	}

	previousTimesheetSpan = () => {
		const {
			isAccountsTimesheetWeekly,
			accountsTimesheetLastDate,
			accountsTimesheetFirstDate
		} = this.state
		let newAccountsTimesheetLastDate, newAccountsTimesheetFirstDate
		if (isAccountsTimesheetWeekly) {
			newAccountsTimesheetLastDate = accountsTimesheetLastDate
				.subtract(7, 'd')
				.endOf('isoweek')
			newAccountsTimesheetFirstDate = accountsTimesheetFirstDate
				.subtract(7, 'd')
				.startOf('isoweek')
		} else {
			newAccountsTimesheetLastDate = accountsTimesheetFirstDate
				.subtract(7, 'd')
				.endOf('month')
			newAccountsTimesheetFirstDate = newAccountsTimesheetLastDate
				.clone()
				.startOf('month')
		}

		this.setState({
			accountsTimesheetLastDate: newAccountsTimesheetLastDate,
			accountsTimesheetFirstDate: newAccountsTimesheetFirstDate
		})
	}

	nextTimesheetSpan = () => {
		const {
			isAccountsTimesheetWeekly,
			accountsTimesheetLastDate,
			accountsTimesheetFirstDate
		} = this.state
		let newAccountsTimesheetLastDate, newAccountsTimesheetFirstDate
		if (isAccountsTimesheetWeekly) {
			newAccountsTimesheetLastDate = accountsTimesheetLastDate
				.add(7, 'd')
				.endOf('isoweek')
			newAccountsTimesheetFirstDate = accountsTimesheetFirstDate
				.add(7, 'd')
				.startOf('isoweek')
		} else {
			newAccountsTimesheetFirstDate = accountsTimesheetLastDate
				.add(7, 'd')
				.startOf('month')
			newAccountsTimesheetLastDate = newAccountsTimesheetFirstDate
				.clone()
				.endOf('month')
		}

		this.setState({
			accountsTimesheetLastDate: newAccountsTimesheetLastDate,
			accountsTimesheetFirstDate: newAccountsTimesheetFirstDate
		})
	}
	setTimeSheetToWeekly = () => {
		const accountsTimesheetLastDate = moment().endOf('isoweek')
		const accountsTimesheetFirstDate = moment().startOf('isoweek')

		this.setState({
			isAccountsTimesheetWeekly: true,
			accountsTimesheetLastDate,
			accountsTimesheetFirstDate
		})
	}

	setTimeSheetToMonthly = () => {
		const accountsTimesheetLastDate = moment().endOf('month')
		const accountsTimesheetFirstDate = moment().startOf('month')
		this.setState({
			isAccountsTimesheetWeekly: false,
			accountsTimesheetLastDate,
			accountsTimesheetFirstDate
		})
	}

	handlePaymentModalClose = () => {
		this.props.handlePaymentModalClose()
	}

	handleDropDown = event => {
		this.setState({ showDropDown: true })
	}

	hideDropDown = event => {
		this.setState({ showDropDown: false })
	}

	handleLogOut = (event, data) => {
		this.props.userLogout().then(() => {
			this.props.history.push('/')
		})
	}

	handleContentLoadStart = () => {
		this.setState({
			contentLoaded: false
		})
	}

	handleContentLoadEnd = () => {
		this.setState({
			contentLoaded: true
		})
	}

	handleBusinessModalOpen = event => {
		this.props.handleBusinessModalOpen()
	}

	handleBusinessModalClose = event => {
		this.props.handleBusinessModalClose()
	}

	handleDeleteBuildingModalOpen = event => {
		this.props.handleDeleteBuildingModalOpen()
	}

	handleDeleteBuildingModalClose = event => {
		this.props.handleDeleteBuildingModalClose()
	}

	handleAddMembership = event => {
		this.props.history.push('/memberships/add')
	}

	handlePreview = event => {
		var win = window.open('https://www.sagepass.com/spiezwebservices')
		win.focus()
	}

	handleHome = event => {
		this.props.history.push('/home')
		this.setState({
			showHome: true
		})
	}

	handleFacilities = event => {
		this.props.history.push('/facilities')
		this.setState({
			showFacilities: true
		})
	}

	handleSupport = () => {
		this.props.history.push('/support')
	}

	handleGallery = event => {
		this.props.history.push('/gallery')
	}

	handleEvents = event => {
		this.props.history.push('/events')
	}

	handleAddEventRoute = event => {
		this.props.history.push('/events/add')
	}

	handleMemberships = event => {
		this.props.history.push('/memberships')
	}


	handleAccounts = event => {
		this.props.history.push('/accounts')
	}

	handleContents = event => {
		this.props.history.push('/contents')
	}

	handleAccountSettings = (event, data) => {
		var win = window.open('https://www.sagepass.com/settings')
		win.focus()
	}

	handelSettings = () => this.props.history.push('/settings')

	handleEditProfile = (event, data) => {
		var win = window.open('https://www.sagepass.com/profile')
		win.focus()
	}

	handleShowAddAccess = event => {
		// var child = ReactDOM.findDOMNode(this.child.showAccess)
		// child.click()
		const access_button = document.querySelector('#add_access')
		return access_button.click()
	}

	handleShowDiscount = event => {
		// var child = ReactDOM.findDOMNode(this.child.showDiscount)
		// child.click()
		const add_discount = document.querySelector('#add_discount')
		return add_discount.click()
	}

	handlebackToMembership = e => {
		this.props.history.push('/memberships')
	}

	support = (event, data) => {
		window.open('https://www.sagepass.com/support', '_self')
	}

	termsAndConditions = (event, data) => {
		window.open('https://www.sagepass.com/terms', '_self')
	}

	focusMessageSearch = e => {
		const searchBox = document.querySelector('#search')
		return searchBox.focus()
	}

	changeStyle = checked => {
		var style = ''
		if (checked) style = 'item ' + classes.sidebaritem + ' ' + classes.active
		else style = 'item ' + classes.sidebaritem
		return style
	}

	handleShowAddAttendance = button_clicked => {
		this.setState({
			button_clicked: button_clicked
		})
	}

	handleRemoveEvent = event => {
		this.setState({
			button_clicked: ''
		})
	}

	renderMembershipButtons = () => {
		if (this.state.definitions) {
			return (
				<div
					className={
						'ui tiny green button right floated ' + classes.addMembershipbtn
					}
					onClick={this.handleAddMembership}
				>
					<Icon name={'add'} />
					Add Membership
				</div>
			)
		}
		if (this.state.active_members) {
			return (
				<div className={classes.galleryBtns}>
					<div
						className={
							'ui tiny green button right floated ' + classes.addMembershipbtn
						}
						onClick={() => this.handleShowAddAttendance('Add Member')}
					>
						<Icon name={'add'} />
						Add Member
					</div>
					<div
						className={
							'ui tiny green button right floated ' + classes.addMembershipbtn
						}
						onClick={() => this.handleShowAddAttendance('Add Bulk Member')}
					>
						<Icon name={'add'} />
						Bulk Add
					</div>
					<div
						className={
							'ui tiny primary button right floated ' + classes.addMembershipbtn
						}
						onClick={() => this.handleShowAddAttendance('Send Message')}
					>
						<Icon name={'envelope'} />
						Message
					</div>
				</div>
			)
		}

		if (this.state.transactions) {
			return null
		}

		if (this.state.attendances) {
			return (
				<div
					className={
						'ui tiny green button right floated ' + classes.addMembershipbtn
					}
					onClick={() => this.handleShowAddAttendance('Add Attendance')}
				>
					<Icon name={'add'} />
					Add Attendance
				</div>
			)
		}
	}

	handleMembershipsButtonState = active_item => {
		if (active_item == 'definitions') {
			this.setState({
				active_members: false,
				transactions: false,
				attendances: false,
				definitions: true
			})
		} else if (
			active_item == 'active members' ||
			active_item == 'expired members'
		) {
			this.setState({
				active_members: true,
				transactions: false,
				attendances: false,
				definitions: false
			})
		} else if (active_item == 'attendances') {
			this.setState({
				active_members: false,
				transactions: false,
				attendances: true,
				definitions: false
			})
		} else {
			this.setState({
				active_members: false,
				transactions: true,
				attendances: false,
				definitions: false
			})
		}
	}

	handleFacilitiesButtonState = async tabIndex => {
		this.setState({
			facilitiesTabIndex: tabIndex
		})
	}

	renderFacilitiesButton = () => {
		if(this.state.facilitiesTabIndex == 0) {
			return (
				<div
					className={
						'ui tiny green button right floated ' + classes.addbuildingbtn
					}
					onClick={e => {
						this.setState({
							showAddBuildingModal: true
						})
					}}
				>
					<Icon name={'code branch'} />Add Building
				</div>
			)
		} else if(this.state.facilitiesTabIndex == 1) {
			return (
				<div className={classes.galleryBtns}>
					<div
						className={
							'ui tiny blue button right floated ' + classes.addMembershipbtn
						}
					>
						<Icon name={'envelope'} />
						Message
					</div>
					<div
						className={
							'ui tiny blue button right floated ' + classes.addMembershipbtn
						}
					>
						<Icon name={'redo'} />
						Reschedule
					</div>
					<div
						className={
							'ui tiny red button right floated ' + classes.addMembershipbtn
						}
					>
						<Icon name={'eye slash outline'} />
						No Show
					</div>
					<div
						className={
							'ui tiny red button right floated ' + classes.addMembershipbtn
						}
					>
						<Icon name={'close'} />
						Cancel
					</div>
					<div
						className={
							'ui tiny green button right floated ' + classes.addMembershipbtn
						}
					>
						<Icon name={'plus'} />
						Bulk Add
					</div>
					<div
						className={
							'ui tiny green button right floated ' + classes.addMembershipbtn
						}
						onClick={() => {
							this.setState({
								showAddBookingFacilities: true
							})
						}}
					>
						<Icon name={'plus'} />
						Add
					</div>
				</div>
			)
		}
	}

	handleFacilitiesButtonState = async facilitiesTabIndex => {
		await this.setState({
			facilitiesTabIndex: facilitiesTabIndex
		})
	}

	handleEventsButtonState = async eventsTabIndex => {
		await this.setState({
			eventsTabIndex: eventsTabIndex
		})
	}

	renderEventsButton = () => {
		if (this.state.eventsTabIndex == 0 || this.state.eventsTabIndex == 1) {
			return (
				<div
					className={
						'ui tiny green button right floated ' + classes.addbuildingbtn
					}
					onClick={this.handleAddEventRoute}
				>
					<Icon name={'plus'} />Add Event
				</div>
			)
		} else if (this.state.eventsTabIndex == 2) {
			return (
				<div className={classes.galleryBtns}>
					<div
						className={
							'ui tiny blue button right floated ' + classes.addMembershipbtn
						}
					>
						<Icon name={'envelope'} />
						Message
					</div>
					<div
						className={
							'ui tiny green button right floated ' + classes.addMembershipbtn
						}
						onClick={e => {
							this.setState({
								showAttendBookingModal: true
							})
						}}
					>
						<Icon name={'check'} />
						Attended
					</div>
					<div
						className={
							'ui tiny blue button right floated ' + classes.addMembershipbtn
						}
						onClick={e => {
							this.setState({
								showRescheduleBookingModal: true
							})
						}}
					>
						<Icon name={'redo'} />
						Reschedule
					</div>
					<div
						className={
							'ui tiny red button right floated ' + classes.addMembershipbtn
						}
						onClick={e => {
							this.setState({
								showNoShowBookingModal: true
							})
						}}
					>
						<Icon name={'eye slash outline'} />
						No Show
					</div>
					<div
						className={
							'ui tiny red button right floated ' + classes.addMembershipbtn
						}
						onClick={e => {
							this.setState({
								showCancelBookingModal: true
							})
						}}
					>
						<Icon name={'close'} />
						Cancel
					</div>
					<div
						className={
							'ui green tiny button right floated ' + classes.addMembershipbtn
						}
						onClick={e => {
							this.setState({
								showBulkAddBookingModal: true
							})
						}}
					>
						<Icon name="plus" />Bulk Add
					</div>
					<div
						className={
							'ui green tiny button right floated ' + classes.addMembershipbtn
						}
						onClick={() => {
							this.setState({
								showAddBookingModal: true
							})
						}}
					>
						<Icon name="plus" />Add
					</div>
				</div>
			)
		}
	}

	onBusinessChange = async (event, value) => {
		this.setState({
			[value.id]: value.value
		})
		// console.log(value.id , " : " + value.value);
		// const data = await API.get("business", "/")
		// If want to make network request
		// start the loading of the component
		await this.props.getBusinessesList()
		const data = this.props.businessesList
		// ?or else get it from state
		const business = await data.filter(singleBusiness => {
			return singleBusiness.bizname == value.value
		})
		// await this.props.getBusinessesList()
		await this.props.setCurrentBusinessListFunc(business[0])
	}

	componentDidMount() {
		// debugger;
	}

	render() {
		return (
			<div>
				<header>
					<div className="logobox">
						<a href="home" />
						<img src={logo} className="logoimg" />
						<a href="home" className="logoletter">
							sagepass
						</a>
						<a href="home" className="logosmallletter">
							for Business
						</a>
					</div>
					<Select
						options={navOptions}
						className={classes.choosebranch}
						onChange={this.onBusinessChange}
						defaultValue = "Dodo Duck"
						id="onLoadValue"
					/>
					<a
						className={'ui sgcolorhover animate button ' + classes.previewbtn}
						onClick={this.handlePreview}
					>
						Preview
					</a>
					<a
						className={'ui sgcolor animate button ' + classes.addbizbtn}
						onClick={this.handleBusinessModalOpen}
					>
						Add Business
					</a>
					<div className="userbox">
						<div id="userlogo" className="ui pointing dropdown userlogo">
							<a href="profile" />
							<img
								src={spiez_logo}
								className="logoimg userlogo"
								onClick={this.handleDropDown}
							/>
							<div className="userdivide" />
							<a className={classes.username} onClick={this.handleDropDown}>
								Spiez Web Services
								{/* {this.props.user[4].Value} */}
							</a>
							<Dropdown
								open={this.state.showDropDown}
								onClose={this.hideDropDown}
								pointing
								icon={null}
								className={'link item ' + classes.username}
								direction="right"
							>
								<Dropdown.Menu className={classes.alignNavbarDropdown}>
									<Dropdown.Item onClick={this.handleEditProfile}>
										<a className={'item ' + classes.changeColor}>
											Add Business{' '}
											<Icon className={'add ' + classes.iconshift} />
										</a>
									</Dropdown.Item>
									<Dropdown.Item onClick={this.handleEditProfile}>
										<a className={'item ' + classes.changeColor}>
											Edit Profile{' '}
											<Icon className={'edit ' + classes.iconshift} />
										</a>
									</Dropdown.Item>
									<Dropdown.Item onClick={this.handleAccountSettings}>
										<a className={'item ' + classes.changeColor}>
											Business Settings{' '}
											<Icon className={'cog ' + classes.iconshift} />
										</a>
									</Dropdown.Item>
									<Dropdown.Divider />
									<Dropdown.Item onClick={this.support}>
										<a className={'item ' + classes.changeColor}>
											Chat Support{' '}
											<Icon className={'comments ' + classes.iconshift} />
										</a>
									</Dropdown.Item>
									<Dropdown.Item>
										<a className={'item ' + classes.changeColor}>
											Privacy Policies{' '}
											<Icon className={'lock ' + classes.iconshift} />
										</a>
									</Dropdown.Item>
									<Dropdown.Item onClick={this.termsAndConditions}>
										<a className={'item ' + classes.changeColor}>
											Terms <Icon className={'legal ' + classes.iconshift} />
										</a>
									</Dropdown.Item>
									<Dropdown.Item onClick={this.termsAndConditions}>
										<a className={'item ' + classes.changeColor}>
											FAQs{' '}
											<Icon
												className={
													'question circle outline ' + classes.iconshift
												}
											/>
										</a>
									</Dropdown.Item>
									<Dropdown.Divider />
									<Dropdown.Item onClick={this.handleLogOut}>
										<a
											className={
												'item ' + classes.changeColor + ' ' + classes.logout
											}
										>
											Logout{' '}
											<Icon className={'sign out ' + classes.iconshift} />
										</a>
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					</div>
				</header>

				<main className={classes.sidebar}>
					<div className="item sidebaritem" />
					<div className="sidebarcontents">
						<div
							className={
								this.props.match.path == '/home'
									? this.changeStyle(true)
									: this.changeStyle(false)
							}
							onClick={this.handleHome}
						>
							<i className="icon tv" />
							<a>HOME</a>
						</div>
						<div
							className={
								this.props.match.path == '/accounts'
									? this.changeStyle(true)
									: this.changeStyle(false)
							}
							onClick={this.handleAccounts}
						>
							<i className="rupee icon" />
							<a>ACCOUNTS</a>
						</div>
						<div
							className={
								this.props.match.path == '/facilities'
									? this.changeStyle(true)
									: this.changeStyle(false)
							}
							onClick={this.handleFacilities}
						>
							<i className="building icon" />
							<a>FACILITIES</a>
						</div>
						<div
							className={
								this.props.match.path == '/memberships' ||
								this.props.match.path == '/memberships/add'
									? this.changeStyle(true)
									: this.changeStyle(false)
							}
							onClick={this.handleMemberships}
						>
							<i className="users icon" />
							<a>MEMBERSHIPS</a>
						</div>
						<div
							className={
								this.props.match.path == '/events' ||
								this.props.match.path == '/events/add'
									? this.changeStyle(true)
									: this.changeStyle(false)
							}
							onClick={this.handleEvents}
						>
							<i className="calendar alternate outline icon" />
							<a>EVENTS</a>
						</div>
						<div
							className={
								this.props.match.path == '/gallery'
									? this.changeStyle(true)
									: this.changeStyle(false)
							}
							onClick={this.handleGallery}
						>
							<i className="image outline icon" />
							<a>GALLERY</a>
						</div>
						<div
							className={
								this.props.match.path == '/contents'
									? this.changeStyle(true)
									: this.changeStyle(false)
							}
							onClick={this.handleContents}
						>
							<Icon name="file alternate outline" />
							<a>CONTENTS</a>
						</div>
						<div
							className={
								this.props.match.path == '/support'
									? this.changeStyle(true)
									: this.changeStyle(false)
							}
							onClick={this.handleSupport}
						>
							<i className="life ring icon" />
							<a href="support">SUPPORT</a>
						</div>
						<div
							className={
								this.props.match.path == '/settings'
									? this.changeStyle(true)
									: this.changeStyle(false)
							}
							onClick={this.handelSettings}
						>
							<i className="settings icon" />
							<a>SETTINGS</a>
						</div>
					</div>
				</main>

				<main className={classes.mainbizwindow}>
					<div className={classes.navButtonsWrapper}>
						<h1>
							{this.props.match.path === '/home' && 'Home'}
							{this.props.match.path === '/accounts' ? 'Accounts' : null}
							{this.props.match.path === '/gallery' ? 'Gallery' : null}
							{this.props.match.path == '/contents' ? 'Contents' : null}
							{this.props.match.path === '/facilities' ? 'Facilities' : null}
							{this.props.match.path === '/events' ? 'Events' : null}
							{this.props.match.path === '/events/add' ? 'Add Event' : null}
							{this.props.match.path === '/facilities/add' ? 'Add Facility' : null}
							{this.props.match.path == '/memberships/add' ? 'Add Membership' : null}
							{this.props.match.path == '/memberships' ? 'Memberships' : null}
						</h1>
						{this.props.match.path == '/facilities' ? (
							this.renderFacilitiesButton()
						) : null}
						{this.props.match.path == '/facilities/add' ? (
							<div
								className={
									'ui tiny red button right floated ' + classes.addbuildingbtn
								}
								onClick={this.handleAddFacilityBack}
							>
								<Icon name="chevron left" />
								Back
							</div>
						) : null}
						{this.props.match.path == '/memberships'
							? this.renderMembershipButtons()
							: null}

						{this.props.match.path == '/accounts'
							? this.renderAccountsButtons()
							: null}
						{this.props.match.path == '/home' ? this.renderHomeButtons() : null}

						{this.props.match.path == '/memberships/add' ? (
							<div className={classes.galleryBtns}>
								<div
									className={
										'ui tiny red button right floated ' +
										classes.addMembershipbtn
									}
									onClick={this.handlebackToMembership}
								>
									<Icon name={'chevron left'} />
									Back
								</div>
								<div
									className={
										'ui tiny blue button right floated ' +
										classes.addMembershipbtn
									}
									onClick={this.handleShowDiscount}
								>
									<Icon name={'add'} />
									Add Discount
								</div>
								<div
									className={
										'ui tiny blue button right floated ' +
										classes.addMembershipbtn
									}
									onClick={this.handleShowAddAccess}
								>
									<Icon name={'add'} />
									Add Access
								</div>
								<div
									className={
										'ui tiny red button right floated ' +
										classes.addMembershipbtn
									}
									onClick={this.handleAddMembership}
								>
									<Icon name={'youtube play'} />
									Add Youtube Video
								</div>
								<div
									className={
										'ui tiny green button right floated ' +
										classes.addMembershipbtn
									}
									onClick={this.handleAddMembership}
								>
									<Icon name={'upload'} />
									Upload Image
								</div>
							</div>
						) : null}
						{this.props.match.path == '/gallery' ? (
							<div className={classes.galleryBtns}>
								<div
									className={
										'ui tiny red button right floated ' + classes.uploadImageBtn
									}
									onClick={() => this.setState({
										showYoutubeVideoModalGallery: true
									})}
								>
									<Icon name={'youtube play'} />Add YouTube Video
								</div>
								<div
									className={
										'ui tiny blue button right floated ' +
										classes.uploadImageBtn
									}
									onClick={() => this.setState({
										showImageUploadModalGallery: true
									})}
								>
									<Icon name={'file image outline'} />Upload Image
								</div>
							</div>
						) : null}
						{this.props.match.path == '/support' ? (
							<div className={classes.galleryBtns}>
								<div
									className={
										'ui tiny green button right floated ' +
										classes.uploadImageBtn
									}
									onClick={() => this.focusMessageSearch()}
								>
									<Icon name={'mail'} />New message
								</div>
								<div
									className={
										'ui tiny blue button right floated ' +
										classes.uploadImageBtn
									}
									onClick={this.props.toggleNewNotificationModal}
								>
									<Icon name={'bullhorn'} />New notification
								</div>
							</div>
						) : null}
						{this.props.match.path == '/events'
							? this.renderEventsButton()
							: null}
						{this.props.match.path == '/events/add' ? (
							<div className={classes.galleryBtns}>
								<div
									className={
										'ui green tiny button right floated ' +
										classes.addMembershipbtn
									}
									onClick={() => {
										document.querySelector('#img').click()
									}}
								>
									<Icon name="upload" />Upload Image
								</div>
								<div
									className={
										'ui red tiny button right floated ' +
										classes.addMembershipbtn
									}
									onClick={() => {
										this.setState({
											showYoutubeVideoModal: true
										})
									}}
								>
									<Icon name="youtube play" />Add YouTube Video
								</div>
								<div
									className={
										'ui tiny blue button right floated ' +
										classes.addMembershipbtn
									}
									onClick={() => {
										document.querySelector('#add_discount').click()
									}}
								>
									<Icon name="plus" />Add Discount
								</div>
								<div
									className={
										'ui tiny red button right floated ' +
										classes.addMembershipbtn
									}
									onClick={() => {
										this.props.history.push('/events')
									}}
								>
									<Icon name="chevron left" />Back
								</div>
							</div>
						) : null}
					</div>
					<section style={{ width: '100%', height: '100%' }}>
						{this.props.showPayment ? (
							<PaymentModal
								showPayment={this.props.showPayment}
								handlePaymentModalClose={this.handlePaymentModalClose}
							/>
						) : null}
						{this.props.showBusinessModal ? (
							<BusinessModal
								showBusinessModal={this.props.showBusinessModal}
								handleBusinessModalClose={this.handleBusinessModalClose}
								closeOnDimmerClick={true}
							/>
						) : null}
						{this.props.showOfflineTransactionModal && (
							<OfflineTransactionModal
								open={this.props.showOfflineTransactionModal}
								toggelOfflineTransactionItemModal={
									this.props.toggelOfflineTransactionModal
								}
							/>
						)}
						{this.props.showBulkTransactionModal && (
							<BulkTransactionModal
								open={this.props.showBulkTransactionModal}
								toggelBulkTransactionItemModal={
									this.props.toggelBulkTransactionModal
								}
							/>
						)}
						{this.props.showAddEmployeeModal && (
							<AddEmployeeModal
								open={this.props.showAddEmployeeModal}
								toggleAddEmployeeModal={this.props.toggleAddEmployeeModal}
							/>
						)}
						{this.props.showAddAttendanceModal && (
							<AddAttendanceModal
								open={this.props.showAddAttendanceModal}
								toggleAddAttendanceModal={this.props.toggleAddAttendanceModal}
							/>
						)}
						{this.props.showAddBuildingModal ? (
							<AddBuilding
								showAddBuildingModal={this.props.showAddBuildingModal}
								handleAddBuildingModalOpen={
									this.props.handleAddBuildingModalOpen
								}
								handleAddBuildingModalClose={
									this.props.handleAddBuildingModalClose
								}
							/>
						) : null}
						{this.props.showAddYoutubeVideoModal ? (
							<AddYoutubeVideoModal
								open={this.props.showAddYoutubeVideoModal}
								toggelAddYoutubeVideoModal={
									this.props.toggelAddYoutubeVideoModal
								}
							/>
						) : null}
						{this.props.showUploadImageModal ? (
							<UploadImageModal
								open={this.props.showUploadImageModal}
								toggelUploadImageModal={this.props.toggelUploadImageModal}
							/>
						) : null}
						{this.props.showNewNotificationModal ? (
							<NewNotificationModal
								open={this.props.showNewNotificationModal}
								toggleNewNotificationModal={
									this.props.toggleNewNotificationModal
								}
							/>
						) : null}
						{this.props.match.path == '/facilities' ? (
							<Facilities
								facilitiesButtonState={this.handleFacilitiesButtonState}
								showAddBuildingModal={this.state.showAddBuildingModal}
								showAddBookingFacilities={this.state.showAddBookingFacilities}
								handleAddBuildingModal={() => {
									this.setState({
										showAddBuildingModal: false
									})
								}}
								handleAddBookingModal={() => {
									this.setState({
										showAddBookingFacilities: false
									})
								}}
							/>
						) : null}
						{this.props.match.path == '/facilities/add' ? (
							<AddFacility />
						) : null}
						{this.props.match.path == '/memberships' ? (
							<MemberShips
								buttonState={this.handleMembershipsButtonState}
								button_clicked={this.state.button_clicked}
								removeButtonClicked={this.handleRemoveEvent}
							/>
						) : null}
						{this.props.match.path == '/memberships/add' ? (
							<AddMembership
								ref={node => {
									this.child = node
								}}
							/>
						) : null}
						{this.props.match.path == '/events' ? (
							<Events
								eventsButtonState={this.handleEventsButtonState}
								removeButtonClicked={this.handleRemoveEvent}
								showAddBookingModal={this.state.showAddBookingModal}
								showBulkAddBookingModal={this.state.showBulkAddBookingModal}
								showCancelBookingModal={this.state.showCancelBookingModal}
								showNoShowBookingModal={this.state.showNoShowBookingModal}
								showAttendBookingModal={this.state.showAttendBookingModal}
								showRescheduleBookingModal={
									this.state.showRescheduleBookingModal
								}
								handleAddBookingModalClose={() => {
									this.setState({
										showAddBookingModal: false
									})
								}}
								handleBulkAddBookingModalClose={() => {
									this.setState({
										showBulkAddBookingModal: false
									})
								}}
								handleCancelBookingModalClose={() => {
									this.setState({
										showCancelBookingModal: false
									})
								}}
								handleNoShowBookingModalClose={() => {
									this.setState({
										showNoShowBookingModal: false
									})
								}}
								handleAttendBookingModalClose={() => {
									this.setState({
										showAttendBookingModal: false
									})
								}}
								handleRescheduleBookingModalClose={() => {
									this.setState({
										showRescheduleBookingModal: false
									})
								}}
							/>
						) : null}
						{this.props.match.path == '/events/add' ? (
							<AddEvent
								showYoutubeVideoModal={this.state.showYoutubeVideoModal}
								handleYoutubeVideoModal={() => {
									this.setState({
										showYoutubeVideoModal: false
									})
								}}
							/>
						) : null}
						{this.props.match.path == '/accounts' ? (
							<Accounts
								timesheetFirstDate={this.state.accountsTimesheetFirstDate}
								timesheetLastDate={this.state.accountsTimesheetLastDate}
								activeIndex={this.state.accountTabIndex}
								handleTabChange={this.handleAccountsTabChange}
								isAccountsTimesheetWeekly={this.state.isAccountsTimesheetWeekly}
							/>
						) : null}
						{this.props.match.path == '/gallery' ? (
							<Gallery
								showYoutubeVideoModal={this.state.showYoutubeVideoModalGallery}
								showImageUploadModal={this.state.showImageUploadModalGallery}
								handleYoutubeModal={() => {
									this.setState({
										showYoutubeVideoModalGallery: false
									})
								}}
								handleImageUploadModal={() => {
									this.setState({
										showImageUploadModalGallery: false
									})
								}}
							/>
						): null}
						{this.props.match.path == '/home' ? <BusinessHome /> : null}
						{this.props.match.path == '/support' ? <Support /> : null}
						{this.props.match.path == '/settings' ? <Settings /> : null}
						{this.props.match.path == '/contents' ? <Contents /> : null}
					</section>
				</main>
			</div>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{ userLogout, setCurrentBusinessListFunc, getBusinessesList },
		dispatch
	)
}

const mapStateToProps = state => ({
	user: state.currentUser,
	businessesList: state.businessesList,
	currentBusinessList: state.currentBusinessList
})

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(NavBar)
)
