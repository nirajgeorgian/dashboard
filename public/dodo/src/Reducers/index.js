import { combineReducers } from 'redux'

// import Reducers
import LoginSuccess from './LoginReducer/LoginSuccess'
import isLoading from './UIReducer/isLoading'
import errorMessage from './Messages/Messages'
import currentUser from './CurrentUser/CurrentUser'
import showConfirm from '../Reducers/LoginReducer/ConfirmUser'
import paymentProcess from '../Reducers/PaymentReducer/PaymentReducer'
import business from '../Reducers/BusinessReducer/BusinessReducer'
import businessList from '../Reducers/BusinessList/BusinessList'
import currentBusinessList from '../Reducers/currentBusinessList/currentBusinessList'
import globalMessage from '../Reducers/GlobalMessage/GlobalMessage'
import TransactionReducer from './TransactionReducer'
import EmployeeReducer from './EmployeeReducer'
import AttendanceReducer from './AttendanceReducer'
// import FormReducer from './FormReducer/FormReducer';

const rootReducer = combineReducers({
	isAutenticated: LoginSuccess,
	isLoading: isLoading,
	errorMessage: errorMessage,
	currentUser: currentUser,
	showConfirm: showConfirm,
	paymentStatus: paymentProcess,
	businessesList: businessList,
	currentBusinessList: currentBusinessList,
	globalMessage: globalMessage,
	transactions: TransactionReducer,
	employees: EmployeeReducer,
	attendance: AttendanceReducer
	// businessList:
	// formData: FormReducer
})

export { rootReducer }
