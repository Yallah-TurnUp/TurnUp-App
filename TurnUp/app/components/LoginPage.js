/**
 * Created by dat on 22/09/2016.
 */

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    TextInput,
    TouchableNativeFeedback
} from 'react-native';

import styles from '../config/styles.js';
import images from '../config/images.js';
import SignUpPage from './SignUpPage.js';
import * as firebase from 'firebase';
import FBSDK from 'react-native-fbsdk';

var provider = new firebase.auth.GoogleAuthProvider();

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
                    <Image source={this.props.image1} style={styles.loginCredentialPhoto1}/>
                    <Image source={this.props.image2} style={styles.loginCredentialPhoto2}/>
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

/*
    login(){
        this.setState({
            loaded:false
        });

        this.props.firebase.auth({
            "email":this.state.email,
            "password":this.state.password
        }, (error, user_data) => {
            this.setState({
                loaded:true
            });

            if(error){
                alert('Login Failed');
            }
            else{
                AsyncStorage.setItem('user_data', JSON.stringify(user_data));
                this.props.navigator.push({ id: 3 });
            }
        });
    }   */
}


export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "Email address",
            password: "",
            hidePassword: false,
            displayedPassword: "*******"
        }
    }

    /*_handlePress() {
        this.props.navigator.push({id: 2,});
    }*/

    _passwordFocusListener() {
        this.setState({
            displayedPassword: "",
            password: "",
            hidePassword: true
        })
    }

    _passwordBlurListener() {
        this.setState({
            displayedPassword: this.state.displayedPassword.length > 0 ? this.state.displayedPassword : "*******",
            hidePassword: this.state.displayedPassword.length > 0
        })
    }

    signUp(){
        this.props.navigator.push({id:0});
        }

    login() {
        this.setState({
            loaded:false
        });

        this.props.firebase.auth().signInWithEmailAndPassword(
            this.state.email,
            this.state.password,
            ).then(() => {
                this.setState({
                    email:"",
                    password:"",
                    loaded:true
                })
                this.props.navigator.push({id:2});
            }).catch((error) => {
                switch(error.code){
                    case "auth/invalid-email":
                        alert(`${this.state.email} is not a valid email.`);
                        break;
                    case "auth/wrong-password":
                        alert("You've entered the wrong password.");
                        break;
                    default:
                        alert("Error");
            }
        });
    }



    loginFacebook() {
        this.setState({
        loaded:false
        });
    // Attempt a login using the Facebook login dialog asking for default permissions.
    FBSDK.LoginManager.logInWithReadPermissions(['public_profile']
    ).then((result)=> {
        if (result.isCancelled) {
          alert('Login cancelled');
        } else {
          alert('Login success with permissions: '
            +result.grantedPermissions.toString());
        }
      this.props.navigator.push({id:2});
      }).catch((error) => {
        alert('Login fail with error:' + error);
      });
      }

    loginGoogle() {
        this.setState({
            loaded:false
        });
        provider.addScope('email');
        provider.addScope('user_friends');
        firebase.auth().signInWithRedirect(provider);

        firebase.auth().getRedirectResult().then(function(result) {
                     if (result.credential) {
                       // This gives you a Google Access Token. You can use it to access the Google API.
                       var token = result.credential.accessToken;
                       // ...
                     }
                     // The signed-in user info.
                     var user = result.user;
                   }).catch(function(error) {
                     // Handle Errors here.
                     var errorCode = error.code;
                     var errorMessage = error.message;
                     // The email of the user's account used.
                     var email = error.email;
                     // The firebase.auth.AuthCredential type that was used.
                     var credential = error.credential;
                     // ...
                   });



    }

    render() {
        return (
            <View style={styles.loginScreen}>
                <Image source={images.bird} style={styles.loginTurnup}/>
                <View style={styles.loginBox}>
                    <View style={styles.loginCredentials}>
                        <LoginCredentialsLine image1={images.email} field={this.state.email}
                                              changeListener={(email) => this.setState({email: email})}
                                              focusListener={() => this.setState({email: ""})}/>
                        <View style={styles.loginCredentialsDivider}></View>
                        <LoginCredentialsLine image2={images.password}  field={this.state.displayedPassword}
                                              changeListener={(password) => this.setState({displayedPassword: password, password: password})}
                                              focusListener={() => this._passwordFocusListener()}
                                              blurListener={() => this._passwordBlurListener()}
                                              isPassword={this.state.hidePassword}/>
                    </View>
                <TouchableNativeFeedback delayPressIn={0}
                    onPressOut={this.login.bind(this)}
                    background={TouchableNativeFeedback.Ripple('red')}>
                        <View style={styles.loginSignInButton}>
                            <Text style={styles.loginSignInButtonText}>Sign in</Text>
                        </View>
                </TouchableNativeFeedback>


                </View>
                <View style={styles.loginBoxDivider}></View>

                <View style={styles.loginWithOthers}>
                    <TouchableNativeFeedback delayPressIn={0}
                        onPressOut={this.loginFacebook.bind(this)}
                        background={TouchableNativeFeedback.Ripple('blue')}>
                            <View style={styles.loginWithFacebook}>
                                <Image source={images.facebook_login} style={styles.loginWithFacebookPhoto}/>
                                <Text style={styles.loginWithFacebookText}> Login with Facebook </Text>
                            </View>

                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback delayPressIn={0}
                        onPressOut={this.loginGoogle.bind(this)}
                        background={TouchableNativeFeedback.Ripple('red')}>
                            <View style={styles.loginWithGoogle}>
                                <Image source={images.google_login} style={styles.loginWithGooglePhoto}/>
                                <Text style={styles.loginWithGoogleText}> Login with Google </Text>
                            </View>
                    </TouchableNativeFeedback>

                </View>

                <View style={styles.LoginMiscellaneous}>
                    <Text style={styles.SignUpText}> Forgot Password ? </Text>
                     <TouchableNativeFeedback delayPressIn={0}
                                            onPressOut={this.signUp.bind(this)}>
                        <View><Text style={styles.SignUpTextItalics}>New here? Sign Up.</Text></View>
                    </TouchableNativeFeedback>

                </View>



            </View>
        )
    }
}
