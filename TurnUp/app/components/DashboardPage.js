/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    Dimensions,
    ListView,
    TouchableOpacity,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import images from '../config/images.js';
import { BottomButtons } from './DateTimePickerPage.js';

const monthNames = {
    0: 'JAN',
    1: 'FEB',
    2: 'MAR',
    3: 'APR',
    4: 'MAY',
    5: 'JUN',
    6: 'JUL',
    7: 'APR',
    8: 'SEP',
    9: 'OCT',
    10: 'NOV',
    11: 'DEC',
};

const dayNames = {
    0: 'SUN',
    1: 'MON',
    2: 'TUE',
    3: 'WED',
    4: 'THU',
    5: 'FRI',
    6: 'SAT',
};

const SummaryLocationView = ({locationName}) => (
    <View style={{height: 50, flexDirection: 'row', backgroundColor: 'rgb(206,206,206)', marginTop: 10, alignItems: 'center'}}>
        <View style={{height: 50, width: 50, padding: 10, backgroundColor: 'white'}}>
            <Image style={{height: 30, width: 30, backgroundColor: 'white'}} source={images.map_icon} />
        </View>
        <Text style={{marginLeft: 10, fontSize: 20, fontFamily: 'SourceSansPro-Regular', color: 'black'}}>{locationName}</Text>
    </View>
);

const statisticsNumberStyle = {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 25,
    textShadowColor: 'black',
    textShadowOffset: { height: 1.5, width: 0 },
    textShadowRadius: 1,
};

const statisticsSubtitleStyle = {
    color: 'black',
    textAlign: 'center',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 15
};

class SummaryStatisticsView extends Component {
    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            currentTab: -1,
            dataSource: ds,
        };

        this.tappedTab = this.tappedTab.bind(this);
        this.getNames = this.getNames.bind(this);
    }

    tappedTab(tabTarget) {
        this.setState({
            currentTab: tabTarget !== this.state.currentTab ? tabTarget : -1,
        })
    }

    getNames() {
        switch(this.state.currentTab) {
            case 0:
                return this.props.invitedPeople;
            case 1:
                return this.props.outPeople;
            case 2:
                return this.props.fencePeople;
            default:
                return [];
        }
    }

    render() {
        const {screenWidth, invitedCount, outCount, fenceCount} = this.props;
        const dataSource = this.state.dataSource.cloneWithRows(this.getNames());

        return (
            <View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <TouchableOpacity activeOpacity={1} style={{width: screenWidth * 0.3, height: screenWidth * 0.167, backgroundColor: (this.state.currentTab === 0 || this.state.currentTab === -1) ? 'rgb(183,210,169)' : 'rgb(206,206,206)', justifyContent: 'center'}} onPress={() => this.tappedTab(0)}>
                        <Text style={statisticsNumberStyle}>{invitedCount}</Text>
                        <Text style={statisticsSubtitleStyle}>Invited</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={{width: screenWidth * 0.3, height: screenWidth * 0.167, backgroundColor: (this.state.currentTab === 1 || this.state.currentTab === -1)  ? 'rgb(226,128,146)' : 'rgb(206,206,206)', justifyContent: 'center'}} onPress={() => this.tappedTab(1)}>
                        <Text style={statisticsNumberStyle}>{outCount}</Text>
                        <Text style={statisticsSubtitleStyle}>Count them OUT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={{width: screenWidth * 0.3, height: screenWidth * 0.167, backgroundColor: (this.state.currentTab === 2 || this.state.currentTab === -1)  ? 'rgb(170,170,170)' : 'rgb(206,206,206)', justifyContent: 'center'}} onPress={() => this.tappedTab(2)}>
                        <Text style={statisticsNumberStyle}>{fenceCount}</Text>
                        <Text style={statisticsSubtitleStyle}>Have not RSVP</Text>
                    </TouchableOpacity>
                </View>
                {this.state.currentTab !== -1 &&
                    <ListView
                        contentContainerStyle={{flexWrap: 'wrap', width: screenWidth * 0.9, paddingTop: 5, flexDirection: 'row', alignSelf: 'center', backgroundColor: 'white', alignItems: 'flex-start'}}
                        dataSource={dataSource}
                        renderRow={(rowData) => (
                            <View style={{width: screenWidth * 0.9 / 4, height: 30, marginTop: 5, marginBottom: 5}}>
                                <Text style={{textAlign: 'center', fontFamily: 'SourceSansPro-Regular', fontSize: 15, color: 'black'}}>{rowData}</Text>
                            </View>
                        )}
                        enableEmptySections />}
            </View>
        );
    }
}

const CommonAvailabilityDate = ({ datePicked, names, highestAttendance, width }) => {
    const date = datePicked.getDate();
    const month = monthNames[datePicked.getMonth()];
    const day = dayNames[datePicked.getDay()];
    const hour = ('0' + datePicked.getHours()).slice(-2);
    const minute = ('0' + datePicked.getMinutes()).slice(-2);

    return (
        <View style={{flex: 1, marginLeft: 2.5, marginRight: 2.5}}>
            <View style={{height: 15, marginBottom: 2}}>
                {highestAttendance && <Image style={{height: width / 8.13, width}} source={images.highest_attendance_banner} />}
            </View>
            <View style={{backgroundColor: 'white', borderTopLeftRadius: 8, borderTopRightRadius: 8}}>
                <Text style={{textAlign: 'center', fontSize: 10, color: 'black'}}>{date} {month} ({day})</Text>
                <Text style={{textAlign: 'center', fontSize: 10, color: 'black', fontWeight: 'bold'}}>{hour}:{minute}</Text>
            </View>
            <View style={{backgroundColor: highestAttendance ? 'rgb(255,241,206)' : 'rgb(206,206,206)', flex: 1, paddingTop: 5, paddingBottom: 5}}>
                <ListView
                    dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(names)}
                    renderRow={(rowData) => <Text style={{textAlign: 'center', marginTop: 5, marginBottom: 5, fontFamily: 'SourceSansPro-Regular', fontSize: 14, color: 'black'}}>{rowData}</Text>} />
            </View>
            <View style={{ height: 20 }} />
            <TouchableOpacity style={{ position: 'absolute', bottom: 10, left: (width - (15 * 2.489)) / 2 }}>
                <Image style={{ height: 15, width: 15 * 2.489 }} source={highestAttendance ? images.pick_green : images.pick_grey} />
            </TouchableOpacity>
        </View>
    );
};

const CommonAvailabilityPicking = ({ screenWidth, enrichedEventInfo }) => (
    <View style={{flexDirection: 'row', width: screenWidth * 0.9, alignSelf: 'center', justifyContent: 'space-between'}}>
        {enrichedEventInfo.map(({ date, names, highestAttendance }, index) => (
            <CommonAvailabilityDate
                key={index}
                highestAttendance={highestAttendance}
                datePicked={date}
                names={names}
                width={(screenWidth * 0.9 / enrichedEventInfo.length) - 5}/>
        ))}
    </View>
);

const EventBanner = ({ screenWidth, eventName }) => (
    <Image style={{width: screenWidth, height: screenWidth * 0.457 }} source={images.banner_rocket}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0, 0.20)', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontFamily: 'SourceSansPro-Regular', fontSize: 30, color: 'white', textAlign: 'center', width: screenWidth * 0.9}}>{'\uD83C\uDF89'} {eventName}</Text>
        </View>
    </Image>
);

export default class DashboardPage extends Component {
    constructor(props) {
        super(props);
    }

    // Highlights the day with the highest attendance
    enrichEventInfo(eventInfo) {
        const bestLength = Math.max(...eventInfo.map(({ names }) => names.length));
        return eventInfo.map(possibleDate => ({
            ...possibleDate,
            highestAttendance: possibleDate.names.length === bestLength,
        }));
    }

    render() {
        const screenWidth = Dimensions.get('window').width;

        const eventInfo = [{
            date: new Date(2016, 9, 10, 6, 15),
            names: ['Aaron Khoo', 'Anna Cheng', 'Benny Chong', 'Bryan Lim'],
        }, {
            date: new Date(2016, 9, 12, 7, 30),
            names: ['Aaron Khoo', 'Anna Cheng', 'Bryan Lim'],
        }, {
            date: new Date(2016, 10, 16, 15, 0),
            names: ['Aaron Khoo'],
        }];

        const invitedPeople = ['Aaron Khoo', 'Anna Cheng', 'Benny Chong', 'Bryan Lim', 'Carrie Ash', 'Darius Pan',
            'Felicia Lim', 'Wei Li', 'Jack Ma', 'Zack Joe', 'Nice Guy'];
        const outPeople = ['Aaron Khoo', 'Anna Cheng', 'Benny Chong', 'Bryan Lim', 'Carrie Ash', 'Darius Pan'];
        const fencePeople = ['Felicia Lim', 'Wei Li', 'Jack Ma', 'Zack Joe', 'Nice Guy'];

        const eventName = 'NCIS \'11 Reunion Dinner';

        const enrichedEventInfo = this.enrichEventInfo(eventInfo);

        return (
            <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'space-between'}}>
                <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                    <EventBanner screenWidth={screenWidth} eventName={eventName} />
                    <Image style={{height: 25, width: 215.6, alignSelf: 'center', marginTop: 5, marginBottom: 5 }} source={images.common_availability_label} />
                    <View style={{backgroundColor: 'rgb(231,231,231)', paddingTop: 10, paddingBottom: 20}}>
                        <CommonAvailabilityPicking screenWidth={screenWidth} enrichedEventInfo={enrichedEventInfo} />
                        <SummaryStatisticsView
                            screenWidth={screenWidth}
                            invitedCount={invitedPeople.length} outCount={outPeople.length} fenceCount={fencePeople.length}
                            invitedPeople={invitedPeople} outPeople={outPeople} fencePeople={fencePeople} />
                    </View>
                    <SummaryLocationView locationName={"NUS Enterprise - Hangar"} />
                </ScrollView>
                <BottomButtons leftImage={images.creation_back} rightImage={images.invite_more} rightAspect={5.114}/>
            </View>
        );
    }
}
