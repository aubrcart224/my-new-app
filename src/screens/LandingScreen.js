import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';

const { height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

export default function LandingScreen({ navigation }) {
  const [pan] = useState(new Animated.ValueXY());

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      // Only allow upward movement
      if (gesture.dy < 0) {
        pan.setValue({ x: 0, y: gesture.dy });
      }
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy < -SWIPE_THRESHOLD) {
        // If swipe up passes threshold, navigate to TodayScreen
        Animated.timing(pan, {
          toValue: { x: 0, y: -height },
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          navigation.replace('Today');
        });
      } else {
        // Reset to original position
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

  return (
    <Animated.View 
      style={[styles.container, animatedStyle]} 
      {...panResponder.panHandlers}
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 40,
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