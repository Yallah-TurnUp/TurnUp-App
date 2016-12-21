/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ListView,
    Dimensions,
    Image,
    AppRegistry,
    TextInput
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
                <Image source={images[this.props.name]} style={{width: cellWidth, height: 135}} />
            </View>
        )
    }
}

export default class ExplorePage extends Component {
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
                var eventList= ['event_1', 'event_2','event_4','event_3','event_2', 'event_1'];
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
            <View style={[styles.container, {backgroundColor: 'transparent', alignItems: 'stretch'}]}>
                <View style={{flexDirection: 'row', height:60, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#FF9800'}}>
                    <Image source={images.filter_logo} style={{height: 50, width: 50}}/>
                    <TextInput style={{flex:1, height: 60, borderColor: 'gray', borderWidth: 1, color: 'white', marginLeft: 10}}
                            onChangeText={(text) => this.setState({text})} value={this.state.text}/>
                </View>
                <View style={{backgroundColor:'white', flex: 2, alignItems: 'center', marginTop: 10}}>
                    <ListView {...ImageListViewProps} dataSource={this.state.dataSource} />
                </View>
            </View>
        )
    }
}
