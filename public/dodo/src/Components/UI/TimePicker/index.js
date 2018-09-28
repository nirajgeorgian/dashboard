import React from 'react'
import { Popup, Input, Grid } from 'semantic-ui-react'

import classes from './TimePicker.local.scss'

class TimePicker extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			hour: '',
			meridian: '',
			showMin: false,
			allowedToClose: true
		}
	}

	handleClick = async (time, isHourTable) => {
		this.setState({ allowedToClose: false })
		const hour = time.split(':')[0]
		const meridian = time.split(' ')[1]
		this.props.setTime(time)
		if (isHourTable) {
			console.log(isHourTable)
			return await this.setState(state => ({
				meridian,
				hour,
				showMin: true
			}))
		}

		return await this.setState(
			state => ({
				meridian,
				hour
			}),
			() => {
				setTimeout(() => {
					this.props.handelPopUpChange(false)
					this.setState({
						allowedToClose: true,
						showMin: false
					})
				}, 5)
			}
		)
	}

	showMinTable = () => {
		const hour = this.state.hour
		return (
			<Grid columns={3} celled="internally">
				{this.renderRow(
					hour + ':00 ' + this.state.meridian,
					hour + ':05 ' + this.state.meridian,
					hour + ':10 ' + this.state.meridian,
					null,
					false
				)}
				{this.renderRow(
					hour + ':15 ' + this.state.meridian,
					hour + ':20 ' + this.state.meridian,
					hour + ':25 ' + this.state.meridian,
					null,
					false
				)}
				{this.renderRow(
					hour + ':30 ' + this.state.meridian,
					hour + ':35 ' + this.state.meridian,
					hour + ':40 ' + this.state.meridian,
					null,
					false
				)}
				{this.renderRow(
					hour + ':45 ' + this.state.meridian,
					hour + ':50 ' + this.state.meridian,
					hour + ':55 ' + this.state.meridian,
					null,
					false
				)}
			</Grid>
		)
	}

	renderRow = (time1, time2, time3, time4, isHourTable = true) => {
		return (
			<Grid.Row textAlign="center" verticalAlign="middle">
				<Grid.Column
					className={classes.react_semantic_time}
					textAlign="center"
					id="time1"
					onClick={e => {
						e.stopPropagation()
						this.handleClick(time1, isHourTable)
					}}
				>
					<div style={{ fontSize: '0.9rem', cursor: 'pointer' }}>{time1}</div>
				</Grid.Column>
				<Grid.Column
					className={classes.react_semantic_time}
					textAlign="center"
					id="time2"
					onClick={e => {
						e.stopPropagation()
						this.handleClick(time2, isHourTable)
					}}
				>
					<div style={{ fontSize: '0.9rem', cursor: 'pointer' }}>{time2}</div>
				</Grid.Column>
				<Grid.Column
					className={classes.react_semantic_time}
					textAlign="center"
					id="time3"
					onClick={e => {
						e.stopPropagation()
						this.handleClick(time3, isHourTable)
					}}
				>
					<div style={{ fontSize: '0.9rem', cursor: 'pointer' }}>{time3}</div>
				</Grid.Column>
				{time4 ? (
					<Grid.Column
						className={classes.react_semantic_time}
						textAlign="center"
						id="time4"
						onClick={e => {
							e.stopPropagation()
							this.handleClick(time4, isHourTable)
						}}
					>
						<div style={{ fontSize: '0.9rem', cursor: 'pointer' }}>{time4}</div>
					</Grid.Column>
				) : null}
			</Grid.Row>
		)
	}
	showHourTable = () => {
		return (
			<Grid columns={4} celled="internally">
				{this.renderRow('12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM')}
				{this.renderRow('4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM')}
				{this.renderRow('8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM')}
				{this.renderRow('12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM')}
				{this.renderRow('4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM')}
				{this.renderRow('8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM')}
			</Grid>
		)
	}

	render() {
		const {
			time,
			placeholder,
			showPopUp,
			handelPopUpChange,
			value
		} = this.props

		return (
			<Popup
				onOpen={() => handelPopUpChange(true)}
				onClose={() => {
					handelPopUpChange(false)
					this.setState({ showMin: false })
				}}
				closeOnDocumentClick={this.state.allowedToClose}
				closeOnTriggerClick={true}
				open={showPopUp}
				className={classes.popup}
				trigger={
					<Input
						icon={this.props.icon ? this.props.icon : 'clock'}
						iconPosition="left"
						inverted
						placeholder={placeholder || 'Time'}
						value={value ? value : time}
						className={classes.time_input}
					/>
				}
				on="click"
				content={
					this.state.showMin ? this.showMinTable() : this.showHourTable()
				}
			/>
		)
	}
}

export default TimePicker
