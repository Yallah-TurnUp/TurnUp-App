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

import { TopBar } from './TabsPage.js';

const ImageListViewProps = {
    renderRow: (rowData) => <ImageListView name_1={rowData.imgBeer1} name_2={rowData.imgBeer2}/>,
    showsVerticalScrollIndicator: false,
};

class ImageListView extends Component {
    render() {
        return (
            <View backgroundColor="transparent"
                style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
                    marginTop: 10, marginBottom: 10}}>
                <Image source={images[this.props.name_1]} style={{width: 140, height: 140, marginRight: -15}} />
                <Image source={images[this.props.name_2]} style={{width: 140, height: 140, marginLeft: -15}} />
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
                var imgBook_1= ['book_1']
                var imgBook_2= ['book_2']
                var imgMusic_1= ['music_1']
                var imgMusic_2= ['music_2']
                var imgSport_1= ['sports_1_logo', 'sport_2_logo']
                var imgSport_2= ['sports_3_logo']

                var photoNames = [];
                for (let i = 0; i < imgBeer_1.length; i++) {
                            photoNames[i] = {
                                imgBeer1: imgBeer_1[i],
                                imgBeer2: imgBeer_2[i],
                                imgBook1: imgBook_1[i],
                                imgBook2: imgBook_2[i],
                                imgMusic1: imgMusic_1[i],
                                imgMusic2: imgMusic_2[i],
                                imgSport1: imgSport_1[i],
                                imgSport2: imgSport_2[i]
                            };
                }
                return photoNames;
            }

    _popSelf() {
        this.props.navigator.pop();
    }

    _navigateToEnrichment() {
        this.props.navigator.push({id: 11});
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'stretch',
                backgroundColor: '#e6e6e6'}}>
                <TopBar leftButton={images.back} leftButtonHandler={() => this._popSelf()}
                        centerImage={images.turnup_title}
                        rightButton={images.forward} rightButtonHandler={() => this._navigateToEnrichment()}/>
                <View style={styles.eventTypeSelector}>
                    <Image source={images.beer_logo} style={{width: 80, height: 80}}/>
                    <Image source={images.guitar_logo} style={{width: 80, height: 80}}/>
                    <Image source={images.book_logo} style={{width: 80, height: 80}}/>
                    <Image source={images.basketball_logo} style={{width: 80, height: 80}}/>
                </View>
                <View style={{backgroundColor:'white', flex: 1, alignItems: 'stretch'}}>
                    <ListView {...ImageListViewProps} dataSource={this.state.dataSource} />
                </View>
                <TouchableOpacity onPress={() => this._handlePress()}>
                </TouchableOpacity>
            </View>
        )
    }
}
