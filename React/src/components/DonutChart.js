import React from 'react';
import { View, Text, Animated, TextInput, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';


const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedInput = Animated.createAnimatedComponent(TextInput);

export default function DonutChart({ 
    currentAmount, 
    targetAmount,
    radius,
    strokeWidth,
    duration,
    color,
    textColor,
    delay,
 }) 
 {
    const progress = targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 100; // Cap at 100%
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const halfCircle = radius + strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const circleRef = React.useRef();
    const inputRef = React.useRef();
    const animation = (toValue) => {
        return Animated.timing(animatedValue, {
            toValue, 
            duration, 
            delay,
            useNativeDriver: true
        }).start();
    };

    React.useEffect(() =>{
        animation(progress);
                
        animatedValue.addListener(v => {
            if (circleRef?.current) {
                const strokeDashoffset = circumference - (progress / 100) * circumference;
                circleRef.current.setNativeProps({
                    strokeDashoffset,
                });
            }

            if (inputRef?.current) {
                inputRef.current.setNativeProps({
                    text: `${Math.round(progress)}`,
                })
            }
        });


        return () => {
            animatedValue.removeAllListeners();
        };
    }, [progress])

    return (
        <View>
            <Svg 
                width={radius * 2} 
                height={radius * 2} 
                viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
                <G rotation='-90' origin={`${halfCircle}, ${halfCircle}`}>
                <Circle
                        cx='50%'
                        cy='50%'
                        stroke={color}
                        strokeWidth={strokeWidth}
                        r={radius}
                        fill="transparent"
                        strokeOpacity={0.2}
                    />
                    <AnimatedCircle 
                        ref={circleRef}
                        cx='50%'
                        cy='50%'
                        stroke={color}
                        strokeWidth={strokeWidth}
                        r={radius}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference}
                        strokeLinecap='round'
                    />
                </G>
            </Svg>
            <AnimatedInput
                ref={inputRef}
                underlineColorAndroid="transparent"
                editable= {false}
                defaultValue="0"
                style={[
                    StyleSheet.absoluteFillObject,
                    { fontSize: radius / 2, color: textColor ?? color },
                    { fontWeight: '900', textAlign: 'center' },
                ]}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentageText: {
        position: 'absolute',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    amountText: {
        fontSize: 14,
        color: '#fff',
        marginTop: 5,
    },
});