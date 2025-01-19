import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FAMILIARITY_THRESHOLDS, FAMILIARITY_TITLES } from '../constants/familiarity';
import { getLevel } from '../utils/logic';
import { BEACONS } from '../constants/beacons';
import { Ionicons } from '@expo/vector-icons';
import { useGameState } from '../components/GameStateProvider';

const ExploreTab = (props) => {
  const { gameState, isLoading } = useGameState();
  const { beacons } = gameState;
  const [sort, setSort] = useState('name');
  
  const [focusCounter, setFocusCounter] = useState(0);

  const { navigation } = props;

  if (isLoading) {
    return null;
  };

  const sortedBeacons = Object.values(BEACONS).sort((a, b) => {
    switch (sort) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'familiarity':
        return beacons[b.id].experience - beacons[a.id].experience;
      case 'historic':
        return (b.historic ? 1 : 0) - (a.historic ? 1 : 0);
      default:
        return 0;
    }
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sortContainer}>
        <TouchableOpacity 
          style={[styles.sortButton, sort === 'name' && styles.sortButtonActive]}
          activeOpacity={1}
          onPress={() => setSort('name')}
        >
          <MaterialCommunityIcons name="order-alphabetical-ascending" size={20} color="#1E3765" />
          <Text style={styles.sortButtonText}>Name</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sortButton, sort === 'familiarity' && styles.sortButtonActive]}
          activeOpacity={1}
          onPress={() => setSort('familiarity')}
        >
          <MaterialCommunityIcons name="star-box-multiple" size={20} color="#1E3765" />
          <Text style={styles.sortButtonText}>Familiarity</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sortButton, sort === 'historic' && styles.sortButtonActive]}
          activeOpacity={1}
          onPress={() => setSort('historic')}
        >
          <Ionicons name="ribbon" size={20} color="#1E3765" />
          <Text style={styles.sortButtonText}>Historic</Text>
        </TouchableOpacity>
      </View>
      {sortedBeacons.map(beacon => {
        let level;
        if (beacons[beacon.id].experience === 0) {
          level = 0;
        } else {
          level = getLevel(beacons[beacon.id].experience, FAMILIARITY_THRESHOLDS);
        }
        const currentLevelXp = beacons[beacon.id].experience - FAMILIARITY_THRESHOLDS[level];
        const xpToNextLevel = FAMILIARITY_THRESHOLDS[level + 1] - FAMILIARITY_THRESHOLDS[level];

        return (
          <TouchableOpacity 
            onPress={() => {
              setFocusCounter(prev => prev + 1);
              navigation.navigate("bluequest", { beaconId: beacon.id, focusCounter })
            }} 
            activeOpacity={0.8}
            style={styles.card} 
            key={beacon.id}
          >
            <Text style={styles.titleText}>{beacon.name}</Text>
            <Text style={styles.familiarityTitleText}>{FAMILIARITY_TITLES[level]}</Text>
            <Text style={styles.familiarityText}>Familiarity {level}</Text>
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
            {beacon.historic && (
              <Ionicons
                style={{ position: 'absolute', top: 12, right: 12 }}
                name="ribbon" 
                size={24}
                color="#B8860B"
              />
            )}
          </TouchableOpacity>
        );
      }
    )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 500,
    color: '#1E3765',
    marginBottom: 6,
  },
  familiarityTitleText: {
    fontSize: 19,
    fontWeight: 500,
    color: '#1E3765',
    marginBottom: 2,
  },
  familiarityText: {
    fontSize: 14,
    color: '#1E3765',
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#1E376510',
    padding: 12,
    marginVertical: 7,
    marginHorizontal: 20,
    borderRadius: 12,
  },
  progressBarContainer: {
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
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#1E376510',
    gap: 6,
  },
  sortButtonActive: {
    backgroundColor: '#1E376530',
  },
  sortButtonText: {
    color: '#1E3765',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ExploreTab;