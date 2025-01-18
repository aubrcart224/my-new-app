import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

export default function AudioPlayerModal({ visible, onClose, lesson }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * If the modal is closed (visible === false), unload the audio.
   * If the modal is open, do nothing until user presses play.
   */
  useEffect(() => {
    if (!visible) {
      unloadAudio();
    }
    // Cleanup automatically if the component unmounts
    return () => {
      unloadAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Unload and free resources
  const unloadAudio = async () => {
    if (sound) {
      try {
        await sound.unloadAsync();
      } catch (unloadError) {
        console.warn('Error unloading sound:', unloadError);
      }
      setSound(null);
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
      setIsLoading(false);
      setError(null);
    }
  };

  // Playback status updates
  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);
    } else if (status.error) {
      console.error(`Playback error: ${status.error}`);
      setError(`Playback error: ${status.error}`);
    }
  };

  /**
   * Play/Pause button logic:
   * - If there's no Sound loaded yet, create it & play
   * - Otherwise, toggle play/pause
   */
  const playPause = async () => {
    if (!sound) {
      // Load and then play
      await loadAndPlay();
    } else {
      // Toggle play/pause
      try {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } catch (err) {
        setError(`Playback error: ${err.message}`);
      }
    }
  };

  /**
   * Load audio and start playing immediately
   */
  const loadAndPlay = async () => {
    if (!lesson?.audioUrl) {
      setError('No audio URL provided.');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);

      // Allow playback in silent mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: lesson.audioUrl },
        { shouldPlay: true }, // start playing once loaded
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsLoading(false);
      setIsPlaying(true);
    } catch (err) {
      console.error('Error loading audio:', err);
      setError(`Failed to load audio: ${err.message}`);
      setIsLoading(false);
    }
  };

  // Seek (slider move)
  const seek = async (value) => {
    if (!sound) return;
    try {
      await sound.setPositionAsync(value);
    } catch (err) {
      setError(`Seek error: ${err.message}`);
    }
  };

  // Skip forward/back 10s
  const skipForward = () => {
    const newPosition = Math.min(position + 10000, duration);
    seek(newPosition);
  };
  const skipBackward = () => {
    const newPosition = Math.max(position - 10000, 0);
    seek(newPosition);
  };

  // Format ms -> M:SS
  const formatTime = (millis) => {
    if (!millis) return '0:00';
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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

          {/* Slider & time display */}
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

          {/* Playback controls */}
          <View style={styles.controls}>
            <TouchableOpacity onPress={skipBackward} style={styles.controlButton}>
              <Text style={styles.skipText}>10s</Text>
              <Ionicons name="play-back" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity onPress={playPause} style={styles.playButton}>
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
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
