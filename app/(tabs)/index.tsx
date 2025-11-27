import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from 'react-native';

import { clearCurrentGuest, getCurrentGuest } from '@/constants/session';

// --- CONFIGURATION ---
const API_KEY = "14951c93f3d11e8ac8bed96dd90e8bc7";
const DEFAULT_CITY = "Hyderabad"; // Default location for the dashboard

// --- THEME CONSTANTS ---
const THEME_RED = '#E62020';
const THEME_BLACK = '#09090B';
const THEME_GRAY = '#F4F4F5';
const THEME_DARK_CARD = '#18181B';

// --- STATIC DATA ---
type QuickLinkRoute =
  | '/todo-tracker'
  | '/coding-tracker'
  | '/holidays'
  | '/room-kathalu'
  | '/kalakandalu'
  | '/vathavarnam'
  | '/job-debblata'
  | '/expense-tracker';

type CommandButton = { label: string; subtitle: string; route: QuickLinkRoute };

const commandButtons: CommandButton[] = [
  { label: 'To-Do Tracker', subtitle: 'Chores & Errands', route: '/todo-tracker' },
  { label: 'Coding Tracker', subtitle: 'Log Commits', route: '/coding-tracker' },
  { label: 'Holidays', subtitle: 'Breaks & Events', route: '/holidays' },
  { label: 'Room Kathalu', subtitle: 'Suite Stories', route: '/room-kathalu' },
  { label: 'Kalakandalu', subtitle: 'Creative Sparks', route: '/kalakandalu' },
  { label: 'Vathavarnam', subtitle: 'Ambience Notes', route: '/vathavarnam' },
  { label: 'Job Debblata', subtitle: 'Opportunities', route: '/job-debblata' },
  { label: 'Expense Tracker', subtitle: 'Shared spends & dues', route: '/expense-tracker' },
];

const kathaluStories = [
  {
    title: 'Midnight Coffee',
    body: 'Brew from the copper pot, open the balcony, and the whole floor smells like home.',
  },
  {
    title: 'Sunrise Hack',
    body: 'Slide the sheer curtains only halfway so the skyline paints the wall gently.',
  },
  {
    title: 'Playlist Ritual',
    body: 'Start with vintage AR Rahman, fade into lo-fi, and the acoustics turn the suite into a studio.',
  },
];

const tonightAgenda = ['Fresh linens', 'Mini bar reset', 'Desk restocked'];

export default function HomeScreen() {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);
  const { width } = useWindowDimensions();
  
  // Weather State
  const [weather, setWeather] = useState({ temp: '--', condition: 'Syncing...' });
  const [loadingWeather, setLoadingWeather] = useState(true);

  // Responsive breakpoints
  const isTablet = width > 600;

  const activeGuest = getCurrentGuest();
  const displayName = activeGuest?.name ?? 'Guest';
  const handleLogout = () => {
    clearCurrentGuest();
    router.replace('/');
  };
  
  // 1. Session Timer Logic
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // 2. Weather Fetch Logic
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${DEFAULT_CITY}&units=metric&appid=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
          setWeather({
            temp: `${Math.round(data.main.temp)}°C`,
            condition: data.weather[0].main // e.g., "Clouds", "Clear"
          });
        }
      } catch (error) {
        console.log('Weather fetch failed', error);
        setWeather({ temp: 'N/A', condition: 'Offline' });
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, []);

  const elapsedLabel = useMemo(() => {
    const hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const seconds = String(elapsed % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }, [elapsed]);

  // Dynamic Status Tiles
  const statusTiles = [
    { label: 'Suite Status', value: 'Ready', meta: 'Cleaned 12:10' },
    { label: 'Concierge', value: '--', meta: 'Offline' },
    { 
      label: 'Climate', 
      value: weather.temp, 
      meta: loadingWeather ? 'Updating...' : `${weather.condition} • Outdoor`,
      isLive: true // Flag to style differently if needed
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* Minimal Header */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <View style={styles.brandAccent} />
          <Text style={styles.brandMark}>REDLINE</Text>
        </View>
        <View style={styles.headerActions}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>305-B</Text>
          </View>
          <Pressable style={styles.logoutButton} onPress={handleLogout} hitSlop={10}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* HERO SECTION - Dark Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.greetingText}>Hello, {displayName}</Text>
              <Text style={styles.subGreetingText}>Systems nominal.</Text>
            </View>
            <View style={styles.timerContainer}>
              <View style={styles.timerDot} />
              <Text style={styles.timerText}>{elapsedLabel}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.agendaContainer}>
            <Text style={styles.sectionLabelDark}>UPCOMING AGENDA</Text>
            <View style={styles.agendaRow}>
              {tonightAgenda.map((item, index) => (
                <View key={index} style={styles.agendaChip}>
                  <Text style={styles.agendaText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* STATUS TILES (With Live Weather) */}
        <View style={styles.statusRow}>
          {statusTiles.map((tile, index) => (
            <View key={index} style={styles.statusTile}>
              <Text style={styles.statusLabel}>{tile.label}</Text>
              
              {/* Special rendering for Live tiles if loading */}
              {tile.isLive && loadingWeather ? (
                <ActivityIndicator size="small" color={THEME_BLACK} style={{ alignSelf: 'flex-start', marginVertical: 4 }} />
              ) : (
                <Text style={[styles.statusValue, tile.isLive && styles.liveValue]}>
                  {tile.value}
                </Text>
              )}
              
              <Text style={styles.statusMeta}>{tile.meta}</Text>
            </View>
          ))}
        </View>

        {/* COMMAND GRID */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Command Center</Text>
          <View style={styles.grid}>
            {commandButtons.map((btn) => (
              <Pressable
                key={btn.route}
                style={({ pressed }) => [
                  styles.gridButton,
                  isTablet ? styles.gridButtonTablet : styles.gridButtonMobile,
                  pressed && styles.gridButtonPressed
                ]}
                onPress={() => router.push(btn.route)}
              >
                <View style={styles.gridIconPlaceholder} />
                <View>
                  <Text style={styles.gridLabel}>{btn.label}</Text>
                  <Text style={styles.gridSub}>{btn.subtitle}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* STORIES (Horizontal Scroll) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Room Kathalu</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storyScroll}>
            {kathaluStories.map((story, index) => (
              <View key={index} style={styles.storyCard}>
                <View style={styles.storyAccent} />
                <Text style={styles.storyTitle}>{story.title}</Text>
                <Text style={styles.storyBody} numberOfLines={3}>{story.body}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* FOOTER NOTE */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerNote}>
            Redline Residence • Service response &lt; 120s
          </Text>
        </View>

      </ScrollView>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F5',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandAccent: {
    width: 4,
    height: 18,
    backgroundColor: THEME_RED,
    borderRadius: 2,
  },
  brandMark: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    color: THEME_BLACK,
  },
  badge: {
    backgroundColor: THEME_GRAY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME_BLACK,
  },
  logoutButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: THEME_RED,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // --- HERO CARD ---
  heroCard: {
    backgroundColor: THEME_DARK_CARD,
    margin: 24,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subGreetingText: {
    color: '#A1A1AA',
    fontSize: 14,
    marginTop: 4,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    gap: 8,
  },
  timerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME_RED,
  },
  timerText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 20,
  },
  sectionLabelDark: {
    color: '#52525B',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  agendaContainer: {
    gap: 0,
  },
  agendaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  agendaChip: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  agendaText: {
    color: '#E4E4E7',
    fontSize: 12,
    fontWeight: '500',
  },

  // --- STATUS TILES ---
  statusRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 32,
  },
  statusTile: {
    flex: 1,
    backgroundColor: THEME_GRAY,
    padding: 16,
    borderRadius: 16,
    gap: 4,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#71717A',
    textTransform: 'uppercase',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME_BLACK,
    marginTop: 4,
  },
  liveValue: {
    color: THEME_RED, // Highlight the live weather value
  },
  statusMeta: {
    fontSize: 11,
    color: '#A1A1AA',
  },

  // --- COMMAND GRID ---
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_BLACK,
    marginLeft: 24,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
  },
  gridButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    padding: 16,
    borderRadius: 16,
    justifyContent: 'space-between',
    gap: 12,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  gridButtonMobile: {
    width: '48%', // 2 columns
  },
  gridButtonTablet: {
    width: '31%', // 3 columns
  },
  gridButtonPressed: {
    borderColor: THEME_RED,
    backgroundColor: '#FEF2F2',
  },
  gridIconPlaceholder: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME_RED,
    opacity: 0.2,
  },
  gridLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME_BLACK,
  },
  gridSub: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
  },

  // --- STORIES ---
  storyScroll: {
    paddingHorizontal: 24,
    gap: 16,
  },
  storyCard: {
    width: 260,
    backgroundColor: THEME_GRAY,
    padding: 20,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  storyAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: THEME_RED,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME_BLACK,
    marginTop: 8,
    marginBottom: 8,
  },
  storyBody: {
    fontSize: 13,
    color: '#52525B',
    lineHeight: 20,
  },

  // --- FOOTER ---
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    opacity: 0.5,
  },
  footerNote: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }
});