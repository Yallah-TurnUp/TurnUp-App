/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ListView
} from 'react-native';
import styles from '../config/styles.js';
var people= ['Superman', 'Batman', 'Dats', 'General','Superman', 'Batman', 'Dats', 'General','Superman', 'Batman', 'Dats', 'General', 'General','Superman', 'Batman', 'Dats', 'General', 'Superman', 'Batman', 'Dats', 'General','Superman', 'Batman', 'Dats', 'General','Superman', 'Batman', 'Dats', 'General', 'General','Superman', 'Batman', 'Dats', 'General']
export default class ExplorePage extends Component {
    _handlePress() {
        this.props.navigator.push({id: 2,});
    }
    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          dataSource: ds.cloneWithRows(people),
        };
     }

    render() {
        return (
            <View style={[styles.container, {backgroundColor: 'green'}]}>
                <Text style={styles.welcome}>Greetings!</Text>
                <ListView
                        style={{flex: 1, marginTop: 10}}
                        dataSource={this.state.dataSource}
                        renderRow={(data) => <View><Text>{data}</Text></View>}
                        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                      />
                <TouchableOpacity onPress={() => this._handlePress()}>
                    <View style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'black'}}>
                        <Text style={styles.welcome}>Go to page two</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}
