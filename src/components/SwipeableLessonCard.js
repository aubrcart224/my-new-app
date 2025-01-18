import React, { useRef, useState, useEffect } from 'react';
import { 
  Animated, 
  PanResponder, 
  StyleSheet, 
  View, 
  Text, 
  Image,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SWIPE_THRESHOLD = -100;
const MAX_SWIPE_DISTANCE = -120;
const ANIMATION_CONFIG = {
  stiffness: 1000,
  damping: 500,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

export default function SwipeableLessonCard({ 
  lesson, 
  onComplete, 
  onUncomplete,
  isCompleted,
  isLocked
}) {
  const [isDarkMode, setIsDarkMode] = useState(isCompleted);
  const pan = useRef(new Animated.ValueXY()).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isTriggered, setIsTriggered] = useState(false);

  useEffect(() => {
    setIsDarkMode(isCompleted);
  }, [isCompleted]);

  const resetCard = () => {
    Animated.parallel([
      Animated.spring(pan.x, {
        toValue: 0,
        useNativeDriver: true,
        ...ANIMATION_CONFIG
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        ...ANIMATION_CONFIG
      })
    ]).start(() => {
      setIsTriggered(false);
    });
  };

  const triggerCompletion = () => {
    if (!isTriggered) {
      setIsTriggered(true);
      if (isCompleted) {
        onUncomplete(lesson.id);
      } else {
        onComplete(lesson.id);
      }
      resetCard();
    }
  };
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isLocked,
      onMoveShouldSetPanResponder: (_, gesture) => {
        return !isLocked && Math.abs(gesture.dx) > Math.abs(gesture.dy);
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: 0
        });
        pan.setValue({ x: 0, y: 0 });
        setIsTriggered(false);
        Animated.spring(scaleAnim, {
          toValue: 0.98,
          useNativeDriver: true,
          ...ANIMATION_CONFIG
        }).start();
      },
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx < 0) {
          // Limit the drag distance with resistance
          const x = Math.max(gesture.dx, MAX_SWIPE_DISTANCE);
          pan.x.setValue(x);

          // Trigger completion when reaching threshold
          if (x <= SWIPE_THRESHOLD && !isTriggered) {
            triggerCompletion();
          }
        }
      },
      onPanResponderRelease: () => {
        resetCard();
      },
      onPanResponderTerminate: resetCard
    })
  ).current;

  const cardStyle = {
    transform: [
      ...pan.getTranslateTransform(),
      { scale: scaleAnim }
    ]
  };

  const progressStyle = {
    transform: [{
      translateX: pan.x.interpolate({
        inputRange: [MAX_SWIPE_DISTANCE, 0],
        outputRange: [0, 50],
        extrapolate: 'clamp'
      })
    }]
  };

  return (
    <View style={styles.container}>
      {/* Progress indicator */}
      <Animated.View 
        style={[
          styles.progressContainer, 
          progressStyle,
          { backgroundColor: isCompleted ? '#666' : '#4CAF50' }
        ]}
      >
        <View style={styles.progressContent}>
          <Ionicons 
            name={isCompleted ? "close" : "checkmark"} 
            size={24} 
            color="#fff" 
          />
        </View>
      </Animated.View>
      
      {/* Main card */}
      <Animated.View 
        style={[
          styles.card,
          { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' },
          cardStyle,
          isLocked && styles.lockedCard
        ]} 
        {...(isLocked ? {} : panResponder.panHandlers)}
      >
        <Image 
          source={{ uri: lesson.imageUrl }} 
          style={styles.image}
        />
        <View style={styles.content}>
          <Text style={[
            styles.title, 
            { color: isDarkMode ? '#ffffff' : '#000000' }
          ]}>
            {lesson.title}
          </Text>
          <View style={styles.durationContainer}>
            <Ionicons 
              name="time-outline" 
              size={14} 
              color={isDarkMode ? '#fff' : '#666'} 
            />
            <Text style={[
              styles.duration, 
              { color: isDarkMode ? '#ffffff' : '#000000' }
            ]}>
              {lesson.duration || 'Daily Goal'}
            </Text>
          </View>
        </View>
        <View style={styles.actionButton}>
          <Ionicons 
            name={isLocked ? "lock-closed" : (isCompleted ? "refresh-circle" : "play-circle")} 
            size={isLocked ? 24 : 32} 
            color={isLocked ? "#999" : (isDarkMode ? '#fff' : '#000')} 
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    height: 90,
    position: 'relative',
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    zIndex: 1,
  },
  progressContent: {
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  lockedCard: {
    opacity: 0.5,
  },
  image: {
    width: 66,
    height: 66,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 14,
    marginLeft: 4,
  },
  actionButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

