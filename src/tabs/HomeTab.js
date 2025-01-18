import { View, StyleSheet, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Map from '../components/Map';

const Stack = createStackNavigator<TodayStackParamList>();

const HomeTab = () => {
  return (
    <Stack.Navigator
      initialRouteName="TodayPage"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TodayPage" component={TodayPage} />
      <Stack.Screen
        name="WardrobePopupPage"
        component={WardrobePopupPage}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default HomeTab;