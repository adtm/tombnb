import React, { Component } from 'react';
import { Text, View } from 'react-native';
import moment from 'moment';
import axios from 'axios';

import CalendarView from '../components/calendar_view'


export default class MainCalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      today: moment().format("YYYY-MM-DD"),
      selectionDate: moment().format("YYYY-MM-DD"),
      selectionTime: moment().format("HH:mm"),
      lastDay: moment().add(2, 'weeks').format("YYYY-MM-DD"),
      items: {}
    };
    // if you want to listen on navigator events, set this up
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  static navigatorButtons = {
    rightButtons: [
      {
        title: 'Add', // for a textual button, provide the button title (label)
        id: 'add', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        testID: 'e2e_rules', // optional, used to locate this view in end-to-end tests
        disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
        showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
        buttonColor: 'blue', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
        buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
        buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
      }
    ]
  };

  /**
   * PR waiting about tabs not hiding
   */
  componentWilMount() {
    this.props.navigator.toggleTabs({
      tabBarHidden: true,
      to: 'hidden', // required, 'hidden' = hide tab bar, 'shown' = show tab bar
      animated: false, // does the toggle have transition animation or does it happen immediately (optional)
      drawUnderTabBar: true
    });
  }

  handleDaySelect = day => {
    this.setState({
      selectionDate: day.dateString
    });
  }

  handleTimeSelect = time => {
    this.setState({
      selectionTime: time.dateString
    });
  }

  handleSubmit = (name, surname, date, time) => {
    axios.post('http://localhost:3000/api/bookings/create', {
      bookerName: name,
      bookerSurname: surname,
      bookerTime: time,
      date
    }).then(savedBookings => {
      const { date } = savedBookings.data;
      Object.keys(this.state.items).forEach(key => {
        if (key == date) {
          let arr = [];
          savedBookings.data.bookings.map(booking => {
            console.log(booking.bookerTime)
            arr.push({
              name: booking.bookerName,
              surname: booking.bookerSurname,
              time: booking.bookerTime,
              height: Math.max(50, Math.floor(Math.random() * 150))
            })
          });
          this.state.items[key] = arr;
        }
      });
      this.setState({ items: this.state.items });
      this.props.navigator.dismissModal({
        animationType: 'slide-down',
      });
    }).catch(e => console.log(e))

  }

  loadItems = () => {
    axios.get('http://localhost:3000/api/bookings/get')
      .then(foundBookings => {
        const { data } = foundBookings;
        data.map(booking => {
          const strTime = booking.date;
          if (!this.state.items[strTime]) {
            this.state.items[strTime] = [];
            booking.bookings.map(oneBooking => {
              console.log(oneBooking);
              this.state.items[strTime].push({
                name: oneBooking.bookerName,
                surname: oneBooking.bookerSurname,
                time: oneBooking.bookerTime,
                height: Math.max(50, Math.floor(Math.random() * 150))
              });
            })
          }
          this.setState({
            items: this.state.items
          });
        })
      })
      .catch(e => console.log(e))
  }

  onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'add') { // this is the same id field from the static navigatorButtons definition
        this.props.navigator.showModal({
          screen: "tombnb.NewBookingScreen", // unique ID registered with Navigation.registerScreen
          title: "New Booking", // title of the screen as appears in the nav bar (optional)
          passProps: {
            today: this.state.today,
            selectionDate: this.state.selectionDate,
            selectionTime: this.state.selectionTime,
            lastDay: this.state.lastDay,
            onSubmit: this.handleSubmit
          }, // simple serializable object that will pass as props to the modal (optional)
          navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
          animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
        });
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <CalendarView
          today={this.state.today}
          lastDay={this.state.lastDay}
          onDaySelect={this.handleDaySelect}
          onTimeSelect={this.handleTimeSelect}
          items={this.state.items}
          loadItems={this.loadItems}
        />
      </View>
    )
  }
}