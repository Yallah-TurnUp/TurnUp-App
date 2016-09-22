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

    loginCredentialPhoto: {
        width: 20,
        height: 20
    },

    loginSignInButton: {
        width: 112,
        height: 36,
        elevation: 1,
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


