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
    TouchableWithoutFeedback,
    Image,
    TouchableHighlight,
    Alert,
    Keyboard,
    StyleSheet,
} from 'react-native';
import * as firebase from 'firebase';
import shortid from 'shortid';
import Contacts from 'react-native-contacts';
import styles from '../config/styles.js';
import images from '../config/images.js';
import SmsSender from '../native/SmsSender';
import { TopBar } from './TabsPage.js';
import { BottomButtons } from './DateTimePickerPage.js';

var people = [];
// var contacts = [{ emailAddresses: [ { label: 'work', email: 'aaron@chim.to' } ],
//          phoneNumbers: [ { label: 'mobile', number: '(963) 258-0147' } ],
//      thumbnailPath: '',
//      familyName: 'Seng',
//      middleName: 'Peck',
//      givenName: 'Aaron Khoo',
//      recordID: '3' },
//    { emailAddresses: [ { label: 'home', email: 'darius@chim.be' } ],
//      phoneNumbers: [ { label: 'mobile', number: '1 234-567-89' } ],
//      thumbnailPath: '',
//      familyName: 'Pan',
//      middleName: null,
//      givenName: 'Darius',
//      recordID: '1' },
//    { emailAddresses: [ { label: 'home', email: 'linchun@chim.be' } ],
//      phoneNumbers: [ { label: 'mobile', number: '1 472-580-369' } ],
//      thumbnailPath: '',
//      familyName: 'Chun',
//      middleName: 'Lin',
//      givenName: 'Kheng',
//      recordID: '2' },
//    { emailAddresses: [ { label: 'home', email: 'shicen@chim.be' } ],
//      phoneNumbers: [ { label: 'mobile', number: '(321) 456-9870' } ],
//      thumbnailPath: '',
//      familyName: 'Shicen',
//      middleName: null,
//      givenName: 'Liang',
//      recordID: '4' } ];



Contacts.getAll((err, contacts) => {
    if (err) {
        console.log('error', err);
        return;
    }
    console.log(contacts);
    people = contacts
        .filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0)
        .map(contact => {
            const { phoneNumbers, emailAddresses, givenName, middleName, familyName } = contact;
            const mobileNumbers = (phoneNumbers || []).filter(phone => phone.label && phone.label === 'mobile');
            return ({
                name: [givenName, middleName, familyName]
                    .filter(name => name)
                    .join(' '),
                firstName: givenName,
                number: mobileNumbers.length > 0
                    ? mobileNumbers[0].number
                    : (phoneNumbers && phoneNumbers.length > 0 ? phoneNumbers[0].number : null),
                email: (emailAddresses && emailAddresses.length > 0) ? emailAddresses[0].email : null,
            });
        });
});

class ContactListView extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.props.toggle(this.props.rowId);
    }

    render() {
        var boxes = {
            untickedBox: images.unticked_box,
            tickedBox: images.ticked_box,
        };

        return (
            <TouchableWithoutFeedback onPress={this.toggle} delayPressOut={0} >
                <View style={styles.contactListViewContainer}>
                    <View style={styles.contactListViewName}>
                        <Text style={styles.contactListViewNameText}>{this.props.name}</Text>
                    </View>
                    <View style={styles.contactListViewCheckbox}>
                        <Image style={styles.TickBox} source={boxes[this.props.active ? 'tickedBox' : 'untickedBox']}/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}


class SectionHeaderView extends Component {
    render(){
        var screenWidth = Dimensions.get('window').width;

        return (
            <View backgroundColor="rgb(113,113,118)" width={screenWidth}
                  style={styles.contactListSectionHeader}>
                <Text style={styles.contactListSectionHeaderText}> {this.props.character} </Text>
            </View>
        )
    }
}


class TypeMessage extends Component{
  render() {
    var limit = 200;
    return (
      <View style = {styles.MessageContainer}>
        <View style={{justifyContent:'center',marginTop:5}}>
          <Text style={styles.UneditableText}>
            Hi [CONTACT'S FIRST NAME],
          </Text>
        </View>
        <TextInput
            value={this.props.exampleMessage}
            onChangeText={(exampleMessage) => {
                this.props.setContent(exampleMessage)
            }}
            placeholder="Example: It’s been some time since we’ve last met. Let’s hang out!"
            onFocus={() => this.props.setContent("")}
            multiline = {true}
            maxLength = {limit}
            style={styles.MessageMultiline}
        />
        <View style={{justifyContent:'center',marginBottom:5}}>
          <Text style={styles.UneditableText}>
            PLS RSVP BY CLICKING ON THE URL BELOW.
          </Text>
        </View>
      </View>
    );
  }
}


export default class CreateInvitationPage extends Component {
    constructor(props) {
        super(props);
        this.onBack = this.onBack.bind(this);
        this.toggle = this.toggle.bind(this);
        this.confirmThenSend = this.confirmThenSend.bind(this);
        this.gatherInvitees = this.gatherInvitees.bind(this);
        this.setContent = this.setContent.bind(this);
        this.popToHome = this.popToHome.bind(this);
        this.filterChanged = this.filterChanged.bind(this);

        const getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
        const getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.active != r2.active || r1.name !== r2.name,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            getSectionData,
            getRowData,
        });

        const selectionState = {};
        const {dataBlob, sectionIds, rowIds} = this._formatData(people, selectionState);
        this.state = {
            selectionState,
            rowIdsLength: rowIds.map((row) => row.length).reduce((r1, r2) => r1 + r2, 0),
            exampleMessage: '',
            inviteesDataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds)
        };
    }

    _formatData(people, selectionState){
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const dataBlob = {};
        const sectionIds = [];
        const rowIds = [];

        for(let sectionId = 0; sectionId < alphabet.length; sectionId ++){
            currentChar = alphabet[sectionId];
            const users = people.filter((user) => user.name.toUpperCase().indexOf(currentChar) === 0);

            if(users.length > 0){
                sectionIds.push(sectionId);
                dataBlob[sectionId] = {character: currentChar};
                rowIds.push([]);

                for(let i=0; i< users.length; i++){
                    const rowId = `${sectionId}:${i}`;
                    rowIds[rowIds.length-1].push(rowId);
                    dataBlob[rowId] = {
                        ...users[i],
                        active: selectionState[rowId],
                    };
                }
            }
        }

        return { dataBlob, sectionIds, rowIds };
    }

    onBack() {
        this.props.navigator.pop();
    }

    toggle(rowId) {
        console.log('toggle trigger!');
        const selectionState = { ...this.state.selectionState };
        selectionState[rowId] = !selectionState[rowId];
        const {dataBlob, sectionIds, rowIds} = this._formatData(people, selectionState);
        this.setState({
            selectionState,
            inviteesDataSource: this.state.inviteesDataSource.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds)
        });
    }

    gatherInvitees() {
        const {dataBlob} = this._formatData(people, this.state.selectionState);
        return Object.keys(this.state.selectionState)
            .map((rowId) => dataBlob[rowId])
            .filter((rowData) => rowData.active);
    }

    setContent(exampleMessage) {
        this.setState({exampleMessage});
    }

    sendToInvitees(invitees) {
        console.log(invitees);
        const inviteesWithKeys = invitees.map(invitee => {
            const key = firebase.database().ref().child(`events/${firebase.auth().currentUser.uid}/${this.props.eventKey}/invitees`).push().key;
            const generatedShortid = shortid.generate();
            return {
                ...invitee,
                key,
                shortid: generatedShortid,
                message: invitee.message + `?id=${generatedShortid}`,
            };
        });
        console.log('inviteesWithKeys', inviteesWithKeys);
        const shortcutMap = {};
        inviteesWithKeys.forEach((invitee) => {
            const payload = {};
            payload[invitee.key] = invitee;
            firebase.database().ref().child(`events/${firebase.auth().currentUser.uid}/${this.props.eventKey}/invitees`).update(payload);
            shortcutMap[invitee.shortid] = {
                u: firebase.auth().currentUser.uid,
                e: this.props.eventKey,
                i: invitee.key,
            };
        });
        firebase.database().ref().child('shortcutMap').update(shortcutMap);
        const completeArray = invitees.map(() => false);
        SmsSender.sendTexts(inviteesWithKeys.map((invitee, index) => ({
            ...invitee,
            delivered: () => {
                completeArray[index] = true;
                if (completeArray.every((completeValue) => completeValue)) {
                    Alert.alert('Sending invitations complete!', 'You can check back on the RSVP status of the event any time.', [
                        { text: 'Alright!', onPress: this.popToHome}
                    ])
                }
            },
        })));
        Alert.alert('Sending your invitations...', 'It will be done in a couple of seconds!', [
            { text: 'Go to homepage', onPress: this.popToHome},
            { text: 'Cool'},
        ]);
    }

    popToHome() {
        this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes().filter(route => route.id === 2)[0]);
    }

    confirmThenSend() {
        const invitees = this.gatherInvitees().map((invitee) => ({
            ...invitee,
            message: `Hi ${invitee.firstName},\n${this.state.exampleMessage}\nPLS RSVP BY CLICKING ON THE URL BELOW:\nhttp://54.169.132.104/`,
        }));
        Alert.alert('Sending your invitation',
            `You will be sending your invitation to ${invitees.length} people.`,
            [{ text: 'Not yet', }, { text: 'TurnUp!', onPress: () => this.sendToInvitees(invitees) }]);
    }

    filterChanged(text) {

    }

    render() {
        return (
            <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
                <View style={styles.fullscreenContainer}>
                    <TopBar centerImage={images.send_to_label}/>
                    <View style={{ flex: 1 }}>
                        <View style={{flexDirection: 'row',  justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Text style={{marginLeft:15, flex: 0, fontSize: 15, fontFamily: "SourceSansPro-Regular", color: 'grey'}}>PERSONALIZE YOUR MESSAGE</Text>
                        </View>

                        <View style={styles.ContactListTopContainer}>
                            <View style={styles.MessageIcon}>
                                <Image style={{height:40, width:40}} source={images.message_logo}/>
                            </View>
                            <TypeMessage exampleMessage={this.state.exampleMessage} setContent={this.setContent}/>
                        </View>

                        <View style={{flexDirection: 'row',  justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Text style={{marginLeft:15, flex: 0, fontSize: 15, fontFamily: "SourceSansPro-Regular", color: 'grey'}}>CONTACT LIST</Text>
                        </View>

                        {/* <TextInput
                            style={{height: 40, paddingLeft: 10, paddingRight: 10}}
                            placeholder="Type a friend's name..."
                            placeholderTextColor="grey"
                            onChangeText={this.filterChanged} /> */}


                        <View style={styles.ContactListBottomContainer}>
                            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                                <ListView initialListSize={this.state.rowIdsLength}
                                          renderRow={(rowData, _, rowId) => <ContactListView name={rowData.name} active={rowData.active} toggle={this.toggle} rowId={rowId} />}
                                          renderSectionHeader={(sectionData) => <SectionHeaderView {...sectionData} />}
                                          renderSeparator={(sectionId, rowId) => <View key={`${sectionId}-${rowId}`} style={styles.ContactlistSeparator} />}
                                          dataSource={this.state.inviteesDataSource}
                                          showsVerticalScrollIndicator={false}/>
                            </View>
                        </View>
                    </View>
                    <BottomButtons leftImage={images.creation_back} rightImage={images.creation_done}
                                   leftHandler={this.onBack} rightHandler={this.confirmThenSend} />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
