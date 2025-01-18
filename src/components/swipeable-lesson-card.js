import React, { useRef, useState } from 'react'
import { Animated, PanResponder, Dimensions, StyleSheet, View, Text, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25

export default function SwipeableLessonCard({ lesson, onComplete, isCompleted }) {
  const [isDarkMode, setIsDarkMode] = useState(isCompleted)
  const position = useRef(new Animated.ValueXY()).current
  const swipeAnimation = useRef(new Animated.Value(0)).current
  const darkModeAnimation = useRef(new Animated.Value(isCompleted ? 1 : 0)).current

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isCompleted,
      onPanResponderMove: (_, gesture) => {
        if (!isCompleted) {
          position.setValue({ x: gesture.dx, y: 0 })
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          completeSwipe()
        } else {
          resetPosition()
        }
      },
    }),
  ).current

  const completeSwipe = () => {
    Animated.timing(swipeAnimation, {
      toValue: SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onComplete(lesson.id)
      setIsDarkMode(true)
      Animated.timing(darkModeAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start()
    })
  }

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    }).start()
  }

  const cardStyle = {
    transform: position.getTranslateTransform(),
    backgroundColor: darkModeAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['#ffffff', '#1a1a1a'],
    }),
  }

  const textStyle = {
    color: darkModeAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['#000000', '#ffffff'],
    }),
  }

  return (
    <Animated.View
      style={[styles.container, cardStyle]}
      {...(isCompleted ? {} : panResponder.panHandlers)}
    >
      <View style={styles.content}>
        <Image source={{ uri: lesson.imageUrl }} style={styles.image} />
        <View style={styles.details}>
          <Animated.Text style={[styles.title, textStyle]}>{lesson.title}</Animated.Text>
          <Animated.Text style={[styles.duration, textStyle]}>{lesson.duration}</Animated.Text>
        </View>
        <View style={styles.actionContainer}>
          {isCompleted ? (
            <Ionicons name="play-circle" size={32} color="#fff" />
          ) : (
            <View style={styles.completeIndicator}>
              <Ionicons name="checkmark" size={24} color="#4CAF50" />
            </View>
          )}
        </View>
      </View>
      {!isCompleted && (
        <View style={styles.swipeHint}>
          <Animated.Text style={styles.swipeText}>Swipe to complete</Animated.Text>
        </View>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    opacity: 0.7,
  },
  actionContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeHint: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  swipeText: {
    fontSize: 12,
    color: '#999999',
  },
})

