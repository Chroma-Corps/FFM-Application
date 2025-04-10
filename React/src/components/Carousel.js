import { StyleSheet, View, ImageBackground, Dimensions, Text } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    interpolateColor,
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler
} from 'react-native-reanimated';
import React, { useRef, useEffect, useState, useCallback } from 'react';

const OFFSET = 20;
const ITEM_WIDTH = Dimensions.get('window').width - OFFSET * 3;
const ITEM_HEIGHT = 300;
const AUTO_SCROLL_INTERVAL = 4000;

const data = [
    {
        "src": require('../assets/slider_1.jpeg'),
        "alt": "Image01"
    },
    {
        "src": require('../assets/slider_2.jpeg'),
        "alt": "Image02"
    },
    {
        "src": require('../assets/slider_3.jpeg'),
        "alt": "Image03"
    }
];

const PaginationDot = ({ index, scrollX }) => {
    const inputRange = [
        (index - 1) * ITEM_WIDTH,
        index * ITEM_WIDTH,
        (index + 1) * ITEM_WIDTH,
    ];

    const animatedDotStyle = useAnimatedStyle(() => {
        const widthAnimation = interpolate(
            scrollX.value,
            inputRange,
            [10, 20, 10],
            Extrapolation.CLAMP
        );
        const opacityAnimation = interpolate(
            scrollX.value,
            inputRange,
            [0.5, 1, 0.5],
            Extrapolation.CLAMP
        );
        return {
            width: widthAnimation,
            opacity: opacityAnimation
        };
    });

    const animatedDotColour = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            scrollX.value,
            data.map((_, i) => i * ITEM_WIDTH),
            data.map(() => '#48A6A7')
        );
        return { backgroundColor };
    });

    return <Animated.View style={[styles.dot, animatedDotStyle, animatedDotColour]} />;
};

const CarouselCard = ({ item, id, scrollX, total }) => {
    const style = {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        marginLeft: id === 0 ? OFFSET : 0,
        marginRight: id === total - 1 ? OFFSET : 0,
        overflow: 'hidden',
        borderRadius: 14,
    };

    const inputRange = [
        (id - 1) * ITEM_WIDTH,
        id * ITEM_WIDTH,
        (id + 1) * ITEM_WIDTH,
    ];

    const scaleStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            scrollX.value,
            inputRange,
            [0.9, 1, 0.9],
            Extrapolation.CLAMP
        );
        const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.7, 1, 0.7],
            Extrapolation.CLAMP,
        )
        return {
            transform: [{ scale }],
            opacity: opacity
        };
    });

    const imageTranslateStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            scrollX.value,
            inputRange,
            [ITEM_WIDTH * 0.3, 0, -ITEM_WIDTH * 0.3],
            Extrapolation.CLAMP
        );
        return {
            transform: [{ translateX }],
        };
    });

    return (
        <Animated.View style={[style, scaleStyle]}>
            <Animated.View style={[styles.imageParallaxWrapper, imageTranslateStyle]}>
                <ImageBackground
                    source={item.src}
                    style={styles.imageBackgroundStyle}
                    resizeMode='cover'
                >
                </ImageBackground>
            </Animated.View>
        </Animated.View>
    );
};


const CarouselCardPagination = ({ data, scrollX }) => {
    return (
        <View style={styles.paginationContainer}>
            {data.map((_, index) => {
                return <PaginationDot index={index} scrollX={scrollX} key={`dot-${index}`} />;
            })}
        </View>
    );
};

const CarouselAnimation = () => {
    const scrollX = useSharedValue(0);
    const scrollViewRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const intervalRef = useRef(null);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });


    const scrollTo = useCallback((index, animated = true) => {
        setActiveIndex(index);
        scrollViewRef.current?.scrollTo({
            x: index * ITEM_WIDTH,
            animated: animated,
        });
    }, []);

    const startAutoScroll = useCallback(() => {
        if (intervalRef.current) return;

        intervalRef.current = setInterval(() => {
            setActiveIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % data.length;
                scrollTo(nextIndex);
                return nextIndex;
            });
        }, AUTO_SCROLL_INTERVAL);
    }, [scrollTo]);

    const stopAutoScroll = useCallback(() => {

        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }, []);

    useEffect(() => {
        startAutoScroll();
        return () => stopAutoScroll();
    }, [startAutoScroll, stopAutoScroll]);

    const handleScrollBeginDrag = () => {
        stopAutoScroll();
    };

    const handleScrollEndDrag = () => {
        setTimeout(startAutoScroll, AUTO_SCROLL_INTERVAL * 1.5);
    };


    return (
        <View style={styles.container}>
            <Animated.ScrollView
                ref={scrollViewRef}
                horizontal
                decelerationRate="fast"
                snapToInterval={ITEM_WIDTH}
                snapToAlignment="center"
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                onScrollBeginDrag={handleScrollBeginDrag}
                onScrollEndDrag={handleScrollEndDrag}
                contentContainerStyle={styles.scrollViewContent}
                style={styles.scrollView}
            >
                {data.map((item, id) => (
                    <CarouselCard
                        item={item}
                        key={`card-${id}`}
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
    container: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 15,
    },
    scrollViewContent: {
        alignItems: 'center',
    },
    imageParallaxWrapper: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
    },

    imageBackgroundStyle: {
        width: '100%',
        height: '100%',
    },

    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginHorizontal: 8,
        backgroundColor: '#CCCCCC',
    },
});