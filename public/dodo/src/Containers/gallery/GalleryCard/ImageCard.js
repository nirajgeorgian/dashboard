import React from 'react'
import {
	Card,
	Icon,
	Image,
	Dimmer,
	Header,
	Segment,
	Button,
	Modal,
	Transition,
	Divider
} from 'semantic-ui-react'

import classes from './ImageCard.local.scss'
import RemoveItemModal from '../RemoveItemModal'
import ModifyItemModal from '../ModifyItemModal'

class ImageCard extends React.Component {
	state = {
		active: false,
		isRemoveItemTypeImage: true,
		removeItemModalOpen: false,
		showCarouselModal: false,
		showModifyItemModal: false,
		carouselImageindex: 0,
		carouselTransition: 'right',
		carouselImageVisible: true
	}

	componentDidMount() {
		console.log(this.props.images)
	}

	getImageUrlArray = () => {
		return this.props.images.map(image => image.photo_file)
	}

	handelItemRemove = () => {
		// logic to remove Item from S3 will go here in nere future
		console.log('Removed')
		this.setState({ removeItemModalOpen: false })
	}

	toggleCarouselModal = () => {
		console.log(this.state.showCarouselModal)
		return this.setState(state => ({
			showCarouselModal: !state.showCarouselModal,
			carouselImageindex: this.props.index
		}))
	}
	 
	toggleModifyItemModal = () => 
		this.setState(state => ({
			showModifyItemModal: !state.showModifyItemModal
		}))

	toggelImageRemoveItemModal = () =>
		this.setState(state => ({
			removeItemModalOpen: !state.removeItemModalOpen
		}))

	carouselLeft = () => {
		this.setState({
			carouselImageVisible: false,
			carouselTransition: 'left'
		})
	}

	carouselRight = () => {
		this.setState({
			carouselImageVisible: false,
			carouselTransition: 'right'
		})
	}

	keyUp = e => {
		console.log(e.keycode)
	}

	onLoad = () => {
		let nextIndex
		if (this.state.carouselTransition === 'right') {
			if (this.state.carouselImageindex === this.props.images.length - 1)
				nextIndex = 0
			else nextIndex = this.state.carouselImageindex + 1
		} else if (this.state.carouselTransition === 'left') {
			console.log('left')
			if (this.state.carouselImageindex === 0)
				nextIndex = this.props.images.length - 1
			else nextIndex = this.state.carouselImageindex - 1
		}
		this.setState({
			carouselImageVisible: true,
			carouselImageindex: nextIndex
		})
	}

	renderCarouselModal = () => {
		const { carouselTransition } = this.state
		const { images } = this.props
		return (
			<Modal
				size="small"
				onClose={this.toggleCarouselModal}
				open={this.state.showCarouselModal}
			>
				<Modal.Header>{images[this.state.carouselImageindex].title}</Modal.Header>
				<Modal.Content>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between'
						}}
					>
						<Button
							primary
							circular
							onClick={this.carouselLeft}
							className={classes.carousel_action}
							icon="arrow left"
						/>

						<Transition
							visible={this.state.carouselImageVisible}
							animation={'fade'}
							duration={500}
							onHide={this.onLoad}
						>
							<Image
								className={classes.carousel_image}
								src={images[this.state.carouselImageindex].photo_file}
							/>
						</Transition>
						<Button
							primary
							className={classes.carousel_action}
							circular
							onClick={this.carouselRight}
							icon="arrow right"
						/>
					</div>
					<div className={classes.carousel_description}>
						{images[this.state.carouselImageindex].description}
					</div>
				</Modal.Content>
			</Modal>
		)
	}

	renderRemoveItemModal = (image) => (
		<RemoveItemModal
			image={this.state.isRemoveItemTypeImage}
			open={this.state.removeItemModalOpen}
			toggelRemoveItemModal={this.toggelImageRemoveItemModal}
			handelRemove={this.handelItemRemove}
			image={image}
		/>
	)

	renderModifyItemModal = (item) => (
		<ModifyItemModal
			open={this.state.showModifyItemModal}
			handleClose={this.toggleModifyItemModal}
			image={true}
			item={item}
		/>
	)

	handleShow = () => this.setState({ active: true })
	handleHide = () => this.setState({ active: false })
	render = () => {
		const { header, image, description, date } = this.props
		return (
			<Card className={classes.cardItem}>
				{this.state.removeItemModalOpen && this.renderRemoveItemModal(image)}
				{this.state.showCarouselModal && this.renderCarouselModal()}
				{this.state.showModifyItemModal && this.renderModifyItemModal(image)}
				<Dimmer.Dimmable
					className={classes.dimmable}
					onMouseEnter={this.handleShow}
					onMouseLeave={this.handleHide}
					blurring
					as={Segment}
					dimmed={this.state.active}
				>
					<Image className={classes.image} src={image} size='medium'/>
					<Dimmer inverted active={this.state.active}>
						<div className={classes.image_actions}>
							<Button
								onClick={this.toggleCarouselModal}
								className={classes.image_action}
								content="View"
								primary
							/>
							<Button
								className={classes.image_action}
								onClick={this.toggleModifyItemModal}
								content="Modify"
								positive
							/>
							<Button
								onClick={this.toggelImageRemoveItemModal}
								className={classes.image_action}
								content="Remove"
								negative
							/>
						</div>
					</Dimmer>
				</Dimmer.Dimmable>
				<Card.Content>
					<Card.Header>{header}</Card.Header>
					<Card.Description>{description}</Card.Description>
				</Card.Content>
				<Card.Content extra>
					<p>
						<Icon name="calendar" />
						{date}
					</p>
				</Card.Content>
			</Card>
		)
	}
}

export default ImageCard
