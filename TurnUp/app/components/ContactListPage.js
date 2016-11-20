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
    TouchableNativeFeedback,
    Image,
    TouchableHighlight,
    Alert,
} from 'react-native';
import * as firebase from 'firebase';
import shortid from 'shortid';
import Contacts from 'react-native-contacts';
import styles from '../config/styles.js';
import images from '../config/images.js';
import SmsSender from '../native/SmsSender.js';
import { TopBar } from './TabsPage.js';
import { BottomButtons } from './DateTimePickerPage.js';

var people= [
    {'name':'Alice'},
    {'name': 'Batman'},
    {'name':'Dats'},
    {'name':'General'},
    {'name':'Superman'},
    {'name': 'Teddy'},
    {'name':'Dats'},
    {'name':'Stalin'},
    {'name':'Ham Lon'},
    {'name': 'Batman'},
    {'name':'Dats'},
    {'name':'Shicen'},
    {'name':'Superman'},
    {'name': 'Batman'},
    {'name':'Joseph'} ,
    {'name':'General'},
    {'name':'Sexy'},
    {'name': 'Batman'},
    {'name':'Darius'} ,
    {'name':'General'}
];

Contacts.getAll((err, contacts) => {
    if (err) {
        console.log('error', err);
        return;
    }
    people = contacts
        .filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0)
        .map(contact => {
            if (contact.givenName === 'Darius' || contact.givenName === 'Dat') {
                console.log(contact);
            }
            const mobileNumbers = contact.phoneNumbers.filter(phone => phone.label && phone.label === 'mobile');
            return ({
                name: [contact.givenName, contact.middleName, contact.familyName]
                    .filter(name => name)
                    .join(' '),
                firstName: contact.givenName,
                number: (mobileNumbers.length > 0 ? mobileNumbers : contact.phoneNumbers)[0].number,
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
                <View style={{backgroundColor: 'rgb(242,242,242)' , flexDirection: 'row', height:40, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{backgroundColor:'transparent', flex:3}}>
                        <Text style={{marginLeft:20, flex: 0, fontSize: 15, fontFamily: "SourceSansPro", color: 'black'}}>{this.props.name}</Text>
                    </View>
                    <View style={{backgroundColor:'transparent', flex:1, justifyContent: 'center', alignItems:'center'}}>
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
                  style={{flex:1, flexDirection: 'row', justifyContent:'flex-start', alignItems:'center'}}>
                <Text style={{marginLeft:20, flex:0, fontSize: 18, fontFamily: "SourceSansPro", color: 'white'}}> {this.props.character} </Text>
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
            rowIdsLength: rowIds.map((row) => row.length).reduce((r1, r2) => r1 + r2),
            exampleMessage: 'Example: It’s been some time since we’ve last met. Let’s hang out!',
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
        SmsSender.sendTexts(invitees.map((invitee, index) => ({
            ...invitee,
            delivered: () => {
                completeArray[index] = true;
                if (completeArray.every((completeValue) => completeValue)) {
                    Alert.alert('Sending invitations complete!', 'You can check back on the RSVP status of the event any time.', [
                        { text: 'Alright!', onPress: () => this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes().filter(route => route.id === 2)[0])}
                    ])
                }
            },
        })));
        Alert.alert('Sending your invitations...', 'It will be done in a couple of seconds!', [{ text: 'Cool'}]);
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

    render() {
        return (
            <View style={styles.fullscreenContainer}>
                <TopBar centerImage={images.send_to_label}/>
                <View style={{ flex: 1 }}>
                    <View style={{flexDirection: 'row',  justifyContent: 'flex-start', alignItems: 'center'}}>
                        <Text style={{marginLeft:15, flex: 0, fontSize: 15, fontFamily: "SourceSansPro", color: 'grey'}}>PERSONALIZE YOUR MESSAGE</Text>
                    </View>

                    <View style={styles.ContactListTopContainer}>
                        <View style={styles.MessageIcon}>
                            <Image style={{height:40, width:40}} source={images.message_logo}/>
                        </View>
                        <TypeMessage exampleMessage={this.state.exampleMessage} setContent={this.setContent}/>
                    </View>

                    <View style={{flexDirection: 'row',  justifyContent: 'flex-start', alignItems: 'center'}}>
                        <Text style={{marginLeft:15, flex: 0, fontSize: 15, fontFamily: "SourceSansPro", color: 'grey'}}>CONTACT LIST</Text>
                    </View>


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
        );
    }
}
