/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    ListView
} from 'react-native';
import styles from '../config/styles.js';
import images from '../config/images.js';

export default class CreateEventPage extends Component {
    _handlePress() {
        this.props.navigator.push({id: 2,});
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#e6e6e6'}}>
                <View style={styles.header}>
                    <Image source={images.trollface} style={{width: 50, height: 50, marginLeft: 8}} />
                    <Text style={{fontSize: 15, fontWeight: 'bold', backgroundColor: 'steelblue'}}>Turn Up</Text>
                    <Image source={images.host_logo} style={{width: 50, height: 50, marginRight: 8}} />
                </View>
                <View style={styles.eventTypeSelector}>
                    <Image source={images.guitar_logo} style={{width: 80, height: 80}}/>
                    <Image source={images.beer_logo} style={{width: 80, height: 80}}/>
                    <Image source={images.book_logo} style={{width: 80, height: 80}}/>
                    <Image source={images.basketball_logo} style={{width: 80, height: 80}}/>
                </View>
                <View style={{backgroundColor:'blue', flex: 2}}>
                </View>
                <View style={styles.footer}>
                    <Image source={images.hosted_logo} style={{width: 80, height: 80, marginLeft: 20}}/>
                    <Image source={images.explore_logo} style={{width: 80, height: 80}}/>
                    <Image source={images.surprise_logo} style={{width: 80, height: 80, marginRight: 20}}/>
                </View>
                <TouchableOpacity onPress={() => this._handlePress()}>
                </TouchableOpacity>
            </View>
        )
    }
}
