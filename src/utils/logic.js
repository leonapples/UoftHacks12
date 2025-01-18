import { BEACONS } from "../constants/beacons";
import { ACHIEVEMENTS } from "../constants/achievements";
import Toast from "react-native-toast-message";

export const getLevel = (experience, thresholds) => {
  let level = 1;
  while (level < 5 && experience >= thresholds[level + 1]) {
    level++;
  }
  return level;
};

export const updateState = (prev, beaconId) => {
  const historic = BEACONS[beaconId].historic;
  const discovery = prev.beacons[beaconId].experience === 0;

  const datetime = new Date();
  const earlybird = datetime.getHours() >=5 && datetime.getHours() < 9;
  const nightowl = datetime.getHours() >= 0 && datetime.getHours() < 5;
  const weekendwanderer = datetime.getDay() === 0 || datetime.getDay() === 6;

  let experience = historic ? 45 : 30;
  experience = discovery ? experience * 2 : experience;

  const oldPrestigeLevel = getLevel(prev.player.experience, PRESTIGE_THRESHOLDS);
  const newPrestigeLevel = getLevel(prev.player.experience + experience, PRESTIGE_THRESHOLDS);
  
  const oldFamiliarityLevel = getLevel(prev.beacons[beaconId].experience, FAMILIARITY_THRESHOLDS);
  const newFamiliarityLevel = getLevel(prev.beacons[beaconId].experience + experience, FAMILIARITY_THRESHOLDS);

  const updatedAchievements = {
    FIRST_STEPS: discovery ? prev.achievements.FIRST_STEPS + 1 : prev.achievements.FIRST_STEPS,
    EXPLORER: discovery ? prev.achievements.EXPLORER + 1 : prev.achievements.EXPLORER,
    EARLY_BIRD: earlybird ? prev.achievements.EARLY_BIRD + 1 : prev.achievements.EARLY_BIRD,
    NIGHT_OWL: nightowl ? prev.achievements.NIGHT_OWL + 1 : prev.achievements.NIGHT_OWL,
    WEEKEND_WANDERER: weekendwanderer ? prev.achievements.WEEKEND_WANDERER + 1 : prev.achievements.WEEKEND_WANDERER,
  };

  const newAchievements = Object.entries(ACHIEVEMENTS)
    .filter(([id, achievement]) => {
      const oldCount = prev.achievements[id];
      const newCount = updatedAchievements[id];
      return oldCount < achievement.total && newCount >= achievement.total;
    })

  Toast.show({
    type: 'success',
    text1: `Beacon ${discovery ? 'Discovered' : 'Activated'}`,
    text2: `${discovery ? 'Congratulations on discovering a new beacon.' : ''} You have earned ${experience} XP.`,
    visibilityTime: 2000,
  });

  let delay = 2500;

  newAchievements.forEach(achievement => {
    setTimeout(() => {
      Toast.show({
        type: 'success',
        text1: 'Achievement Unlocked!',
        text2: achievement.title,
        visibilityTime: 2000,
      });
    }, delay);
    delay += 2500;
  });

  if (newPrestigeLevel > oldPrestigeLevel) {
    setTimeout(() => {
      Toast.show({
        type: 'success',
        text1: 'Prestige Up!',
        text2: `You are now Campus Prestige ${newPrestigeLevel}`,
        visibilityTime: 2000,
      });
    }, delay);
    delay += 2500;
  }

  if (newFamiliarityLevel > oldFamiliarityLevel) {
    setTimeout(() => {
      Toast.show({
        type: 'success',
        text1: `${BEACONS[beaconId].name} Familiarity Up!`,
        text2: `${BEACONS[beaconId].name} is now Familiarity ${newFamiliarityLevel}`,
        visibilityTime: 2000,
      });
    }, delay);
  };

  return {
    player: {
      experience: prev.player.experience + experience,
      totalVisits: prev.player.totalVisits + 1,
    },
    beacons: {
      ...prev.beacons,
      [beaconId]: {
        experience: prev.beacons[beaconId].experience + experience,
        lastVisited: datetime.toISOString(),
      }
    },
    achievements: updatedAchievements,
  };
}