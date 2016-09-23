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
import styles from '../config/styles.js';
import images from '../config/images.js';

import HostPage from './HostPage.js';
import ExplorePage from './ExplorePage.js';

const tabPageIds = {
    hostPage: "hostPage",
    explorePage: "explorePage",
    surprisePage: "surprisePage"
};

// Top

class TopBar extends Component {
    render() {
        return (
            <View style={styles.header}>
                <Image source={images.profile} style={{width: 50, height: 50, marginLeft: 10}}/>
                <Image source={images.turnup_title} style={{height: 60, width: 140}}/>
                <Image source={images.host_logo} style={{width: 50, height: 50, marginLeft: 10}}/>
            </View>
        )
    }
}


// Tab

class TabBarButton extends Component {
    render() {
        var backgroundColor = this.props.selected ? '#F28500' : 'transparent';
        return (
            <TouchableNativeFeedback style={{flex: 1}}
                                     background={TouchableNativeFeedback.Ripple('red')}
                                     onPressOut={() => this.props.pressHandler(this.props.tabId)}>
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

//CC7A00
// Current

class CurrentTab extends Component {
    render() {
        var hostPage = this.props.currentTab === tabPageIds.hostPage ? <HostPage/> : null;
        var explorePage = this.props.currentTab === tabPageIds.explorePage ? <ExplorePage/> : null;
        var surprisePage = this.props.currentTab === tabPageIds.surprisePage ? <HostPage/> : null;

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

    render() {
        return (
            <View style={styles.tabsContainer}>
                <TopBar/>
                <CurrentTab currentTab={this.state.currentTab}/>
                <TabBar pressHandler={(tabId) => this.setState({currentTab: tabId})}
                        currentTab={this.state.currentTab}/>
            </View>
        )
    }
}
