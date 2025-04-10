import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { theme } from '../core/theme';

const Slider = ({ data, width, height }) => {

    return (
        <View style={[{ width: width, height: height }]}>
            <Carousel
                loop
                width={width}
                height={height}
                autoPlay
                autoPlayInterval={5000}
                data={data}
                scrollAnimationDuration={1000}
                renderItem={({ item }) => (
                    <View style={[{ width: width, height: height }]}>
                        <Image
                            source={item.image}
                            style={[{ height: height, width: width }]}
                            resizeMode="contain"
                        />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
});

export default Slider;