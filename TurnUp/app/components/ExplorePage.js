/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ListView,
    Dimensions,
    Image
} from 'react-native';
import styles from '../config/styles.js';
import images from '../config/images.js';

const EventsCellViewProps = {
    renderRow: (rowData) => <EventsCellView name={rowData.peoples}/>,
    showsVerticalScrollIndicator: false
};

class EventsCellView extends Component {
    render() {
        var screenWidth = Dimensions.get('window').width;
        const cellWidth = (screenWidth * 0.9 ); // margin is on both sides
        return (
            <View backgroundColor="white" width={cellWidth} height={60}
                style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                <Image source={images.trollface} style={{width: 50, height: 50, marginLeft: 8}} />
                <Text style={{marginLeft:30, flex: 0, fontSize: 20, fontFamily: "SourceSansPro", color: 'black'}}>{this.props.name}</Text>
            </View>
        )
    }
}

export default class ExplorePage extends Component {
    _handlePress() {
        this.props.navigator.push({id: 2,});
    }
    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          dataSource: ds.cloneWithRows(this._nameList())
        };
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

    render() {
        return (
            <View style={[styles.container, {backgroundColor: 'green'}]}>
                <Text style={styles.welcome}>Greetings!</Text>
                <View style={styles.eventCells}>
                    <ListView {...EventsCellViewProps} dataSource={this.state.dataSource} />
                </View>

                <TouchableOpacity onPress={() => this._handlePress()}>
                    <View style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'black'}}>
                        <Text style={styles.welcome}>Go to page two</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.footer}>
                    <Image source={images.hosted_logo} style={{width: 80, height: 80, marginLeft: 20}}/>
                    <Image source={images.explore_logo} style={{width: 80, height: 80}}/>
                    <Image source={images.surprise_logo} style={{width: 80, height: 80, marginRight: 20}}/>
                </View>
            </View>
        )
    }
}
