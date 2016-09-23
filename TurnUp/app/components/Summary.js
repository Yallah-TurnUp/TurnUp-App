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

import { TopBar } from './TabsPage.js';

var screenWidth = Dimensions.get('window').width;
        const cellWidth = (screenWidth * 0.95);
var screenHeight = Dimensions.get('window').height;
        const cellHeight = (screenHeight * 0.65 );

const EventsCellViewProps = {
    renderRow: (rowData) => <EventsCellView name={rowData.peoples}/>,
    showsVerticalScrollIndicator: false
};

class EventsCellView extends Component {
    render() {
        var screenWidth = Dimensions.get('window').width;
        const cellWidth = (screenWidth * 0.95 ); // margin is on both sides
        return (
            <View backgroundColor="white" width={cellWidth} height={60}
                style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                <Image source={images.turnup_bird_button} style={{width: 50, height: 50, marginLeft: 8}} />
                <Text style={{marginLeft:30, flex: 0, fontSize: 20, fontFamily: "SourceSansPro", color: 'black'}}>{this.props.name}</Text>
            </View>
        )
    }
}

export default class Summary extends Component {
    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          dataSource: ds.cloneWithRows(this._nameList())
        };
    }

    _nameList() {
            // Thousands of apologies to the gods of computing
            var people= ['Superman', 'Batman', 'Dats', 'General','Superman', 'Batman', 'Dats', 'General','Superman', 'Batman', 'Dats', 'General', 'General','Superman', 'Batman', 'Dats', 'General', 'Superman', 'Batman', 'Dats', 'General','Superman', 'Batman', 'Dats', 'General','Superman', 'Batman', 'Dats', 'General', 'General','Superman', 'Batman', 'Dats', 'General'];
            var peopleName = [];
            for (let i = 0; i < people.length; i++) {
                        peopleName[i] = {
                            peoples: people[i]
                        };
            }
            return peopleName;
        }

    _popSelf() {
        this.props.navigator.pop()
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#e6e6e6'}}>
                <TopBar leftButton={images.back} centerImage={images.summary_title}
                        leftButtonHandler={() => this._popSelf()}/>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={images.summary_top} style={{width: cellWidth , height: 140, marginTop: 10}}/>
                </View>
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={images.summary_input} style={{height: 30, width: cellWidth}}/>
                </View>
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center', height: 100}}>
                    <ListView {...EventsCellViewProps} dataSource={this.state.dataSource}/>
                </View>
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={images.summary_location} style={{height: 30, width: cellWidth}}/>
                </View>
                <View style={{flex:2, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={images.event_1} style={{width: cellWidth, height: 120}}/>
                </View>
            </View>
        )
    }
}