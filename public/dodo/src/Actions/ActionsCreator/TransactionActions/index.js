import {
	TRANSACTION_ADD,
	TRANSACTION_LOAD,
	TRANSACTION_DELETE
} from '../../ACTION_TYPE/ACTION_TYPE'

export const transactionAdd = payload => ({
	type: TRANSACTION_ADD,
	payload
})

export const transactionLoad = payload => ({
	type: TRANSACTION_LOAD,
	payload
})
export const transactionDelete = payload => ({
	type: TRANSACTION_DELETE,
	payload
})
