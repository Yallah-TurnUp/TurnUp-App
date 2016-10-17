/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
} from 'react-native';
import MapView from 'react-native-maps';

const MOUNTAIN_VIEW = {
    latitude: 37.78825,
    longitude: -122.4324,
};

export default class MapPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userLocation: null,
            markerTarget: MOUNTAIN_VIEW,
            locationText: 'Enter event location...',
        };

        this.getRegion = this.getRegion.bind(this);
        this.setMarkerTarget = this.setMarkerTarget.bind(this);
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

    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'green', justifyContent: 'center', alignItems: 'stretch'}}>
                <TextInput
                    value={this.state.locationText} onChangeText={locationText => this.setState({locationText})}
                    style={{backgroundColor: 'rgba(255, 255, 255, 0.5)'}}/>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'stretch'}}>
                    {this.state.userLocation && <MapView
                        initialRegion={this.getRegion()}
                        style={StyleSheet.absoluteFill}
                        onPress={this.setMarkerTarget}>
                        <MapView.Marker coordinate={this.state.markerTarget} />
                    </MapView>}
                </View>
            </View>
        )
    }
}
