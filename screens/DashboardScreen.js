import React, {Component} from 'react';
import{
    View,
    Text,
    StyleSheet
} from 'react-native';

class Dashboard extends Component{
    render(){
        return(
            <View style={styles.container}>
                <Text>BISH,You is INNNNNNN</Text>
            </View>
        )
    }
}

export default Dashboard

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent: 'center'
    }
})