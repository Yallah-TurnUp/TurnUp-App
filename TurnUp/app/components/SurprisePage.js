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
import Contacts from 'react-native-contacts';
import IntentSender from '../native/IntentSender';
import SmsSender from '../native/SmsSender';

export default class SurprisePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: 'Enter a Firebase token, or use the current logged in user\'s:',
            userToken: firebase.auth().currentUser.uid,
            currentLocation: 'Click the button below!',
            number_1: 'Enter number #1',
            number_2: 'Enter number #2',
            number_3: 'Enter number #3',
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

    sendTextToWhatsapp() {
        const textContent = 'Lin Chun chim be';
        IntentSender.sendTextToApplication(textContent, IntentSender.targets.WHATSAPP);
    }

    sendTextToMessenger() {
        const textContent = 'Lin Chun chim be';
        IntentSender.sendTextToApplication(textContent, IntentSender.targets.FB_MESSENGER);
    }

    sendTextToAnything() {
        const textContent = 'Lin Chun chim be';
        IntentSender.chooseAndSendText(textContent, "Send to Lin Chun");
    }

    getCurrentLocation() {
        navigator.geolocation.getCurrentPosition(position => {
            this.setState({ currentLocation: `N: ${position.coords.latitude}, E: ${position.coords.longitude}` });
        }, error => {
            this.setState({ currentLocation: error });
        });
    }

    sendSomeSmses() {
        SmsSender.sendTexts([
            {
                number: this.state.number_1,
                message: "You're guy number 1",
            },
            {
                number: this.state.number_2,
                message: "You're guy number 2",
            },
            {
                number: this.state.number_3,
                message: "You're guy number 3",
            },
        ], () => {
            console.log("Everything done!");
        });
    }

    getUserContacts() {
        Contacts.getAll((err, contacts) => {
           if (err) {
               console.log('error', err);
               return;
           }
           const namesAndNumbers = contacts
               .filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0)
               .map(contact => ({
               name: [contact.givenName, contact.middleName, contact.familyName]
                   .filter(name => name)
                   .join(' '),
               number: (contact.phoneNumbers.filter(phone => phone.label && phone.label === 'mobile') || contact.phoneNumbers)[0].number,
           }));
           console.log('contacts', namesAndNumbers);
        });
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center'}}>
                <ScrollView contentContainerStyle={{alignItems: 'center'}} style={{flex: 1}}>
                    <Text style={{textAlign: 'center', color:'white', marginBottom: 10}}>{this.state.message}</Text>
                    <TextInput value={this.state.userToken} onChangeText={userToken => this.setState({userToken})} style={{width: 400, backgroundColor: 'rgba(255, 255, 255, 0.5)'}}/>
                    <TouchableOpacity onPress={() => this.sendDataToServer()}>
                        <View style={{width: 200, height: 30, backgroundColor: 'red', borderRadius: 4, justifyContent: 'center'}}>
                            <Text style={{textAlign: 'center'}}>Send some data to server</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginTop: 10}} onPress={() => this.sendTextToWhatsapp()}>
                        <View style={{width: 200, height: 30, backgroundColor: 'blue', borderRadius: 4, justifyContent: 'center'}}>
                            <Text style={{textAlign: 'center', color: 'white'}}>Send some text to Whatsapp</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginTop: 10}} onPress={() => this.sendTextToMessenger()}>
                        <View style={{width: 200, height: 30, backgroundColor: 'blue', borderRadius: 4, justifyContent: 'center'}}>
                            <Text style={{textAlign: 'center', color: 'white'}}>Send some text to Messenger</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginTop: 10}} onPress={() => this.sendTextToAnything()}>
                        <View style={{width: 200, height: 30, backgroundColor: 'blue', borderRadius: 4, justifyContent: 'center'}}>
                            <Text style={{textAlign: 'center', color: 'white'}}>Send some text somewhere</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={{textAlign: 'center', color:'white', marginTop: 10}}>{this.state.currentLocation}</Text>
                    <TouchableOpacity style={{marginTop: 10}} onPress={() => this.getCurrentLocation()}>
                        <View style={{width: 200, height: 30, backgroundColor: 'purple', borderRadius: 4, justifyContent: 'center'}}>
                            <Text style={{textAlign: 'center', color: 'white'}}>Get current location!</Text>
                        </View>
                    </TouchableOpacity>
                    <TextInput value={this.state.number_1} onChangeText={number_1 => this.setState({number_1})} style={{width: 400, height: 40, backgroundColor: 'rgba(255, 255, 255, 0.5)'}}/>
                    <TextInput value={this.state.number_2} onChangeText={number_2 => this.setState({number_2})} style={{width: 400, height: 40, backgroundColor: 'rgba(255, 255, 255, 0.5)'}}/>
                    <TextInput value={this.state.number_3} onChangeText={number_3 => this.setState({number_3})} style={{width: 400, height: 40, backgroundColor: 'rgba(255, 255, 255, 0.5)'}}/>
                    <TouchableOpacity style={{marginTop: 10}} onPress={() => this.sendSomeSmses()}>
                        <View style={{width: 200, height: 30, backgroundColor: 'purple', borderRadius: 4, justifyContent: 'center'}}>
                            <Text style={{textAlign: 'center', color: 'white'}}>Send some SMSes</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginTop: 10}} onPress={() => this.getUserContacts()}>
                        <View style={{width: 200, height: 30, backgroundColor: 'purple', borderRadius: 4, justifyContent: 'center'}}>
                            <Text style={{textAlign: 'center', color: 'white'}}>Get user contacts</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
}
