import React, { useState, useEffect } from 'react';
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

export default function TodayScreen({ navigation }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/** 
       * 1) HEADER
       */}
      <View style={styles.headerWrapper}>
        <Text style={styles.headerTitle}>MINDSET</Text>
        <TouchableOpacity style={styles.menuIcon}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/** 
       * 2) QUOTE SECTION
       */}
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteIcon}>"</Text>
        <Text style={styles.quoteText}>
          If you don't get what you want, you SUFFER...
        </Text>
        <Text style={styles.quoteIcon}>"</Text>
      </View>

      {/**
       * 3) MAIN CONTENT
       */}
      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/** Day Title + Skip button */}
        <View style={styles.dayTitleRow}>
          <Text style={styles.dayTitle}>Day 15</Text>
          <TouchableOpacity>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/** Horizontal Dates Row */}
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

        {/** Lesson / Audio Cards */}
        <View style={styles.lessonCard}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.lessonImage}
          />
          <View style={styles.lessonDetails}>
            <Text style={styles.lessonTitle}>Unleash Yourself</Text>
            <Text style={styles.lessonSub}>4 minutes • Lesson</Text>
          </View>
          <TouchableOpacity style={styles.lessonPlayButton}>
            <Ionicons name="play" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.lessonCard}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.lessonImage}
          />
          <View style={styles.lessonDetails}>
            <Text style={styles.lessonTitle}>Improve Your Focus</Text>
            <Text style={styles.lessonSub}>5 minutes • Lesson</Text>
          </View>
          <TouchableOpacity style={styles.lessonPlayButton}>
            <Ionicons name="play" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.lessonCard}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.lessonImage}
          />
          <View style={styles.lessonDetails}>
            <Text style={styles.lessonTitle}>Walk 20,000 Steps</Text>
            <Text style={styles.lessonSub}>Daily Goal</Text>
          </View>
          <TouchableOpacity style={styles.lessonPlayButton}>
            <Ionicons name="play" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/** Notes Section */}
        <View style={styles.notesHeaderRow}>
          <Text style={styles.notesHeader}>Notes</Text>
          <TouchableOpacity>
            <Text style={styles.notesLink}>See all notes</Text>
          </TouchableOpacity>
        </View>

        {/** Notes Grid */}
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
    </View>
  );
}

// ----------------------------------------------------------
// Styles
// ----------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // 1) HEADER
  headerWrapper: {
    backgroundColor: '#222',
    paddingTop: 50, // so text is below the status bar
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  menuIcon: {
    position: 'absolute',
    right: 20,
    top: 50,
  },

  // 2) QUOTE SECTION
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

  // 3) MAIN CONTENT
  mainContent: {
    paddingHorizontal: 20,
    flex: 1,
  },

  // Day Title + Skip
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

  // Horizontal Dates
  dateItem: {
    width: 60,
    height: 70,
    marginRight: 10,
    backgroundColor: '#dadada',
    borderRadius: 10,
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

  // Lesson / Audio Card
  lessonCard: {
    flexDirection: 'row',
    backgroundColor: '#e5e5e5', // shades of gray here
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

  // Notes Section
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
    borderRadius: 10,
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

