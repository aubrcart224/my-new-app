import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

let Audio;
if (Platform.OS !== 'web') {
  Audio = require('expo-av').Audio;
}

export default function AudioPlayerModal({ visible, onClose, lesson }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (Platform.OS !== 'web' && sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadAudio = async () => {
    console.log('Loading Audio');
    try {
      setIsLoading(true);
      setError(null);
      
      if (Platform.OS === 'web') {
        const audio = new Audio(lesson.audioUrl);
        audio.onloadedmetadata = () => {
          setDuration(audio.duration * 1000);
          setIsLoading(false);
        };
        audio.onerror = (e) => {
          console.error('Audio loading error:', e);
          setError('Failed to load audio');
          setIsLoading(false);
        };
        audioRef.current = audio;
        setSound(audio);
      } else {
        const { sound: audioSound } = await Audio.Sound.createAsync(
          { uri: lesson.audioUrl },
          { shouldPlay: false },
          onPlaybackStatusUpdate
        );
        setSound(audioSound);
      }
    } catch (error) {
      console.error('Error loading audio:', error);
      setError(`Failed to load audio: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (visible && lesson?.audioUrl) {
      loadAudio();
    }
    return () => {
      if (Platform.OS === 'web' && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else if (sound) {
        sound.unloadAsync();
      }
    };
  }, [visible, lesson]);

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);
    } else if (status.error) {
      console.error(`Encountered a fatal error during playback: ${status.error}`);
      setError('An error occurred during playback');
    }
  };

  const playPause = async () => {
    if (Platform.OS === 'web' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    }
  };

  const seek = async (value) => {
    if (Platform.OS === 'web' && audioRef.current) {
      audioRef.current.currentTime = value / 1000;
    } else if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const skipForward = async () => {
    const newPosition = Math.min(position + 10000, duration);
    seek(newPosition);
  };

  const skipBackward = async () => {
    const newPosition = Math.max(position - 10000, 0);
    seek(newPosition);
  };

  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  useEffect(() => {
    if (Platform.OS === 'web' && audioRef.current) {
      const updatePosition = () => {
        setPosition(audioRef.current.currentTime * 1000);
      };
      audioRef.current.addEventListener('timeupdate', updatePosition);
      return () => audioRef.current.removeEventListener('timeupdate', updatePosition);
    }
  }, [audioRef.current]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="chevron-down" size={24} color="#000" />
          </TouchableOpacity>

          <Image
            source={{ uri: lesson?.imageUrl }}
            style={styles.lessonImage}
          />

          <Text style={styles.title}>{lesson?.title}</Text>
          <Text style={styles.subtitle}>{lesson?.subtitle}</Text>

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={styles.loadingText}>Loading audio...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.progressContainer}>
            <Slider
              style={styles.progressBar}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              onSlidingComplete={seek}
              minimumTrackTintColor="#000"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#000"
            />
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity onPress={skipBackward} style={styles.controlButton}>
              <Text style={styles.skipText}>10s</Text>
              <Ionicons name="play-back" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity onPress={playPause} style={styles.playButton}>
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={32}
                color="#000"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={skipForward} style={styles.controlButton}>
              <Text style={styles.skipText}>10s</Text>
              <Ionicons name="play-forward" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '80%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  lessonImage: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  progressBar: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: -10,
  },
  timeText: {
    color: '#666',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  controlButton: {
    alignItems: 'center',
    marginHorizontal: 30,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  skipText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  errorText: {
    color: '#ff4444',
  },
});

