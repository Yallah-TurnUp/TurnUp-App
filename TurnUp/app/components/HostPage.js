/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    ListView,
    Dimensions
} from 'react-native';
import * as firebase from 'firebase';
import styles from '../config/styles.js';
import images from '../config/images.js';
import getBannerName from "../utils/getBannerName";

class ImageListView extends Component {
    render() {
        var screenWidth = Dimensions.get('window').width;
        const cellWidth = (screenWidth * 0.9 ); // margin is on both sides
        return (
            <TouchableOpacity backgroundColor="transparent" width={cellWidth} height={175} onPress={() => this.props.onPress(this.props.eventKey)}
                style={{justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}>
                <Image source={images[this.props.name]} style={{alignItems: 'stretch', width: cellWidth, height: 150}}>
                    <View style={{flex: 1, backgroundColor: 'rgba(0,0,0, 0.40)', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontFamily: 'SourceSansPro-Regular', fontSize: 25, color: 'white', textAlign: 'center', width: screenWidth * 0.9 * 0.9}}>{this.props.eventName}</Text>
                    </View>
                </Image>
            </TouchableOpacity>
        )
    }
}

export default class HostPage extends Component {
    _handlePress() {
        this.props.navigator.push({id: 2,});
    }

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.onTapEvent = this.onTapEvent.bind(this);
        this.state = {
          dataSource: ds.cloneWithRows([]),
          text: 'your favourite'
        };
    }

    componentWillMount() {
        firebase.database().ref(`/events/${firebase.auth().currentUser.uid}`).on('value', (newEvents) => {
            const events = newEvents.val();
            if (!events) return;
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(
                    Object.keys(events).map((eventKey) => ({
                        eventLists: getBannerName(events[eventKey].type),
                        eventName: events[eventKey].name,
                        eventKey,
                    }))
                ),
            });
        });
    }

    onTapEvent(eventKey) {
        this.props.navigator.push({ id: 19, eventKey });
    }

    render() {
        return (
            <View style={[styles.container, {backgroundColor: 'transparent'}]}>
                <View style={{flex: 1, backgroundColor:'transparent', alignItems: 'stretch', marginTop: 10}}>
                    <ListView
                        enableEmptySections
                        showsVerticalScrollIndicator={false}
                        renderRow={(rowData) => <ImageListView onPress={this.onTapEvent} name={rowData.eventLists} eventName={rowData.eventName} eventKey={rowData.eventKey} />}
                        dataSource={this.state.dataSource} />
                </View>
            </View>
        )
    }
}
