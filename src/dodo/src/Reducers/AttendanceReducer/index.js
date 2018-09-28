import {
	ATTENDANCE_ADD,
	ATTENDANCE_DELETE,
	ATTENDANCE_LOAD
} from '../../Actions/ACTION_TYPE/ACTION_TYPE'

export default function(state = [], action) {
	switch (action.type) {
		case ATTENDANCE_ADD:
			return [...state, action.payload]
			break
		case ATTENDANCE_LOAD:
			return [...action.payload]
			break

		default:
			return state
	}
}
