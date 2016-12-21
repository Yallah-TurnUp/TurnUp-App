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
} from 'react-native';

import styles from '../config/styles.js';
import images from '../config/images.js';
import SignUpPage from './SignUpPage.js';
import * as firebase from 'firebase';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {GoogleSignin} from 'react-native-google-signin';


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

    componentWillMount() {
        this.props.firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.props.navigator.push({ id: 2 });
            }
        });
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
                });
                // No need to navigate, onAuthStateChanged callback does the job for us.
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

        const auth = firebase.auth();
        const provider = firebase.auth.FacebookAuthProvider;
        // Attempt a login using the Facebook login dialog asking for default permissions.
        LoginManager.logInWithReadPermissions(['public_profile'])
            .then(loginResult => {
                if (loginResult.isCancelled) alert('Login cancelled');
            })
            .catch(error => {
                console.log(error);
            });
    }

        /*AccessToken.getCurrentAccessToken()
            .then((accessTokenData) => {
                const credential = provider.getCredential(accessTokenData.accessToken);
                return auth.signInWithCredential(credential);
            })
            .then(credData => {
                console.log(credData);
                this.navigator.push({id:2});
                })
            .catch((err) => {
                console.log(error);
            });
        });}*/


    loginGoogle() {
        GoogleSignin.configure({
          offlineAccess: false
          //webClientId: '46    190653377-gibl6q1g44qa7uktkv07odc0lg569oul.apps.googleusercontent.com'
          })
        .then(()=> {

            });}
        /*GoogleSignin.signOut()
        .then(() => {
          console.log('out');
        })
        .catch((err) => {

        });

        GoogleSignin.signin()
            .then((user) => {
                console.log(user);
                this.firebase.auth().signInWithCredential(user.idToken)
                    .then(() => {
                        this.props.navigator.push({id:2});
                        })
                    .catch((error) => {
                        console.log(error);
                    });
                    })
                .catch((err) => {
                    console.log(err);
                    });
                }

        /*GoogleSignin.getAccessToken(user)
        .then((token) => {
          const credential = token;
          return firebase.auth().signInWithCustomToken(credential);
              })
        .then(() => {
          this.props.navigator.push({id:2});
          })
        .catch((err) => {
            console.log(err);
          });}*/

            /*.catch((error) => {
              switch(error.code){
                case "auth/account-exists-with-different-credential":
                  alert('alert1');
                  break;
                case "auth/invalid-credential":
                  alert('alert2');
                  break;
                case "auth/operation-not-allowed":
                  alert('alert3');
                  break;
                case "auth/user-disabled":
                  alert('alert4');
                  break;
                case "auth/user-not-found":
                  alert('alert5');
                  break;
                case "auth/wrong-password":
                  alert('alert6');
                  break;
                default:
                  alert('error');*/


    render() {
        return (
            <View style={styles.loginScreen}>
                <Image source={images.bird} style={styles.loginTurnupIcon}/>
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
                <TouchableOpacity onPress={this.login.bind(this)}>
                        <View style={styles.loginSignInButton}>
                            <Text style={styles.loginSignInButtonText}>Sign in</Text>
                        </View>
                </TouchableOpacity>


                </View>
                <View style={styles.loginBoxDivider}></View>

                <View style={styles.loginWithOthers}>
                    <TouchableOpacity onPress={this.loginFacebook.bind(this)}>
                            <View style={styles.loginWithFacebook}>
                                <Image source={images.facebook_login} style={styles.loginWithFacebookPhoto}/>
                                <Text style={styles.loginWithFacebookText}> Login with Facebook </Text>
                            </View>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.loginGoogle.bind(this)}>
                            <View style={styles.loginWithGoogle}>
                                <Image source={images.google_login} style={styles.loginWithGooglePhoto}/>
                                <Text style={styles.loginWithGoogleText}> Login with Google </Text>
                            </View>
                    </TouchableOpacity>

                </View>

                <View style={styles.LoginMiscellaneous}>
                    <Text style={styles.SignUpText}> Forgot Password ? </Text>
                     <TouchableOpacity onPress={this.signUp.bind(this)}>
                        <View><Text style={styles.SignUpTextItalics}>New here? Sign Up.</Text></View>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }
}
