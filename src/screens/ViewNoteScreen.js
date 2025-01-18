import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ViewNoteScreen({ route, navigation }) {
  const { note } = route.params;

  const deleteNote = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        let notes = JSON.parse(savedNotes);
        notes = notes.filter(n => n.id !== note.id);
        await AsyncStorage.setItem('notes', JSON.stringify(notes));
        navigation.navigate('Today', { refresh: true });
      } else {
        Alert.alert("No notes found", "There were no notes to delete.");
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      Alert.alert("Error", "Failed to delete the note. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Today')}
          style={styles.headerLeftIcon}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>MINDSET</Text>

        <TouchableOpacity
          onPress={() => Alert.alert("Star", "Star icon pressed!")}
          style={styles.headerRightIcon}
        >
          <Ionicons name="menu" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{note.title}</Text>
        {note.subtitle && <Text style={styles.subtitle}>{note.subtitle}</Text>}
        <Text style={styles.noteContent}>{note.content}</Text>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.editNoteButton}
          onPress={() => navigation.navigate('EditNote', { note })}
        >
          <Text style={styles.editNoteText}>Edit Note</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={deleteNote}
        >
          <Ionicons name="trash-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/** STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,    // adjust for device notch if necessary
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius:24,
    borderBottomColor: '#eee',
    backgroundColor: '#dadada',
    
  },
  headerTitle: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
  },
  menuIcon: {
    position: 'absolute',
    right: 20,
    top: 50,
  },
  headerLeftIcon: {
    padding: 8,
  },
  headerRightIcon: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },

  /* CONTENT */
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 14,
    fontWeight: '600',
  },
  noteContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },

  /* FOOTER */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: '#eee',
  },
  editNoteButton: {
    backgroundColor: '#dadada',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  editNoteText: {
    color: '#000',
    fontSize: 16,
    
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 14,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
