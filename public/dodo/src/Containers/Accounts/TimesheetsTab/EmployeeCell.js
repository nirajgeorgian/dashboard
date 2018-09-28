import React from 'react'
import { Image } from 'semantic-ui-react'
import classes from './TimesheetsTab.local.scss'

const EmployeeCell = () => {
	return (
		<div className={classes.cellContainer}>
			<div>
				<Image
					className={classes.miniImage}
					src={'http://dev.sagepass.com:8081/img/chat/sherlock.jpg'}
					size="mini"
				/>
			</div>
			<div>
				<div>Lena</div>
				<div style={{ fontWeight: 'lighter', color: 'rgba(0,0,0,0.6)' }}>
					Human Resources
				</div>
			</div>
		</div>
	)
}

export default EmployeeCell
