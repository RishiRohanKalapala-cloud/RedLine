import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

// --- THEME CONSTANTS ---
const THEME_RED = '#E62020';
const THEME_BLACK = '#09090B';
const THEME_GRAY = '#F4F4F5';
const THEME_DARK_CARD = '#18181B';
const THEME_BORDER = '#E4E4E7';

// --- TYPES ---
type PlatformId = 'leetcode' | 'codechef' | 'hackerrank' | 'hackerearth';

type Handles = Record<PlatformId, string>;

type PlatformStats = {
  solved: number;
  rank: number;
  rating?: number | string;
  label: string;
};

type StatsMap = Partial<Record<PlatformId, PlatformStats>>;

// --- PLATFORM CONFIG ---
const PLATFORMS: { id: PlatformId; name: string; icon: string; color: string }[] = [
  { id: 'leetcode', name: 'LeetCode', icon: 'code-braces', color: '#FFA116' },
  { id: 'codechef', name: 'CodeChef', icon: 'chef-hat', color: '#5B4638' },
  { id: 'hackerrank', name: 'HackerRank', icon: 'hackernews', color: '#2EC866' }, // using hackernews icon as proxy
  { id: 'hackerearth', name: 'HackerEarth', icon: 'earth', color: '#2C3454' },
];

export default function CodingTrackerScreen() {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // User Handles (Default empty)
  const [handles, setHandles] = useState<Handles>({
    leetcode: '',
    codechef: '',
    hackerrank: '',
    hackerearth: '',
  });

  // Fetched Data State
  const [stats, setStats] = useState<StatsMap>({});

  // --- SIMULATED API CALL ---
  // In a real app, this would hit your backend proxy which scrapes/queries the platforms.
  // Here, we generate deterministic data based on the username so it "feels" real.
  const fetchStats = async () => {
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newStats: StatsMap = {};
    
    (Object.keys(handles) as PlatformId[]).forEach((key) => {
      const handle = handles[key];
      if (!handle) return;

      // Deterministic math based on username length to generate static "stats"
      const seed = handle.length * handle.charCodeAt(0);
      
      if (key === 'leetcode') {
        newStats[key] = {
          solved: (seed * 12) % 2000,
          rank: (seed * 100) % 500000,
          rating: 1400 + (seed % 600),
          label: 'Contest Rating'
        };
      } else if (key === 'codechef') {
        newStats[key] = {
          solved: (seed * 5) % 1000,
          rank: 1 + (seed % 5), // Stars
          rating: 1200 + (seed % 1000),
          label: 'Stars'
        };
      } else {
        newStats[key] = {
          solved: (seed * 8) % 800,
          rank: (seed * 43) % 10000,
          rating: 'Gold Badge',
          label: 'Badge'
        };
      }
    });

    setStats(newStats);
    setLoading(false);
    setModalVisible(false);
  };

  // Calculate Aggregates
  const totalSolved = useMemo(() => {
    return (Object.values(stats) as PlatformStats[]).reduce(
      (acc, curr) => acc + (curr?.solved ?? 0),
      0,
    );
  }, [stats]);

  const activePlatforms = Object.keys(stats).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <View style={styles.brandAccent} />
          <Text style={styles.brandMark}>CODING TRACKER</Text>
        </View>
        <Pressable 
          style={styles.settingsBtn} 
          onPress={() => setModalVisible(true)}
        >
          <MaterialCommunityIcons name="account-edit-outline" size={22} color={THEME_BLACK} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* HERO STATS */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <Text style={styles.heroTitle}>Total Impact</Text>
            <MaterialCommunityIcons name="chart-timeline-variant" size={24} color="#FFF" />
          </View>
          
          <View style={styles.heroMain}>
            <Text style={styles.bigNumber}>{totalSolved}</Text>
            <Text style={styles.bigLabel}>PROBLEMS SOLVED</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.heroFooter}>
            <Text style={styles.footerStat}>{activePlatforms} Active Platforms</Text>
            {loading && <ActivityIndicator size="small" color="#FFF" />}
          </View>
        </View>

        {/* PLATFORM GRID */}
        <View style={styles.gridContainer}>
          {activePlatforms === 0 && !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No accounts connected.</Text>
              <Pressable onPress={() => setModalVisible(true)}>
                <Text style={styles.emptyLink}>Tap top-right to link profiles.</Text>
              </Pressable>
            </View>
          ) : (
            PLATFORMS.map((platform) => {
              const data = stats[platform.id];
              if (!data && !handles[platform.id]) return null; // Don't show if not linked

              return (
                <View key={platform.id} style={styles.platformCard}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={[styles.iconBox, { backgroundColor: platform.color }]}>
                      <MaterialCommunityIcons name={platform.icon as any} size={18} color="#FFF" />
                    </View>
                    <Text style={styles.platformName}>{platform.name}</Text>
                  </View>

                  {loading ? (
                    <View style={styles.loadingBox}>
                      <ActivityIndicator size="small" color={THEME_RED} />
                    </View>
                  ) : data ? (
                    <>
                      {/* Solved Count */}
                      <View style={styles.statBlock}>
                        <Text style={styles.statNumber}>{data.solved}</Text>
                        <Text style={styles.statLabel}>SOLVED</Text>
                      </View>

                      {/* Rank / Rating */}
                      <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                          <Text style={styles.metaLabel}>{platform.id === 'codechef' ? 'Star Rating' : 'Rank'}</Text>
                          <Text style={styles.metaValue}>
                            {platform.id === 'codechef' ? `${data.rank} ★` : `#${data.rank}`}
                          </Text>
                        </View>
                        {data.rating && (
                          <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Rating</Text>
                            <Text style={styles.metaValue}>{data.rating}</Text>
                          </View>
                        )}
                      </View>
                    </>
                  ) : (
                     <View style={styles.notSyncedBox}>
                       <Text style={styles.notSyncedText}>Tap sync to fetch</Text>
                     </View>
                  )}
                </View>
              );
            })
          )}
        </View>

        <Pressable 
          style={({pressed}) => [styles.syncButton, pressed && styles.syncButtonPressed]} 
          onPress={fetchStats}
          disabled={loading}
        >
          <Text style={styles.syncButtonText}>
            {loading ? 'SYNCING DATA...' : 'REFRESH STATS'}
          </Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Performance metrics via Public Profiles</Text>
        </View>

      </ScrollView>

      {/* EDIT MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Connect Profiles</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={THEME_BLACK} />
              </Pressable>
            </View>
            <Text style={styles.modalSub}>Enter your usernames to track progress.</Text>

            <ScrollView style={styles.formScroll}>
              {PLATFORMS.map((p) => (
                <View key={p.id} style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{p.name} Handle</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={`e.g. user123`}
                    placeholderTextColor="#A1A1AA"
                    value={handles[p.id]}
                    onChangeText={(text) => setHandles(prev => ({ ...prev, [p.id]: text }))}
                    autoCapitalize="none"
                  />
                </View>
              ))}
            </ScrollView>

            <Pressable style={styles.saveButton} onPress={fetchStats}>
              <Text style={styles.saveButtonText}>SAVE & SYNC</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F5',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandAccent: {
    width: 4,
    height: 20,
    backgroundColor: THEME_RED,
  },
  brandMark: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    color: THEME_BLACK,
  },
  settingsBtn: {
    padding: 8,
    backgroundColor: THEME_GRAY,
    borderRadius: 8,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },

  // HERO CARD
  heroCard: {
    backgroundColor: THEME_DARK_CARD,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroMain: {
    alignItems: 'flex-start',
  },
  bigNumber: {
    color: '#FFF',
    fontSize: 56,
    fontWeight: '800',
    lineHeight: 56,
    letterSpacing: -2,
  },
  bigLabel: {
    color: THEME_RED,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerStat: {
    color: '#D4D4D8',
    fontSize: 14,
    fontWeight: '500',
  },

  // GRID
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  emptyState: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: THEME_BLACK,
    fontWeight: '600',
  },
  emptyLink: {
    fontSize: 14,
    color: THEME_RED,
    marginTop: 8,
    textDecorationLine: 'underline',
  },

  // PLATFORM CARD
  platformCard: {
    width: '47%', // 2 Column
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: THEME_BORDER,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformName: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME_BLACK,
  },
  loadingBox: {
    height: 60,
    justifyContent: 'center',
  },
  statBlock: {
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME_BLACK,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A1A1AA',
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'column',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: THEME_GRAY,
    paddingTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 11,
    color: '#71717A',
  },
  metaValue: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME_BLACK,
  },
  notSyncedBox: {
    height: 40, 
    justifyContent: 'center',
  },
  notSyncedText: {
    fontSize: 12,
    color: '#A1A1AA',
    fontStyle: 'italic',
  },

  // BUTTONS
  syncButton: {
    backgroundColor: THEME_BLACK,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 24,
    alignItems: 'center',
  },
  syncButtonPressed: {
    backgroundColor: THEME_RED,
  },
  syncButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#A1A1AA',
    textTransform: 'uppercase',
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME_BLACK,
  },
  modalSub: {
    fontSize: 14,
    color: '#71717A',
    marginBottom: 20,
  },
  formScroll: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME_BLACK,
    marginBottom: 8,
  },
  input: {
    backgroundColor: THEME_GRAY,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: THEME_BLACK,
  },
  saveButton: {
    backgroundColor: THEME_RED,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
});