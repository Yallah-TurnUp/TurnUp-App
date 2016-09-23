/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    // Boilerplate

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: 'white',
        fontFamily: 'SourceSansPro-Light'
    },

    // Actual designs


    // Generic stuff
    fullscreenContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'stretch',
        backgroundColor: 'white'
    },

    topBar: {
        height: 60,
        backgroundColor: '#F28500'
    },

    header: {
        flex: -1,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FF9800'
    },

    // Login

    loginScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F28500',
    },

    loginTurnup: {
        width: 170,
        height: 170
    },

    loginCredentials: {
        width: 280,
        height: 80,
        backgroundColor: 'rgba(255,255,255,0.63)',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 20
    },

    loginCredentialLine: {
        flex: 1,
        flexDirection: 'row'
    },

    loginCredentialLeftPortion: {
        flex: -1,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },

    loginCredentialPhoto1: {
        width: 30,
        height: 20
    },

    loginCredentialPhoto2:  {
        width: 20,
        height: 20
    },

    loginSignInButton: {
        width: 112,
        height: 36,
        elevation: 2,
        backgroundColor: '#FF9800',
        justifyContent: 'center'
    },

    loginSignInButtonText: {
        flex: 0,
        fontSize: 14,
        fontFamily: 'SourceSansPro-Light',
        color: 'white',
        textAlign: 'center'
    },

    // Information enrichment screen

    topContainer: {
        flex: -1,
        alignItems: 'stretch',
        backgroundColor: "#F28500"
    },

    topTabButtonsContainer: {
        height: 50,
        flexDirection: 'row'
    },

    tabBarButton: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },

    selectedTabBarButton: {
        flex: 1,
        backgroundColor: '#FF9800',
        alignItems: 'center',
        justifyContent: 'center'
    },

    dateTimeScroller: {
        height: 60
    },

    enrichmentNavigationButton: {
        flex: 0,
        flexDirection: 'row',
        height: 44,
        width: 152,
        marginLeft: 15,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF9800',
        borderRadius: 8,
    },

    enrichmentButtonText: {
        flex: 0,
        fontSize: 18,
        fontFamily: 'SourceSansPro-Light',
        color: 'white',
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 10,
    },

    enrichmentButtonImage: {
        flex: 0,
        width: 29,
        height: 29,
    },

    // CreateEvent

    eventTypeSelector: {
        flex: 1,
        height: 110,
        marginRight: 5,
        marginLeft: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
});


