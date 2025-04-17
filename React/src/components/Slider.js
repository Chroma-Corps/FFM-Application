import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { theme } from '../core/theme';

const Slider = ({ data, width, height }) => {

    const footerHeight = height * 0.20;
    const imageHeight = height - footerHeight;

    return (
        <View style={[styles.sliderContainer, { width: width, height: height }]}>
            <Carousel
                loop
                width={width}
                height={height}
                autoPlay
                autoPlayInterval={5000}
                data={data}
                scrollAnimationDuration={1000}
                renderItem={({ item }) => (
                    <View style={[styles.slide, { width: width, height: height }]}>
                        <Image
                            source={item.image}
                            style={[styles.image, { height: imageHeight, width: width }]}
                            resizeMode="cover"
                        />
                        <View style={[styles.footer, { height: footerHeight }]}>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>{item.title}</Text>
                            </View>

                            {item.description ? (
                                <Text style={styles.description}>{item.description}</Text>
                            ) : null}
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    sliderContainer: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 10,
        overflow: 'hidden',
    },

    slide: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: theme.colors.surface || '#252525',
    },

    footer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: theme.colors.primaryDimmed,
        position: 'relative',
    },

    textContainer: {
        backgroundColor: theme.colors.background,
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -25,
        zIndex: 1,
    },

    text: {
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 18,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },

    description: {
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 8,
    },
});

export default Slider;