/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    ListView,
    TextInput,
    Image,
    StyleSheet
} from 'react-native';
import * as firebase from 'firebase';
import styles from '../config/styles.js';
import images from '../config/images.js';
import { TopBar } from './TabsPage.js';
import { BottomButtons } from './DateTimePickerPage.js';

import MapView from 'react-native-maps';

const MOUNTAIN_VIEW = {
    latitude: 37.78825,
    longitude: -122.4324,
};

var screenWidth = Dimensions.get('window').width;
const cellWidth = (screenWidth * 0.90 );
var screenHeight = Dimensions.get('window').height;
const cellHeight = (screenHeight * 0.55 );

export default class MapPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userLocation: null,
            markerTarget: MOUNTAIN_VIEW,
            locationText: 'Enter event location...',
            locationTextDirty: false,
        };

        this.getRegion = this.getRegion.bind(this);
        this.setMarkerTarget = this.setMarkerTarget.bind(this);
        this.onLocationTextFocus = this.onLocationTextFocus.bind(this);
        this.changeLocationText = this.changeLocationText.bind(this);
        this.navigateToSummaryTabs = this.navigateToSummaryTabs.bind(this);
    }

    componentWillMount() {
        navigator.geolocation.getCurrentPosition(position => {
            const currentPosition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
            this.setState({
                userLocation: currentPosition,
                markerTarget: currentPosition
            });
        });
    }

    getRegion() {
        return {
            ...this.state.userLocation,
            latitudeDelta: 0.0231,
            longitudeDelta: 0.0110,
        };
    }

    setMarkerTarget(event) {
        const dragCoords = event.nativeEvent.coordinate;
        this.setState({
            markerTarget: {
                latitude: dragCoords.latitude,
                longitude: dragCoords.longitude,
            }
        });
    }

    onLocationTextFocus() {
        if (!this.state.locationTextDirty) this.changeLocationText('');
    }

    changeLocationText(locationText) {
        this.setState({locationText, locationTextDirty: true});
    }

    navigateToSummaryTabs() {
        const { locationTextDirty, locationText } = this.state;
        const eventBlob = {
            ...this.props.eventBlob,
            locationText: locationTextDirty ? locationText : null,
        };
        const payload = {};
        payload[`/events/${firebase.auth().currentUser.uid}/${this.props.eventKey}`] = eventBlob;
        firebase.database().ref().update(payload);
        this.props.navigator.push({id: 18, eventBlob, eventKey: this.props.eventKey});
    }

    render() {
        return (

            <View style={styles.fullscreenContainer}>
                {!this.props.hideNav && <TopBar centerImage={images.my_event}/>}
                <View style={styles.MapPageTopContainer}>
                    <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1, marginBottom: -10}}>
                        <Text style={{fontSize:15, marginLeft: 5, textAlign:'left'}}>CHOOSE A LOCATION</Text>
                    </View>
                    <View style={{backgroundColor:'rgb(237,237,237)',height:50, flexDirection:'row', justifyContent: 'center', alignItems:'center'}}>
                        <View style={{backgroundColor:'rgb(237,237,237)',flex:0.5, justifyContent:'center', alignItems:'center', height:40}}>
                            <Image style={{height:28,width:28}} source={images.location_pin}/>
                        </View>
                        <TextInput
                            blurOnSubmit onFocus={this.onLocationTextFocus}
                            value={this.state.locationText} onChangeText={locationText => this.setState({locationText, locationTextDirty: true})}
                            style={styles.SearchTextContainer} />
                        <TouchableOpacity style={{backgroundColor:'rgb(237,237,237)',flex:0.5, justifyContent:'center', alignItems:'center', height:50}}>
                                <Image source={images.search_logo} style={{height:20,width:20}}/>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{backgroundColor:'white',flex: 0.85, justifyContent: 'center', alignItems: 'center'}}>
                    {this.state.userLocation && <MapView
                        initialRegion={this.getRegion()}
                        style={{height:cellHeight, width:cellWidth}}
                        onPress={this.setMarkerTarget}>
                        <MapView.Marker coordinate={this.state.markerTarget} />
                    </MapView>}
                </View>
                {!this.props.hideNav && <View style={{height: 100, justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={{height: 85, width: 380}} source={images.progress_map} resizeMode={Image.resizeMode.contain} />
                </View>}
                {!this.props.hideNav && <BottomButtons
                    leftImage={images.creation_back} leftHandler={this.props.navigator.pop}
                    rightImage={images.creation_next} rightHandler={this.navigateToSummaryTabs}/>}

            </View>

        )
    }
}
