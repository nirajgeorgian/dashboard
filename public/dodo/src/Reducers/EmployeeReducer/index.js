import {
	EMPLOYEE_ADD,
	EMPLOYEE_LOAD,
	EMPLOYEE_UPDATE
} from '../../Actions/ACTION_TYPE/ACTION_TYPE'

export default function(state = [], action) {
	switch (action.type) {
		case EMPLOYEE_ADD:
			return [...state, action.payload]
			break
		case EMPLOYEE_LOAD:
			return [...action.payload]
			break
		case EMPLOYEE_UPDATE:
			const index = state.findIndex(findEmpIndex(action.payload.empid))
			return [
				...state.slice(0, index),
				{ ...action.payload },
				...state.slice(index + 1)
			]
			break
		default:
			return state
	}
}

const findEmpIndex = empid => emp => emp.empid === empid
