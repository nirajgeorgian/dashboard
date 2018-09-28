import {
	ATTENDANCE_ADD,
	ATTENDANCE_DELETE,
	ATTENDANCE_LOAD
} from '../../ACTION_TYPE/ACTION_TYPE'

export const attendanceAdd = payload => ({
	type: ATTENDANCE_ADD,
	payload
})

export const attendanceLoad = payload => ({
	type: ATTENDANCE_LOAD,
	payload
})

export const attendanceDelete = id => ({
	type: ATTENDANCE_DELETE,
	payload: id
})
