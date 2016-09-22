/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    TextInput
} from 'react-native';
import styles from '../config/styles.js';
import images from '../config/images.js';

const loginCredentialsDefaultProps = {
    style: {flex: 1, fontSize: 16},
    underlineColorAndroid: "transparent"
};

class LoginCredentialsLine extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.loginCredentialLine}>
                <View style={styles.loginCredentialLeftPortion}>
                    <Image source={this.props.image} style={styles.loginCredentialPhoto}/>
                </View>
                <TextInput {...loginCredentialsDefaultProps}
                           value={this.props.field}
                           onChangeText={this.props.changeListener}
                           onFocus={this.props.focusListener}
                           onBlur={this.props.blurListener}
                           secureTextEntry={this.props.isPassword}
                />
            </View>
        )
    }
}

export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "your email address",
            password: "",
            hidePassword: false,
            displayedPassword: "password"
        }
    }

    _handlePress() {
        this.props.navigator.push({id: 2,});
    }

    _passwordFocusListener() {
        this.setState({
            displayedPassword: "",
            password: "",
            hidePassword: true
        })
    }

    _passwordBlurListener() {
        this.setState({
            displayedPassword: this.state.displayedPassword.length > 0 ? this.state.displayedPassword : "password",
            hidePassword: this.state.displayedPassword.length > 0
        })
    }

    render() {
        return (
            <View style={styles.loginScreen}>
                <Image source={images.trollface} style={styles.loginTurnup}/>
                <View style={styles.loginCredentials}>
                    <LoginCredentialsLine image={images.trollface} field={this.state.email}
                                          changeListener={(email) => this.setState({email: email})}
                                          focusListener={() => this.setState({email: ""})}/>
                    <LoginCredentialsLine image={images.trollface}  field={this.state.displayedPassword}
                                          changeListener={(password) => this.setState({displayedPassword: password, password: password})}
                                          focusListener={() => this._passwordFocusListener()}
                                          blurListener={() => this._passwordBlurListener()}
                                          isPassword={this.state.hidePassword}/>
                </View>
                <TouchableOpacity onPress={() => this._handlePress()}>
                    <View style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'black'}}>
                        <Text style={styles.welcome}>Sign in</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}
