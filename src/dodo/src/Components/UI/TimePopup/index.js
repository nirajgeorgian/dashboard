import React, { Component } from 'react';
import PopUpComponent from './PopUpComponent'
import classes from './TimePopup.local.scss'

class TimePopup extends Component {

  state = {
    "showHour": false,
    "showMin": false,
    "final_time": ""
  }

  handleHourOpen = () => {
    console.log("Index hour open");
    this.setState({ showHour: true })
  }
  handleHourClose = (updatedTime) => {
    console.log("Index Hour close");
    this.setState({
      showHour: false,
      final_time: updatedTime
    })
  }
  handleMinOpen = () => {
    console.log("Index min open");
    this.setState({ showMin: true })
  }
  handleMinClose = (updatedTime) => {
    console.log("Index min close");
    this.setState({
      showMin: false,
      final_time: updatedTime
   })
  }
  render() {
    return (
      <PopUpComponent
        disabled={this.props.disabled}
        showHour={this.state.showHour}
        showMin={this.state.showMin}
        handleHourOpen={this.handleHourOpen}
        handleHourClose={this.handleHourClose}
        handleMinOpen={this.handleMinOpen}
        handleMinClose={this.handleMinClose}
      />
  );
  }
}

export default TimePopup;
