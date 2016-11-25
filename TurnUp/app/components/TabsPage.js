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
} from 'react-native';
import * as firebase from 'firebase';

import styles from '../config/styles.js';
import images from '../config/images.js';

import HostPage from './HostPage.js';
import ExplorePage from './ExplorePage.js';
import SurprisePage from './SurprisePage.js';
import MapPage from './MapPage.js';
import DateTimePickerPage from './DateTimePickerPage.js';
import DashboardPage from './DashboardPage.js';
import InviteeGenerationPage from './InviteeGenerationPage.js';

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
                <View style={{flex: 1, alignItems: 'flex-start', marginLeft: 10}}>
                    <TouchableOpacity onPress={() => {
                        if ('leftButtonHandler' in this.props) this.props.leftButtonHandler();
                    }}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Image source={this.props.leftButton} style={{width: 50, height: 50}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    <Image source={this.props.centerImage} style={{height: 60, width: 140, flex: 1}}/>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end', marginRight: 10}}>
                    <TouchableOpacity onPress={() => {
                        if ('rightButtonHandler' in this.props) this.props.rightButtonHandler();
                    }}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Image source={this.props.rightButton} style={{width: 50, height: 50}}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}


// Tab

const TabBarButton = ({ tabId, pressHandler, backgroundColor, activeBackgroundColor, selected, image, activeImage, imageSize }) => (
    <TouchableOpacity activeOpacity={1} style={{flex: 1, justifyContent: 'center'}} onPress={() => pressHandler(tabId)}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: selected && activeBackgroundColor ? activeBackgroundColor : backgroundColor}}>
            <Image source={(selected && activeImage) ? activeImage : image} style={{flex: imageSize ? 0 : 1, width: imageSize || 60, height: imageSize || 60}}/>
        </View>
    </TouchableOpacity>
);

const TabBar = ({ tabsBackgroundColor, imageSize,
    leftImage, leftActiveImage, leftActiveBackground, leftTabId,
    centerImage, centerActiveImage, centerActiveBackground, centerTabId,
    rightImage, rightActiveImage, rightActiveBackground, rightTabId,
    currentTab, pressHandler }) => (
    <View style={[styles.tabsBar, { backgroundColor: tabsBackgroundColor }]}>
        {leftImage && <TabBarButton tabId={leftTabId}
                      backgroundColor="transparent" activeBackgroundColor={leftActiveBackground}
                      image={leftImage} activeImage={leftActiveImage} imageSize={imageSize}
                      selected={currentTab === leftTabId}
                      pressHandler={pressHandler}/>}
        {centerImage && <TabBarButton tabId={centerTabId}
                      backgroundColor="transparent" activeBackgroundColor={centerActiveBackground}
                      image={centerImage} activeImage={centerActiveImage} imageSize={imageSize}
                      selected={currentTab === centerTabId}
                      pressHandler={pressHandler}/>}
        {rightImage && <TabBarButton tabId={rightTabId}
                      backgroundColor="transparent" activeBackgroundColor={rightActiveBackground}
                      image={rightImage} activeImage={rightActiveImage} imageSize={imageSize}
                      selected={currentTab === rightTabId}
                      pressHandler={pressHandler}/>}
    </View>
);

// Current

class CurrentTab extends Component {
    render() {
        var hostPage = this.props.currentTab === tabPageIds.hostPage ? <HostPage navigator={this.props.navigator} /> : null;
        var explorePage = this.props.currentTab === tabPageIds.explorePage ? <ExplorePage/> : null;
        var surprisePage = this.props.currentTab === tabPageIds.surprisePage ? <InviteeGenerationPage/> : null;

        return (
            <View style={{flex: 1}}>
                {hostPage}
                {explorePage}
                {surprisePage}
            </View>
        )
    }
}

export { TabBar, TopBar };

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

    logoutGoogle(){
        GoogleSignin.signOut()
        .then(() => {
          this.props.navigator.popToTop();
        })
        .catch((err) => {

        });
    }

    render() {
        return (
            <View style={styles.tabsContainer}>
                <TopBar leftButton={images.profile} centerImage={images.turnup_title} rightButton={images.host_logo}
                    leftButtonHandler={() => this.logout()}
                    rightButtonHandler={() => {this._pushEventCreationPage()}}/>
                <CurrentTab currentTab={this.state.currentTab} navigator={this.props.navigator} />
                <TabBar tabsBackgroundColor="#FF9800"
                        leftImage={images.hosted_logo} leftTabId={tabPageIds.hostPage} leftActiveBackground="#F28500"
                        centerImage={images.explore_logo} centerTabId={tabPageIds.explorePage} centerActiveBackground="#F28500"
                        rightImage={images.surprise_logo} rightTabId={tabPageIds.surprisePage} rightActiveBackground="#F28500"
                        pressHandler={(tabId) => this.setState({currentTab: tabId})}
                        currentTab={this.state.currentTab}/>
            </View>
        )
    }
}