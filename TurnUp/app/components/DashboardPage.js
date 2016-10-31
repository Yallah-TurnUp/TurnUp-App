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
    fontSize: 30,
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

const SummaryStatisticsView = ({screenWidth, inCount, outCount, fenceCount}) => (
    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={{width: screenWidth * 0.3, height: screenWidth * 0.167, backgroundColor: 'rgb(203,230,189)', justifyContent: 'center'}}>
            <Text style={statisticsNumberStyle}>{inCount}</Text>
            <Text style={statisticsSubtitleStyle}>Invited</Text>
        </View>
        <View style={{width: screenWidth * 0.3, height: screenWidth * 0.167, backgroundColor: 'rgb(246,148,166)', justifyContent: 'center'}}>
            <Text style={statisticsNumberStyle}>{outCount}</Text>
            <Text style={statisticsSubtitleStyle}>Count them OUT</Text>
        </View>
        <View style={{width: screenWidth * 0.3, height: screenWidth * 0.167, backgroundColor: 'rgb(206,206,206)', justifyContent: 'center'}}>
            <Text style={statisticsNumberStyle}>{fenceCount}</Text>
            <Text style={statisticsSubtitleStyle}>Have not RSVP</Text>
        </View>
    </View>
);

const CommonAvailabilityDate = ({ datePicked, names, highestAttendance, width }) => {
    const date = datePicked.getDate();
    const month = monthNames[datePicked.getMonth()];
    const day = dayNames[datePicked.getDay()];
    const hour = ('0' + datePicked.getHours()).slice(-2);
    const minute = ('0' + datePicked.getMinutes()).slice(-2);
    // const pickImageWidth = width / 1.5;

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
            <TouchableOpacity style={{ position: 'absolute', bottom: 10, left: (width - (20 * 3.02)) / 2 }}>
                <Image style={{ height: 20, width: 20 * 3.02 }} source={highestAttendance ? images.pick_green : images.pick_grey} />
            </TouchableOpacity>
        </View>
    );
};

export default class DashboardPage extends Component {
    constructor(props) {
        super(props);
    }

    enrichEventInfo(eventInfo) {
        const bestLength = Math.max(...eventInfo.map(({ names }) => names.length));
        return eventInfo.map(possibleDate => ({
            ...possibleDate,
            highestAttendance: possibleDate.names.length === bestLength,
        }));
    }

    render() {
        const screenWidth = Dimensions.get('window').width;
        const bannerHeight = 0.457 * screenWidth;
        const partyPopperEmoji = '\uD83C\uDF89';

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

        const enrichedEventInfo = this.enrichEventInfo(eventInfo);

        return (
            <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'space-between'}}>
                <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                    <Image style={{width: Dimensions.get('window').width, height: bannerHeight}} source={images.banner_rocket}>
                        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0, 0.20)', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontFamily: 'SourceSansPro-Regular', fontSize: 30, color: 'white', textAlign: 'center', width: screenWidth * 0.9}}>{partyPopperEmoji} NCIS '11 Reunion Dinner</Text>
                        </View>
                    </Image>
                    <Image style={{height: 25, width: 215.6, alignSelf: 'center', marginTop: 5, marginBottom: 5 }} source={images.common_availability_label} />
                    <View style={{backgroundColor: 'rgb(231,231,231)', paddingTop: 10, paddingBottom: 20}}>
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
                        <SummaryStatisticsView screenWidth={screenWidth} inCount={50} outCount={20} fenceCount={25} />
                    </View>
                    <SummaryLocationView locationName={"NUS Enterprise - Hangar"} />
                </ScrollView>
                <BottomButtons leftImage={images.creation_back} rightImage={images.invite_more} rightAspect={5.114}/>
            </View>
        );
    }
}
