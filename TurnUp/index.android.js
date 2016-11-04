'use strict';
import * as firebase from 'firebase';
import firebaseConfig from './auth.js';
import FBSDK from 'react-native-fbsdk';

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableOpacity
} from 'react-native';


import LoginPage from './app/components/LoginPage.js';
import CreateEventPage from './app/components/CreateEventPage.js';
import CreateInvitationPage from './app/components/CreateInvitationPage.js';
import ExplorePage from './app/components/ExplorePage.js';
import SummaryPreviewPage from './app/components/SummaryPreview.js';
import SummaryPage from './app/components/Summary.js';
import HostPage from './app/components/HostPage.js';
import TabsPage from './app/components/TabsPage.js';
import Summary from './app/components/Summary.js';
import SignUpPage from './app/components/SignUpPage.js';
import ContactListPage from './app/components/ContactListPage.js';
import LocationPage from './app/components/PickLocationPage.js';
import MapPage from './app/components/MapPage.js';

class LastPage extends Component {
  _handleBack() {
    this.props.navigator.pop();
  }

  _handleToFirst() {
    this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[0])
  }

  render() {
    return (
        <View style={[styles.container,
          {
            backgroundColor: 'green',
            justifyContent: 'center'
          },
          ]}>
          <Text style={[styles.welcome]}>Last page bro!</Text>
          <View style={[styles.container, {flex: 0, flexDirection: 'row', backgroundColor: 'transparent'}]}>
            <TouchableOpacity onPress={() => this._handleBack()} style={{margin: 5}}>
              <View style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'black'}}>
                <Text style={styles.welcome}>Go back</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this._handleToFirst()} style={{margin: 5}}>
              <View style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'black'}}>
                <Text style={styles.welcome}>Go to first</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
    )
  }
}

class TurnUp extends Component {
  _renderScene(route, navigator) {
    if (route.id === 0) {
      return <SignUpPage navigator={navigator} firebase={firebaseApp} />
    } else if (route.id === 1) {   
      return <LoginPage navigator={navigator} firebase={firebaseApp} />
    } else if (route.id === 2) {
      return <TabsPage navigator={navigator} />
    } else if (route.id === 3) {
      return <ExplorePage navigator={navigator} />
    } else if (route.id === 4) {
      return <SummaryPreviewPage navigator={navigator} />
    } else if (route.id === 5) {
      return <SummaryPage navigator={navigator} />
    } else if (route.id === 6) {
      return <CreateEventPage navigator={navigator} />
    } else if (route.id === 7) {
      return <HostPage navigator={navigator} />
    } else if (route.id < 9) {
      return <HostPage navigator={navigator} pageNumber={route.id}/>
    } else if (route.id === 10) {
      return <CreateEventPage navigator={navigator} />
    } else if (route.id === 11) {
      return <CreateInvitationPage navigator={navigator} />
    } else if (route.id === 12) {
      return <SummaryPreviewPage navigator={navigator} />
    } else if (route.id === 13) {
      return <Summary navigator={navigator} />
    } else if (route.id === 14) {
      return <ContactListPage navigator={navigator}/>
    } else if (route.id ===15) {
      return <MapPage navigator ={navigator}/>
    } else {
      return <LastPage navigator={navigator} />
    }
  }

  _configureScene(route) {
    if (route.id === 10) {
        return Navigator.SceneConfigs.HorizontalSwipeJump;
    }
    return Navigator.SceneConfigs.PushFromRight;
  }

  render() {
    return (
      <Navigator
        initialRoute={{id: 15, }}
        renderScene={this._renderScene}
        configureScene={this._configureScene} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
});

AppRegistry.registerComponent('TurnUp', () => TurnUp);