import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height, width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

export default function LandingScreen({ navigation }) {
  const [pan] = useState(new Animated.ValueXY());
  const [gradientAnimation] = useState(new Animated.Value(0));

  // Animate the gradient
  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(gradientAnimation, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: false,
        }),
        Animated.timing(gradientAnimation, {
          toValue: 0,
          duration: 15000,
          useNativeDriver: false,
        })
      ]).start(() => animate());
    };

    animate();
  }, []);

  const interpolatedColors = {
    start: gradientAnimation.interpolate({
      inputRange: [0, 0.33, 0.66, 1],
      outputRange: ['#4A0B50', '#2A0B3C', '#090D2C', '#4A0B50']
    }),
    middle: gradientAnimation.interpolate({
      inputRange: [0, 0.33, 0.66, 1],
      outputRange: ['#090D2C', '#4A0B50', '#2A0B3C', '#090D2C']
    }),
    end: gradientAnimation.interpolate({
      inputRange: [0, 0.33, 0.66, 1],
      outputRange: ['#2A0B3C', '#090D2C', '#4A0B50', '#2A0B3C']
    })
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      if (gesture.dy < 0) {
        pan.setValue({ x: 0, y: gesture.dy });
      }
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy < -SWIPE_THRESHOLD) {
        Animated.timing(pan, {
          toValue: { x: 0, y: -height },
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          navigation.replace('Today');
        });
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const animatedStyle = {
    transform: pan.getTranslateTransform(),
  };

  const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

  return (
    <Animated.View 
      style={[styles.container, animatedStyle]} 
      {...panResponder.panHandlers}
    >
      <AnimatedGradient
        colors={[
          interpolatedColors.start,
          interpolatedColors.middle,
          interpolatedColors.end
        ]}
        style={styles.gradient}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        locations={[0.2, 0.5, 0.8]}
      >
        <View style={styles.content}>
          <Text style={styles.title}>MINDSET</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>by APEX</Text>
          </View>
          <Text style={styles.quote}>"Change your life with move..."</Text>
          <View style={styles.swipeIndicator}>
            <Text style={styles.swipeText}>Swipe up to begin</Text>
          </View>
        </View>
      </AnimatedGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 2,
    marginBottom: 10,
  },
  subtitleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 40,
    backdropFilter: 'blur(10px)',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
  },
  quote: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.7,
    fontStyle: 'italic',
    position: 'absolute',
    bottom: 100,
  },
  swipeIndicator: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  swipeText: {
    color: '#FFF',
    opacity: 0.6,
    fontSize: 14,
  },
}); 