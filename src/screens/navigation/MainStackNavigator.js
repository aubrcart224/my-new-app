import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SomeScreen from '../SomeScreen';
import CreateNoteScreen from '../CreateNoteScreen';
import ViewNoteScreen from '../ViewNoteScreen';
import EditNoteScreen from '../EditNoteScreen';
import TodayScreen from '../TodayScreen';

const Stack = createStackNavigator();

export default function MainStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={SomeScreen} />
      <Stack.Screen name="CreateNote" component={CreateNoteScreen} />
      <Stack.Screen name="ViewNote" component={ViewNoteScreen} />
      <Stack.Screen name="EditNote" component={EditNoteScreen} />
      <Stack.Screen name="Today" component={TodayScreen} />
    </Stack.Navigator>
  );
}
