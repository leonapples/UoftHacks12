import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import BeaconMarker from './BeaconMarker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import PrestigeOverlay from './PrestigeOverlay';
import { BEACONS } from '../constants/beacons';
import { isNearby } from '../utils/activebeacon';
import Toast from 'react-native-toast-message';

const Map = (props) => {
  const { beaconToFocus, focusCounter, navigation } = props;
  const markerRefs = useRef({});

  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  
  const pollLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
    setInterval(async () => {
      // const location = await Location.getCurrentPositionAsync({
      //   accuracy: Location.Accuracy.Balanced,
      // });
      const location = {
        coords: {
          latitude: 43.6608787 + 0.0002,
          longitude: -79.3984443 + 0.0004
        }
      }
      setLocation(location);
    }, 500);
  };

  useEffect(() => {
    pollLocation();
  }, []);

  useEffect(() => {
    if (beaconToFocus) {
      centerOnBeacon(beaconToFocus)
    }
  }, [beaconToFocus, focusCounter]);

  const centerMap = () => {
    mapRef.current.animateToRegion({
      latitude: location.coords.latitude - 0.001,
      longitude: location.coords.longitude,
      latitudeDelta: 0.004,
      longitudeDelta: 0.004,
    });
  }

  const centerOnBeacon = (beaconId) => {
    const location = BEACONS[beaconId].location;
    setTimeout(() => {
      mapRef.current.animateToRegion({
        latitude: location.latitude - 0.0004,
        longitude: location.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      }, 1000);
    }, 100);
    markerRefs.current[beaconId]?.showCallout();
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
            opacity={0.5}
          >
            <Ionicons 
              name="location-sharp"
              size={50} 
              color="#1E3765"
            /> 
          </Marker>
        )}

        {Object.values(BEACONS).map(beacon => {
          const nearby = isNearby(location, beacon.location);

          return (
            <BeaconMarker 
              key={beacon.id}
              beacon={beacon}
              nearby={nearby}
              navigation={navigation}
              markerRefs={markerRefs}
            />
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
      <PrestigeOverlay />
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
