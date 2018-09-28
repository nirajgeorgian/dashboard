import {
	BUSINESS_FETCHED,
	BUSINESS_NOT_FETCHED,
	BUSINESS_UPDATE,
	BUILDING_DELETE,
	BUILDING_ADDED
} from '../../Actions/ACTION_TYPE/ACTION_TYPE'

export default function(state = [], action) {
	// console.log(state,action)
	switch (action.type) {
		case BUSINESS_FETCHED:
			return action.payload
			break
		case BUSINESS_NOT_FETCHED:
			return state
			break
		case BUSINESS_UPDATE:
			const attributes = action.payload.message.Attributes
			var a = [attributes]
			return a
			break
		case BUILDING_ADDED:
			const build = action.payload
			var businesses = JSON.parse(JSON.stringify(state))
			var a = businesses
				.filter(business => business.bizid == build.bizid)
				.map(business => {
					return business.buildings.push(build)
				})
			businesses.filter(business => {
				business.buildings = a[0]
			})
			console.log(businesses)
			// return businesses
			break
		case BUILDING_DELETE:
			const building = action.payload
			var businesses = JSON.parse(JSON.stringify(state))
			var a = businesses
				.filter(business => business.bizid == building.bizid)
				.map(business => {
					return business.buildings.filter(item => item.bid != building.bid)
				})
			businesses.filter(business => {
				if (business.bizid == building.bizid) {
					business.buildings = a[0]
				}
			})
			return businesses

		// console.log(businesses)
		// return [
		//   state.map(business => {
		//     if(business.bizid == action.payload.message.Attributes.bizid) {
		//       return action.payload.message.Attributes
		//     }
		//     return business
		//   })
		// ]
		default:
			return state
	}
}
