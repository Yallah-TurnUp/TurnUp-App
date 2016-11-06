import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ListView,
    Dimensions,
    Image
} from 'react-native';
import MapPage from './MapPage.js';
import DateTimePickerPage from './DateTimePickerPage.js';
import styles from '../config/styles.js';
import images from '../config/images.js';

import { TopBar, TabBar } from './TabsPage.js';

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

function getDateString(date) {
    const day = date.getDate();
    const month = date.getMonth();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${day} ${monthNames[month]} ${('0' + hour).slice(-2)}:${('0' + minute).slice(-2)}`;
}

const SummaryTabIds = {
    commonAvailability: 'commonAvailability',
    mapPage: 'mapPage',
    summaryPage: 'summaryPage',
};

const EventBanner = ({ eventName, screenWidth }) => (
    <Image style={{width: screenWidth, height: screenWidth * 0.457 }} source={images.banner_rocket}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0, 0.20)', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontFamily: 'SourceSansPro-Regular', fontSize: 30, color: 'white', textAlign: 'center', width: screenWidth * 0.9}}>{'\uD83C\uDF89'} {eventName}</Text>
        </View>
    </Image>
);

const DateTimeSummary = ({ dates }) => (
    <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: 'rgb(231, 231, 231)'}}>
        <Image style={{width: 35, height: 35, marginLeft: 10, marginRight: 10}} source={images.calendar_icon} />
        <Text style={{color: 'black'}}>{getDateString(dates[0])}</Text>
        {dates.length > 1 && (
            <View style={{width: 30, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{width: 1, height: 30, backgroundColor: 'black'}} />
            </View>
        )}
        {dates.length > 1 && <Text style={{color: 'black'}}>{getDateString(dates[1])}</Text>}
        {dates.length > 2 && (
            <View style={{width: 30, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{width: 1, height: 30, backgroundColor: 'black'}} />
            </View>
        )}
        {dates.length > 2 && <Text style={{color: 'black'}}>{getDateString(dates[2])}</Text>}
    </View>
);

const LocationSummary = ({ locationName }) => (
    <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: 'rgb(231, 231, 231)'}}>
        <Image style={{width: 35, height: 35, marginLeft: 10, marginRight: 10}} source={images.map_icon} />
        <Text style={{color: 'black'}}>{locationName}</Text>
    </View>
);

const SummaryView = ({ eventName, screenWidth, dates, locationName }) => (
    <View style={{ marginTop: 10 }}>
        <EventBanner eventName={eventName} screenWidth={screenWidth} />
        <DateTimeSummary dates={dates} />
        <LocationSummary locationName={locationName} />
    </View>
);

export default class SummaryTabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: SummaryTabIds.summaryPage
        }
    }

    render() {
        const screenWidth = Dimensions.get('window').width;
        const eventName = 'NCIS \'11 Reunion Dinner';
        const eventDates = [new Date(2016, 9, 10, 6, 15),
            new Date(2016, 9, 12, 7, 30),
            new Date(2016, 10, 16, 15, 0)];
        const locationName = 'NUS - IDC';

        const summaryViewProps = {
            screenWidth,
            eventName,
            locationName,
            dates: eventDates,
        };

        let currentTabView = null;

        switch (this.state.currentTab) {
            case SummaryTabIds.commonAvailability:
                currentTabView = <DateTimePickerPage hideNav/>;
                break;
            case SummaryTabIds.mapPage:
                currentTabView = <MapPage hideNav/>;
                break;
            case SummaryTabIds.summaryPage:
                currentTabView = <SummaryView {...summaryViewProps}/>;
                break;
        }

        return (
            <View style={styles.tabsContainer}>
                <TopBar centerImage={images.my_event} />
                <TabBar leftImage={images.inactive_calendar_tab} leftActiveImage={images.calendar_icon} leftTabId={SummaryTabIds.commonAvailability} leftActiveBackground="white"
                        centerImage={images.inactive_location_tab} centerActiveImage={images.map_icon} centerTabId={SummaryTabIds.mapPage} centerActiveBackground="white"
                        rightImage={images.inactive_summary_tab} rightActiveImage={images.summary_icon} rightTabId={SummaryTabIds.summaryPage} rightActiveBackground="white"
                        pressHandler={(tabId) => this.setState({currentTab: tabId})} tabsBackgroundColor={'rgb(231,231,231)'}
                        currentTab={this.state.currentTab} imageSize={40}/>
                <View style={{flex: 1}}>
                    {currentTabView}
                </View>
            </View>
        )
    }
}