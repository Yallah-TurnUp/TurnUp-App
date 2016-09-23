/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    ListView,
    TextInput,
    TouchableNativeFeedback,
    Image
} from 'react-native';
import styles from '../config/styles.js';
import images from '../config/images.js';

import { TopBar } from './TabsPage.js';

const cellMargin = 0.20;
const cellCount = 6;
const cellHorizontalMargins = {
    marginLeft: cellMargin,
    marginRight: cellMargin
};
const numberAndTextScrollViewProps = {
    renderRow: (rowData) => <NumberAndTextCellView number={rowData.number} text={rowData.text}/>,
    horizontal: true,
    showsHorizontalScrollIndicator: false
};

const tabIds = {
    selectDate: 'selectDate',
    selectTime: 'selectTime',
    selectLocation: 'selectLocation'
};

const EventsCellViewProps = {
    renderRow: (rowData) => <EventsCellView name={rowData.peoples}/>,
    showsVerticalScrollIndicator: false
};

const ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
const ids = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});

class EventsCellView extends Component {
    render() {
        var screenWidth = Dimensions.get('window').width;
        const cellWidth = (screenWidth * 0.95 ); // margin is on both sides
        return (
            <View backgroundColor="white" width={cellWidth} height={60}
                  style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                <Image source={images.turnup_bird_button} style={{width: 50, height: 50, marginLeft: 8}} />
                <Text style={{marginLeft:30, flex: 0, fontSize: 20, fontFamily: "SourceSansPro", color: 'black'}}>{this.props.name}</Text>
            </View>
        )
    }
}

class NumberAndTextCellView extends Component {
    render() {
        var screenWidth = Dimensions.get('window').width;
        const cellWidth = (screenWidth - (cellCount * 2 * cellMargin)) / cellCount; // margin is on both sides
        return (
            <View backgroundColor="rgba(0,0,0,0.58)"
                  width={cellWidth}
                  style={[cellHorizontalMargins, {justifyContent: 'center', alignItems: 'center'}]}>
                <Text style={{flex: 0, fontSize: 20, fontFamily: "SourceSansPro-Semibold", color: 'white'}}>{this.props.number}</Text>
                <Text style={{flex: 0, fontSize: 12, fontFamily: "SourceSansPro-Regular", color: 'white'}}>{this.props.text}</Text>
            </View>
        )
    }
}

export default class CreateInvitationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: ds.cloneWithRows(this._daysAhead()),
            currentTabId: tabIds.selectDate,
            searchTerm: "Enter names",
            inviteesDataSource: ids.cloneWithRows(this._nameList())
        }
    }

    _nameList() {
        // Thousands of apologies to the gods of computing
        var people= ['Superman', 'Batman', 'Dats', 'General','Superman', 'Batman', 'Dats', 'General','Superman', 'Batman', 'Dats', 'General', 'General','Superman', 'Batman', 'Dats', 'General', 'Superman', 'Batman', 'Dats', 'General','Superman', 'Batman', 'Dats', 'General','Superman', 'Batman', 'Dats', 'General', 'General','Superman', 'Batman', 'Dats', 'General'];
        var peopleName = [];
        for (let i = 0; i < people.length; i++) {
            peopleName[i] = {
                peoples: people[i]
            };
        }
        return peopleName;
    }

    _daysAhead() {
        // Thousands of apologies to the gods of computing
        var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var days = [];
        var curr = new Date();
        for (let i = 0; i < 100; i++) {
            days[i] = {
                number: curr.getDate(),
                text: dayNames[curr.getDay()]
            };
            curr = new Date(curr);
            curr.setDate(curr.getDate() + 1);
        }
        return days;
    }

    _hoursOfTheDay() {
        var hours = [];
        for (let i = 0; i < 24; i++) {
            var hour_number = ((i + 8) % 12) + 1; // 1 to 12 not 0 to 11; starts from 9
            var hour_text = ((i + 9) % 24) < 12 ? "AM" : "PM";
            hours[i] = {
                number: hour_number,
                text: hour_text
            }
        }
        return hours
    }

    _handleBack() {
        this.props.navigator.pop();
    }

    _handleLetsGo() {
        this.props.navigator.push({id: 12});
    }

    _handleCalendar() {
        if (this.state.currentTabId !== tabIds.selectDate) {
            this.setState({
                currentTabId: tabIds.selectDate,
                dataSource: ds.cloneWithRows(this._daysAhead()),
            });
        }
    }

    _handleClock() {
        if (this.state.currentTabId !== tabIds.selectTime) {
            this.setState({
                currentTabId: tabIds.selectTime,
                dataSource: ds.cloneWithRows(this._hoursOfTheDay()),
            });
        }
    }

    _handleLocation() {
        if (this.state.currentTabId !== tabIds.selectLocation) {
            this.setState({currentTabId: tabIds.selectLocation});
        }
    }

    render() {
        var isOnMap = this.state.currentTabId === tabIds.selectLocation;
        var scroller =(!isOnMap) ? <View style={styles.dateTimeScroller}>
                                    <ListView {...numberAndTextScrollViewProps} dataSource={this.state.dataSource} />
                                </View> : null;
        var invitees = (!isOnMap) ? <View style={{flex:1, justifyContent: 'center', alignItems: 'center', height: 100}}>
                                    <ListView {...EventsCellViewProps} dataSource={this.state.inviteesDataSource}/>
                                </View> : null;
        var invitemsg = (!isOnMap) ? <View style={{flex: 0, margin: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <Text>Invite: </Text>
                                        <TextInput value={this.state.searchTerm}
                                                   onChangeText={(searchTerm) => this.setState({searchTerm: searchTerm})}
                                                   onFocus={() => this.setState({searchTerm: ""})}
                                                   style={{flex: 1, height:48}}/>
                                    </View> : null;
        return (
            <View style={styles.fullscreenContainer}>
                <View style={styles.topContainer}>
                    <TopBar centerImage={images.turnup_title}/>
                    <View style={styles.topTabButtonsContainer}>
                        <TouchableNativeFeedback onPressOut={() => this._handleCalendar()}
                                                 background={TouchableNativeFeedback.Ripple('red')}
                                                 style={{flex: 1}}>
                            <View style={this.state.currentTabId === tabIds.selectDate ?
                                styles.selectedTabBarButton : styles.tabBarButton}>
                                <Image source={this.state.currentTabId === tabIds.selectDate ?
                                    images.calendar_selected : images.calendar}
                                       style={{width: 25, height: 25}}/>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback onPressOut={() => this._handleClock()}
                                                 background={TouchableNativeFeedback.Ripple('red')}
                                                 style={{flex: 1}}>
                            <View style={this.state.currentTabId === tabIds.selectTime ?
                                styles.selectedTabBarButton : styles.tabBarButton}>
                                <Image source={this.state.currentTabId === tabIds.selectTime ?
                                    images.clock_selected : images.clock}
                                       style={{width: 25, height: 25}}/>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback onPressOut={() => this._handleLocation()}
                                                 background={TouchableNativeFeedback.Ripple('red')}
                                                 style={{flex: 1}}>
                            <View style={this.state.currentTabId === tabIds.selectLocation ?
                                styles.selectedTabBarButton : styles.tabBarButton}>
                                <Image source={this.state.currentTabId === tabIds.selectLocation ?
                                    images.location_pin_selected : images.location_pin}
                                       style={{width: 25, height: 25}}/>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
                <View style={{flex: 1, justifyContent: 'space-between'}}>
                    {scroller}
                    <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'space-between'}}>
                        {invitemsg}
                        {invitees}
                        <View style={{flex: 0, marginBottom: 46, flexDirection: 'row', justifyContent: 'center'}}>
                            <TouchableNativeFeedback onPressOut={() => this._handleBack()}
                                                     background={TouchableNativeFeedback.Ripple('red')}>
                                <View style={styles.enrichmentNavigationButton}>
                                    <Image source={images.enrichment_back} style={styles.enrichmentButtonImage}/>
                                    <Text style={styles.enrichmentButtonText}>Back</Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPressOut={() => this._handleLetsGo()}
                                                     background={TouchableNativeFeedback.Ripple('red')}>
                                <View style={styles.enrichmentNavigationButton}>
                                    <Text style={styles.enrichmentButtonText}>Let's Go</Text>
                                    <Image source={images.enrichment_rocket} style={styles.enrichmentButtonImage}/>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
