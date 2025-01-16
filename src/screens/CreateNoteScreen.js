// src/screens/CreateNoteScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function CreateNoteScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');

  const saveNote = async () => {
    // Build note object
    const newNote = {
      id: Date.now().toString(), // or use uuid
      title,
      subtitle,
      content,
      createdAt: Date.now(),
    };

    try {
      const storedNotes = await AsyncStorage.getItem('MY_NOTES');
      const notesArray = storedNotes ? JSON.parse(storedNotes) : [];
      notesArray.push(newNote);
      await AsyncStorage.setItem('MY_NOTES', JSON.stringify(notesArray));

      // Navigate back or to Today screen
      navigation.goBack();
    } catch (error) {
      console.log('Error saving note:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Note</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.inputTitle}
          placeholder="Type the title here..."
          placeholderTextColor="#ccc"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.inputSubtitle}
          placeholder="Type your subtitle here..."
          placeholderTextColor="#ccc"
          value={subtitle}
          onChangeText={setSubtitle}
        />
        <TextInput
          style={styles.inputContent}
          placeholder="What do you want to write in your notes?"
          placeholderTextColor="#ccc"
          value={content}
          onChangeText={setContent}
          multiline
        />
      </View>

      <View style={styles.footerRow}>
        <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Example styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    backgroundColor: '#333',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  form: {
    flex: 1,
    padding: 20,
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  inputSubtitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  inputContent: {
    flex: 1,
    color: '#000',
    marginTop: 10,
    textAlignVertical: 'top',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  saveButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelButton: {
    width: 50,
    height: 50,
    backgroundColor: '#f66',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
