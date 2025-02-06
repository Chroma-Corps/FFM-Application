import { StyleSheet, View, ImageBackground, Dimensions, Image } from 'react-native'
import Animated, { Extrapolation, interpolate, useSharedValue, useAnimatedStyle } from 'react-native-reanimated'
import React from 'react'
const OFFSET = 20
const ITEM_WIDTH = Dimensions.get('window').width - OFFSET * 2
const ITEM_HEIGHT = 420

const data = [
    {
        "src": require('../assets/slider_1.jpeg'),
        "alt": "Image01 "
    },
    {
        "src": require('../assets/slider_2.jpeg'),
        "alt": "Image02 "
    },
    {
        "src": require('../assets/slider_3.jpeg'),
        "alt": "Image03 "
    }
];

const CarouselCard = ({ item, id, scrollX, total }) => {

    const margin = id === 0 ? OFFSET : undefined;
    const marginRight = total - 1 === id ? OFFSET : undefined;

    const inputRange = [
        (id - 1) * ITEM_WIDTH,
        id * ITEM_WIDTH,
        (id + 1) * ITEM_WIDTH,
    ]

    const translateStyle = useAnimatedStyle(() => {
        const trasnlate = interpolate(
            scrollX.value,
            inputRange,
            [0.97, 0.97, 0.97],
            Extrapolation.CLAMP
        )

        const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.6, 1, 0.6],
            Extrapolation.CLAMP,
        )

        return {
            transform: [{ scale: trasnlate }], opacity
        }
    })

    const translateImageStyle = useAnimatedStyle(() => {
        const trasnlate = interpolate(
            scrollX.value,
            inputRange,
            [ITEM_WIDTH * 0.2, 0, ITEM_WIDTH * 0.4],
        )


        return {
            transform: [{ translateX: trasnlate }]
        }
    })

    return (

        <Animated.View style={[translateImageStyle]}>

            <Animated.View style={[styles.caroselCardView, { margin, marginRight }]}>
                <ImageBackground source={item.src} style={styles.imageBackgroundStyle}>
                    <View style={styles.imageBackgroundView}>
                        <Image source={item.scr} style={styles.cardImage} />
                    </View>
                </ImageBackground>

            </Animated.View>
        </Animated.View>
    )
}


const CarouselAnimation = () => {

    const scrollX = useSharedValue(0);

    return (
        <View style={styles.carouselView}>
            <Animated.ScrollView
                horizontal
                decelerationRate={'fast'}
                snapToAlignment='ITEM_WIDTH'
                disableIntervalMomentum
                onScroll={event => { event.nativeEvent.contentOffset.x }}
                scrollEventThrottle={12}>

                {data.map((item, index) => (
                    <CarouselCard
                        item={item}
                        key={index}
                        id={index}
                        scrollX={scrollX}
                        total={data.length} />
                ))}
            </Animated.ScrollView>
        </View>
    )
}


export default function Carousel() {
    return (
        <View >
            <CarouselAnimation />
        </View>
    )
}

const styles = StyleSheet.create({

    carouselView: {
        paddingVertical: 50,
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        overflow: 'hidden',
        borderRadius: 14,
    },

    imageBackgroundStyle: {
        resizeMode: 'cover',
        borderRadius: 14,
        width: '100%',
        height: '100%',
        overflow: 'hidden',

    },

    caroselCardView: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
    },

    imageBackgroundView: {
        paddingHorizontal: 15,
        paddingVertical: 25,
        flex: 1,
        justifyContent: 'flex-end',
        gap: 4
    },

    cardImage: {
        height: 30,
        width: 30
    }
});