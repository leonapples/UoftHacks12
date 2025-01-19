import { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Map from '../components/Map';
import BeaconModal from '../components/BeaconModal';

const Stack = createStackNavigator();

const HomeTab = (props) => {
  const { route } = props;

  return (
    <Stack.Navigator
      initialRouteName="Map"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Map">
        {(props) => <Map {...props} focusCounter={route.params?.focusCounter} beaconToFocus={route.params?.beaconId} />}
      </Stack.Screen>
      <Stack.Screen
        name="BeaconModal"
        component={BeaconModal}
        options={{
          cardStyle: { backgroundColor: 'white' },
          animation: 'slide_from_bottom'
        }}
      />
    </Stack.Navigator>
  );
};

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