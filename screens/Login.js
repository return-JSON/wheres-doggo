import * as React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated'
import { TapGestureHandler, State } from 'react-native-gesture-handler'
import Svg, { Image, Circle, ClipPath } from 'react-native-svg'
import * as Animatable from 'react-native-animatable'
import * as Google from 'expo-google-app-auth';
import firebase from '../config/firebase';



const { width, height } = Dimensions.get('window')
const { Value, event, block, cond, eq, set, Clock, startClock, stopClock, debug, timing, clockRunning, interpolate, Extrapolate, concat } = Animated

function runTiming(clock, value, dest) {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0)
    };

    const config = {
        duration: 1000,
        toValue: new Value(0),
        easing: Easing.inOut(Easing.ease)
    };

    return block([
        cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest),
            startClock(clock)
        ]),
        timing(clock, state, config),
        cond(state.finished, debug('stop clock', stopClock(clock))),
        state.position
    ]);
}





export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errorMessage: null
        };
        this.buttonOpacity = new Value(1)
        this.onStateChange = event([
            {
                nativeEvent: ({ state }) => block([
                    cond(eq(state, State.END), set(this.buttonOpacity, runTiming(new Clock(), 1, 0)))
                ])
            }
        ])
        this.onCloseState = event([
            {
                nativeEvent: ({ state }) => block([
                    cond(eq(state, State.END), set(this.buttonOpacity, runTiming(new Clock(), 0, 1)))
                ])
            }
        ])

        this.buttonY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [100, 0],
            extrapolate: Extrapolate.CLAMP
        })
        this.bgY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [-height / 3 - 10, 0],
            extrapolate: Extrapolate.CLAMP
        })
        this.bgYX = interpolate(this.buttonOpacity, {
            inputRange: [0, 1.5],
            outputRange: [-height / 2 - 10, 0],
            extrapolate: Extrapolate.CLAMP
        })
        this.bgYXZ = interpolate(this.buttonOpacity, {
            inputRange: [0, 3],
            outputRange: [-height / 2- 50, 185],
            extrapolate: Extrapolate.CLAMP
        })

        this.textInputZindex = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [1, -1],
            extrapolate: Extrapolate.CLAMP
        })
        this.textInputY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [0, 100],
            extrapolate: Extrapolate.CLAMP
        })
        this.textInputOpacity = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP
        })
        this.rotateCross = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [0, 360],
            extrapolate: Extrapolate.CLAMP
        })


    }

    loginUser = () => {
        const { email, password } = this.state;
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(error => this.setState({ errorMessage: error.message }))
    };


    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (
                    providerData[i].providerId ===
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()
                ) {
                    return true;
                }
            }
        }
        return false;
    };

    onSignIn = googleUser => {
        console.log('Google Auth Response', googleUser);
        var unsubscribe = firebase.auth().onAuthStateChanged(
            function (firebaseUser) {
                unsubscribe();
                if (!this.isUserEqual(googleUser, firebaseUser)) {
                    var credential = firebase.auth.GoogleAuthProvider.credential(
                        googleUser.idToken,
                        googleUser.accessToken
                    );

                    firebase
                        .auth()
                        .signInWithCredential(credential)
                        .then(function (result) {
                            if (result.additionalUserInfo.isNewUser) {
                                firebase
                                    .firestore()
                                    .collection('users')
                                    .doc(result.user.uid)
                                    .set({
                                        email: result.user.email,
                                        profilePicture:
                                            result.additionalUserInfo.profile.picture,
                                        locale: result.additionalUserInfo.profile.locale,
                                        firstName: result.additionalUserInfo.profile.given_name,
                                        lastName: result.additionalUserInfo.profile.family_name,
                                        createdAt: Date.now()
                                    });
                            } else {
                                firebase
                                    .firestore()
                                    .collection('users')
                                    .doc(result.user.uid)
                                    .update({
                                        lastLoggedIn: Date.now()
                                    });
                            }
                        })
                        .catch(function (error) {
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            var email = error.email;
                            var credential = error.credential;
                        });
                } else {
                    console.log('User already signed-in Firebase.');
                }
            }.bind(this)
        );
    };

    signInWithGoogleAsync = async () => {
        try {
            const result = await Google.logInAsync({
                behavior: 'web',
                iosClientId:
                    '151112267540-hqsnr6j6h6g1lu7aoqpip2mdjqpkkvvi.apps.googleusercontent.com',
                scopes: ['profile', 'email']
            });
            if (result.type === 'success') {
                this.onSignIn(result);
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch (error) {
            return { error: true };
        }
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'flex-end' }}>


                <Animated.View style={{ ...StyleSheet.absoluteFill, transform: [{ translateY: this.bgY }] }}>
                    <Svg height={height + 50} width={width}>
                        <ClipPath id='clip'>
                            <Circle r={height + 50} cx={width / 2} />
                        </ClipPath>
                        <Image
                            href={require('../assets/images/corgilaying.jpg')}
                            width={width}
                            height={height + 50}
                            preserveAspectRatio='xMidYMid slice'
                            clipPath='url(#clip)'
                        />
                    </Svg>
                </Animated.View>



                <View style={{ ...styles.header }}>
                    <Animated.View style={{ transform: [{ translateY: this.bgYX }] }}>
                        <Animatable.Image
                            animation='bounceInDown'
                            duration={2000}
                            resizeMode='center'
                            source={require('../assets/images/Intro.png')}
                            style={{ ...styles.image, ...styles.lower1}}
                        />
                        </Animated.View>
                    <Animated.View style={{ transform: [{ translateY: this.bgYXZ }] }}>
                        <Animatable.Image
                            animation='bounceInDown'
                            duration={4000}
                            resizeMode='center'
                            source={require('../assets/images/WheresDogGo.png')}
                            style={{ ...styles.image, ...styles.lower2}}
                        />
                    </Animated.View>
                </View>
                <Animated.View style={{ opacity: this.buttonOpacity, transform: [{ translateY: this.buttonY }] }}>
                    <TouchableOpacity style={{ alignSelf: "center", marginTop: 32 }} onPress={() => this.props.navigation.navigate('Register')}>
                        <Text style={{ fontSize: 15 }}>
                            New to Where's DogGo? <Text style={{ fontWeight: "500", color: "blue" }}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </Animated.View>




                <View style={{ height: height / 4, justifyContent: 'center' }}>
                    <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                        <Animated.View style={{ ...styles.button, opacity: this.buttonOpacity, transform: [{ translateY: this.buttonY }] }}>
                            <Text>Sign In</Text>
                        </Animated.View>
                    </TapGestureHandler>

                    <TouchableOpacity onPress={() => this.signInWithGoogleAsync()}>
                        <Animated.View style={{ ...styles.button, opacity: this.buttonOpacity, transform: [{ translateY: this.buttonY }] }}>

                            <Text>Log In With Google</Text>

                        </Animated.View>
                    </TouchableOpacity>



                    <Animated.View style={{ zIndex: this.textInputZindex, opacity: this.textInputOpacity, transform: [{ translateY: this.textInputY }], height: height /3.5, ...StyleSheet.absoluteFill, top: null, justifyContent: 'center' }}>

                        <TapGestureHandler onHandlerStateChange={this.onCloseState}>
                            <Animated.View style={styles.closeButton}>
                                <Animated.Text style={{ fontSize: 15, transform: [{ rotate: concat(this.rotateCross, 'deg') }] }}>
                                    X
            </Animated.Text>
                            </Animated.View>
                        </TapGestureHandler>

                        <View style={styles.errorMessage}>
                            {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                        </View>
                    
                        <TextInput
                            placeholder="Email"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            placeholderTextColor='black'
                            autoCapitalize="none"
                            onChangeText={email => this.setState({ email })}
                            value={this.state.email}
                        />
                        <TextInput
                            placeholder="Password"
                            style={styles.textInput}
                            placeholderTextColor='black'
                            underlineColorAndroid="transparent"
                            secureTextEntry={true}
                            onChangeText={password => this.setState({ password })}
                            value={this.state.password}
                        />

                        <TouchableOpacity style={styles.button} onPress={this.loginUser}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Sign In</Text>

                        </TouchableOpacity>


                    </Animated.View>



                </View>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    header: {
        flex: 1.4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lower1: {
        resizeMode: 'contain'
    },
    lower2: {
        resizeMode: 'contain'
    },
    button: {
        backgroundColor: '#FFE066',
        height: 50,
        marginHorizontal: 20,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: "black",
        shadowOpacity: 0.2
    },
    textInput: {
        height: 40,
        borderRadius: 25,
        borderWidth: 2,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        borderColor: 'rgba(0,0,0,0.2)'
    },
    closeButton: {
        height: 40,
        width: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -20,
        left: width / 2 - 20,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: "black",
        shadowOpacity: 0.2
    },
    errorMessage: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20
      },
      error: {
        color: "green",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
      }
});