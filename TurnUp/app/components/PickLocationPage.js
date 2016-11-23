/**
 * Created by LinChun on 29/10/16.
 */

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    ListView,
    TextInput,
    TouchableNativeFeedback,
    Image,
    TouchableHighlight,
    TouchableWithoutFeedback
} from 'react-native';
import styles from '../config/styles.js';
import images from '../config/images.js';
import { TopBar } from './TabsPage.js';

var people= [{'name':'Alice'},{'name': 'Batman'}, {'name':'Dats'},{'name':'General'},{'name':'Superman'},{'name': 'Teddy'}, {'name':'Dats'} , {'name':'Stalin'}, {'name':'Ham Lon'},{'name': 'Batman'}, {'name':'Dats'} , {'name':'Shicen'},{'name':'Superman'},{'name': 'Batman'}, {'name':'Joseph'} , {'name':'General'},{'name':'Sexy'},{'name': 'Batman'}, {'name':'Darius'} , {'name':'General'}];

const genSectionProps = {
    renderSectionHeader: (sectionData) => <SectionHeaderView {...sectionData}/>,
    showsVerticalScrollIndicator: false
};

const genRowProps = {
    renderRow: (rowData) => <ContactListView name={rowData.name}/>,
    showsVerticalScrollIndicator: false
};

/*
 const genRowProps = {
 renderRow: (rowData) => <ContactListView {...rowData}/>,
 showsVerticalScrollIndicator: false
 };*/

class ContactListView extends Component {
    constructor(props) {
        super(props);
        this._changeBox = this._changeBox.bind(this)
        this.state = { //initialstate
            count: false,
            theImage: 'untickedBox'
        }
    }

    _changeBox(){

        if(this.state.count) {
            this.setState({
                count: false,
                theImage: 'untickedBox'
            });
        }
        else {
            this.setState({
                count: true,
                theImage: 'tickedBox'
            });
        }
    }

    render() {
        var boxes = {
            untickedBox: images.unticked_box,
            tickedBox: images.ticked_box
        }

        return (
            <TouchableWithoutFeedback onPress={this._changeBox} >
                <View style={{backgroundColor: 'rgb(242,242,242)' , flexDirection: 'row', height:40, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{backgroundColor:'transparent', flex:3}}>
                        <Text style={{marginLeft:30, flex: 0, fontSize: 20, fontFamily: "SourceSansPro", color: 'black'}}>{this.props.name}</Text>
                    </View>
                    <View style={{backgroundColor:'transparent', flex:1, justifyContent: 'center', alignItems:'center'}}>
                        <Image style={styles.TickBox} key={boxes[this.state.theImage]} source={boxes[this.state.theImage]}/>
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
                <Text style={{marginLeft:23, flex:0, fontSize: 18, fontFamily: "SourceSansPro", color: 'white'}}> {this.props.character} </Text>
            </View>
        )
    }
}

class TypeMessage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            exampleMessage: 'Example: It’s been some time since we’ve last met. Let’s hang out!'};
    }

    render() {
        var limit = 300;
        var remainder = limit - this.state.text.length;
        var remainderColor = remainder > 10 ? 'blue' : 'red';
        return (
            <View style = {styles.MessageContainer}>
                <View style={{justifyContent:'center',marginTop:5}}>
                    <Text style={styles.UneditableText}>
                        Hi [CONTACT NAME],
                    </Text>
                </View>
                <TextInput
                    value={this.state.exampleMessage}
                    onChangeText={(exampleMessage) => this.setState({exampleMessage: exampleMessage})}
                    onFocus={() => this.setState({exampleMessage: ""})}
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
        const getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
        const getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            getSectionData,
            getRowData,
        });

        const {dataBlob, sectionIds, rowIds} = this._formatData(people);
        this.state = {
            inviteesDataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds)
        }
    }

    _formatData(people){

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const dataBlob = {};
        const sectionIds = [];
        const rowIds = [];

        for(let sectionId = 0; sectionId < alphabet.length; sectionId ++){
            currentChar = alphabet[sectionId];
            const users = people.filter((user) => user.name.toUpperCase().indexOf(currentChar) === 0);

            if(users.length > 0){
                sectionIds.push(sectionId)
                dataBlob[sectionId] = {character: currentChar};
                rowIds.push([]);

                for(let i=0; i< users.length; i++){

                    const rowId = `${sectionId}:${i}`;
                    rowIds[rowIds.length-1].push(rowId);
                    dataBlob[rowId] = users[i];
                };

            }
        }

        return { dataBlob, sectionIds, rowIds };
    }



    render() {

        var invitees = <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <ListView {...genRowProps} {...genSectionProps}
                      renderSeparator={(sectionData,rowData)=> <View key={rowData} style={styles.ContactlistSeparator}></View>}
                      dataSource={this.state.inviteesDataSource}/>
        </View>
        return (
            <View style={styles.fullscreenContainer}>

                <TopBar />
                <View style={{flex:0.1, flexDirection: 'row',  justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Text style={{marginLeft:15, flex: 0, fontSize: 15, fontFamily: "SourceSansPro", color: 'grey'}}>PERSONALIZE YOUR MESSAGE</Text>
                </View>

                <View style={styles.ContactListTopContainer}>
                    <View style={styles.MessageIcon}>
                        <Image style={{height:40, width:40}} source={images.message_logo}/>
                    </View>
                    <TypeMessage/>

                </View>

                <View style={{flex:0.1, flexDirection: 'row',  justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Text style={{marginLeft:15, flex: 0, fontSize: 15, fontFamily: "SourceSansPro", color: 'grey'}}>CONTACT LIST</Text>
                </View>


                <View style={styles.ContactListBottomContainer}>
                    {invitees}
                </View>

            </View>
        );
    }
}
