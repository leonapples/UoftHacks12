import { View, Text, StyleSheet } from 'react-native';
import { PRESTIGE_TITLES, PRESTIGE_THRESHOLDS } from '../constants/prestige';
import { getLevel } from '../utils/logic';
import { useGameState } from '../components/GameStateProvider';

const PrestigeOverlay = () => {
  const { gameState } = useGameState();
  const { player } = gameState;

  const level = getLevel(player.experience, PRESTIGE_THRESHOLDS);
  const currentLevelXP = player.experience - PRESTIGE_THRESHOLDS[level];
  const xpToNextLevel = PRESTIGE_THRESHOLDS[level + 1] - PRESTIGE_THRESHOLDS[level];

  return (
    <View style={styles.statsContainer}>
      <Text style={styles.titleText}>{PRESTIGE_TITLES[level]}</Text>
      <Text style={styles.prestigeText}>Campus Prestige {level}</Text>
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${(currentLevelXP / xpToNextLevel) * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.xpText}>
        {currentLevelXP} / {xpToNextLevel || 0} XP
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    width: 220,
    shadowColor: '#1E3765',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2
    },
  },
  titleText: {
    fontSize: 18,
    fontWeight: 500,
    color: '#1E3765',
    marginBottom: 2,
  },
  prestigeText: {
    fontSize: 14,
    color: '#1E3765',
    marginBottom: 6,
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
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 2,
  }
});

export default PrestigeOverlay;
