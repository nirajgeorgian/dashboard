import {
	EMPLOYEE_ADD,
	EMPLOYEE_LOAD,
	EMPLOYEE_UPDATE
} from '../../ACTION_TYPE/ACTION_TYPE'

export const employeeAdd = payload => ({
	type: EMPLOYEE_ADD,
	payload
})

export const employeeLoad = payload => ({
	type: EMPLOYEE_LOAD,
	payload
})
export const employeeEdit = payload => ({
	type: EMPLOYEE_UPDATE,
	payload
})
