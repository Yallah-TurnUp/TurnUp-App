/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
} from 'react-native';
import styles from '../config/styles.js';
import images from '../config/images.js';

export default class CreateEventPage extends Component {
    _handlePress() {
        this.props.navigator.push({id: 2,});
    }

    render() {
        return (
            <View style={{backgroundColor: 'grey'}}>
             <View style={{paddingVertical: 20, paddingHorizontal: 163, backgroundColor: 'orange'}}>
                                    <Text style={styles.welcome}>TurnUp</Text>
                                </View>
                <Text style={styles.welcome}>This is CreateEventPage!</Text>
                <TouchableOpacity onPress={() => this._handlePress()}>
                </TouchableOpacity>
            </View>
        )
    }
}
