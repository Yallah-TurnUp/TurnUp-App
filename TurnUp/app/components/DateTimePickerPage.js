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
} from 'react-native';
import images from '../config/images.js';

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
        const initialSelectedPosition = this.itemPositionFromScrollViewOffset(0);
        this.state = {
            dataSource: ds.cloneWithRows(this.populateDataWithSelectedInformation(initialSelectedPosition)),
            selectedItem: initialSelectedPosition,
        };
    }

    populateDataWithSelectedInformation(selectedPosition) {
        return this.props.data.map((data, index) => ({
            ...data,
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
            y: event.nativeEvent.contentOffset.y,
            animated: true,
        });
        this.setState({
            selectedItem: itemPosition,
            dataSource: this.state.dataSource.cloneWithRows(this.populateDataWithSelectedInformation(itemPosition)),
        });
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
                showsHorizontalScrollIndicator={false}
                dataSource={this.state.dataSource}
                onMomentumScrollEnd={this.onScrollFinish}
            />
        );
    }
}

const DeletableListCell = ({ text, onPress, rowID }) => (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, paddingBottom: 8}}>
        <View style={{width: 20}}/>
        <Text textAlign='center' style={{fontSize: 18}}>{text}</Text>
        <TouchableOpacity onPress={() => this.props.onPress(rowID)}>
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
            <ListView
                contentContainerStyle={{width: 300}}
                renderRow={(rowData, _, rowID) => <DeletableListCell text={rowData} onPress={this.props.onPress} rowID={rowID}/>}
                renderSeparator={(_, rowID) => (rowID !== (this.props.data.length - 1).toString()) && <View key={rowID} style={{width: 300, alignItems: 'center'}}><View style={{height: 0.75, width: 150, backgroundColor: 'rgb(253,191,45)'}} /></View>}
                showsVerticalScrollIndicator={false}
                dataSource={new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}).cloneWithRows(this.props.data)}
            />
        );
    }
}

export default class DateTimePickerPage extends Component {
    constructor(props) {
        super(props);

        this.onDelete = this.onDelete.bind(this);
        this.state = {
            dates: [],
        };
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
            content: monthNames[month.getMonth()] + month.getYear().toString().slice(-2),
        })), 2);
    }

    getDays(monthDays) {
        const days = [];
        for (let i = 1; i <= monthDays; i++) days.push(i);
        return SnappingListView.preFillWithPadding(days.map(day => ({
            content: day,
        })), 2);
    }

    getHours() {
        const hours= [];
        for (let i = 0; i < 24; i++) hours.push(i);
        return SnappingListView.preFillWithPadding(hours.map(hour => ({
            content: hour,
        })), 2);
    }

    getMins() {
        const mins = [];
        for (let i = 0; i <= 60; i = i + 5) mins.push(('0' + i).slice(-2));
        return SnappingListView.preFillWithPadding(mins.map(min => ({
            content: min,
        })), 2);
    }

    onDelete(rowID) {
        this.setState()
    }

    render() {
        const cellCount = 5;
        const pickerWidth = Dimensions.get('window').width;
        const cellWidth = pickerWidth / cellCount;

        const currMonth = new Date();
        currMonth.setDate(1);
        const monthDays = new Date(currMonth.getYear(), currMonth.getMonth() + 1, 0).getDate();

        const monthsRow = this.getMonths();
        const daysRow = this.getDays(monthDays);
        const hoursRow = this.getHours();
        const minsRow = this.getMins();

        const someDays = ['ONE', 'TWO', 'THREE'];

        return (
            <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'rgb(241,241,241)'}}>
                <View style={{flex: 0, alignItems: 'stretch', overflow: 'visible', backgroundColor: 'white'}}>
                    <Text style={{marginLeft: 5, marginTop: 3, fontSize: 15}}>PICK A DATE</Text>
                    <View style={{height: 40, backgroundColor: 'rgb(241,241,241)', marginTop: 1}}>
                        <SnappingListView
                            pickerWidth={pickerWidth}
                            cellWidth={cellWidth}
                            snapPosition={pickerWidth / 2}
                            data={monthsRow} />
                    </View>
                    <View style={{height: 40, backgroundColor: 'rgb(241,241,241)', marginTop: 3}}>
                        <SnappingListView
                            pickerWidth={pickerWidth}
                            cellWidth={cellWidth}
                            snapPosition={pickerWidth / 2}
                            data={daysRow} />
                    </View>
                    <Text style={{marginLeft: 5, marginTop: 3, fontSize: 15}}>SELECT TIME</Text>
                    <View style={{height: 40, backgroundColor: 'rgb(241,241,241)', marginTop: 1}}>
                        <SnappingListView
                            pickerWidth={pickerWidth}
                            cellWidth={cellWidth}
                            snapPosition={pickerWidth / 2}
                            data={hoursRow} />
                    </View>
                    <View style={{height: 40, backgroundColor: 'rgb(241,241,241)', marginTop: 3}}>
                        <SnappingListView
                            pickerWidth={pickerWidth}
                            cellWidth={cellWidth}
                            snapPosition={pickerWidth / 2}
                            data={minsRow} />
                    </View>
                    <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center', height: 80, marginTop: 5}}>
                        <View style={{flex: 1, height: 40}} />
                        <View style={{flex: 1, backgroundColor: 'rgb(241,241,241)', height: 41}} />
                        <View style={{flex: 1, position: 'absolute', top: 0, left: (pickerWidth - 80) / 2, backgroundColor: 'white', height: 80, width: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center'}}>
                            <TouchableOpacity>
                                <Image style={{height: 55, width: 55}} source={images.datetimeplus} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{flex: 1, backgroundColor: 'rgb(241,241,241)', padding: 10, alignItems: 'center'}}>
                    <Image style={{height: 40, width: 213, marginBottom: 15}} source={images.chosen_timings_label} />
                    <DeletableListView data={someDays} onPress={this.onDelete} />
                </View>
                <View style={{flex: 0, backgroundColor: 'white', height: 70, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity>
                        <Image style={{height: 30, width: 110.4, marginLeft: 30}} source={images.creation_back} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image style={{height: 30, width: 110.4, marginRight: 30}} source={images.creation_next} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
