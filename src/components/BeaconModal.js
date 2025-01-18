const BeaconModal = ({ beacon, isVisible, onClose }) => {
  const isInRange = isBeaconInRange(beacon.id);
  const canActivate = isInRange && !isOnCooldown(beacon.lastVisited);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{BEACON_NAMES[beacon.id]}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.stats}>
            <Text style={styles.statLabel}>Total Experience</Text>
            <Text style={styles.statValue}>{beacon.experience}</Text>
            
            <Text style={styles.statLabel}>Last Visited</Text>
            <Text style={styles.statValue}>
              {beacon.lastVisited ? formatDate(beacon.lastVisited) : 'Never'}
            </Text>
          </View>

          {canActivate ? (
            <TouchableOpacity 
              style={styles.activateButton}
              onPress={() => handleBeaconActivation(beacon.id)}
            >
              <Text style={styles.buttonText}>Activate Beacon</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.cooldownText}>
              {isInRange ? 'On Cooldown' : 'Get Closer to Activate'}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};
