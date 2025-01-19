export const isNearby = (location, beaconLocation) => {
  if (!location || !beaconLocation) {
    return false;
  }
  if (Math.abs(location.coords.latitude - beaconLocation.latitude) < 0.0005 && Math.abs(location.coords.longitude - beaconLocation.longitude) < 0.0005) {
    return true;
  } 
  return false;
};

export const isRecharged = (lastVisited) => {
  if (Date.now() - lastVisited > 86400000) {
    return true;
  }
  return false;
}
