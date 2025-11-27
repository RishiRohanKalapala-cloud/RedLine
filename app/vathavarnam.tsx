import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

// --- CONFIGURATION ---
const API_KEY = '14951c93f3d11e8ac8bed96dd90e8bc7';

// --- THEME COLORS ---
const THEME_RED = '#E62020';
const THEME_BLACK = '#09090B';
const THEME_GRAY = '#F4F4F5';
const THEME_DARK_CARD = '#18181B';
const THEME_BORDER = '#E4E4E7';

type GeoSuggestion = {
  name: string;
  lat: number;
  lon: number;
  state?: string;
  country: string;
};

type WeatherCard = {
  id: number;
  name: string;
  sys: { country: string };
  weather: { description: string }[];
  main: {
    temp: number;
    feels_like: number;
    temp_max: number;
    temp_min: number;
    humidity: number;
  };
  wind: { speed: number };
  visibility: number;
};

export default function VathavarnamScreen() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [weatherCards, setWeatherCards] = useState<WeatherCard[]>([]);
  const [error, setError] = useState('');

  // Debounce logic: Wait for user to stop typing before calling API
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 2) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // 1. Fetch City Suggestions (Geocoding API)
  const fetchSuggestions = async (text: string) => {
    setIsSearching(true);
    try {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=5&appid=${API_KEY}`;
      const response = await fetch(url);
      const data = (await response.json()) as GeoSuggestion[];
      setSuggestions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('Geo Error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // 2. Add City (Weather API via Coords)
  const addCity = async (cityData: GeoSuggestion) => {
    // Check if already added (prevent duplicates)
    const exists = weatherCards.find(
      card => card.name === cityData.name && card.sys.country === cityData.country
    );

    if (exists) {
      setError(`${cityData.name} is already active.`);
      setQuery('');
      setSuggestions([]);
      Keyboard.dismiss();
      return;
    }

    Keyboard.dismiss();
    setQuery('');
    setSuggestions([]);
    setError('');

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${cityData.lat}&lon=${cityData.lon}&units=metric&appid=${API_KEY}`;
      const response = await fetch(url);
      const data = (await response.json()) as WeatherCard;

      if (response.ok) {
        setWeatherCards(prev => [data, ...prev]);
      } else {
        setError('Could not sync weather data.');
      }
    } catch (err) {
      setError('Network connection failed.');
    }
  };

  const removeCard = (id: number) => {
    setWeatherCards(prev => prev.filter(item => item.id !== id));
  };

  const capitalize = (str?: string) => (str ? str.replace(/\b\w/g, l => l.toUpperCase()) : '');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <View style={styles.brandAccent} />
          <Text style={styles.brandMark}>VATHAVARNAM</Text>
        </View>
        <Text style={styles.countBadge}>{weatherCards.length} ACTIVE</Text>
      </View>

      <View style={styles.container}>
        
        {/* SEARCH & AUTOCOMPLETE SECTION */}
        <View style={styles.searchContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Search city (e.g. London)"
              placeholderTextColor="#A1A1AA"
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              returnKeyType="search"
            />
            {isSearching && (
              <ActivityIndicator style={styles.loader} size="small" color={THEME_RED} />
            )}
          </View>

          {/* SUGGESTIONS DROPDOWN (Absolute Positioned) */}
          {suggestions.length > 0 && (
            <View style={styles.suggestionsBox}>
              {suggestions.map((item, index) => (
                <Pressable
                  key={`${item.lat}-${item.lon}-${index}`}
                  style={({ pressed }) => [
                    styles.suggestionItem,
                    pressed && styles.suggestionItemPressed
                  ]}
                  onPress={() => addCity(item)}
                >
                  <Text style={styles.suggestionText}>
                    {item.name}
                    {item.state ? `, ${item.state}` : ''}
                  </Text>
                  <Text style={styles.suggestionSub}>
                    {item.country}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* ERROR BANNER */}
        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        {/* WEATHER CARDS LIST */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {weatherCards.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Active Feeds</Text>
              <Text style={styles.emptySubtitle}>
                Type above to find a city and add it to your dashboard.
              </Text>
            </View>
          ) : (
            weatherCards.map((weather) => (
              <View key={weather.id} style={styles.weatherCard}>
                
                {/* Remove Button */}
                <Pressable 
                  style={styles.closeButton} 
                  onPress={() => removeCard(weather.id)}
                  hitSlop={10}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </Pressable>

                <View style={styles.weatherHeader}>
                  <View>
                    <Text style={styles.cityText}>{weather.name}</Text>
                    <Text style={styles.countryText}>{weather.sys.country}</Text>
                  </View>
                  <Text style={styles.conditionText}>
                    {capitalize(weather.weather[0].description)}
                  </Text>
                </View>

                <View style={styles.tempContainer}>
                  <Text style={styles.tempText}>{Math.round(weather.main.temp)}°</Text>
                  <View style={styles.tempMeta}>
                    <Text style={styles.feelText}>
                      Feels {Math.round(weather.main.feels_like)}°
                    </Text>
                    <Text style={styles.hlText}>
                      H:{Math.round(weather.main.temp_max)}° L:{Math.round(weather.main.temp_min)}°
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>HUMIDITY</Text>
                    <Text style={styles.statValue}>{weather.main.humidity}%</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>WIND</Text>
                    <Text style={styles.statValue}>{weather.wind.speed} m/s</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>VISIBILITY</Text>
                    <Text style={styles.statValue}>{(weather.visibility / 1000).toFixed(1)} km</Text>
                  </View>
                </View>
              </View>
            ))
          )}

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Redline Ambience • OpenWeather API
            </Text>
          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  countBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A1A1AA',
    letterSpacing: 1,
  },
  
  // SEARCH SECTION
  searchContainer: {
    zIndex: 100, // Important: Keeps dropdown on top
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  inputWrapper: {
    backgroundColor: THEME_GRAY,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: THEME_BLACK,
    fontWeight: '500',
  },
  loader: {
    marginRight: 12,
  },
  
  // DROPDOWN SUGGESTIONS
  suggestionsBox: {
    position: 'absolute',
    top: 75, // Just below input
    left: 24,
    right: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME_BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME_GRAY,
  },
  suggestionItemPressed: {
    backgroundColor: '#FAFAFA',
  },
  suggestionText: {
    fontSize: 14,
    color: THEME_BLACK,
    fontWeight: '500',
    flex: 1,
  },
  suggestionSub: {
    fontSize: 12,
    color: '#A1A1AA',
    fontWeight: '600',
    marginLeft: 8,
  },

  // ERROR
  errorBanner: {
    marginHorizontal: 24,
    marginBottom: 8,
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '600',
  },

  // SCROLL CONTENT
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 10,
    zIndex: 1, // Lower than dropdown
  },

  // EMPTY STATE
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    opacity: 0.6,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_BLACK,
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#71717A',
    lineHeight: 20,
  },

  // WEATHER CARD
  weatherCard: {
    backgroundColor: THEME_DARK_CARD,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 18,
    lineHeight: 20,
    marginTop: -2,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginRight: 20, 
  },
  cityText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  countryText: {
    color: THEME_RED,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  conditionText: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'right',
    marginTop: 6,
  },
  tempContainer: {
    marginVertical: 16,
  },
  tempText: {
    color: '#FFF',
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -2,
    lineHeight: 64,
  },
  tempMeta: {
    marginTop: 8,
  },
  feelText: {
    color: '#E4E4E7',
    fontSize: 15,
    fontWeight: '500',
  },
  hlText: {
    color: '#71717A',
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    gap: 4,
  },
  statLabel: {
    color: '#52525B', 
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statValue: {
    color: '#E4E4E7',
    fontSize: 13,
    fontWeight: '600',
  },

  // FOOTER
  footer: {
    marginTop: 20,
    alignItems: 'center',
    opacity: 0.4,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#A1A1AA',
  },
});