import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput,TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated'
import * as Animatable from 'react-native-animatable'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'






const { width, height } = Dimensions.get('window')



export default class TryOut2 extends React.Component {
    constructor(props){
        super(props)
    }
    render(){


    return (

        <View style={styles.container}>
            <View style={styles.header}>
                <Animatable.Image
                    animation='bounceInDown'
                    duration={2000}
                    resizeMode='center'
                    source={require('../assets/images/Intro.png')}
                    style={{ ...styles.image, ...styles.lower1, width: 500, height: 500 }}
                />
                <Animatable.Image
                    animation='bounceIn'
                    duration={10500}
                    resizeMode='center'
                    source={require('../assets/images/WheresDogGo.png')}
                    style={{ ...styles.image, ...styles.lower2, width: 500, height: 500 }}
                />
            </View>
            <View style={styles.header}>
                <Animatable.Image source={require('../assets/images/corgi.gif')} style={{ width: 300, height: 290 }} />
            </View>


            <Animatable.View
                style={styles.footer}
                animation='fadeInUpBig'
                duration={2500}
            >
                <Text style={styles.text_header}>Email</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="user-o"
                        color="blue"
                        size={20}
                    />
                    <TextInput
                        placeholder='Your email...'
                        style={styles.textInput}
                    />
                    <Feather
                        name="check-circle"
                        color="green"
                        size={20}
                    />

                </View>

                <Text style={{ ...styles.text_header, marginTop: 8 }}>Password</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="user-o"
                        color="blue"
                        size={20}
                    />
                    <TextInput
                        placeholder='Your password...'
                        style={styles.textInput}
                    />
                    <Feather
                        name="eye-off"
                        color="green"
                        size={20}
                    />

                </View>

                <TouchableOpacity style={{ alignSelf: "center", marginTop: 8 }}>
                    <View style={{
                        width: 100, height: 30, backgroundColor: 'pink', borderTopLeftRadius: 30,
                        borderTopRightRadius: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30
                    }}>
                        <Text style={{ fontSize: 15, textAlign: 'center', margin: '5%' }}>
                            Log In
                    </Text></View>
                </TouchableOpacity>


                <View style={{ ...styles.action2, marginTop: 15 }}>
                    <FontAwesome
                        name="google"
                        color="blue"
                        size={20}
                    />
                    <Text style={{ ...styles.text_header, marginLeft: 10 }}>Log In With Google</Text></View>

 
                    <TouchableOpacity style={{ alignSelf: "center", marginTop: 15 }} onPress={() => this.props.navigation.navigate('Register')}>
          <Text style={{ fontSize: 18 }}>
            New to Where's DogGo? <Text style={{ fontWeight: "500", color: "blue" }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>



            </Animatable.View>








        </View>

    );

}
}


const styles = StyleSheet.create({
    container: {
        flex: 2,
        // justifyContent: 'center',
        // alignItems: 'center',
        // alignContent: 'center',
        backgroundColor: '#CCDFE8'

    },
    header: {
        flex: 1.4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lower1: {
        top: -170,
        flex: 1,
        width: 50,
        height: 50,
        resizeMode: 'contain'
    },
    lower2: {
        top: -100,
        flex: 1,
        width: 50,
        height: 50,
        resizeMode: 'contain'
    },
    footer: {
        flex: 1.6,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 40
    },
    image: {
        height: 50,
        position: 'absolute',
        width: 160
    },
    text_header: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 15
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        paddingBottom: 5
    },
    action2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        paddingLeft: 10,
        color: 'pink'
    }
});