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
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              const savedNotes = await AsyncStorage.getItem('notes');
              if (savedNotes) {
                let notes = JSON.parse(savedNotes);
                notes = notes.filter(n => n.id !== note.id);
                await AsyncStorage.setItem('notes', JSON.stringify(notes));
                navigation.navigate('Today', { refresh: true });
              }
            } catch (error) {
              console.error('Error deleting note:', error);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('EditNote', { note })}
            style={styles.editButton}
          >
            <Ionicons name="create-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={deleteNote}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>{note.title}</Text>
        {note.subtitle && <Text style={styles.subtitle}>{note.subtitle}</Text>}
        <Text style={styles.noteContent}>{note.content}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#222',
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  noteContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
