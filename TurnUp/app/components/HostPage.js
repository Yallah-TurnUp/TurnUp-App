/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    ListView,
    Dimensions
} from 'react-native';
import styles from '../config/styles.js';
import images from '../config/images.js';
const ImageListViewProps = {
    renderRow: (rowData) => <ImageListView name={rowData.eventLists}/>,
    showsVerticalScrollIndicator: false
};

class ImageListView extends Component {
    render() {
        var screenWidth = Dimensions.get('window').width;
        const cellWidth = (screenWidth * 0.9 ); // margin is on both sides
        return (
            <View backgroundColor="transparent" width={cellWidth} height={150}
                style={{justifyContent: 'space-between', alignItems: 'center'}}>
                <Image source={images[this.props.name]} style={{alignItems: 'stretch', width: cellWidth, height: 135}} />
            </View>
        )
    }
}

export default class HostPage extends Component {
    _handlePress() {
        this.props.navigator.push({id: 2,});
    }

    constructor(props) {
            super(props);
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.state = {
              dataSource: ds.cloneWithRows(this._imageList()),
              text: 'your favourite'
            };
        }

        _imageList() {
                // Thousands of apologies to the gods of computing
                var eventList= ['event_1', 'event_3'];
                var photoNames = [];
                for (let i = 0; i < eventList.length; i++) {
                            photoNames[i] = {
                                eventLists: eventList[i],
                            };
                }
                return photoNames;
            }

    render() {
        return (
            <View style={[styles.container, {backgroundColor: 'transparent'}]}>
                <View style={{flex: 1, backgroundColor:'transparent', alignItems: 'stretch', marginTop: 10}}>
                    <ListView {...ImageListViewProps} dataSource={this.state.dataSource} />
                </View>
            </View>
        )
    }
}
