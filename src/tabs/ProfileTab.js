import { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGameState } from '../components/GameStateProvider';
import { PRESTIGE_THRESHOLDS, PRESTIGE_TITLES } from '../constants/prestige';
import { BEACONS } from '../constants/beacons';
import { getLevel } from '../utils/logic';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';


const ProfileTab = () => {
  const { gameState, isLoading } = useGameState();
  const { player, beacons, achievements } = gameState;

  if (isLoading) {
    return null;
  };

  const viewShotRef = useRef();

  const onShare = async () => {
    const uri = await viewShotRef.current.capture();
    await Sharing.shareAsync(`file://${uri}`, {
      mimeType: 'image/png',
    });
  };

  const level = getLevel(player.experience, PRESTIGE_THRESHOLDS);
  const currentLevelXP = player.experience - PRESTIGE_THRESHOLDS[level];
  const xpToNextLevel = PRESTIGE_THRESHOLDS[level + 1] - PRESTIGE_THRESHOLDS[level];

  const discovered = Object.values(beacons).filter(beacon => beacon.experience !== 0).length;
  const total = Object.values(BEACONS).length;

  const historicDiscovered = Object.entries(beacons).filter(([id, beacon]) => BEACONS[id].historic && beacon.experience !== 0).length;
  const totalHistoric = Object.values(BEACONS).filter(beacon => beacon.historic).length;

  const totalVisits = player.totalVisits;

  const favouriteBeacon = Object.entries(beacons).reduce((max, [id, beacon]) => beacon.experience > (max?.experience || 0) ? { ...beacon, name: BEACONS[id].name } : max, null);

  let icon;
  switch (level) {
    case 1:
      icon = <MaterialCommunityIcons style={styles.icon} name="compass-rose" size={50} color="#CD7F32" />;
      break;
    case 2:
      icon = <MaterialCommunityIcons style={styles.icon} name="book-open-page-variant" size={50} color="#A8A9AD" />;
      break;
    case 3:
      icon = <MaterialCommunityIcons style={styles.icon} name="feather" size={50} color="#757575" />;
      break;
    case 4:
      icon = <MaterialCommunityIcons style={styles.icon} name="shield-sun" size={50} color="#B8860B" />;
      break;
    case 5:
      icon = <MaterialCommunityIcons style={styles.icon} name="crown" size={50} color="#1C1C1B" />;
      break;
    default:
      icon = null;
  }

  return (
    <ScrollView style={styles.container}>
      <ViewShot
        ref={viewShotRef}
        options={{
          format: "png",
          quality: 0.9
        }}
        style={styles.container}
      >
        <View style={styles.card}>
          {icon}
          <Text style={styles.titleText}>{PRESTIGE_TITLES[level]}</Text>
          <Text style={styles.prestigeText}>Campus Prestige {level}</Text>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${(currentLevelXP / xpToNextLevel) * 100 || 0}%` }
              ]} 
            />
          </View>
          <Text style={styles.xpText}>
            {currentLevelXP || 0} / {xpToNextLevel || (level === 5 ? '∞' : 0)} XP
          </Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="map-marker-check" size={24} color="#1E3765" />
            <Text style={styles.statNumber}>{discovered}/{total}</Text>
            <Text style={styles.statLabel}>Total Beacons Discovered</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="castle" size={24} color="#1E3765" />
            <Text style={styles.statNumber}>{historicDiscovered}/{totalHistoric}</Text>
            <Text style={styles.statLabel}>Historic Beacons Discovered</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="star" size={24} color="#1E3765" />
            <Text style={styles.statNumber}>{totalVisits}</Text>
            <Text style={styles.statLabel}>Total Beacon Activations</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="star-circle" size={24} color="#1E3765" />
            <Text style={styles.statNumber}>{favouriteBeacon?.experience || 0} XP</Text>
            <Text style={styles.statLabel}>{favouriteBeacon?.name || "No beacons yet."}{'\n'}Favourite Beacon XP</Text>
          </View>
        </View>
      </ViewShot>
      <TouchableOpacity style={styles.shareButton} activeOpacity={0.8} onPress={onShare}>
        <MaterialCommunityIcons name="share-variant" size={24} color="#FFF" />
        <Text style={styles.shareButtonText}>Share Progress</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  card: {
    padding: 10,
    paddingHorizontal: 20,
    marginHorizontal: 30,
    borderRadius: 20,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1E3765',
    borderRadius: 12,
  },
  xpText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 600,
    color: '#1E3765',
    textAlign: 'center',
    marginBottom: 6,
  },
  prestigeText: {
    fontSize: 18,
    color: '#1E3765',
    textAlign: 'center',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    padding: 20,
    gap: 16,
  },
  statCard: {
    backgroundColor: '#1E376510',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '46%',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3765',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: '#1E3765',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 25,
    marginVertical: 10,
    gap: 8,
  },
  shareButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '500',
  },
});

export default ProfileTab;