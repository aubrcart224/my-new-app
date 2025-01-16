// src/screens/NoteDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function NoteDetailScreen({ route, navigation }) {
  const { noteId } = route.params; // we passed noteId from TodayScreen
  const [note, setNote] = useState(null);

  useEffect(() => {
    loadNote();
  }, []);

  const loadNote = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('MY_NOTES');
      if (storedNotes) {
        const notesArray = JSON.parse(storedNotes);
        const foundNote = notesArray.find((n) => n.id === noteId);
        setNote(foundNote);
      }
    } catch (error) {
      console.log('Error loading note detail:', error);
    }
  };

  const deleteNote = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('MY_NOTES');
      if (storedNotes) {
        let notesArray = JSON.parse(storedNotes);
        notesArray = notesArray.filter((n) => n.id !== noteId);
        await AsyncStorage.setItem('MY_NOTES', JSON.stringify(notesArray));
      }
      navigation.goBack();
    } catch (error) {
      console.log('Error deleting note:', error);
    }
  };

  if (!note) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading note...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{/* blank or "Detail"? */}</Text>
        <Ionicons name="star-outline" size={24} color="#fff" />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.subtitle}>{note.subtitle}</Text>
        <Text style={styles.body}>{note.content}</Text>
      </ScrollView>

      {/* Footer: Edit / Delete */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate('CreateNote', { isEdit: true, existingNote: note })
          }
        >
          <Text style={styles.buttonText}>Edit Note</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={deleteNote}>
          <Ionicons name="trash" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Example styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: {
    backgroundColor: '#333',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 5 },
  subtitle: { fontSize: 16, fontWeight: '500', marginBottom: 15 },
  body: { fontSize: 14, lineHeight: 20 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  editButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
    flex: 0.85,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#f55',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
