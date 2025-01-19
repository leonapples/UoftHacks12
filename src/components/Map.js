import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import PrestigeOverlay from './PrestigeOverlay';
import { BEACONS } from '../constants/beacons';
import Toast from 'react-native-toast-message';

const Map = (props) => {
  const { navigation } = props;

  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  
  const pollLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
    setInterval(async () => {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(location);
    }, 500);
  };

  useEffect(() => {
    pollLocation();
  }, []);

  const centerMap = () => {
    mapRef.current.animateToRegion({
      latitude: location.coords.latitude - 0.001,
      longitude: location.coords.longitude,
      latitudeDelta: 0.004,
      longitudeDelta: 0.004,
    });
  }

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 43.6629 - 0.00325,
          longitude: -79.3957,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            }}
          >
            <Ionicons 
              name="location-sharp"
              size={50} 
              color="#1E3765"
            /> 
          </Marker>
        )}

        {Object.values(BEACONS).map(beacon => {
          const nearby = location ? 
            Math.abs(location.coords.latitude - beacon.location.latitude) < 0.0003 && 
            Math.abs(location.coords.longitude - beacon.location.longitude) < 0.0003
            : false;

          return (
            <Marker
              key={beacon.id}
              coordinate={beacon.location}
              title={beacon.name}
              opacity={nearby ? 1.0 : 0.5}
              onCalloutPress={(
                () => navigation.navigate('BeaconModal', { beaconId: beacon.id, location })
              )}
            >
              <Ionicons 
                name="cube" 
                size={30} 
                color={beacon.historic ? "#B8860B" : "#1E3765"}
              />
            </Marker>
          );
        })}
      </MapView>
      <TouchableOpacity 
        style={styles.button}
        onPress={centerMap}
        activeOpacity={0.7}
      >
        <Ionicons 
          name="location-outline" 
          size={30} 
          color="#1E3765"
        />
      </TouchableOpacity>
      <PrestigeOverlay playerStats={{ level: 1, currentXP: 30, xpToNextLevel: 100 }}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  button: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 30,
    shadowColor: '#1E3765',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2
    }
  }
});

export default Map;
