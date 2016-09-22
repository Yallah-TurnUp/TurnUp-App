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

export default class CreateInvitationPage extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
        this.state = {
            dataSource: ds.cloneWithRows(['row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', ])
        };
    }

    _handlePress() {
        this.props.navigator.push({id: 2,});
    }

    render() {
        var screenWidth = Dimensions.get('window').width;
        return (
            <View style={styles.fullscreenContainer}>
                <View style={styles.topContainer}>
                    <View style={styles.topBar}><Text>Thing</Text></View>
                    <View style={styles.topTabButtonsContainer}><Text>Top tab buttons</Text></View>
                </View>
                <View style={{flex: 1}}>
                    <View style={styles.dateTimeScroller}>
                        <ListView
                        dataSource={this.state.dataSource}
                        renderRow={(rowData) => <Text>{rowData}</Text>}
                        horizontal={true}
                        />
                    </View>
                    <View><Text>Who are you inviting</Text></View>
                    <View><Text>Buttons</Text></View>
                </View>
            </View>
        )
    }
}
