import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts, Cormorant_700Bold } from '@expo-google-fonts/cormorant';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import HomeTab from './src/tabs/HomeTab';
import ExploreTab from './src/tabs/ExploreTab';
import AchievementsTab from './src/tabs/AchievementsTab';
import ProfileTab from './src/tabs/ProfileTab';
import GameStateProvider from './src/components/GameStateProvider';

const Tab = createBottomTabNavigator();

const App = () => {
  let [fontsLoaded] = useFonts({
    Cormorant_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <GameStateProvider> 
        <View style={styles.container}>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerStyle: {
                  height: 115,
                },
                headerTitleStyle: {
                  fontFamily: 'Cormorant_700Bold',
                  fontSize: 48,
                  color: '#1E3765',
                  paddingBottom: 10,
                },
                headerShadowVisible: false,
                headerTitleAlign: 'left',
                headerLeft: () => (route.name === 'bluequest' ?
                  <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>bq</Text>
                  </View> : null
                ),
                headerLeftContainerStyle: {
                  paddingBottom: 8,
                },
                tabBarShowLabel: false,
                tabBarIcon: ({ focused, color }) => {
                  let iconName;
                  if (route.name === 'bluequest') {
                    iconName = focused ? 'map' : 'map-outline';
                  } else if (route.name === 'achievements') {
                    iconName = focused ? 'trophy' : 'trophy-outline';
                  } else if (route.name === 'explore') {
                    iconName = focused ? 'compass' : 'compass-outline';
                  } else if (route.name === 'profile') {
                    iconName = focused ? 'person' : 'person-outline';
                  }
                  return <Ionicons name={iconName} size={30} color={color} />;
                },
                tabBarStyle: {
                  height: 80,
                  borderTopColor: 'transparent',
                  paddingTop: 8,
                },
                tabBarActiveTintColor: '#1E3765',
                tabBarInactiveTintColor: 'gray',
              })}
              >
              <Tab.Screen name="bluequest" component={HomeTab} />
              <Tab.Screen name="explore" component={ExploreTab} />
              <Tab.Screen name="achievements" component={AchievementsTab} />
              <Tab.Screen name="profile" component={ProfileTab} />
            </Tab.Navigator>
          </NavigationContainer>
        </View>
      </GameStateProvider>
      <Toast 
        config={{
          success: ({ text1, text2 }) => (
            <View style={styles.toastContainer}>
              <Text style={styles.toastTitle}>{text1}</Text>
              {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
            </View>
          )
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#1E3765',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 16,
    marginRight: 8,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontFamily: 'Cormorant_700Bold',
  },
  toastContainer: {
    width: 300,
    marginTop: 30,
    backgroundColor: '#1E3765',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  toastTitle: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Cormorant_700Bold',
    textAlign: 'center'
  },
  toastMessage: {
    color: 'white',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center'
  },
});

export default App;
