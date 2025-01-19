import { memo, useState } from 'react';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const BeaconMarker = (props) => {
  const { beacon, nearby, navigation, markerRefs } = props;
  const [loaded, setLoaded] = useState(false);

  return (
    <Marker
      key={`marker-${beacon.id}-${loaded}`}      
      coordinate={beacon.location}
      title={beacon.name}
      ref={ref => markerRefs.current[beacon.id] = ref}
      opacity={nearby ? 1.0 : 0.5}
      tracksViewChanges={false}
      onCalloutPress={(
        () => navigation.navigate('BeaconModal', { beaconId: beacon.id, nearby })
      )}
    >
      <Ionicons 
        name="cube" 
        size={nearby ? 50 : 30}
        color={beacon.historic ? "#B8860B" : "#1E3765"}
        onLayout={() => setLoaded(true)}
      />
    </Marker>
  );
};

export default memo(BeaconMarker);
