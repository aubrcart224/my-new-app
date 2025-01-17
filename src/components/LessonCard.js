import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LessonCard({ lesson, onPress, onComplete, isLocked, isCompleted }) {
  const pan = useRef(new Animated.ValueXY()).current;
  const [showCheck, setShowCheck] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => !isLocked && !isCompleted,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx < 0) {
          pan.x.setValue(gesture.dx);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -100) {
          Animated.timing(pan.x, {
            toValue: -80,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            setShowCheck(true);
            onComplete(lesson.id);
          });
        } else {
          Animated.spring(pan.x, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const cardStyle = {
    transform: pan.getTranslateTransform(),
    opacity: pan.x.interpolate({
      inputRange: [-100, 0],
      outputRange: [0.5, 1],
    }),
  };

  return (
    <View style={styles.container}>
      {isCompleted && (
        <View style={styles.completedIndicator}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        </View>
      )}
      <Animated.View
        style={[styles.card, cardStyle, isLocked && styles.lockedCard]}
        {...(isLocked ? {} : panResponder.panHandlers)}
      >
        <Image source={{ uri: lesson.imageUrl }} style={styles.image} />
        <View style={styles.details}>
          <Text style={[styles.title, isLocked && styles.lockedText]}>
            {lesson.title}
          </Text>
          <Text style={[styles.subtitle, isLocked && styles.lockedText]}>
            {lesson.duration} • {lesson.type}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.playButton, isLocked && styles.lockedButton]}
          onPress={() => !isLocked && onPress(lesson)}
          disabled={isLocked}
        >
          <Ionicons
            name={isCompleted ? "checkmark" : "play"}
            size={20}
            color={isLocked ? "#999" : "#fff"}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    position: 'relative',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedCard: {
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
  },
  subtitle: {
    color: '#666',
    marginTop: 5,
    fontSize: 13,
  },
  lockedText: {
    color: '#999',
  },
  playButton: {
    width: 36,
    height: 36,
    backgroundColor: '#000',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedButton: {
    backgroundColor: '#ddd',
  },
  completedIndicator: {
    position: 'absolute',
    left: -40,
    top: '50%',
    marginTop: -12,
    zIndex: 1,
  },
});
