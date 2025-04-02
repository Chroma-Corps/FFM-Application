import { StyleSheet, View, ImageBackground, Dimensions, Image } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    interpolateColor,
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler
} from 'react-native-reanimated';
import React from 'react';

const OFFSET = 20
const ITEM_WIDTH = Dimensions.get('window').width - OFFSET * 2
const ITEM_HEIGHT = 400
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

const PaginationDot = ({ index, scrollX }) => {
    const inputRange = [
        (index - 1) * ITEM_WIDTH,
        index * ITEM_WIDTH,
        (index + 1) * ITEM_WIDTH,
    ]

    const animatedDotStyle = useAnimatedStyle(() => {
        const widthAnimation = interpolate(
            scrollX.value,
            inputRange,
            [10, 20, 10],
            Extrapolation.CLAMP
        )
        const opacityAnimation = interpolate(
            scrollX.value,
            inputRange,
            [0.5, 1, 0.5],
            Extrapolation.CLAMP
        )
        return {
            width: widthAnimation,
            opacity: opacityAnimation
        }
    })

    const animatedDotColour = useAnimatedStyle(() => {
        const clampedScrollX = Math.max(0, Math.min(scrollX.value, ITEM_WIDTH * (data.length - 1)));
        const backgroundColor = interpolateColor(
            clampedScrollX,
            [0, ITEM_WIDTH, ITEM_WIDTH * (data.length - 1)],
            ['#48A6A7', '#48A6A7', '#48A6A7']
        )
        return { backgroundColor }
    })

    return <Animated.View style={[styles.dot, animatedDotStyle, animatedDotColour]} />
}

const CarouselCard = ({ item, id, scrollX, total }) => {
    const margin = id === 0 ? OFFSET : 0
    const marginRight = total - 1 === id ? OFFSET : 0
    const inputRange = [
        (id - 1) * ITEM_WIDTH,
        id * ITEM_WIDTH,
        (id + 1) * ITEM_WIDTH,
    ]
    const translateStyle = useAnimatedStyle(() => {
        const trasnlate = interpolate(
            scrollX.value,
            inputRange,
            [0.9, 1, 0.9],
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
        const clampedScrollX = Math.max(0, Math.min(scrollX.value, ITEM_WIDTH * (total - 1)));
        const trasnlate = interpolate(
            clampedScrollX,
            inputRange,
            [ITEM_WIDTH * 0.2, 0, ITEM_WIDTH * 0.4],
            Extrapolation.CLAMP
        )
        return {
            transform: [{ translateX: trasnlate }]
        }
    })
    return (
        <Animated.View
            style={[
                {
                    width: ITEM_WIDTH,
                    height: ITEM_HEIGHT,
                    marginLeft: id === 0 ? OFFSET : undefined,
                    marginRight: id === total - 1 ? OFFSET : undefined,
                    overflow: 'hidden',
                    borderRadius: 14,
                },
                translateStyle,
            ]}>
            <Animated.View style={[translateImageStyle]}>
                <Animated.View style={[styles.caroselCardView, { margin, marginRight }]}>
                    <ImageBackground source={item.src} style={styles.imageBackgroundStyle}>
                        <View style={styles.imageBackgroundView}>
                            <Image source={item.src} style={styles.cardImage} />
                        </View>
                    </ImageBackground>
                </Animated.View>
            </Animated.View>
        </Animated.View>
    )
}

const CarouselCardPagination = ({ data, scrollX }) => {
    return (
        <View style={styles.paginationContainer}>
            {data.map((item, index) => {
                return <PaginationDot index={index} scrollX={scrollX} key={index} />
            })}
        </View>
    )
}

const CarouselAnimation = () => {
    const scrollX = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    return (
        <View style={styles.carouselView}>
            <Animated.ScrollView
                horizontal
                decelerationRate="fast"
                snapToInterval={ITEM_WIDTH}
                snapToAlignment="center"
                onScroll={scrollHandler}
                scrollEventThrottle={12}
                showsHorizontalScrollIndicator={false}
            >
                {data.map((item, id) => (
                    <CarouselCard
                        item={item}
                        key={id}
                        id={id}
                        scrollX={scrollX}
                        total={data.length}
                    />
                ))}
            </Animated.ScrollView>
            <CarouselCardPagination data={data} scrollX={scrollX} />
        </View>
    );
};

export default function Carousel() {
    return (
        <View>
            <CarouselAnimation />
        </View>
    );
}

const styles = StyleSheet.create({
    carouselView: {
        paddingVertical: 15,
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        overflow: 'hidden',
    },

    imageBackgroundStyle: {
        resizeMode: 'contain',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },

    imageBackgroundView: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        flex: 1,
        justifyContent: 'flex-end',
        gap: 2
    },

    caroselCardView: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
    },
    cardImageView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    cardImage: {
        height: 20,
        width: 20
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },

    dot: {
        height: 10,
        marginHorizontal: 8,
        borderRadius: 5,
        backgroundColor: 'grey'
    }
});