import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View
} from 'react-native';

import { findGuest } from '@/constants/guests';
import { setCurrentGuest } from '@/constants/session';

// --- THEME COLORS ---
const THEME_RED = '#E62020'; 
const THEME_BLACK = '#09090B';
const THEME_GRAY = '#F4F4F5';

export default function LandingScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [focusField, setFocusField] = useState<'name' | 'pass' | null>(null);

  // Responsive Checks
  const isSmallDevice = height < 700;
  const isTablet = width > 500;

  const handleEnter = () => {
    const guest = findGuest(name, passcode);
    if (!guest) {
      setError('Evadavi ra nuvuuu evadavi...🔥');
      return;
    }

    setError('');
    setCurrentGuest(guest);
    router.replace('/(tabs)');
  };

  const isButtonEnabled = name.length > 0 && passcode.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent, 
            { paddingBottom: isSmallDevice ? 20 : 40 }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* Main Content Wrapper (Constrained width for tablets) */}
          <View style={[styles.mainWrapper, isTablet && styles.tabletWrapper]}>
            
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.brandContainer}>
                <View style={styles.brandAccent} />
                <Text style={styles.brandMark}>REDLINE</Text>
              </View>
            </View>

            <View style={styles.content}>
              <View style={styles.textBlock}>
                <Text style={[styles.welcomeText, isSmallDevice && styles.welcomeTextSmall]}>
                  Arrival
                </Text>
                <Text style={[styles.roomText, isSmallDevice && styles.roomTextSmall]}>
                  Suite 305-B
                </Text>
                <Text style={styles.instructionText}>
                  Enter your credentials to access the friend suite.
                </Text>
              </View>

              <View style={styles.form}>
                {/* Name Input */}
                <View>
                  <Text style={[styles.label, focusField === 'name' && styles.labelActive]}>
                    GUEST NAME
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={(value) => {
                      setName(value);
                      setError('');
                    }}
                    onFocus={() => setFocusField('name')}
                    onBlur={() => setFocusField(null)}
                    placeholder="Ex. Bunny"
                    placeholderTextColor="#A1A1AA"
                    selectionColor={THEME_RED}
                    style={[
                      styles.input, 
                      focusField === 'name' && styles.inputFocused,
                      error ? styles.inputError : null
                    ]}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>

                {/* Passcode Input */}
                <View>
                  <Text style={[styles.label, focusField === 'pass' && styles.labelActive]}>
                    PASSCODE
                  </Text>
                  <TextInput
                    value={passcode}
                    onChangeText={(value) => {
                      setPasscode(value);
                      setError('');
                    }}
                    onFocus={() => setFocusField('pass')}
                    onBlur={() => setFocusField(null)}
                    placeholder="••••••"
                    placeholderTextColor="#A1A1AA"
                    selectionColor={THEME_RED}
                    secureTextEntry
                    style={[
                      styles.input, 
                      focusField === 'pass' && styles.inputFocused,
                      error ? styles.inputError : null
                    ]}
                  />
                </View>

                {/* Error Message Space (Fixed height to prevent jumpiness) */}
                <View style={styles.errorContainer}>
                  {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                  ) : null}
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.enterButton,
                  !isButtonEnabled && styles.enterButtonDisabled,
                  pressed && isButtonEnabled && styles.enterButtonPressed
                ]}
                onPress={handleEnter}
                disabled={!isButtonEnabled}
              >
                <Text style={styles.enterButtonText}>ENTER SUITE</Text>
              </Pressable>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Redline Residence • Exclusive Access</Text>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
  },
  mainWrapper: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between', // Pushes footer down
    width: '100%',
  },
  tabletWrapper: {
    maxWidth: 500,
    alignSelf: 'center',
    paddingHorizontal: 0, // Reset padding for tablet centered view
  },
  header: {
    paddingTop: 24,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  textBlock: {
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 48,
    fontWeight: '800',
    color: THEME_BLACK,
    letterSpacing: -1,
    lineHeight: 48,
  },
  welcomeTextSmall: {
    fontSize: 36,
    lineHeight: 40,
  },
  roomText: {
    fontSize: 24,
    color: THEME_RED,
    fontWeight: '600',
    marginTop: 4,
  },
  roomTextSmall: {
    fontSize: 20,
  },
  instructionText: {
    marginTop: 12,
    fontSize: 15,
    color: '#71717A',
    lineHeight: 22,
    maxWidth: '90%',
  },
  form: {
    gap: 20,
    marginBottom: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A1A1AA',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  labelActive: {
    color: THEME_RED,
  },
  input: {
    backgroundColor: THEME_GRAY,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16, // Slightly reduced for better responsiveness
    fontSize: 16,
    fontWeight: '500',
    color: THEME_BLACK,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputFocused: {
    backgroundColor: '#FFF',
    borderColor: THEME_RED,
    shadowColor: THEME_RED,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputError: {
    borderColor: '#E62020',
    backgroundColor: '#FEF2F2',
  },
  errorContainer: {
    height: 20, // Reserves space so layout doesn't jump
    justifyContent: 'center',
  },
  errorText: {
    color: '#E62020',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  enterButton: {
    borderRadius: 12,
    height: 56,
    backgroundColor: THEME_RED,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME_RED,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 8,
  },
  enterButtonDisabled: {
    backgroundColor: '#F4F4F5',
    shadowOpacity: 0,
    elevation: 0,
  },
  enterButtonPressed: {
    transform: [{ scale: 0.97 }],
    backgroundColor: '#B91C1C',
  },
  enterButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 1,
  },
  footer: {
    paddingTop: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  footerText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});