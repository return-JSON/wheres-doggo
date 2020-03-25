import * as React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native'

export default function DogTile(props) {
    const { dog } = props
    console.log('props in dogtile', dog.imageUrl);
    return(
        <View>
            <Image style={styles.image} source={{ uri: dog.imageUrl }} />
            <Text>{dog.breed}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 50,
        height: 50
    }
})