import { View, Text, StyleSheet } from 'react-native';
import { PRESTIGE_TITLES } from '../constants/prestige';

const PrestigeOverlay = ({ playerStats }) => {
  const progressPercentage = (playerStats.currentXP / playerStats.xpToNextLevel) * 100;

  return (
    <View style={styles.statsContainer}>
      <Text style={styles.titleText}>{PRESTIGE_TITLES[playerStats.level]}</Text>
      <Text style={styles.prestigeText}>Campus Prestige {playerStats.level}</Text>
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${progressPercentage}%` }
          ]} 
        />
      </View>
      <Text style={styles.xpText}>
        {playerStats.currentXP} / {playerStats.xpToNextLevel} XP
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
    shadowOpacity: 0.4,
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
