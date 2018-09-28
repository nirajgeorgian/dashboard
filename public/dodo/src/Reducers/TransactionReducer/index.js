import {
	TRANSACTION_ADD,
	TRANSACTION_LOAD,
	TRANSACTION_DELETE
} from '../../Actions/ACTION_TYPE/ACTION_TYPE'

export default function(state = [], action) {
	switch (action.type) {
		case TRANSACTION_ADD:
			return [...state, action.payload]
			break
		case TRANSACTION_LOAD:
			return [...action.payload]
			break
		case TRANSACTION_DELETE:
			console.log(action.payload)
			return [
				...state.filter(txn => {
					if (txn.offline) return txn.id !== action.payload
					return true
				})
			]
			break
		default:
			return state
	}
}
