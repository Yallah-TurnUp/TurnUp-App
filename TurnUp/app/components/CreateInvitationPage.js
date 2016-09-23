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

const cellMargin = 0.20;
const cellCount = 6;
const cellHorizontalMargins = {
    marginLeft: cellMargin,
    marginRight: cellMargin
};
const numberAndTextScrollViewProps = {
    renderRow: (rowData) => <NumberAndTextCellView number={rowData.day} text={rowData.dayName}/>,
    horizontal: true,
    showsHorizontalScrollIndicator: false
};

const tabIds = {
    selectDate: 'selectDate',
    selectTime: 'selectTime',
    selectLocation: 'selectLocation'
};

class NumberAndTextCellView extends Component {
    render() {
        var screenWidth = Dimensions.get('window').width;
        const cellWidth = (screenWidth - (cellCount * 2 * cellMargin)) / cellCount; // margin is on both sides
        return (
            <View backgroundColor="rgba(0,0,0,0.58)"
                  width={cellWidth}
                  style={[cellHorizontalMargins, {justifyContent: 'center', alignItems: 'center'}]}
            >
                <Text style={{flex: 0, fontSize: 20, fontFamily: "SourceSansPro-Semibold", color: 'white'}}>{this.props.number}</Text>
                <Text style={{flex: 0, fontSize: 11, fontFamily: "SourceSansPro-Regular", color: 'white'}}>{this.props.text}</Text>
            </View>
        )
    }
}

export default class CreateInvitationPage extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        this.state = {
            dataSource: ds.cloneWithRows(this._daysAhead()),
            searchTerm: "Enter names",
            currentTabId: tabIds.selectDate
        };
    }

    _daysAhead() {
        // Thousands of apologies to the gods of computing
        var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var days = [];
        var curr = new Date();
        for (let i = 0; i < 100; i++) {
            days[i] = {
                day: curr.getDate(),
                dayName: dayNames[curr.getDay()]
            };
            curr = new Date(curr);
            curr.setDate(curr.getDate() + 1);
        }
        return days;
    }

    _handleBack() {

    }

    _handleLetsGo() {

    }

    _handleCalendar() {
        if (this.state.currentTabId !== tabIds.selectDate) {

        }
    }

    _handleClock() {
        if (this.state.currentTabId !== tabIds.selectTime) {

        }
    }

    _handleLocation() {
        if (this.state.currentTabId !== tabIds.selectLocation) {

        }
    }

    render() {
        return (
            <View style={styles.fullscreenContainer}>
                <View style={styles.topContainer}>
                    <View style={styles.topBar}><Text>Thing</Text></View>
                    <View style={styles.topTabButtonsContainer}>
                        <TouchableNativeFeedback onPressOut={() => this._handleCalendar()}
                                                 background={TouchableNativeFeedback.Ripple('red')}
                                                 style={{flex: 1}}>
                            <View style={styles.tabBarButton}>
                                <Image source={images.calendar} style={{width: 25, height: 25}}/>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback onPressOut={() => this._handleClock()}
                                                 background={TouchableNativeFeedback.Ripple('red')}
                                                 style={{flex: 1}}>
                            <View style={styles.tabBarButton}>
                                <Image source={images.clock} style={{width: 25, height: 25}}/>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback onPressOut={() => this._handleLocation()}
                                                 background={TouchableNativeFeedback.Ripple('red')}
                                                 style={{flex: 1}}>
                            <View style={styles.tabBarButton}>
                                <Image source={images.location_pin} style={{width: 25, height: 25}}/>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
                <View style={{flex: 1, justifyContent: 'space-between'}}>
                    <View style={styles.dateTimeScroller}>
                        <ListView {...numberAndTextScrollViewProps} dataSource={this.state.dataSource} />
                    </View>
                    <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'space-between'}}>
                        <View style={{flex: 0, margin: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text>Invite: </Text>
                            <TextInput value={this.state.searchTerm}
                                       onChangeText={(searchTerm) => this.setState({searchTerm: searchTerm})}
                                       onFocus={() => this.setState({searchTerm: ""})}
                                       style={{flex: 1, height:48}}/>
                        </View>
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
