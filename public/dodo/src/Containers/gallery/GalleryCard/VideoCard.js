import React from 'react'
import {
	Card,
	Icon,
	Image,
	Dimmer,
	Header,
	Segment,
	Button,
	Item
} from 'semantic-ui-react'

import RemoveItemModal from '../RemoveItemModal'
import ModifyItemModal from '../ModifyItemModal'
import classes from './VideoCard.local.scss'

class VideoCard extends React.Component {
	state = {
		isRemoveItemTypeImage: false,
		removeItemModalOpen: false,
		showModifyItemModal: false
	}

	handelItemRemove = () => {
		// logic to remove Item from S3 will go here in nere future
		console.log('Removed')
		this.setState({ removeItemModalOpen: false })
	}

	toggleModifyItemModal = () =>
		this.setState(state => ({
			showModifyItemModal: !state.showModifyItemModal
		}))

	toggelImageRemoveItemModal = () =>
		this.setState(state => ({
			removeItemModalOpen: !state.removeItemModalOpen
		}))

	renderRemoveItemModal = (videoId) => (
		<RemoveItemModal
			image={this.state.isRemoveItemTypeImage}
			open={this.state.removeItemModalOpen}
			toggelRemoveItemModal={this.toggelImageRemoveItemModal}
			handelRemove={this.handelItemRemove}
			videoId={videoId}
		/>
	)

	renderModifyItemModal = (item) => (
		<ModifyItemModal
			open={this.state.showModifyItemModal}
			handleClose={this.toggleModifyItemModal}
			item={item}
			image={false}
		/>
	)

	render = () => {
		const { header, videoUrl, description, date } = this.props
		const videoId = videoUrl.split('=')[1]
		console.log('video', videoId)
		const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`
		return (
			<Card>
				{this.renderRemoveItemModal(videoId)}
				{this.state.showModifyItemModal && this.renderModifyItemModal(videoUrl)}
				<div className={classes.container}>
					<iframe
						className={classes.player}
						type="text/html"
						width="100%"
						height="100%"
						src={videoSrc}
						frameBorder="0"
					/>
				</div>
				<Card.Content>
					<Card.Header>{header}</Card.Header>
					<Card.Description>{description}</Card.Description>
				</Card.Content>
				<Card.Content extra>
					<div className={classes.extra}>
						<p>
							<Icon name="calendar" />
							{date}
						</p>
						<div className={classes.actions}>
							<div className={classes.edit} onClick={this.toggleModifyItemModal}>
								<Icon name="edit" />
							</div>
							<div
								className={classes.remove}
								onClick={this.toggelImageRemoveItemModal}
							>
								<Icon name="trash" />
							</div>
						</div>
					</div>
				</Card.Content>
			</Card>
		)
	}
}

export default VideoCard
