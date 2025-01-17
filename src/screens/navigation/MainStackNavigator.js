import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TodayScreen from '../TodayScreen';
import NoteDetailScreen from '../ViewNoteScreen';
import CreateNoteScreen from '../CreateNoteScreen';

const Stack = createStackNavigator();

export default function MainStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Today" component={TodayScreen} />
      <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
      <Stack.Screen name="CreateNote" component={CreateNoteScreen} />
    </Stack.Navigator>
  );
}
