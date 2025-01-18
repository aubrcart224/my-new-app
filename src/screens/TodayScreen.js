import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  LayoutAnimation,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import LessonCard from '../components/LessonCard';
import AudioPlayerModal from '../components/AudioPlayerModal';
import { SAMPLE_AUDIO_FILES } from '../constants/audioFiles';
import { format, addDays, isSameDay } from 'date-fns';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');
const DATE_ITEM_WIDTH = 60;
const DATE_ITEM_MARGIN = 10;
const DATES_CONTAINER_PADDING = 20;
const TODAY = new Date();
const NUMBER_OF_DAYS = 30; // Show 30 days

export default function TodayScreen({ navigation, route }) {
  const [notes, setNotes] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [isQuoteVisible, setIsQuoteVisible] = useState(true);
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [quoteHeight, setQuoteHeight] = useState(0);
  const [lessonDurations, setLessonDurations] = useState({});
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const scrollViewRef = useRef(null);

  const toggleQuote = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsQuoteVisible(!isQuoteVisible);
  };

  const loadNotes = useCallback(async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      } else {
        setNotes([]);
      }
      // Reset the refresh parameter
      if (route.params?.refresh) {
        navigation.setParams({ refresh: false });
      }
      // Handle deleted note
      if (route.params?.deletedNoteId) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== route.params.deletedNoteId));
        navigation.setParams({ deletedNoteId: null });
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }, [navigation, route.params]);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes, route.params?.refresh, route.params?.deletedNoteId])
  );

  const loadCompletedLessons = async () => {
    try {
      const saved = await AsyncStorage.getItem('completedLessons');
      if (saved) {
        setCompletedLessons(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading completed lessons:', error);
    }
  };

  useEffect(() => {
    loadCompletedLessons();
  }, []);

  const handleLessonComplete = async (lessonId) => {
    try {
      let newCompletedLessons;
      if (completedLessons.includes(lessonId)) {
        // If lesson is already completed, remove it
        newCompletedLessons = completedLessons.filter(id => id !== lessonId);
      } else {
        // If lesson is not completed, add it
        newCompletedLessons = [...completedLessons, lessonId];
      }
      setCompletedLessons(newCompletedLessons);
      await AsyncStorage.setItem('completedLessons', JSON.stringify(newCompletedLessons));
    } catch (error) {
      console.error('Error toggling lesson completion:', error);
    }
  };

  

  const handleLessonPress = (lesson) => {
    setSelectedLesson(lesson);
    setTimeout(() => {
      setShowAudioPlayer(true);
    }, 100);
  };

  const scrollToActiveDate = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: DATE_ITEM_WIDTH + DATE_ITEM_MARGIN,
        animated: true
      });
    }
  };

  useEffect(() => {
    setTimeout(scrollToActiveDate, 100);
  }, []);

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < NUMBER_OF_DAYS; i++) {
      dates.push(addDays(TODAY, i));
    }
    return dates;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // Here you can add logic to load data for the selected date
  };

  const handleMouseWheel = (event) => {
    if (scrollViewRef.current) {
      // Prevent default vertical scrolling when hovering over dates
      event.preventDefault();
      // Use deltaY for horizontal scrolling (since we're converting vertical scroll to horizontal)
      const newOffset = scrollViewRef.current._contentOffset?.x || 0;
      scrollViewRef.current.scrollTo({
        x: newOffset + (event.nativeEvent.deltaY * 0.5), // Adjust the 0.5 multiplier to control scroll speed
        animated: true
      });
    }
  };

  const scrollDates = (direction) => {
    if (scrollViewRef.current) {
      const newOffset = (scrollViewRef.current._contentOffset?.x || 0) + 
        (direction === 'left' ? -200 : 200); // Adjust 200 to control scroll distance
      scrollViewRef.current.scrollTo({
        x: Math.max(0, newOffset),
        animated: true
      });
    }
  };

  const lessonsData = [
    {
      id: 1,
      title: 'Focus Session',
      type: 'Lesson',
      imageUrl: 'https://s3-alpha-sig.figma.com/img/12c8/a01d/3409d6897e456d4e5e623490f9968017?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=f2gZ4nS-KNshW6eWeb31O1Vi8Q9LTRK~Hy-JNcTd7SapdOMqs~INY9tyEmh765~L2u3C4VjK65Hr~~XXD9x7D8yoI9cGkd2EPJ9Fnpyg2WslAMoAhhmoZwYcskCHiRaGMQI2maYcC6O2iVKbazk3Q4Z50bL8dPan~eC8p8YJvhzF~sset1REq92trG5KuZgxTFYGrtQ~2EvCj680cuuKOBottau8onZGYLNC5cYQWN8Cbj0ZBCzqbQF9HSalBNw7MJ6ZflA0Wo2ju6o63nrQXwromkg8QUigJCP4JIRkM88QWCMzDbxpT6Wm4IKw3iMX~CjeQfO9CaeC6E66OsMvqw__',
      audioUrl: SAMPLE_AUDIO_FILES.focus,
      subtitle: 'IMPROVE by Alex'
    },
    {
      id: 2,
      title: 'Unleash',
      type: 'Lesson',
      imageUrl: 'https://s3-alpha-sig.figma.com/img/367d/4e8a/e6b3fd0e6d5f593a5837de3c93ba1bf3?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=UZAZ1-1EZFqAw~A~u3uWaVeiwgn8yjulGUKYqOI8LfxcUc8yNEI33GKc53NEBQeawtynokhfrfiQlriF2lC72FsRpdCXDJ5t8JWJIfOThz~ykvhWTZWrJF2p9uE1NWaXVjUZyjgNaQUlmUeJftS4NWAavVZu15wNcgeewFcQeMPYb1cDNZDnRpHEMwVQuJItNL8Ih0HCHnB~4vFT-jS3QuGduzZODkLNH43e-O8Ekdq-S3~qKrFH8gFH~HECcZmJVyvOvKG8yhQ3c87i4jMZZ~SIhu1kSeUuMBVfZmWhlmB9-M4MkCHXPhmWzN1hcwPX6S0ur0w7wWRyr8IllM5yew__',
      audioUrl: SAMPLE_AUDIO_FILES.unleash,
      subtitle: 'UNLEASH by Alex'
    },
    {
      id: 3,
      title: 'Walk 20,000 Steps',
      duration: 'Daily Goal',
      type: 'Goal',
      imageUrl: 'https://s3-alpha-sig.figma.com/img/98d9/8a02/bd75cf0a1f8a6fe008febd7c1500bf2d?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=GjToL3sjfLpSP-iAtoZNpVZ9mz4Gv8rMPo0tH9xweNXVegV7ibcAkfrJP1hPci~tG4hz2TtTNots08-uBO1cM0UiTlJEdorRiRN9J8ObDtrm625nleXixuudoRbUI16trqKCXnazYE5WAyl0p-kEYr-~q0sqCpB79NTB7IqH9uoydcnzLmmiByhmbTFUatZOQ75WYre7QIDMXoH6SwbnL~1wdK4lmsjWmGDcaDrRFCSmNWP3dY95Gr6LZynvIUgqdHX8WDG0XTLkkJ9FVc1boArUCNc7Xf7ktFxyvJFnEXpng73OlBjve8NCV9axQmoULlUSBf~DmizAYwwf28-jHg__',
    },
  ];

  const getAudioDuration = async (audioUrl) => {
    try {
      const sound = new Audio.Sound();
      await sound.loadAsync({ uri: audioUrl });
      const status = await sound.getStatusAsync();
      await sound.unloadAsync(); // Clean up
      return status.durationMillis;
    } catch (error) {
      console.error('Error loading audio:', error);
      return null;
    }
  };

  // Load lessons with durations on mount
  useEffect(() => {
    const initializeLessons = async () => {
      setIsLoading(true);
      const lessonsWithDurations = await Promise.all(
        lessonsData.map(async (lesson) => {
          if (lesson.audioUrl) {
            const durationMs = await getAudioDuration(lesson.audioUrl);
            if (durationMs) {
              const minutes = Math.floor(durationMs / 60000);
              const seconds = ((durationMs % 60000) / 1000).toFixed(0);
              return {
                ...lesson,
                duration: `${minutes}:${seconds.padStart(2, '0')}`
              };
            }
          }
          return lesson;
        })
      );
      setLessons(lessonsWithDurations);
      setIsLoading(false);
    };

    initializeLessons();
  }, []);

  // In your render method, conditionally render based on loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading lessons...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerWrapper}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.quoteToggle}
              onPress={toggleQuote}
            >
              <Ionicons 
                name="chevron-down"
                size={24} 
                color="#fff" 
                style={{ transform: [{ rotate: isQuoteVisible ? '180deg' : '0deg' }] }}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>MINDSET</Text>
            <TouchableOpacity style={styles.menuIcon}>
              <Ionicons name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        
        {isQuoteVisible && (
          <View style={styles.quoteSection}>
            <View style={styles.quoteContainer}>
              <Text style={[styles.quoteIcon, styles.quoteIconLeft]}>"</Text>
              <Text style={styles.quoteText}>
                If you don't get what you want, you SUFFER...
              </Text>
              <Text style={[styles.quoteIcon, styles.quoteIconRight]}>"</Text>
            </View>
          </View>
        )}
      </View>
      {/* Main Content */}
      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Day Title + Skip button */}
        <View style={styles.dayTitleRow}>
          <Text style={styles.dayTitle}>Day 15</Text>
          <TouchableOpacity>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        {/* Dates Section with Arrows */}
        <View style={styles.datesSection}>
          <ScrollView 
            ref={scrollViewRef}
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesContainer}
            snapToInterval={DATE_ITEM_WIDTH + DATE_ITEM_MARGIN}
            decelerationRate="fast"
            snapToAlignment="center"
            style={styles.datesScrollView}
            onScroll={(event) => {
              scrollViewRef.current._contentOffset = event.nativeEvent.contentOffset;
            }}
            scrollEventThrottle={16}
            onWheel={handleMouseWheel}
          >
            {generateDates().map((date) => {
              const isActive = isSameDay(date, selectedDate);
              return (
                <TouchableOpacity
                  key={date.toISOString()}
                  onPress={() => handleDateSelect(date)}
                  style={[
                    isActive ? styles.dateItemActive : styles.dateItem,
                    styles.dateItemHover, // Add hover effect
                  ]}
                >
                  <Text style={isActive ? styles.dateNumberActive : styles.dateNumber}>
                    {format(date, 'dd')}
                  </Text>
                  <Text style={isActive ? styles.dateLabelActive : styles.dateLabel}>
                    {format(date, 'EEE').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={styles.arrowsContainer}>
            <TouchableOpacity 
              style={styles.dateArrow} 
              onPress={() => scrollDates('left')}
            >
              <Ionicons name="chevron-back" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dateArrow} 
              onPress={() => scrollDates('right')}
            >
              <Ionicons name="chevron-forward" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Lesson / Audio Cards */}
        {lessons.map((lesson, index) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onPress={handleLessonPress}
            onComplete={handleLessonComplete}
            isCompleted={completedLessons.includes(lesson.id)}
            isLocked={index > completedLessons.length}
          />
        ))}
        {/* Notes Section */}
        <View style={styles.notesHeaderRow}>
          <Text style={styles.notesHeader}>Notes</Text>
          <TouchableOpacity>
            <Text style={styles.notesLink}>See all notes</Text>
          </TouchableOpacity>
        </View>
        {/* Notes Grid */}
        <View style={styles.notesGrid}>
          {/* "+" card for a new note */}
          <TouchableOpacity 
            style={styles.noteCardAdd}
            onPress={() => navigation.navigate('CreateNote')}
          >
            <Ionicons name="add" size={75} color="#ccc" />
          </TouchableOpacity>
          {/* Existing Notes */}
          {notes.slice(0, 3).map((note) => (
            <TouchableOpacity
              key={note.id}
              style={styles.noteCard}
              onPress={() => navigation.navigate('ViewNote', { note })}
            >
              <Text style={styles.noteTitle}>{note.title}</Text>
              <Text style={styles.noteBody} numberOfLines={3}>
                {note.content}
              </Text>
              <Text style={styles.noteFooter}>
                {new Date(note.createdAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <AudioPlayerModal
        visible={showAudioPlayer && selectedLesson !== null}
        onClose={() => {
          setShowAudioPlayer(false);
          setSelectedLesson(null);
        }}
        lesson={selectedLesson}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#222',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 30,
    paddingBottom: 5,
    overflow: 'hidden',
  },
  headerWrapper: {
    height: 74,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  menuIcon: {
    width: 24,
  },
  quoteToggle: {
    width: 24,
  },
  quoteContainer: {
    paddingHorizontal: 20,
    position: 'relative',
    alignItems: 'center',
    marginBottom: 15,
  },
  quoteIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    position: 'absolute',
    zIndex: 1,
  },
  quoteIconLeft: {
    left: 30,
    top: 4,
  },
  quoteIconRight: {
    right: 30,
    bottom: 4,
  },
  quoteText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'left',
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  mainContent: {
    paddingHorizontal: 20,
    flex: 1,
  },
  dayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 10,
  },
  dayTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  skipText: {
    color: '#555',
  },
  dateItem: {
    width: DATE_ITEM_WIDTH,
    height: 70,
    marginRight: DATE_ITEM_MARGIN,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    transform: [{ scale: 0.95 }], // Slightly smaller by default
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateLabel: {
    fontSize: 12,
    color: '#888',
  },
  dateItemActive: {
    width: DATE_ITEM_WIDTH,
    height: 70,
    marginRight: DATE_ITEM_MARGIN,
    backgroundColor: '#000',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    transform: [{ scale: 1 }], // Full size when active
  },
  dateNumberActive: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  dateLabelActive: {
    fontSize: 12,
    color: '#fff',
  },
  lessonCard: {
    flexDirection: 'row',
    backgroundColor: '#e5e5e5',
    borderRadius: 15,
    padding: 15,
    marginTop: 15,
    marginBottom: 5,
    alignItems: 'center',
    minHeight: 100,
  },
  lessonImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  lessonDetails: {
    flex: 1,
    marginLeft: 15,
    paddingRight: 10,
  },
  lessonTitle: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 4,
  },
  lessonSub: {
    color: '#999',
    marginTop: 6,
    fontSize: 14,
  },
  lessonPlayButton: {
    width: 44,
    height: 44,
    backgroundColor: '#000',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  notesHeader: {
    fontSize: 18,
    fontWeight: '700',
  },
  notesLink: {
    color: '#777',
  },
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  noteCardAdd: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  noteCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#dadada',
  },
  noteTitle: {
    fontWeight: '500',
    marginBottom: 10,
    fontSize: 14,
    padding: 4,
  },
  noteBody: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    flex: 1,
    padding: 4,
  },
  noteFooter: {
    fontSize: 10,
    color: '#aaa',
    textAlign: 'right',
  },
  datesSection: {
    marginVertical: 10,
  },
  arrowsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 5,
    width: '100%',
  },
  dateArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  datesScrollView: {
    flex: 1,
    cursor: 'grab',
    WebkitOverflowScrolling: 'touch',
  },
  datesContainer: {
    paddingHorizontal: 10,
    //paddingBottom: 5, // Add some space above the arrows
  },
  dateItemHover: {
    // Add hover effect for web
    ':hover': {
      transform: [{ scale: 0.98 }],
      transition: 'transform 0.2s ease-in-out',
    },
  },
  quoteWrapper: {
    width: '100%',
  },
  quoteSection: {
    position: 'relative',
    width: '100%',
  },
  quoteBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: '#333',
    transformOrigin: 'top',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});