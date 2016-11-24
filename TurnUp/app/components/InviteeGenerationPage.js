/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    NativeModules,
    ScrollView,
} from 'react-native';
import * as firebase from 'firebase';
import shortid from 'shortid';

export default class InviteeGenerationPage extends Component {
    constructor(props) {
        super(props);

        this.generateInvitees = this.generateInvitees.bind(this);
    }

    generateInvitees() {
        firebase.database()
            .ref(`/events/${firebase.auth().currentUser.uid}`)
            .once('value')
            .then((newEvents) => {
                const eventKeys = newEvents.val();
                if (!eventKeys) return;
                const firstEventKey = Object.keys(eventKeys)[0];
                const inviteeRange = [];
                for (let i = 0; i < 100; i++) {
                    inviteeRange.push(i);
                }
                const inviteesWithKeys = inviteeRange.map(() => {
                    const key = firebase.database().ref().child(`events/${firebase.auth().currentUser.uid}/${firstEventKey}/invitees`).push().key;
                    const generatedShortid = shortid.generate();
                    return {
                        key,
                        shortid: generatedShortid,
                    };
                });
                const shortcutMap = {};
                const shortIds = [];
                inviteesWithKeys.forEach((invitee) => {
                    shortIds.push(invitee.shortid);
                    const payload = {};
                    payload[invitee.key] = invitee;
                    firebase.database().ref().child(`events/${firebase.auth().currentUser.uid}/${firstEventKey}/invitees`).update(payload);
                    shortcutMap[invitee.shortid] = {
                        u: firebase.auth().currentUser.uid,
                        e: firstEventKey,
                        i: invitee.key,
                    };
                });
                firebase.database().ref().child('shortcutMap').update(shortcutMap);
                console.log(shortIds.join(" "));
            });
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={this.generateInvitees}>
                    <View style={{width: 200, height: 30, backgroundColor: 'purple', borderRadius: 4, justifyContent: 'center'}}>
                        <Text style={{textAlign: 'center', color: 'white'}}>Generate your invitees here</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}
