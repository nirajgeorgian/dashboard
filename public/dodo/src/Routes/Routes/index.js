import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PaymentsPlan from '../../Containers/Payments/paymentsPlan/index'

// import Routes type
import { ApplyRoutes, PrivateRoute } from '../'

// Import component
import {
	Login,
	Signup,
	Business,
	Home,
	Profile,
	NavBar,
	LandingPage,
	Gallery,
	Settings,
	AddMembership,
	Events,
	Contents
} from '../../Containers'
// import { LandingPage } from '../../Containers/Home/LandingPage/LandingPage'
import { NotFound, PaymentSuccess, PaymentFailed } from '../../Components'
import NotFoundPage from '../../Components/UI/404page/index'
import Contact from '../../Containers/Contact'
import Pricing from '../../Containers/Pricing'

/*
  There are two types of component's one privateRoute component
  and one simple route
  to access private route one should check isAutenticated state
*/

// const Routes = props => (
//   <Switch>
//     <ApplyRoutes path="/" exact component={Home} />
//     <ApplyRoutes path="/login" exact component={Login} />
//     <ApplyRoutes path="/signup" exact component={Signup} />
//     <PrivateRoute path="/business" exact component={Business} />
//     <ApplyRoutes component={NotFound} />
//   </Switch>
// )

/*
  some fake views
*/

const About = () => <h2>About Us</h2>
// const Contact = () => (
// 	<div>
// 		<Navbar />
// 	</div>
// )

class Routes extends Component {
	render() {
		// console.log(this.props.match)
		return (
			<Switch>
				<ApplyRoutes path="/" exact component={LandingPage} />
				{/* <ApplyRoutes path="/login" exact component={Login} /> */}
				{/* // <ApplyRoutes path="/signup" exact component={Signup} /> */}
				<PrivateRoute exact path="/facilities/add" component={Home} />
				<PrivateRoute path="/business" exact component={Business} />
				/* Simple dummy Routes */
				<PrivateRoute path="/home" exact component={Home} />
				<Route path="/about" exact component={About} />
				<Route path="/contact" exact component={Contact} />
				<Route path="/pricing" exact component={Pricing} />
				<PrivateRoute path="/profile" exact component={Profile} />
				<PrivateRoute path="/facilities" component={Home}>
				{/*	<PrivateRoute path="/add" component={AddFacility} /> */}
				</PrivateRoute>
				/* dummy routes end here */
				<PrivateRoute exact path="/gallery" component={Home} />
				<PrivateRoute exact path="/support" component={Home} />
				<PrivateRoute exact path="/settings" component={Home} />
				<PrivateRoute exact path="/events" component={Home} />
				<PrivateRoute exact path="/events/add" component={Home} />
				<PrivateRoute exact path="/memberships" component={Home} />
				<PrivateRoute exact path="/memberships/add" component={Home} />
				<PrivateRoute exact path="/accounts" component={Home} />
				<PrivateRoute exact path="/contents" component={Home} />
				<PrivateRoute
					exact
					path="/payments/chooseplan"
					component={PaymentsPlan}
				/>
				<PrivateRoute
					exact
					path="/payments/checkout"
					component={PaymentsPlan}
				/>
				<PrivateRoute
					exact
					path="/payments/withdraw"
					component={PaymentsPlan}
				/>
				<PrivateRoute
					exact
					path="/payments/makepayment"
					component={PaymentsPlan}
				/>
				{/* </PrivateRoute> */}
				{/*
				<PrivateRoute
					exact
					path="/payments/success"
					component={PaymentSuccess}
				/>
				<PrivateRoute exact path="/payments/failed" component={PaymentFailed} />
				*/}
				<ApplyRoutes component={NotFoundPage} path="*" status={404} />
			</Switch>
		)
	}
}

function mapStateToProps(state) {
	return {
		state
	}
}

export default withRouter(connect(mapStateToProps.null)(Routes))
