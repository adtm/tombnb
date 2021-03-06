import { createStore, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import { Navigation } from "react-native-navigation";

import thunk from "redux-thunk";
import { registerScreens } from './screens';

import * as reducers from "./reducers";
import { Platform } from "react-native";

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

registerScreens(store, Provider);

export default class App {
  constructor() {
    this.startApp();
  }

  startApp() {
    Navigation.startTabBasedApp({
      tabs: [
        {
          label: "Calendar",
          screen: "tombnb.MainCalendarScreen",
          icon: require("../img/navigation/icons8-romance.png"),
          title: "Calendar"
        },
        {
          label: "New Booking",
          screen: "tombnb.NewBookingScreen",
          icon: require("../img/navigation/icons8-add-user-male.png"),
          title: "New Booking"
        },
        {
          label: "Analytics",
          screen: "tombnb.AnalyticsScreen",
          icon: require("../img/navigation/icons8-rose.png"),
          title: "Analytics"
        }
      ],
      tabsStyle: {
        tabBarTranslucent: false
    }});
  }
}
