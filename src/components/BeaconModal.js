import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BEACONS } from '../constants/beacons';
import { useGameState } from '../components/GameStateProvider';
import { Ionicons } from '@expo/vector-icons';
import { getLevel } from '../utils/logic';
import { FAMILIARITY_THRESHOLDS, FAMILIARITY_TITLES, FAMILIARITY_XP } from '../constants/familiarity';
import { format } from 'date-fns';

const BeaconModal = (props) => {
  const { route, navigation } = props;
  const { gameState, activateBeacon } = useGameState();

  const { beaconId, location } = route.params;
  const beaconState = gameState.beacons[beaconId];
  const beaconData = BEACONS[beaconId];

  let level;
  if (beaconState.experience === 0) {
    level = 0;
  } else {
    level = getLevel(beaconState.experience, FAMILIARITY_THRESHOLDS);
  }
  const currentLevelXp = beaconState.experience - FAMILIARITY_THRESHOLDS[level];
  const xpToNextLevel = FAMILIARITY_THRESHOLDS[level + 1] - FAMILIARITY_THRESHOLDS[level];

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons
            style={styles.back}
            name="chevron-down" 
            size={32} 
            color="#1E3765"
            onPress={() => navigation.goBack()}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{beaconData.name}</Text>
            {beaconData.historic && (
              <Ionicons
                name="ribbon" 
                size={24} 
                color="#B8860B"
              />
            )}
          </View>
          {beaconData.historic && (
            <View style={styles.historicBadge}>
              <Text style={styles.historicYear}>EST. {beaconData.yearBuilt}</Text>
            </View>
          )}
        </View>
        <Image 
          source={{ uri: beaconData.image }} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.card}>
          <Text style={styles.familiarityTitle}>{FAMILIARITY_TITLES[level]}</Text>
          <Text style={styles.familiarity}>Familiarity {level}</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar, 
                { width: `${(currentLevelXp / xpToNextLevel) * 100 || 0}%` }
              ]} 
            />
          </View>
          <Text style={styles.xpText}>
            {currentLevelXp || 0} / {xpToNextLevel || (level === 5 ? '∞' : 0)} XP
          </Text>
          <Text style={styles.descriptionText}>{beaconData.description}</Text>
          {beaconData.historic && (
            <Text style={styles.historicText}>This is a historic beacon. Historic beacons have a 1.5x XP multiplier!</Text>
          )}
          <View style={styles.item}>
            <Ionicons 
              name="location" 
              size={20} 
              color="#666" 
            />
            <Text style={styles.text}>{beaconData.address}</Text>
          </View>
          {beaconState.lastVisited && (
            <View style={styles.item}>
              <Ionicons
                name="time" 
                size={20} 
                color="#666" 
              />
              <Text style={styles.text}>Last activated on {format(new Date(beaconState.lastVisited), 'MMM d, yyyy h:mm a')}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => activateBeacon(beaconId)}
          style={styles.button}
        >
          <Ionicons
            name="flash" 
            size={25} 
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Activate Beacon</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginRight: 10,
    borderRadius: 10,
    width: '100%',
  },
  back: {
    paddingVertical: 5,
    marginRight: 10,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '400',
    color: '#1E3765',
  },
  historicBadge: {
    backgroundColor: '#B8860B',
    padding: 8,
    borderRadius: 15,
  },
  historicYear: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  historicText: {
    fontSize: 14,
    color: '#B8860B',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
  },
  card: {
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 6,
    backgroundColor: '#1E376510',
    borderRadius: 15,
    marginBottom: 20,
  },
  familiarity: {
    fontSize: 18,
    color: '#1E3765',
    marginBottom: 6,
  },
  familiarityTitle: {
    fontSize: 25,
    fontWeight: 500,
    color: '#1E3765',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginVertical: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1E3765',
    borderRadius: 4,
  },
  xpText: {
    width: '100%',
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 2,
    marginBottom: 10,
  },
  button: {
    position: '',
    width: '100%',
    backgroundColor: '#1E3765',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonIcon: {
    position: 'absolute',
    left: 75,
    top: 15,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#FFFFFF',
  }
});

export default BeaconModal;
