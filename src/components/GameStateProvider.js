import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_STATE } from '../constants/initialState';

const GameStateContext = createContext();

const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = useState(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGameState();
    // AsyncStorage.removeItem('BLUEQUEST');
  }, []);

  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  const loadGameState = async () => {
    const savedState = await AsyncStorage.getItem('BLUEQUEST');
    if (savedState) {
      setGameState(JSON.parse(savedState));
    }
    setIsLoading(false);
  };

  const saveGameState = async (state) => {
    await AsyncStorage.setItem('BLUEQUEST', JSON.stringify(state));
  };

  const activateBeacon = (beaconId) => {
    setGameState((prev) => updateState(prev, beaconId));
  };

  return (
    <GameStateContext.Provider value={{ gameState, isLoading, activateBeacon }}>
      {children}
    </GameStateContext.Provider>
  );
}

const useGameState = () => useContext(GameStateContext);

export default GameStateProvider;

export { useGameState };
