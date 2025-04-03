import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { theme } from '../core/theme';

const Slider = ({ data, width, height }) => {
    return (
        <Carousel
            loop
            width={width}
            height={height}
            autoPlay
            autoPlayInterval={5000}
            data={data}
            renderItem={({ item }) => (
                <View style={[styles.slide, { width: width, height: height }]}>
                    <Image source={item.image} style={[styles.image, { height: height * 0.75 }]} />
                    <View style={styles.footer}>
                        <Text style={styles.text}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    slide: {
        borderColor: 'black',
        borderWidth: 3,
        borderRadius: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow: 'hidden',
    },

    image: {
        width: '100%',
        borderRadius: 10,
    },

    footer: {
        width: '100%',
        height: '25%',
        backgroundColor: '#1C1C1C',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },

    text: {
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },

    description: {
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 14,
        color: 'white',
        marginTop: 5,
    },
});

export default Slider;