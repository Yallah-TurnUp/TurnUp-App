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
    Alert,
} from 'react-native';
import * as firebase from 'firebase';
import Collapsible from 'react-native-collapsible';
import images from '../config/images.js';
import { BottomButtons } from './DateTimePickerPage.js';
import { TopBar } from './TabsPage.js';
import getBannerName from "../utils/getBannerName";

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
        const names = this.getNames();
        const dataSource = this.state.dataSource.cloneWithRows(names);

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
                <View>
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
            </View>
        );
    }
}

class InPeopleView extends Component {
    constructor(props) {
        super(props);

        this.state = { isOpen: false };
        this.toggleOpen = this.toggleOpen.bind(this);
    }

    toggleOpen() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
        const {screenWidth, inCount, inPeople} = this.props;
        const buttonHeight = screenWidth * 0.167;
        const buttonWidth = screenWidth * 0.9;
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(inPeople);

        return (
            <View style={{width: screenWidth * 0.9, alignSelf: 'center', marginTop: 5, marginBottom: 10}}>
                <TouchableOpacity activeOpacity={1} style={{width: buttonWidth, height: buttonHeight, backgroundColor: 'rgb(163,212,105)', justifyContent: 'center', borderRadius: 10}} onPress={this.toggleOpen}>
                    <Text style={statisticsNumberStyle}>{inCount}</Text>
                    <Text style={statisticsSubtitleStyle}>Are IN!</Text>
                </TouchableOpacity>
                {(this.state.isOpen && inPeople.length > 0) &&
                    <ListView
                        contentContainerStyle={{flexWrap: 'wrap', paddingTop: 5, flexDirection: 'row', backgroundColor: 'white', alignItems: 'flex-start'}}
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
};

const CommonAvailabilityDate = ({ datePicked, names, highestAttendance, width, pickDate }) => {
    const date = datePicked.getDate();
    const month = monthNames[datePicked.getMonth()];
    const day = dayNames[datePicked.getDay()];
    const hour = ('0' + datePicked.getHours()).slice(-2);
    const minute = ('0' + datePicked.getMinutes()).slice(-2);

    let fitWidthHeight = 15;
    let fitWidthWidth = 121.95;
    if (width < 121.95) {
        fitWidthWidth = width;
        fitWidthHeight = width * (15 / 121.95);
    }

    return (
        <View style={{flex: 1, marginLeft: 2.5, marginRight: 2.5}}>
            <View style={{height: 15, marginBottom: 2, alignItems: 'center'}}>
                {highestAttendance && <Image style={{height: fitWidthHeight, width: fitWidthWidth}} source={images.highest_attendance_banner} />}
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
            <TouchableOpacity style={{ position: 'absolute', bottom: 10, left: (width - (15 * 2.489)) / 2 }} onPress={() => pickDate(datePicked)}>
                <Image style={{ height: 15, width: 15 * 2.489 }} source={highestAttendance ? images.pick_green : images.pick_grey} />
            </TouchableOpacity>
        </View>
    );
};

const CommonAvailabilityPicking = ({ screenWidth, enrichedEventInfo, pickDate }) => (
    <View style={{flexDirection: 'row', width: screenWidth * 0.9, alignSelf: 'center', justifyContent: 'space-between'}}>
        {enrichedEventInfo.map(({ date, names, highestAttendance }, index) => (
            <CommonAvailabilityDate
                key={index}
                highestAttendance={highestAttendance}
                datePicked={date}
                pickDate={pickDate}
                names={names}
                width={(screenWidth * 0.9 / enrichedEventInfo.length) - 5}/>
        ))}
    </View>
);

// Initial stage

const CommonAvailabilityView = ({ screenWidth, enrichedEventInfo, invitedPeople, outPeople, fencePeople, pickDate }) => (
    <View>
        <Image style={{height: 25, width: 215.6, alignSelf: 'center', marginTop: 5, marginBottom: 5 }} source={images.common_availability_label} />
        <View style={{backgroundColor: 'rgb(231,231,231)', paddingTop: 10, paddingBottom: 20}}>
            <CommonAvailabilityPicking screenWidth={screenWidth} enrichedEventInfo={enrichedEventInfo} pickDate={pickDate} />
            <SummaryStatisticsView
                screenWidth={screenWidth}
                invitedCount={invitedPeople.length} outCount={outPeople.length} fenceCount={fencePeople.length}
                invitedPeople={invitedPeople} outPeople={outPeople} fencePeople={fencePeople} />
        </View>
    </View>
);

// New stage

const RSVPSummaryView = ({ screenWidth, inPeople, invitedPeople, outPeople, fencePeople }) => (
    <View>
        <Image style={{height: 25, width: 159.3, alignSelf: 'center', marginTop: 5, marginBottom: 5 }} source={images.rsvp_summary_label} />
        <View style={{backgroundColor: 'rgb(231,231,231)', paddingTop: 10, paddingBottom: 20}}>
            <InPeopleView screenWidth={screenWidth} inPeople={inPeople} inCount={inPeople.length} />
            <SummaryStatisticsView
                screenWidth={screenWidth}
                invitedCount={invitedPeople.length} outCount={outPeople.length} fenceCount={fencePeople.length}
                invitedPeople={invitedPeople} outPeople={outPeople} fencePeople={fencePeople} />
        </View>
    </View>
);

const EventBanner = ({ screenWidth, eventName, eventType }) => (
    <Image style={{width: screenWidth, height: screenWidth * 0.457}} source={images[getBannerName(eventType)]}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0, 0.20)', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{
                fontFamily: 'SourceSansPro-Regular',
                fontSize: 30,
                color: 'white',
                textAlign: 'center',
                width: screenWidth * 0.9
            }}>{'\uD83C\uDF89'} {eventName}</Text>
        </View>
    </Image>
);

export default class DashboardPage extends Component {
    constructor(props) {
        super(props);

        this.pickDate = this.pickDate.bind(this);
        this.onPop = this.onPop.bind(this);

        this.state = {
            pickedDate: this.props.pickedDate,
        }
    }

    componentWillMount() {
        firebase.database().ref().child(`events/${firebase.auth().currentUser.uid}/${this.props.eventKey}`).on('value', (updatedEvent) => {
            const event = updatedEvent.val();
            const invitees = Object.keys(event.invitees).map((inviteeKey) => event.invitees[inviteeKey]);
            const attending = invitees.filter(({ attending }) => attending);
            const saidNo = invitees.filter(({ attending }) => attending === false);
            const onTheFence = invitees.filter(({ attending }) => attending == null);
            const eventInfo = event.dates.map((date, index) => ({
                date: new Date(Date.parse(date.actualDate)),
                names: attending
                    .filter(({ commonAvailability }) => commonAvailability &&
                        Object.keys(commonAvailability).some((commonAvailabilityKey) =>
                            commonAvailability[commonAvailabilityKey] === String(index + 1)))
                    .map(({ name }) => name),
            }));
            const invitedNames = invitees.map(({ name }) => name);
            const saidNoNames = saidNo.map(({ name }) => name);
            const fenceNames = onTheFence.map(({ name }) => name);
            const eventName = event.name;
            const locationName = event.locationText;
            const eventType = event.type;
            this.setState({
                invitedPeople: invitedNames,
                outPeople: saidNoNames,
                fencePeople: fenceNames,
                eventInfo,
                eventName,
                locationName,
                eventType,
            });
        });
    }

    // Highlights the day with the highest attendance
    enrichEventInfo(eventInfo) {
        const bestLength = Math.max(...eventInfo.map(({ names }) => names.length));
        return eventInfo.map(possibleDate => ({
            ...possibleDate,
            highestAttendance: possibleDate.names.length === bestLength,
        }));
    }

    reallyPickDate(date) {
        console.log('Chose this date!', date);
        this.setState({ pickedDate: date });
    }

    pickDate(date) {
        Alert.alert('Finalize date', `Decide on this date?`, [
            { text: 'Maybe not', null },
            { text: 'Sure!', onPress: () => this.reallyPickDate(date)},
        ]);
    }

    onPop() {
        this.props.navigator.pop();
    }

    render() {
        const screenWidth = Dimensions.get('window').width;
        const { eventInfo, invitedPeople, outPeople, fencePeople, eventName, locationName, eventType } = this.state;
        const enrichedEventInfo = this.enrichEventInfo(eventInfo);

        return (
            <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'space-between'}}>
                <TopBar centerImage={images.dashboard_label} />
                <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                    <EventBanner screenWidth={screenWidth} eventName={eventName} eventType={eventType} />
                    {this.state.pickedDate
                        ? <RSVPSummaryView
                            screenWidth={screenWidth} inPeople={inPeople}
                            invitedPeople={invitedPeople} outPeople={outPeople} fencePeople={fencePeople} />
                        : <CommonAvailabilityView
                            screenWidth={screenWidth} enrichedEventInfo={enrichedEventInfo} pickDate={this.pickDate}
                            invitedPeople={invitedPeople} outPeople={outPeople} fencePeople={fencePeople} />}
                    <SummaryLocationView locationName={locationName} />
                </ScrollView>
                <BottomButtons
                    leftHandler={this.onPop}
                    leftImage={images.creation_back} rightImage={images.invite_more} rightAspect={5.114}/>
            </View>
        );
    }
}
