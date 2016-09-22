/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';
import styles from '../config/styles.js';
import images from '../config/images.js';

export default class CreateEventPage extends Component {
    _handlePress() {
        this.props.navigator.push({id: 2,});
    }

    render() {
        return (
            <View style={{backgroundColor: '#e6e6e6'}}>
                <View style={styles.header}>
                    <Image source={images.trollface} style={{width: 50, height: 50, marginLeft: 5}} />
                    <Text style={{fontSize: 15, fontWeight: 'bold', backgroundColor: 'steelblue'}}>Turn Up</Text>
                    <Image source={images.host_logo} style={{width: 50, height: 50, marginRight: 5}} />
                </View>
                <View style={styles.eventTypeSelector}>
                    <Image source={images.guitar_logo} style={{width: 80, height: 80}}/>
                    <Image source={images.beer_logo} style={{width: 80, height: 80}}/>
                    <Image source={images.book_logo} style={{width: 80, height: 80}}/>
                    <Image source={images.basketball_logo} style={{width: 80, height: 80}}/>
                </View>
                <TouchableOpacity onPress={() => this._handlePress()}>
                </TouchableOpacity>
            </View>
        )
    }
}
