import React from 'react'
import { Header, Card, Icon, Modal, Button } from 'semantic-ui-react'
import Dropzone from 'react-dropzone'
import { API } from 'aws-amplify'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import compare from '../../../utility/compare'
import { setCurrentBusinessListFunc } from '../../../Actions/ActionsCreator/currentBusinessList/currentBusinessList'
import config from '../../../Config/AwsConfig'
import classes from './LogoSettings.local.scss'
import LogoCard from './LogoCard'
import Cropper from 'react-image-crop'
import LoadingComponent from '../Loading'
import MockData from './MockData'
import { s3Upload } from '../../../Config/awsLib'

class LogoSettings extends React.Component {
 	constructor(props) {
		super(props)
		this.state = {
      businessName: this.props.businessName,
			file_src: '',
      logos: [],
			showCropper: false,
			crop: {
				x: 20,
				y: 10,
				aspect: 1
			}
		}
	}

  componentWillMount() {
		// const data = (this.props.businessesList).filter(res => res.bizname == (this.state.businessName))
    this.setState({
      file: this.props.currentBusinessList.logo.file,
      bizid: this.props.currentBusinessList.bizid,
      logos: this.props.currentBusinessList.logos
    })
  }

  componentWillReceiveProps(nextProps) {
    if(compare(nextProps.currentBusinessList.logo, this.state) == false) {
      const data = nextProps.currentBusinessList
      this.setState({
        dir: "businesslogos",
        businessName: (data).bizname,
        file: (data).logo.file,
        bizid: (data).bizid,
        logos: (data).logos
      })
      return true
    }
    return false
  }

	handleCropCancel = () =>
		this.setState({
			showCropper: false,
			crop: {
				x: 20,
				y: 10,
				aspect: 1
			}
		})
	handleDoneCropping = () => {
		// TODO: upload image
		this.setState({
			showCropper: false,
			crop: {
				x: 20,
				y: 10,
				aspect: 1
			}
		})
	}
	onCropComplete = async (crop, pixelCrop) => {
		// console.log('onCropComplete, pixelCrop:', pixelCrop)
		const canvas = document.createElement('canvas')
		canvas.width = pixelCrop.width
		canvas.height = pixelCrop.height
		const ctx = canvas.getContext('2d')
		const image = document.querySelector('.ReactCrop__image')
		ctx.drawImage(
			image,
			pixelCrop.x,
			pixelCrop.y,
			pixelCrop.width,
			pixelCrop.height,
			0,
			0,
			pixelCrop.width,
			pixelCrop.height
		)

		const base64Image = canvas.toDataURL()

		const arr = base64Image.split(',')
		const mime = arr[0].match(/:(.*?);/)[1]

		new Promise((resolve, reject) => {
			canvas.toBlob(file => {
				file.name = this.state.filename
				resolve(file)
			})
		}).then(async x => {
			const file = new File([x], this.state.filename, { type: mime })
			this.setState({ image_file: URL.createObjectURL(file), file })
      const name = "Fish Busines"
  		// const allBusiness = await API.get("business", '/listmine')
  		// // console.log(allBusiness);
  		// const res = allBusiness.filter(res => {
  		// 	return res.bizname == name
  		// })
  		// const id = res[0].bizid
      // const data = (this.props.businessesList).filter(res => res.bizname == (this.state.businessName))
  		// const id = data[0].bizid
      const id = this.props.currentBusinessList.bizid
			// upload the file here
			// upload to s3
			const { Location, Key } = await s3Upload(this.state.file, "businesslogos");
      const updateData = await API.put("business", `/update/${id}`, {
  			body: {
          logo_dir:  Key.split("/")[0],
          logo_file: Location
        }
  		})
      const data = await API.get("business", '/listmine')
			// ?or else get it from state
			const business = await data.filter(singleBusiness => {
				return singleBusiness.bizname == this.props.currentBusinessList.bizname
			})
			await this.props.setCurrentBusinessListFunc(business[0])
			await this.props.setCurrentBusinessList(business[0])
		})
	}

	onDrop = async files => {
		if (files && files[0].size > config.MAX_ATTACHMENT_LOGO_FILE) {
      console.log("File size exceed");
		}

		// console.log('file')

		await this.setState({
			file_src: files[0].preview,
			showCropper: true,
			filename: files[0].name
		})
	}

	showCropperModal = () => {
		return (
			<Modal
				size={'small'}
				open={this.state.showCropper}
				closeOnDimmerClick={false}
				className="ui coupled modal mini"
			>
				<Modal.Header className="header">
					<center>
						<div className="row">
							<br />Crop Image
						</div>
					</center>
				</Modal.Header>
				<Modal.Content style={{ width: '100%', position: 'relative' }}>
					<center>
						<Cropper
							onChange={crop => {
								this.setState({ crop })
							}}
							crop={this.state.crop}
							onComplete={this.onCropComplete}
							src={this.state.file_src}
							style={{
								width: 'auto',
								height: '50vh',
								border: '1px dashed #00b5ad'
							}}
							imageStyle={{ width: 'auto', height: '100%' }}
						/>
						<br />
						<br />
						<Button
							icon
							labelPosition="right"
							onClick={this.handleDoneCropping}
							loading={this.state.loading}
							className={'ui blue right labeled icon button '}
						>
							Done Cropping<Icon className="check" />
						</Button>
						<Button
							icon
							labelPosition="right"
							loading={this.state.loading}
							onClick={this.handleCropCancel}
							className={
								'ui red right labeled icon button ' + classes.marginLeft
							}
						>
							Cancel<Icon className="close" />
						</Button>
					</center>
				</Modal.Content>
			</Modal>
		)
	}

	render() {
		if(this.state.logos != []) {
      return (
        this.props.isLoading === false ?
  			<div>
  				{this.state.showCropper && this.showCropperModal()}
  				<Header className={classes.logos_settings_header} dividing>
  					Logos
  				</Header>
  				<Card.Group itemsPerRow={3} stackable>
  					<Card className={classes.dropzone}>
  						<Card.Content className={classes.content}>
  							<Dropzone
  								accept="image/*"
  								multiple={false}
  								onDrop={this.onDrop}
  								className={classes.react_dropzone}
  							>
  								<div className={classes.dropzone_container}>
  									<p className={classes.icon}>
  										<Icon name="plus" />
  									</p>
  									<p className={classes.text}>
  										Drag and drop your logo here or Click here to upload.
  									</p>
  								</div>
  							</Dropzone>
  						</Card.Content>
  					</Card>
  					{this.state.logos.map((data, i) => {
              // create the timestamp
              const datetime = (data.file.split("/")[5]).split(".")[0]
              // console.log(datetime);
              const day = new String((new Date(Number(datetime)))).split(/\d{2}:\d{2}:\d{2}/)[0]
              // console.log(day);
              return (
    						<LogoCard
    							key={i}
    							image={data.file}
    							date={day}
    							active={data.file == this.state.file ? true : false}
    						/>
    					)
            })}
  				</Card.Group>
  			</div>
        : <LoadingComponent />
  		)
    } else {
      return (
        <LoadingComponent />
      )
    }
	}
}

const mapStateToProps = state => {
	return {
		businessesList: state.businessesList,
		currentBusinessList: state.currentBusinessList,
    isLoading: state.isLoading
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ setCurrentBusinessListFunc }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LogoSettings))
