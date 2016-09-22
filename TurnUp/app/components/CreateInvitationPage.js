/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    ListView
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
    constructor(props) {
        super(props);
    }

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
            dataSource: ds.cloneWithRows(this._daysAhead())
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

    render() {
        return (
            <View style={styles.fullscreenContainer}>
                <View style={styles.topContainer}>
                    <View style={styles.topBar}><Text>Thing</Text></View>
                    <View style={styles.topTabButtonsContainer}><Text>Top tab buttons</Text></View>
                </View>
                <View style={{flex: 1}}>
                    <View style={styles.dateTimeScroller}>
                        <ListView {...numberAndTextScrollViewProps} dataSource={this.state.dataSource} />
                    </View>
                    <View><Text>Who are you inviting</Text></View>
                    <View><Text>Buttons</Text></View>
                </View>
            </View>
        )
    }
}
