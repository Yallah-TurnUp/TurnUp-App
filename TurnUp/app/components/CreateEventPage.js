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
import * as firebase from 'firebase';
import styles from '../config/styles.js';
import images from '../config/images.js';

import { TopBar } from './TabsPage.js';

const ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});

const activityIds = {
    beer: "beer",
    music: "music",
    book: "book",
    sports: "sports"
};

const ImageListViewProps = {
    renderRow: (rowData) => <ImageListView
        leftImageTapped={rowData.leftImageTapped}
        rightImageTapped={rowData.rightImageTapped}
        name_1={rowData.imgBeer1}
        name_2={rowData.imgBeer2}
        activity={rowData.activity}
        highlightLeft={rowData.shouldHighlightLeftImage}
        highlightRight={rowData.shouldHighlightRightImage}
        index={rowData.index}
    />,
    showsVerticalScrollIndicator: false,
};

class ImageListView extends Component {
    render() {
        return (
            <View backgroundColor="transparent"
                style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
                    marginTop: 10, marginBottom: 10}}>
                <TouchableOpacity style={{width: 140, height: 140, marginRight: -15}}
                                  onPress={() => this.props.leftImageTapped(this.props.index, this.props.activity)}>
                    <Image source={images[this.props.name_1]} style={{width: 140, height: 140, opacity: this.props.highlightLeft ? 0.5 : 1}}/>
                </TouchableOpacity>
                <TouchableOpacity style={{width: 140, height: 140, marginLeft: -15}}
                                  onPress={() => this.props.rightImageTapped(this.props.index, this.props.activity)}>
                    <Image source={images[this.props.name_2]} style={{width: 140, height: 140, opacity: this.props.highlightRight ? 0.5 : 1}}/>
                </TouchableOpacity>
            </View>
        )
    }
}

export default class CreateEventPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedType: activityIds.beer,
            dataSource: ds.cloneWithRows(this._imageList({
                activity: activityIds.beer,
                index: -1,
                side: "right"
            })),
        };
    }

    _beerImages() {
        var imgBeer_1= ['beer_1', 'beer_5','beer_3','beer_4','beer_2'];
        var imgBeer_2= ['beer_7', 'beer_8','beer_9','beer_10','beer_6'];
        var photoNames = [];
        for (let i = 0; i < imgBeer_1.length; i++) {
            photoNames[i] = {
                imgBeer1: imgBeer_1[i],
                imgBeer2: imgBeer_2[i],
            };
        }
        return photoNames;
    }

    _bookImages() {
        var imgBook_1= ['book_1'];
        var imgBook_2= ['book_2'];
        var photoNames = [];
        for (let i = 0; i < imgBook_1.length; i++) {
            photoNames[i] = {
                imgBeer1: imgBook_1[i],
                imgBeer2: imgBook_2[i],
            };
        }
        return photoNames;
    }

    _musicImages() {
        var imgMusic_1= ['music_1'];
        var imgMusic_2= ['music_2'];
        var photoNames = [];
        for (let i = 0; i < imgMusic_1.length; i++) {
            photoNames[i] = {
                imgBeer1: imgMusic_1[i],
                imgBeer2: imgMusic_2[i],
            };
        }
        return photoNames;
    }

    _sportsImages() {
        var imgSport_1= ['sports_1_logo'];
        var imgSport_2= ['sports_3_logo'];
        var photoNames = [];
        for (let i = 0; i < imgSport_1.length; i++) {
            photoNames[i] = {
                imgBeer1: imgSport_1[i],
                imgBeer2: imgSport_2[i],
            };
        }
        return photoNames;
    }

    _leftImageTapped(index, activity) {
        console.log({
            activity: activity,
            index: index,
            side: "left"
        });
        this.setState({
            selectedIndexAndSide: {
                activity: activity,
                index: index,
                side: "left"
            },
            dataSource: ds.cloneWithRows(this._imageList({
                activity: activity,
                index: index,
                side: "left"
            }))
        });
    }

    _rightImageTapped(index, activity) {
        console.log({
            activity: activity,
            index: index,
            side: "right"
        });
        this.setState({
            selectedIndexAndSide: {
                activity: activity,
                index: index,
                side: "right"
            },
            dataSource: ds.cloneWithRows(this._imageList({
                activity: activity,
                index: index,
                side: "right"
            }))
        });
    }

    _imageList(selectedIndexAndSide) {
        var images = [];
        var selectedType = selectedIndexAndSide.activity;
        console.log(selectedType);
        if (selectedType === activityIds.beer) {
            images = this._beerImages();
        } else if (selectedType === activityIds.book) {
            images = this._bookImages();
        } else if (selectedType === activityIds.music) {
            images = this._musicImages();
        } else if (selectedType === activityIds.sports) {
            images = this._sportsImages();
        }

        for (let i = 0; i < images.length; i++) {
            images[i].leftImageTapped = this._leftImageTapped.bind(this);
            images[i].rightImageTapped = this._rightImageTapped.bind(this);
            images[i].activity = selectedType;
            images[i].index = i;
            images[i].shouldHighlightLeftImage =
                selectedIndexAndSide.activity === selectedType
                && selectedIndexAndSide.index === i
                && selectedIndexAndSide.side === "left";
            images[i].shouldHighlightRightImage =
                selectedIndexAndSide.activity === selectedType
                && selectedIndexAndSide.index === i
                && selectedIndexAndSide.side === "right";
        }

        return images;
    }

    _popSelf() {
        this.props.navigator.pop();
    }

    _navigateToEnrichment() {
        const eventKey = firebase.database().ref().child('events').push().key;
        this.props.navigator.push({id: 16, eventKey});
    }

    _setSelectedType(selectedType) {
        this.setState({
            selectedType: selectedType,
            dataSource: ds.cloneWithRows(this._imageList({
                activity: selectedType,
                index: -1,
                side: "left"
            }))
        });
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'stretch',
                backgroundColor: '#e6e6e6'}}>
                <TopBar leftButton={images.back} leftButtonHandler={() => this._popSelf()}
                        centerImage={images.my_event}
                        rightButton={images.forward} rightButtonHandler={() => this._navigateToEnrichment()}/>
                <View style={styles.eventTypeSelector}>
                    <TouchableOpacity style={{width: 80, height: 80}}
                                      onPress={() => this._setSelectedType(activityIds.beer)}>
                        <Image source={images.beer_logo} style={{width: 80, height: 80}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: 80, height: 80}}
                                      onPress={() => this._setSelectedType(activityIds.music)}>
                        <Image source={images.guitar_logo} style={{width: 80, height: 80}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: 80, height: 80}}
                                      onPress={() => this._setSelectedType(activityIds.book)}>
                        <Image source={images.book_logo} style={{width: 80, height: 80}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: 80, height: 80}}
                                      onPress={() => this._setSelectedType(activityIds.sports)}>
                        <Image source={images.basketball_logo} style={{width: 80, height: 80}}/>
                    </TouchableOpacity>
                </View>
                <View style={{backgroundColor:'white', flex: 1, alignItems: 'stretch'}}>
                    <ListView {...ImageListViewProps} dataSource={this.state.dataSource} />
                </View>
            </View>
        )
    }
}
