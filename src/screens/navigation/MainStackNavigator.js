import { createStackNavigator } from '@react-navigation/stack';
import TodayScreen from '../screens/TodayScreen';
import CreateNoteScreen from '../screens/CreateNoteScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';

const Stack = createStackNavigator();

export default function TodayStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TodayMain" component={TodayScreen} />
      <Stack.Screen name="CreateNote" component={CreateNoteScreen} />
      <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
    </Stack.Navigator>
  );
}
