import * as React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native'

export default function DogTile(props) {
    const { dog } = props
    // console.log('props in dogtile', dog.imageUrl);
    return(
        <View style={styles.container}>
            <Image style={styles.image} source={{ uri: dog.imageUrl }} />
            <Text>{dog.breed}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10
    },
    image: {
        // tintColor: 'gray',
        // opacity: 0.3,
        width: 150,
        height: 150
    }
})