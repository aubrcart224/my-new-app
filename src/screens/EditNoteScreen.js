import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function EditNoteScreen({ route, navigation }) {
  const { note } = route.params;
  const [title, setTitle] = useState(note.title);
  const [subtitle, setSubtitle] = useState(note.subtitle);
  const [content, setContent] = useState(note.content);

  const saveNote = async () => {
    try {
      const updatedNote = {
        ...note,
        title: title || 'Untitled Note',
        subtitle: subtitle,
        content: content,
      };

      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        let notes = JSON.parse(savedNotes);
        const index = notes.findIndex(n => n.id === note.id);
        if (index !== -1) {
          notes[index] = updatedNote;
          await AsyncStorage.setItem('notes', JSON.stringify(notes));
          navigation.navigate('ViewNote', { note: updatedNote });
        }
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={saveNote}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <TextInput
            style={styles.titleInput}
            placeholder="Type the title here..."
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.subtitleInput}
            placeholder="Type your subtitle here..."
            value={subtitle}
            onChangeText={setSubtitle}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.contentInput}
            placeholder="What do you want to write in your notes?"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            placeholderTextColor="#999"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 8,
    marginTop: 40,
  },
  saveButton: {
    backgroundColor: '#222',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitleInput: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
});

