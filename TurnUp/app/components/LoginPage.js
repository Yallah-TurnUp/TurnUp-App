/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    TextInput
} from 'react-native';
import styles from '../config/styles.js';
import images from '../config/images.js';

export default class LoginPage extends Component {
    _handlePress() {
        this.props.navigator.push({id: 2,});
    }

    render() {
        return (
            <View style={styles.loginScreen}>
                <Image source={images.trollface} style={styles.loginTurnup}/>
                <View style={styles.loginCredentials}>
                    <TextInput style={styles.loginCredentialLine}/>
                    <TextInput style={styles.loginCredentialLine}/>
                </View>
                <TouchableOpacity onPress={() => this._handlePress()}>
                    <View style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'black'}}>
                        <Text style={styles.welcome}>Sign in</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}
