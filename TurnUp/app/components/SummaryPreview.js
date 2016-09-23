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
var screenWidth = Dimensions.get('window').width;
        const cellWidth = (screenWidth * 0.7 );
var screenHeight = Dimensions.get('window').height;
        const cellHeight = (screenHeight * 0.65 );

export default class InvitedPage extends Component {
    _handlePress() {
        this.props.navigator.push({id: 2,});
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#e6e6e6'}}>
                <View style={styles.header}>
                    <Image source={images.back} style={{width: 50, height: 50, marginLeft: 10}} />
                    <Image source={images.summary_title} style={{height: 60, width:140}}/>
                    <Image source={images.host_logo} style={{width: 50, height: 50, marginLeft: 10}} />
                </View>
                <View style={{alignItems: 'center'}}>
                    <Image source={images.summary_eye} style={{width: 180, height: 40, marginTop: 10, marginBottom: 10}}/>
                </View>
                <View style={{flex:3, justifyContent: 'space-between', alignItems: 'center'}}>
                    <Image source={images.summary_preview} style={{height: cellHeight, width: cellWidth}}/>
                </View>
                <View style={{flex:-1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF9800'}}>
                    <Image source={images.summary_turnup_button} style={{width: 160, height: 50}}/>
                </View>
                    <TouchableOpacity onPress={() => this._handlePress()}>
                    </TouchableOpacity>
            </View>
        )
    }
}
