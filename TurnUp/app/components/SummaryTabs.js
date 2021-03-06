import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    TextInput,
    ListView,
    Dimensions,
    ScrollView,
    Image,
    Alert,
} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import * as firebase from 'firebase';
import MapPage from './MapPage.js';
import DateTimePickerPage, { BottomButtons } from './DateTimePickerPage.js';
import styles from '../config/styles.js';
import images from '../config/images.js';
import getBannerName from '../utils/getBannerName.js';

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

const EventBanner = ({ eventName, screenWidth, imageSource }) => (
    <Image style={{width: screenWidth, height: screenWidth * 0.457 }} source={images[imageSource]}>
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

const EventNameEditor = ({ eventName, onEventNameChange }) => (
    <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: 'rgb(231, 231, 231)'}}>
        <Image style={{width: 35, height: 35, marginLeft: 10, marginRight: 10}} source={images.edit_label} />
        <TextInput
            placeholder="Give your event a name!"
            placeholderTextColor="grey"
            onChangeText={onEventNameChange}
            value={eventName}
            style={{color: 'black', flex: 1}} />
    </View>
);

const SummaryView = ({eventName, screenWidth, dates, locationName, onBack, onInvite, onEventNameChange, imageSource }) => (
    <View style={{justifyContent: 'space-between', flex: 1}}>
        <ScrollView contentContainerStyle={{marginTop: 10}}>
            <EventBanner eventName={eventName} screenWidth={screenWidth} imageSource={imageSource} />
            <DateTimeSummary dates={dates}/>
            {locationName && <LocationSummary locationName={locationName} />}
            <EventNameEditor eventName={eventName} onEventNameChange={onEventNameChange} />
        </ScrollView>
        <BottomButtons leftImage={images.creation_back} rightImage={images.creation_invite}
                       leftHandler={onBack} rightHandler={onInvite}/>
    </View>
);

export default class SummaryTabs extends Component {
    constructor(props) {
        super(props);

        this.onPop = this.onPop.bind(this);
        this.goToInvitePage = this.goToInvitePage.bind(this);
        this.onEventNameChange = this.onEventNameChange.bind(this);

        this.state = {
            currentTab: SummaryTabIds.summaryPage,
            eventName: null,
        }
    }

    componentWillMount() {
        firebase.database()
            .ref(`/events/${firebase.auth().currentUser.uid}/${this.props.eventKey}`)
            .child('locationText')
            .on('value', (newLocation) => {
                this.setState({ locationText: newLocation.val() })
            });
        firebase.database()
            .ref(`/events/${firebase.auth().currentUser.uid}/${this.props.eventKey}`)
            .child('dates')
            .on('value', (newDates) => {
                this.setState({ dates: newDates.val() || [] })
            });
        firebase.database()
            .ref(`/events/${firebase.auth().currentUser.uid}/${this.props.eventKey}`)
            .child('type')
            .on('value', (newEventType) => {
                this.setState({ eventType: newEventType.val() || [] })
            });
    }

    onPop() {
        this.props.navigator.pop();
    }

    goToInvitePage() {
        if (this.state.eventName && this.state.eventName.length > 0) {
            dismissKeyboard();
            firebase.database().ref().child(`events/${firebase.auth().currentUser.uid}/${this.props.eventKey}`).update({
                name: this.state.eventName,
            });
            this.props.navigator.push({ id: 14, eventKey: this.props.eventKey });
        } else {
            Alert.alert('Give your event a name!');
        }
    }

    onEventNameChange(eventName) {
        this.setState({ eventName });
    }

    render() {
        const screenWidth = Dimensions.get('window').width;

        const summaryViewProps = {
            screenWidth,
            eventName: this.state.eventName,
            locationName: this.state.locationText,
            dates: this.state.dates.map(({actualDate}) => new Date(Date.parse(actualDate))),
            onBack: this.onPop,
            onInvite: this.goToInvitePage,
            onEventNameChange: this.onEventNameChange,
            imageSource: getBannerName(this.state.eventType),
        };

        let currentTabView = null;

        switch (this.state.currentTab) {
            case SummaryTabIds.commonAvailability:
                currentTabView = <DateTimePickerPage hideNav eventKey={this.props.eventKey} />;
                break;
            case SummaryTabIds.mapPage:
                currentTabView = <MapPage hideNav eventKey={this.props.eventKey} />;
                break;
            case SummaryTabIds.summaryPage:
                currentTabView = <SummaryView {...summaryViewProps}/>;
                break;
        }

        return (
            <View style={styles.tabsContainer}>
                <TopBar centerImage={images.dashboard_label} />
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