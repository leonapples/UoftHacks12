import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ACHIEVEMENTS } from '../constants/achievements';
import { useGameState } from '../components/GameStateProvider';
import { Ionicons } from '@expo/vector-icons';

const AchievementsTab = () => {
  const { gameState, isLoading } = useGameState();
  const { achievements } = gameState;

  if (isLoading) {
    return null;
  };

  return (
    <ScrollView style={styles.container}>
      {Object.entries(ACHIEVEMENTS).map(([id, achievement]) =>
        <View style={styles.card} key={id}>
          <Text style={styles.titleText}>{achievement.title}</Text>
          <Text style={styles.descriptionText}>{achievement.description}</Text>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${(achievements[id] / achievement.total) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.xpText}>{achievements[id]}/{achievement.total}</Text>
          {achievements[id] >= achievement.total && (
            <Ionicons
              style={{ position: 'absolute', top: 12, right: 12 }}
              name="checkmark-circle" 
              size={24}
              color="#4CAF50"
            />
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  card: {
    backgroundColor: '#1E376509',
    padding: 12,
    marginVertical: 5,
    marginHorizontal: 12,
    borderRadius: 12,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 500,
    color: '#1E3765',
    marginBottom: 2,
  },
  descriptionText: {
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

export default AchievementsTab;
