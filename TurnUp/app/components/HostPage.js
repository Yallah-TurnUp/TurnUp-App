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

export default class HostPage extends Component {
    _handlePress() {
        this.props.navigator.push({id: 2,});
    }

    render() {
        return (
            <View style={[styles.container, {backgroundColor: 'green'}]}>
                <Text style={styles.welcome}>Greetings!</Text>
                <TouchableOpacity onPress={() => this._handlePress()}>
                    <View style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'black'}}>
                        <Text style={styles.welcome}>Go to page two</Text>
                    </View>
            <View style={styles.footer}>
                <Image source={images.hosted_logo} style={{width: 80, height: 80, marginLeft: 20}}/>
                <Image source={images.explore_logo} style={{width: 80, height: 80}}/>
                <Image source={images.surprise_logo} style={{width: 80, height: 80, marginRight: 20}}/>
            </View>
                </TouchableOpacity>
            </View>
        )
    }
}
