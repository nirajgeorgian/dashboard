import React, { Component } from 'react';
import { Input, Popup, Grid } from 'semantic-ui-react'
import classes from './TimePopup.local.scss'



// const style_sheet = {
//     paddingTop: '5px !important',
//     paddingBottom: '5px !important',
//     paddingRight: '7px !important',
//     height: '30px !important',
//     firstChild {
//       paddingRight: '4px !important';
//     },
//     hover {
//       /* border-style: solid;
//       border-width: thin;
//       border-color: #1aa3ff !important; */
//       cursor: 'pointer';
//       outlineStyle: 'solid';
//       outlineWidth: 'thin';
//       outlineColor: '#1aa3ff !important';
//     }
// }
class PopUpComponent extends Component {

  state = {
    hour: "",
    meridian: "",
    final_time: ""
  }

  handleClick = async e => {
    e.stopPropagation();
    e.preventDefault()
    var x = document.getSelection().focusNode.nodeValue
    await this.setState({
      hour: x,
      meridian: x.split(' ')[1],
      final_time: x
    })
    this.props.handleHourClose(this.state.final_time)
    this.props.handleMinOpen()

  }

  handleMinClick = async e => {
    e.stopPropagation();
    e.preventDefault()
    var x = document.getSelection().focusNode.nodeValue
    const y = x + " " + this.state.meridian
    await this.setState({
      final_time: y
    })
    this.props.handleMinClose(this.state.final_time);
  }

  renderMin = () => {
    var hour = this.state.hour.split(':')[0]
    return (
      <Grid columns={3} celled='internally' style={{ width: "250px" }}>
        {
          this.renderMinRow(hour + ':00',hour + ':05',hour + ':10')
        }
        {
          this.renderMinRow(hour + ':15',hour + ':20',hour + ':25')
        }
        {
          this.renderMinRow(hour + ':30',hour + ':35',hour + ':40')
        }
        {
          this.renderMinRow(hour + ':45',hour + ':50',hour + ':55')
        }
    </Grid>
    )
  }

  renderMinRow = (min1, min2, min3) => {
    return (
      <Grid.Row>
        <Grid.Column textAlign="center" className={classes.gridUp} id="min1" onClick={this.handleMinClick}>
          {min1}
        </Grid.Column>
        <Grid.Column textAlign="center" className={classes.gridUp} id="min2" onClick={this.handleMinClick}>
          {min2}
        </Grid.Column>
        <Grid.Column textAlign="center" id="min3" className={classes.gridUp} onClick={this.handleMinClick}>
          {min3}
        </Grid.Column>
    </Grid.Row>
    )
  }

  renderHour = () => {
    return (
        <Grid columns={4} celled='internally' style={{ width: "353px" }}>
          {
            this.renderRow('12:00 AM','1:00 AM','2:00 AM','3:00 AM')
          }
          {
            this.renderRow('4:00 AM','5:00 AM','6:00 AM','7:00 AM')
          }
          {
            this.renderRow('8:00 AM','9:00 AM','10:00 AM','11:00 AM')
          }
          {
            this.renderRow('12:00 PM','1:00 PM','2:00 PM','3:00 PM')
          }
          {
            this.renderRow('4:00 PM','5:00 PM','6:00 PM','7:00 PM')
          }
          {
            this.renderRow('8:00 PM','9:00 PM','10:00 PM','11:00 PM')
          }
      </Grid>
    )
  }

  renderRow = (time1,time2,time3,time4) => {
    return (
      <Grid.Row width={3}>
        <Grid.Column textAlign="center" id="time1" className={classes.gridUp} onClick={this.handleClick}>
          {time1}
        </Grid.Column>
        <Grid.Column textAlign="center" id="time2" className={classes.gridUp} onClick={this.handleClick}>
          {time2}
        </Grid.Column>
        <Grid.Column textAlign="center" id="time3" className={classes.gridUp} onClick={this.handleClick}>
          {time3}
        </Grid.Column>
        <Grid.Column textAlign="center" id="time4" className={classes.gridUp} onClick={this.handleClick}>
          {time4}
        </Grid.Column>
    </Grid.Row>
    )
  }

  handleHourOpen = (e, data) => {
    console.log("Hour Open");
    // e.stopPropagation()
    this.props.handleHourOpen()
  }

  handleHourClose = (e, data) => {
    console.log("Hour Closed");
    // e.stopPropagation()
    this.props.handleHourClose(this.state.final_time)
  }

  handleMinOpen = (e, data) => {
    console.log("Min Open");
    this.props.handleMinOpen()
  }

  handleMinClose = (e, data) => {
    console.log("Min Closed");
    this.props.handleMinClose(this.state.final_time)
  }

  showHourPopup = () => {
    return (
      <Popup
        position='bottom left'
        className={classes.popUp}
        flowing={true}
        open={this.props.disabled ? false: this.props.showHour}
        onOpen={this.handleHourOpen}
        onClose={this.handleHourClose}
        trigger={<Input className={this.props.inputProps} icon='clock' placeholder='Input time' iconPosition='left' value={this.state.final_time === "" ? this.state.hour : this.state.final_time} onClick={this.handleHourOpen} disabled={this.props.disabled}/>}
        on='click'
        content={this.renderHour()}
        style = {{ display: 'none !important' }}
       />
    )
  }

  render() {
    return (
      <div>
        {
          this.props.showHour || this.props.showMin ?
            ( this.props.showHour ?
                this.showHourPopup() :
              <Popup
                position='bottom left'
                flowing={true}
                open={this.props.disabled ? false : this.props.showMin}
                onOpen={this.handleMinOpen}
                onClose={this.handleMinClose}
                trigger={<Input icon='clock' placeholder='Input time' iconPosition='left' value={this.state.final_time === "" ? this.state.hour : this.state.final_time} onClick={this.handleMinOpen} disabled={this.props.disbaled}/>}
                on='click'
                content={this.renderMin()}
               />
           ) : this.showHourPopup()
          }
      </div>
    );
  }
}

export default PopUpComponent;
