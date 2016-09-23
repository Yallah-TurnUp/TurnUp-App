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
    renderRow: (rowData) => <ImageListView name_1={rowData.imgBeer1} name_2={rowData.imgBeer2}/>,
    showsVerticalScrollIndicator: false
};

class ImageListView extends Component {
    render() {
        var screenWidth = Dimensions.get('window').width;
        const cellWidth = (screenWidth * 0.85 ); // margin is on both sides
        return (
            <View backgroundColor="white" width={cellWidth} height={160}
                style={{flex:2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Image source={images[this.props.name_1]} style={{width: 140, height: 140}} />
                <Image source={images[this.props.name_2]} style={{width: 140, height: 140}} />
            </View>
        )
    }
}

export default class CreateEventPage extends Component {
    _handlePress() {
        this.props.navigator.push({id: 2,});
    }
    constructor(props) {
            super(props);
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.state = {
              dataSource: ds.cloneWithRows(this._imageList())
            };
        }

        _imageList() {
                // Thousands of apologies to the gods of computing
                var imgBeer_1= ['beer_1', 'beer_5','beer_3','beer_4','beer_2'];
                var imgBeer_2= ['beer_7', 'beer_8','beer_9','beer_10','beer_6'];
                var photoNames = [];
                for (let i = 0; i < imgBeer_1.length; i++) {
                            photoNames[i] = {
                                imgBeer1: imgBeer_1[i],
                                imgBeer2: imgBeer_2[i]
                            };
                }
                return photoNames;
            }

    render() {
        return (
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#e6e6e6'}}>
                <View style={styles.header}>
                    <Image source={images.trollface} style={{width: 50, height: 50, marginLeft: 10}} />
                    <Image source={images.turnup_title} style={{height: 60, width:110}}/>
                    <Image source={images.host_logo} style={{width: 50, height: 50, marginRight: 10}} />
                </View>
                <View style={styles.eventTypeSelector}>
                    <Image source={images.beer_logo} style={{width: 80, height: 80}}/>
                    <Image source={images.guitar_logo} style={{width: 80, height: 80}}/>
                    <Image source={images.book_logo} style={{width: 80, height: 80}}/>
                    <Image source={images.basketball_logo} style={{width: 80, height: 80}}/>
                </View>
                <View style={{backgroundColor:'white', flex: 2, alignItems: 'center'}}>
                    <ListView {...ImageListViewProps} dataSource={this.state.dataSource} />
                </View>
                <View style={styles.footer}>
                    <Image source={images.hosted_logo} style={{width: 80, height: 80, marginLeft: 20}}/>
                    <Image source={images.explore_logo} style={{width: 80, height: 80}}/>
                    <Image source={images.surprise_logo} style={{width: 80, height: 80, marginRight: 20}}/>
                </View>
                <TouchableOpacity onPress={() => this._handlePress()}>
                </TouchableOpacity>
            </View>
        )
    }
}
