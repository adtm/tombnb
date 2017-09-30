import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import List from 'antd-mobile/lib/list';
import TextareaItem from 'antd-mobile/lib/textarea-item';
import Button from 'antd-mobile/lib/button';
import DatePicker from 'antd-mobile/lib/date-picker';
import moment from 'moment'
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';

import { connect } from 'react-redux';
import * as appActions from '../reducers/app/actions';


class NewBookingScreen extends Component {
  static navigatorButtons = {
    leftButtons: [
      {
        title: 'Back', // for a textual button, provide the button title (label)
        id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        testID: 'e2e_rules', // optional, used to locate this view in end-to-end tests
        showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
        buttonColor: 'blue', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
        buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
        buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
      }
    ]
  };

  onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'back') { // this is the same id field from the static navigatorButtons definition
        this.props.navigator.dismissModal({
          animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
        });
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      focused: false,
    };
    // if you want to listen on navigator events, set this up
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }


  handleSubmit = () => {
    const { name, surname, selectionDate, selectionTime } = this.state;
    this.props.onSubmit(
      name, surname, selectionDate, selectionTime
    );
  }

  onTimeSelection = time => {
    const selectedTime = moment(date).format("HH:mm");
    this.props.dispatch(appActions.setSelectionTime(selectedTime));
  }

  onDateSelection = date => {
    const selectedDate = moment(date).format("YYYY-MM-DD");
    this.props.dispatch(appActions.setSelectionDate(selectedDate));
  }

  render() {
    console.log(this.props);
    return (
      <View >
        <List renderHeader={() => 'Person information'}>
          <TextareaItem
            placeholder="Name"
            value={this.props.name}
            clear
            focused={this.state.focused}
            onFocus={() => {
              this.setState({
                focused: false,
              });
            }}
            onChange={name => this.props.setName(name)}
          />
          <TextareaItem
            placeholder="Surname"
            value={this.props.surname}
            onChange={surname => this.props.dispatch(appActions.setSurname(surname))}
            clear
          />
        </List>
        <List renderHeader={() => 'Booking information'}>
          <DatePicker
            mode="date"
            format={val => val.format('YYYY-MM-DD')}
            okText="OK"
            dismissText="Cancel"
            onChange={this.onDateSelection}
            locale={enUs}
            value={moment(this.props.selectionDate, 'YYYY-MM-DD')}
            maxDate={moment(this.props.lastDay, 'YYYY-MM-DD')}
            minDate={moment(this.props.today, 'YYYY-MM-DD')}
          ><List.Item arrow="horizontal">Book Date</List.Item>
          </DatePicker>
          <DatePicker
            mode="time"
            format={val => val.format('HH:mm')}
            okText="OK"
            dismissText="Cancel"
            locale={enUs}
            value={moment(this.props.selectionTime, 'HH:mm')}
            onChange={this.onTimeSelection}
          >
            <List.Item arrow="horizontal">Book Time</List.Item>
          </DatePicker>
        </List>
        <Button style={{ margin: 10 }} type="primary" onClick={this.handleSubmit}>Book</Button>
      </View>
    );
  }
}

const mapStateToProps = state =>{
  return {
    today: state.app.today,
    lastDay: state.app.lastDay,
    selectionDate: state.app.selectionDate,
    selectionTime: state.app.selectionTime,
    name: state.app.name,
    surname: state.app.surname
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
      setName : name => dispatch(appActions.setName(name))       
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewBookingScreen);