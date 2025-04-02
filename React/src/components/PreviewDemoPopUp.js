import React from 'react';
import { View, StyleSheet, Image, Modal, TouchableOpacity, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Paragraph from './Paragraph';
import { theme } from '../core/theme';

const { width } = Dimensions.get('window');

const carouselData = [
    { id: '1', image: require('../assets/slider_1.jpeg'), description: 'Track your expenses with ease' },
    { id: '2', image: require('../assets/slider_2.jpeg'), description: 'Set savings goals and monitor progress' },
    { id: '3', image: require('../assets/slider_3.jpeg'), description: 'Get insights on your spending patterns' },
];

const PreviewDemoPopUp = ({ visible, onClose }) => {
    const renderItem = ({ item }) => (
        <View style={styles.carouselItem}>
            <Image source={item.image} style={styles.carouselImage} />
            <Paragraph>{item.description}</Paragraph>
        </View>
    );

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Carousel
                        data={carouselData}
                        renderItem={renderItem}
                        sliderWidth={width * 0.9}
                        itemWidth={width * 0.8}
                        layout={'default'}
                    />
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Paragraph>Close</Paragraph>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    carouselItem: {
        alignItems: 'center',
    },
    carouselImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: theme.colors.primary,
        borderRadius: 5,
    },
});

export default PreviewDemoPopUp;
