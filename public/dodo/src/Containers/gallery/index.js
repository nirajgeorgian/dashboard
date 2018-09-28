import React, { Component } from 'react'
import Loading from '../../Components/UI/Loading/index'
import classes from './gallery.local.scss'
import { Icon, Popup, Card, Image } from 'semantic-ui-react'
import gym_logo from '../../assests/img/gym_icon.jpg'
import swimming from '../../assests/img/swimming.jpg'
import GalleryCard from './GalleryCard'
import RemoveItemModal from './RemoveItemModal'

import { connect } from 'react-redux'

import ImageCardItem from './GalleryCard/ImageCard'
import VideoCardItem from './GalleryCard/VideoCard'
import AddYoutubeVideoModal from './AddYoutubeVideoModal/index'
import ImageUploadModal from './UploadImageModal/index'

import { Images, Videos } from './MockGalleryData'

class Gallery extends Component {
	
	state = {
		images: [],
		videos: []
	}

	componentWillMount() {
		const business = this.props.business
		this.setState({
			// images: Images,
			videos: business.gallery.youtube_links ? business.gallery.youtube_links : [],
			images: business.gallery.photos ? business.gallery.photos : [],	
		})
	}

	componentWillReceiveProps(props) {
		this.setState({
			// images: Images,
			videos: props.business.gallery.youtube_links ? props.business.gallery.youtube_links : [],
			images: props.business.gallery.photos ? props.business.gallery.photos : [],
		})
	}

	handleAddYoutubeVideo = video_data => {
		console.log(video_data)
		const videos = Array.from(this.state.videos)
		videos.push(video_data)
		this.setState({
			videos: videos
		})
	}

	handleAddImage = image_data => {
		console.log(image_data)
	}

	renderPopup = (content, icon) => {
		return (
			<Popup
				key={content}
				trigger={<Icon className={classes.icon} name={icon} />}
				content={content}
			/>
		)
	}

	render() {
		return (
			<div className={classes.container}>
				<div className={classes.images}>
					<div className={classes.heading}>Images</div>
					<div className={classes.cards}>
						<Card.Group itemsPerRow={3} stackable>
							{this.state.images.map((image, i) => (
								<ImageCardItem
									key={i}
									index={i}
									header={image.title}
									image={image.photo_file}
									description={image.description}
									date={image.date}
									images={this.state.images}
								/>
							))}
						</Card.Group>
					</div>
				</div>
				<div className={classes.videos}>
					<div className={classes.heading}>YouTube Videos</div>
					<div className={classes.cards}>
						<Card.Group itemsPerRow={2} stackable>
							{this.state.videos.map((video, i) => (
								<VideoCardItem
									key={i}
									header={video.title}
									videoUrl={video.url}
									description={video.description}
									date={video.date}
								/>
							))}
						</Card.Group>
					</div>
				</div>
				{
					this.props.showYoutubeVideoModal ? (
						<AddYoutubeVideoModal
							open={this.props.showYoutubeVideoModal}
							toggelAddYoutubeVideoModal={this.props.handleYoutubeModal}
							handleAddVideo={this.handleAddYoutubeVideo}
						/>
					) : null
				}
				{
					this.props.showImageUploadModal ? (
						<ImageUploadModal
							open={this.props.showImageUploadModal}
							toggelUploadImageModal={this.props.handleImageUploadModal}
							handleAddImage={this.handleAddImage}
						/>
					) : null
				}
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		business: state.currentBusinessList
	}
}

export default connect(mapStateToProps, null)(Gallery)
