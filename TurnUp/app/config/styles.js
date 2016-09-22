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
        fontFamily: 'SourceSansPro-Regular'
    },

    // Actual designs


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
        opacity: 0.63,
        backgroundColor: 'white'
    },

    loginCredentialLine: {
        flex: 1
    }
});