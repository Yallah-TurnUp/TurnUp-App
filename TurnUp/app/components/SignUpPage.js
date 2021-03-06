
import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    TextInput,
    ActivityIndicator,
} from 'react-native';

import styles from '../config/styles.js';
import images from '../config/images.js';


const SignUpCredentialsDefaultProps = {
    style: {flex: 1, fontSize: 16},
    underlineColorAndroid: "transparent"
};

class SignUpCredentialsLine extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.SignUpCredentialLine}>
                <View style={styles.SignUpCredentialLeftPortion}>
                    <Image source={this.props.image1} style={styles.SignUpCredentialPhoto1}/>
                    <Image source={this.props.image2} style={styles.SignUpCredentialPhoto2}/>
                </View>
                <TextInput {...SignUpCredentialsDefaultProps}
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


export default class SignUpPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            email: "your email address",
            password: "",
            hidePassword: false,
            displayedPassword: "password"
        }
    }

    componentWillMount() {
        this.props.firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.props.navigator.push({ id: 2 });
            }
        });
    }

    signup() {
        this.setState({
            loaded:false
        });

        this.props.firebase.auth().createUserWithEmailAndPassword(
            this.state.email,
            this.state.password,
        ).then(() => {
            alert('Your account was created!');
            this.setState({
                email:"",
                password:"",
                loaded:true
            });
            // No need to navigate, onAuthStateChanged callback does the job for us.
        }).catch((error) => {
            console.log(error.code);
            switch(error.code){
                case "auth/email-already-in-use":
                    alert(`The new user account cannot be created because ${this.state.email} is already in use.`);
                    break;
                case "auth/invalid-email":
                    alert(`${this.state.email} is not an email.`);
                    break;
                case "auth/weak-password":
                    alert("Choose a stronger password.");
                    break;
                default:
                    alert(`Error in creating ${this.state.email}`);
            }
        });
    }

    goToLogin(){
        this.props.navigator.pop();
    }

    
/*
    _handlePress() {
        this.props.navigator.push({id: 2,});
    }
*/

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
            <View style={styles.SignUpScreen}>
                <Image source={images.bird} style={styles.SignUpTurnup}/>
                <View style={styles.SignUpCredentials}>
                    <SignUpCredentialsLine image1={images.email} field={this.state.email}
                                          changeListener={(email) => this.setState({email: email})}
                                          focusListener={() => this.setState({email: ""})}/>
                    <View style={styles.SignUpCredentialsDivider}></View>
                    <SignUpCredentialsLine image2={images.password}  field={this.state.displayedPassword}
                                          changeListener={(password) => this.setState({displayedPassword: password, password: password})}
                                          focusListener={() => this._passwordFocusListener()}
                                          blurListener={() => this._passwordBlurListener()}
                                          isPassword={this.state.hidePassword}/>
                </View>
                <View>
                    <TouchableOpacity onPress={this.signup.bind(this)}>
                        <View style={styles.SignUpButton}>
                            <Text style={styles.SignUpButtonText}>Sign Up</Text>
                        </View>
                    </TouchableOpacity>
                    <ActivityIndicator animating={!this.state.loaded} size="large"/>
                </View>
            </View>
        )
    }
}
