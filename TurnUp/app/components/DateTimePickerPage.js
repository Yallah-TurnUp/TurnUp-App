/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    ListView,
    Dimensions,
    Image,
    TouchableOpacity,
    LayoutAnimation,
    UIManager,
    Platform,
} from 'react-native';
import * as firebase from 'firebase';
import { TopBar } from './TabsPage.js';
import images from '../config/images.js';

export const BottomButtons = ({leftImage, rightImage, leftHandler, rightHandler, leftAspect, rightAspect}) => (
    <View style={{backgroundColor: 'white', height: 55, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <TouchableOpacity onPress={leftHandler}>
            <Image style={{height: 30, width: 30 * (leftAspect || 3.68), marginLeft: 30}} source={leftImage} />
        </TouchableOpacity>
        <TouchableOpacity onPress={rightHandler}>
            <Image style={{height: 30, width: 30 * (rightAspect || 3.68), marginRight: 30}} source={rightImage} />
        </TouchableOpacity>
    </View>
);

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

// Snapping list (for picker)

const SnappingCellView = ({cellWidth, content, selected}) => (
    <View width={cellWidth} style={{justifyContent: 'center', alignItems: 'center'}} >
        <Text textAlign='center' style={{flex: 0,
            fontSize: 18,
            fontWeight: selected ? 'bold' : 'normal',
            color: selected ? 'rgb(62,138,193)' : 'black'}}>{content}</Text>
    </View>
);

class SnappingListView extends Component {
    static preFillWithPadding(data, numberOfEmptyCells) {
        const emptyCellData = [];
        for (let i = 0; i < numberOfEmptyCells; i++) {
            emptyCellData.push({
                content: '',
                selected: false,
            });
        }
        return emptyCellData.concat(data).concat(emptyCellData);
    }

    constructor(props) {
        super(props);

        this.onScrollFinish = this.onScrollFinish.bind(this);
        this.itemPositionFromScrollViewOffset = this.itemPositionFromScrollViewOffset.bind(this);
        this.offsetToItemCenterFromItemPosition = this.offsetToItemCenterFromItemPosition.bind(this);
        this.populateDataWithSelectedInformation = this.populateDataWithSelectedInformation.bind(this);

        const ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        const initialSelectedPosition = this.props.initialPosition;
        this.state = {
            dataSource: ds.cloneWithRows(this.populateDataWithSelectedInformation(initialSelectedPosition, this.props.data)),
            selectedItem: initialSelectedPosition,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data.length === this.props.data.length) return;
        const selectedPosition = (nextProps.data.map(data => data.content).indexOf(this.props.data[this.state.selectedItem].content) === -1)
            ? nextProps.data.length - 3
            : this.state.selectedItem;
        this.setState({
           dataSource: this.state.dataSource.cloneWithRows(this.populateDataWithSelectedInformation(selectedPosition, nextProps.data)),
           selectedItem: selectedPosition,
        }, () => {
            this.listView.scrollTo({
                x: this.offsetToItemCenterFromItemPosition(selectedPosition),
                animated: false,
            });
        });
    }

    populateDataWithSelectedInformation(selectedPosition, data) {
        return data.map((dataPiece, index) => ({
            ...dataPiece,
            selected: index === selectedPosition,
        }));
    }

    itemPositionFromScrollViewOffset(offset) {
        return Math.floor((offset + this.props.snapPosition) / this.props.cellWidth);
    }

    offsetToItemCenterFromItemPosition(itemPosition) {
        return (itemPosition * this.props.cellWidth) + (this.props.cellWidth / 2) - this.props.snapPosition;
    }

    onScrollFinish(event) {
        const itemPosition = this.itemPositionFromScrollViewOffset(event.nativeEvent.contentOffset.x);
        this.listView.scrollTo({
            x: this.offsetToItemCenterFromItemPosition(itemPosition),
            animated: true,
        });
        this.props.selectedItem(this.props.data[itemPosition]);
        this.setState({
            selectedItem: itemPosition,
            dataSource: this.state.dataSource.cloneWithRows(this.populateDataWithSelectedInformation(itemPosition, this.props.data)),
        });
    }

    componentDidMount() {
        setTimeout(() => {
            this.listView.scrollTo({
                x: this.offsetToItemCenterFromItemPosition(this.props.initialPosition),
                animated: false,
            });
        }, 0);
    }

    render() {
        return (
            <ListView
                ref={(listView) => { this.listView = listView; }}
                style={{width: this.props.pickerWidth}}
                renderRow={rowData => (
                    <SnappingCellView
                        cellWidth={this.props.cellWidth}
                        content={rowData.content}
                        selected={rowData.selected} />
                )}
                horizontal
                initialListSize={this.props.data.length < 35 ? this.props.data.length : 35} // more than 31 because we need to load the padding too
                showsHorizontalScrollIndicator={false}
                dataSource={this.state.dataSource}
                onMomentumScrollEnd={this.onScrollFinish}
            />
        );
    }
}

// Deletable list (for dates)

const DeletableListCell = ({ text, onPress, rowID }) => (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, paddingBottom: 8}}>
        <View style={{width: 20}}/>
        <Text textAlign='center' style={{fontSize: 18}}>{text}</Text>
        <TouchableOpacity onPress={() => onPress(rowID)}>
            <Image style={{width: 20, height: 20}} source={images.clear_date_time} />
        </TouchableOpacity>
    </View>
);

class DeletableListView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ListView enableEmptySections
                contentContainerStyle={{width: 300}}
                renderRow={(rowData, _, rowID) => <DeletableListCell text={rowData} onPress={this.props.onPress} rowID={rowID}/>}
                renderSeparator={(_, rowID) => (rowID !== (this.props.data.length - 1).toString()) && <View key={rowID} style={{width: 300, alignItems: 'center'}}><View style={{height: 0.75, width: 150, backgroundColor: 'rgb(253,191,45)'}} /></View>}
                showsVerticalScrollIndicator={false}
                dataSource={new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}).cloneWithRows(this.props.data)}
            />
        );
    }
}

// What to show

const EventDates = ({selectedDates, onDelete}) => (
    <View style={{alignItems: 'center', flex: 1}}>
        <Image style={{height: 40, width: 213, marginBottom: 15}} source={images.chosen_timings_label} />
        <DeletableListView data={selectedDates} onPress={onDelete} />
    </View>
);

const CurrentProgress = () => (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: -40}}>
        <Text style={{fontSize: 20, color: 'rgb(239,142,36)', marginBottom: 20}}>Almost there!</Text>
        <Image style={{height: 50, width: 380}} source={images.progress_common_availability} />
    </View>
);

// Picker

const DateTimePicker = ({pickerWidth, cellWidth, offset, selectedDate, onAdd,
    monthsRow, daysRow, hoursRow, minsRow,
    onMonthSelect, onDaySelect, onHourSelect, onMinuteSelect}) => (
    <View style={{flex: 0, alignItems: 'stretch', overflow: 'visible', backgroundColor: 'white'}}>
        <Text style={{marginLeft: 5, marginTop: 3, fontSize: 15}}>PICK A DATE</Text>
        <View style={{height: 40, backgroundColor: 'rgb(241,241,241)', marginTop: 1}}>
            <SnappingListView
                pickerWidth={pickerWidth}
                cellWidth={cellWidth}
                snapPosition={pickerWidth / 2}
                data={monthsRow}
                selectedItem={onMonthSelect}
                initialPosition={offset} />
        </View>
        <View style={{height: 40, backgroundColor: 'rgb(241,241,241)', marginTop: 3}}>
            <SnappingListView
                pickerWidth={pickerWidth}
                cellWidth={cellWidth}
                snapPosition={pickerWidth / 2}
                data={daysRow}
                selectedItem={onDaySelect}
                initialPosition={selectedDate.day + offset - 1} />
        </View>
        <Text style={{marginLeft: 5, marginTop: 3, fontSize: 15}}>SELECT TIME</Text>
        <View style={{height: 40, backgroundColor: 'rgb(241,241,241)', marginTop: 1}}>
            <SnappingListView
                pickerWidth={pickerWidth}
                cellWidth={cellWidth}
                snapPosition={pickerWidth / 2}
                data={hoursRow}
                selectedItem={onHourSelect}
                initialPosition={selectedDate.hour + offset} />
        </View>
        <View style={{height: 40, backgroundColor: 'rgb(241,241,241)', marginTop: 3}}>
            <SnappingListView
                pickerWidth={pickerWidth}
                cellWidth={cellWidth}
                snapPosition={pickerWidth / 2}
                data={minsRow}
                selectedItem={onMinuteSelect}
                initialPosition={Math.floor(selectedDate.minute / 5) + offset} />
        </View>
        <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center', height: 80, marginTop: 5}}>
            <View style={{flex: 1, height: 40}} />
            <View style={{flex: 1, backgroundColor: 'rgb(241,241,241)', height: 41}} />
            <View style={{flex: 1, position: 'absolute', top: 0, left: (pickerWidth - 80) / 2, backgroundColor: 'white', height: 80, width: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity onPress={onAdd}>
                    <Image style={{height: 55, width: 55}} source={images.datetimeplus} />
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

// The meat

export default class DateTimePickerPage extends Component {
    constructor(props) {
        super(props);

        this.onDelete = this.onDelete.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.getSelectedDates = this.getSelectedDates.bind(this);
        this.onMonthSelect = this.onMonthSelect.bind(this);
        this.onDaySelect = this.onDaySelect.bind(this);
        this.onHourSelect = this.onHourSelect.bind(this);
        this.onMinuteSelect = this.onMinuteSelect.bind(this);
        this.navigateToMapPage = this.navigateToMapPage.bind(this);

        const now = new Date();
        this.state = {
            dates: [],
            selectedDate: {
                month: now.getMonth(),
                year: now.getFullYear(),
                day: now.getDate(),
                hour: now.getHours(),
                minute: Math.floor(now.getMinutes() / 5) * 5,
            }
        };

        if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    getMonths() {
        const currMonth = new Date();
        const months = [];
        currMonth.setDate(1);
        for (let i = 0; i < 100; i++) {
            months.push(new Date(currMonth.getTime()));
            currMonth.setMonth(currMonth.getMonth() + 1);
        }
        return SnappingListView.preFillWithPadding(months.map(month => ({
            content: monthNames[month.getMonth()] + month.getFullYear().toString().slice(-2),
            month: month.getMonth(),
            year: month.getFullYear(),
        })), 2);
    }

    getDays(monthDays) {
        const days = [];
        for (let i = 1; i <= monthDays; i++) days.push(i);
        return SnappingListView.preFillWithPadding(days.map(day => ({
            content: day,
            day: day,
        })), 2);
    }

    getHours() {
        const hours= [];
        for (let i = 0; i < 24; i++) hours.push(i);
        return SnappingListView.preFillWithPadding(hours.map(hour => ({
            content: hour,
            hour: hour,
        })), 2);
    }

    getMins() {
        const mins = [];
        for (let i = 0; i < 60; i = i + 5) mins.push({
            content: ('0' + i).slice(-2),
            minute: i,
        });
        return SnappingListView.preFillWithPadding(mins, 2);
    }

    getSelectedDates() {
        return this.state.dates.map(date => date.dateString);
    }

    onMonthSelect({ month, year }) {
        this.setState({selectedDate: { ...this.state.selectedDate, month, year }});
    }

    onDaySelect({ day }) {
        this.setState({selectedDate: { ...this.state.selectedDate, day }});
    }

    onHourSelect({ hour }) {
        this.setState({selectedDate: { ...this.state.selectedDate, hour }});
    }

    onMinuteSelect({ minute }) {
        this.setState({selectedDate: {...this.state.selectedDate, minute }});
    }

    onDelete(deletedRowID) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({
            dates: this.state.dates.filter((_, index) => index.toString() !== deletedRowID),
        });
    }

    onAdd() {
        const {year, month, day, hour, minute} = this.state.selectedDate;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const newDates = this.state.dates.concat([{
            actualDate: new Date(year, month, day, hour, minute),
            dateString: `${day} ${monthNames[month]} ${('0' + hour).slice(-2)}:${('0' + minute).slice(-2)}`,
        }]).sort((a, b) => a.actualDate.getTime() - b.actualDate.getTime());
        this.setState({ dates: newDates });
        console.log(new Date(year, month, day, hour, minute));
    }

    navigateToMapPage() {
        const eventBlob = { dates: this.state.dates };
        const payload = {};
        payload[`/events/${this.props.eventKey}`] = eventBlob;
        firebase.database().ref().update(payload);
        this.props.navigator.push({id: 17, eventBlob, eventKey: this.props.eventKey});
    }

    render() {
        const cellCount = 5;
        const pickerWidth = Dimensions.get('window').width;
        const cellWidth = pickerWidth / cellCount;
        const offset = Math.floor(cellCount / 2);

        const { year, month } = this.state.selectedDate;
        const currMonth = new Date(year, month, 1);
        const monthDays = new Date(currMonth.getYear(), currMonth.getMonth() + 1, 0).getDate();

        const monthsRow = this.getMonths();
        const daysRow = this.getDays(monthDays);
        const hoursRow = this.getHours();
        const minsRow = this.getMins();

        return (
            <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'rgb(241,241,241)'}}>
                {!this.props.hideNav && <TopBar centerImage={images.my_event} />}
                <DateTimePicker
                    pickerWidth={pickerWidth} cellWidth={cellWidth} offset={offset} selectedDate={this.state.selectedDate} onAdd={this.onAdd}
                    monthsRow={monthsRow} daysRow={daysRow} hoursRow={hoursRow} minsRow={minsRow}
                    onMonthSelect={this.onMonthSelect} onDaySelect={this.onDaySelect} onHourSelect={this.onHourSelect} onMinuteSelect={this.onMinuteSelect} />
                <View style={{flex: 1, backgroundColor: 'rgb(241,241,241)', padding: 10, alignItems: 'center'}}>
                    {this.state.dates.length > 0 || this.props.hideNav
                        ? <EventDates selectedDates={this.getSelectedDates()} onDelete={this.onDelete} />
                        : <CurrentProgress/>}
                </View>
                {!this.props.hideNav && <BottomButtons
                    leftImage={images.creation_back} leftHandler={this.props.navigator.pop}
                    rightImage={images.creation_next} rightHandler={this.navigateToMapPage} />}
            </View>
        );
    }
}
