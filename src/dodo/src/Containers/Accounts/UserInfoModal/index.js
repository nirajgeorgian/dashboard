import React from 'react'
import { Modal, Header, Button, Icon } from 'semantic-ui-react'

import classes from './UserInfo.local.scss'

export default ({ open, user, onClose }) => {
	return (
		<Modal
			onClose={onClose}
			open={open}
			size="small"
			closeOnDimmerClick={false}
			closeIcon
		>
			<Modal.Header>{user.name}</Modal.Header>
			<Modal.Content>
				<div className={classes.info_container}>
					<div className={classes.user_image}>
						<img className={classes.image} src={user.image} />
					</div>
					<div className={classes.user_info}>
						<Header>
							{user.name},{user.age}
						</Header>
						<ul className={classes.info_list}>
							<li className={classes.info_item}>
								Member since {user.MemberSince}
							</li>
							<li className={classes.info_item}>
								Membership: {user.Membership}
							</li>
							<li className={classes.info_item}>
								Contact Number:{' '}
								<a href={`tel:${user.ContactNumber}`}>{user.ContactNumber}</a>
							</li>
							<li className={classes.info_item}>
								Email Address:{' '}
								<a href={`mailto:${user.EmailAddress}`}>{user.EmailAddress}</a>
							</li>
							<li className={classes.info_item}>Address: {user.Address}</li>
							{user.SpecialNeeds && (
								<li className={classes.info_item}>
									Special Needs: {user.SpecialNeeds}
								</li>
							)}
						</ul>
					</div>
				</div>
			</Modal.Content>
			<Modal.Actions>
				<Button onClick={onClose} secondary>
					Close
				</Button>
			</Modal.Actions>
		</Modal>
	)
}
