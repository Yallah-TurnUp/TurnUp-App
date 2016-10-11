/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import * as firebase from 'firebase';

export default class SurprisePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: 'Enter a Firebase token, or use the current logged in user\'s:',
            userToken: firebase.auth().currentUser.uid,
        }
    }

    sendDataToServer() {
        var postData = {
            eventDate: Date.now(),
            eventLocation: {
                latitude: 32.070771,
                longitude: 34.765995,
            },
            attendees: [
                "Superman",
                "Batman",
                "Dat",
            ]
        };
        const eventKey = firebase.database().ref().child('events').push().key;
        var payload = {};
        payload[`/events/${this.state.userToken}/${eventKey}`] = postData;
        firebase.database().ref().update(payload)
            .then(() => {
                this.setState({message: `Success! ${eventKey}`});
            })
            .catch(error => {
                this.setState({message: `Failure! ${error}`});
            });
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{textAlign: 'center', color:'white', marginBottom: 10}}>{this.state.message}</Text>
                <TextInput value={this.state.userToken} onChangeText={userToken => this.setState({userToken})} style={{width: 400, backgroundColor: 'rgba(255, 255, 255, 0.5)'}}/>
                <TouchableOpacity onPress={() => this.sendDataToServer()}>
                    <View style={{width: 200, height: 30, backgroundColor: 'red', borderRadius: 4, justifyContent: 'center'}}>
                        <Text style={{textAlign: 'center'}}>Send some data to server</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}
