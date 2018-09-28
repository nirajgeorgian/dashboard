export const PlanDetails = {
	plan_active: true,
	plan_type: 'Small Business',
	validity: '21st August 2018'
}

export const paymentHistory = [
	{
		state: 'Success',
		details: 'Initial Subscription',
		price: 599,
		time: '10 hours ago'
	},
	{
		state: 'Failed',
		details: 'Renewal - Small Plan',
		price: 599,
		time: '24 hours ago'
	},
	{
		state: 'Cancelled',
		details: 'Upgrade from Small to Big Plan',
		price: 999,
		time: '21st June 2017'
	},
	{
		state: 'Success',
		details: 'Renewal - Big Plan',
		price: 999,
		time: '8th August 2018'
	}
]
