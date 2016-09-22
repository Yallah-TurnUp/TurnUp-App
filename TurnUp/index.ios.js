'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableOpacity
} from 'react-native';

var BaseConfig = Navigator.SceneConfigs.FloatFromRight;

class PageOne extends Component {
  _handlePress() {
    this.props.navigator.push({id: 2,});
  }

  render() {
    <View style={[styles.container, {backgroundColor: 'green'}]}>
      <Text style={styles.welcome}>Greetings!</Text>
      <TouchableOpacity onPress={this._handlePress}>
        <View style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'black'}}>
          <Text style={styles.welcome}>Go to page two</Text>
        </View>
      </TouchableOpacity>
     </View>
  }
}

class PageTwo extends Component {
  _handlePress() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={[styles.container, {backgroundColor: 'purple'}]}>
        <Text style={styles.welcome}>This is page two!</Text>
        <TouchableOpacity onPress={this._handlePress}>
          <View style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'black'}}>
            <Text style={styles.welcome}>Go back</Text>
          </View>
        </TouchableOpacity>
       </View>
    )
  }
}

class TurnUp extends Component {
  _renderScene(route, navigator) {
    if (route.id === 1) {
      return <PageOne navigator={navigator} />
    } else if (route.id === 2) {
      return <PageTwo navigator={navigator} />
    }
  }

  _configureScene() {
    return BaseConfig;
  }

  render() {
    return (
      <Navigator
        initialRoute={{id: 1, }}
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