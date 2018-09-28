import React from 'react'
import Hof from '../..'

const Layout = props => (
	<section className={props.className}>
		{props.children}
	</section>
)

export default Layout
