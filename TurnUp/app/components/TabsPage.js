/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    TextInput,
    TouchableNativeFeedback
} from 'react-native';
import * as firebase from 'firebase';

import styles from '../config/styles.js';
import images from '../config/images.js';

import HostPage from './HostPage.js';
import ExplorePage from './ExplorePage.js';
import SurprisePage from './SurprisePage.js';

const tabPageIds = {
    hostPage: "hostPage",
    explorePage: "explorePage",
    surprisePage: "surprisePage"
};

// Top

export class TopBar extends Component {
    render() {
        return (
            <View style={styles.header}>
                <View style={{flex: 1, alignItems: 'flex-start', marginLeft: 10}}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#F28500', true)}
                                             delayPressIn={0}
                                             onPressOut={() => {
                                                 if ('leftButtonHandler' in this.props) this.props.leftButtonHandler();
                                             }}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Image source={this.props.leftButton} style={{width: 50, height: 50}}/>
                        </View>
                    </TouchableNativeFeedback>
                </View>
                <View style={{flex: 1}}>
                    <Image source={this.props.centerImage} style={{height: 60, width: 140, flex: 0}}/>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end', marginRight: 10}}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#F28500', true)}
                                             delayPressIn={0} delayPressOut={0}
                                             onPressOut={() => {
                                                 if ('rightButtonHandler' in this.props) this.props.rightButtonHandler();
                                             }}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Image source={this.props.rightButton} style={{width: 50, height: 50}}/>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        )
    }
}


// Tab

class TabBarButton extends Component {
    render() {
        var backgroundColor = this.props.selected ? '#F28500' : 'transparent';
        return (
            <TouchableNativeFeedback style={{flex: 1}} delayPressIn={0}
                                     background={TouchableNativeFeedback.Ripple('red')}
                                     onPress={() => this.props.pressHandler(this.props.tabId)}>
                <View style={{flex: 1, alignItems: 'center', backgroundColor: backgroundColor}}>
                    <Image source={this.props.image} style={{flex: 1, width: 60, height: 60}}/>
                </View>
            </TouchableNativeFeedback>
        )
    }
}

class TabBar extends Component {
    render() {
        return (
            <View style={styles.tabsBar}>
                <TabBarButton image={images.hosted_logo} tabId={tabPageIds.hostPage}
                              selected={this.props.currentTab === tabPageIds.hostPage}
                              pressHandler={this.props.pressHandler}/>
                <TabBarButton image={images.explore_logo} tabId={tabPageIds.explorePage}
                              selected={this.props.currentTab === tabPageIds.explorePage}
                              pressHandler={this.props.pressHandler}/>
                <TabBarButton image={images.surprise_logo} tabId={tabPageIds.surprisePage}
                              selected={this.props.currentTab === tabPageIds.surprisePage}
                              pressHandler={this.props.pressHandler}/>
            </View>
        )
    }
}


// Current

class CurrentTab extends Component {
    render() {
        var hostPage = this.props.currentTab === tabPageIds.hostPage ? <HostPage/> : null;
        var explorePage = this.props.currentTab === tabPageIds.explorePage ? <ExplorePage/> : null;
        var surprisePage = this.props.currentTab === tabPageIds.surprisePage ? <SurprisePage/> : null;

        return (
            <View style={{flex: 1}}>
                {hostPage}
                {explorePage}
                {surprisePage}
            </View>
        )
    }
}

export default class TabsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: tabPageIds.hostPage
        }
    }

    _pushEventCreationPage() {
        this.props.navigator.push({id: 10})
    }

    logout() {
        firebase.auth().signOut()
            .then(() => {
                this.props.navigator.popToTop();
            })
            .catch(error => {});
    }

    render() {
        return (
            <View style={styles.tabsContainer}>
                <TopBar leftButton={images.profile} centerImage={images.turnup_title} rightButton={images.host_logo}
                    leftButtonHandler={() => this.logout()}
                    rightButtonHandler={() => {this._pushEventCreationPage()}}/>
                <CurrentTab currentTab={this.state.currentTab}/>
                <TabBar pressHandler={(tabId) => this.setState({currentTab: tabId})}
                        currentTab={this.state.currentTab}/>
            </View>
        )
    }
}
