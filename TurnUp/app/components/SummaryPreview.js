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
    Image,
    TouchableNativeFeedback
} from 'react-native';
import styles from '../config/styles.js';
import images from '../config/images.js';

import { TopBar } from './TabsPage.js';

var screenWidth = Dimensions.get('window').width;
        const cellWidth = (screenWidth * 0.55 );
var screenHeight = Dimensions.get('window').height;
        const cellHeight = (screenHeight * 0.65 );

export default class SummaryPreview extends Component {
    _showSummary() {
        this.props.navigator.push({id: 13,});
    }

    _popSelf() {
        this.props.navigator.pop();
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#e6e6e6'}}>
                <TopBar leftButton={images.back} centerImage={images.summary_title}
                        leftButtonHandler={() => this._popSelf()}/>
                <View style={{alignItems: 'center'}}>
                    <Image source={images.summary_eye} style={{width: 180, height: 40, marginTop: 10, marginBottom: 10}}/>
                </View>
                <View style={{flex:3, justifyContent: 'flex-start', alignItems: 'center', elevation: 10}}>
                    <Image source={images.summary_preview} style={{height: cellHeight, width: cellWidth}}/>
                </View>
                <View style={{alignItems: 'center', marginBottom: 30}}>
                    <TouchableNativeFeedback onPressOut={() => this._showSummary()}
                                             background={TouchableNativeFeedback.Ripple('red')}>
                        <View style={{width: 128, height: 40, backgroundColor: '#F28500', elevation: 3,
                            alignItems: 'center', justifyContent: 'center', borderRadius: 8}}>
                            <Image source={images.turnup_title} style={{width: 96, height: 30}}/>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        )
    }
}
