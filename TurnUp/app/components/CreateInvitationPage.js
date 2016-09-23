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
    TouchableNativeFeedback
} from 'react-native';
import styles from '../config/styles.js';

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
            searchTerm: "Enter names"
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

    render() {
        return (
            <View style={styles.fullscreenContainer}>
                <View style={styles.topContainer}>
                    <View style={styles.topBar}><Text>Thing</Text></View>
                    <View style={styles.topTabButtonsContainer}><Text>Top tab buttons</Text></View>
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
                                    <Text style={styles.enrichmentButtonText}>Back</Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPressOut={() => this._handleBack()}
                                                     background={TouchableNativeFeedback.Ripple('red')}>
                                <View style={styles.enrichmentNavigationButton}>
                                    <Text style={styles.enrichmentButtonText}>Let's Go</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
