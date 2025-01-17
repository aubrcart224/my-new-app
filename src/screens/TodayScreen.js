import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import LessonCard from '../components/LessonCard';
import AudioPlayerModal from '../components/AudioPlayerModal'
import { SAMPLE_AUDIO_FILES } from '../constants/audioFiles';


export default function TodayScreen({ navigation, route }) {
  const [notes, setNotes] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [isQuoteVisible, setIsQuoteVisible] = useState(true);

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
      const newCompletedLessons = [...completedLessons, lessonId];
      setCompletedLessons(newCompletedLessons);
      await AsyncStorage.setItem('completedLessons', JSON.stringify(newCompletedLessons));
    } catch (error) {
      console.error('Error saving completed lesson:', error);
    }
  };

  const handleLessonPress = (lesson) => {
    setSelectedLesson(lesson);
    setShowAudioPlayer(true);
  };

  const lessons = [
    {
      id: 1,
      title: 'Focus Session',
      duration: '3 minutes',
      type: 'Lesson',
      imageUrl: 'https://s3-alpha-sig.figma.com/img/367d/4e8a/e6b3fd0e6d5f593a5837de3c93ba1bf3?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=UZAZ1-1EZFqAw~A~u3uWaVeiwgn8yjulGUKYqOI8LfxcUc8yNEI33GKc53NEBQeawtynokhfrfiQlriF2lC72FsRpdCXDJ5t8JWJIfOThz~ykvhWTZWrJF2p9uE1NWaXVjUZyjgNaQUlmUeJftS4NWAavVZu15wNcgeewFcQeMPYb1cDNZDnRpHEMwVQuJItNL8Ih0HCHnB~4vFT-jS3QuGduzZODkLNH43e-O8Ekdq-S3~qKrFH8gFH~HECcZmJVyvOvKG8yhQ3c87i4jMZZ~SIhu1kSeUuMBVfZmWhlmB9-M4MkCHXPhmWzN1hcwPX6S0ur0w7wWRyr8IllM5yew__',
      audioUrl: SAMPLE_AUDIO_FILES.focus,
      subtitle: 'IMPROVE by Alex'
    },
    {
      id: 2,
      title: 'Unleash',
      duration: '3 minutes',
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <Text style={styles.headerTitle}>MINDSET</Text>
        <TouchableOpacity style={styles.menuIcon}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Quote Section */}
      <View style={styles.quoteWrapper}>
        <TouchableOpacity 
          style={styles.quoteToggle}
          onPress={() => setIsQuoteVisible(!isQuoteVisible)}
        >
        <Ionicons 
          name={isQuoteVisible ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#fff" 
          style={styles.icon} 
        />
        </TouchableOpacity>
        {isQuoteVisible && (
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteIcon}>"</Text>
            <Text style={styles.quoteText}>
              If you don't get what you want, you SUFFER...
            </Text>
          <Text style={styles.quoteIcon}>"</Text>
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

        {/* Horizontal Dates Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.dateItem}>
            <Text style={styles.dateNumber}>08</Text>
            <Text style={styles.dateLabel}>SUN</Text>
          </View>
          <View style={styles.dateItemActive}>
            <Text style={styles.dateNumberActive}>09</Text>
            <Text style={styles.dateLabelActive}>MON</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateNumber}>10</Text>
            <Text style={styles.dateLabel}>TUE</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateNumber}>11</Text>
            <Text style={styles.dateLabel}>WED</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateNumber}>12</Text>
            <Text style={styles.dateLabel}>THU</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateNumber}>13</Text>
            <Text style={styles.dateLabel}>FRI</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateNumber}>14</Text>
            <Text style={styles.dateLabel}>SAT</Text>
          </View>
        </ScrollView>

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
        visible={showAudioPlayer}
        onClose={() => setShowAudioPlayer(false)}
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
  headerWrapper: {
    backgroundColor: '#222',
    paddingTop: 32,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  menuIcon: {
    position: 'absolute',
    right: 20,
    top: 50,
  },
  quoteContainer: {
    backgroundColor: '#222',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  quoteIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  quoteText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 8,
    lineHeight: 24,
    textAlign: 'left',
  },
  mainContent: {
    paddingHorizontal: 20,
    flex: 1,
  },

  quoteWrapper: {
    backgroundColor: '#222',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    overflow: 'hidden',
  },
  icon: {
    marginLeft: 10,
    marginBottom: 5,
  },

  quoteToggle: {
    alignItems: 'left',
    paddingVertical: 8,
  },
  dayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
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
    width: 60,
    height: 70,
    marginRight: 10,
    backgroundColor: '#dadada',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 60,
    height: 70,
    marginRight: 10,
    backgroundColor: '#000',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  lessonImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  lessonDetails: {
    flex: 1,
    marginLeft: 10,
  },
  lessonTitle: {
    fontWeight: '600',
    fontSize: 16,
  },
  lessonSub: {
    color: '#999',
    marginTop: 5,
    fontSize: 13,
  },
  lessonPlayButton: {
    width: 36,
    height: 36,
    backgroundColor: '#000',
    borderRadius: 18,
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
});

