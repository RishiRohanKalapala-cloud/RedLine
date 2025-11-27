import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { clearCurrentGuest } from '@/constants/session';

// --- CONTENT CONFIGURATION ---
const APP_VERSION = 'v1.0.4 • Beta Build';
const DEVELOPER_NAME = 'Bunny';
const PROJECT_CODENAME = 'Redline Residence'; // Fixed variable name

const APP_CAUSE = 
  "To engineer a digital sanctuary that feels less like a utility and more like a living space. " +
  "This project explores the intersection of code, calm, and digital ownership—proving that software can have a soul.";

const QUOTE = 
  "“The details are not the details. They make the design.”";
const QUOTE_AUTHOR = "Charles Eames";

// --- THEME COLORS ---
const THEME_RED = '#E62020';
const THEME_BLACK = '#09090B';
const THEME_GRAY = '#F4F4F5';

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* Minimal Header */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <View style={styles.brandAccent} />
          <Text style={styles.brandMark}>EXPLORE</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* SECTION 1: The Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>{QUOTE}</Text>
          <Text style={styles.quoteAuthor}>— {QUOTE_AUTHOR}</Text>
        </View>

        <View style={styles.divider} />

        {/* SECTION 2: The Manifesto (Cause) */}
        <View style={styles.manifestoSection}>
          <Text style={styles.label}>THE PURPOSE</Text>
          <Text style={styles.manifestoText}>{APP_CAUSE}</Text>
        </View>

        <View style={styles.divider} />

        {/* SECTION 3: Technical Metadata */}
        <View style={styles.metaSection}>
          <Text style={styles.label}>SYSTEM DATA</Text>
          
          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Version</Text>
            <Text style={styles.metaValue}>{APP_VERSION}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Developer</Text>
            <Text style={styles.metaValue}>{DEVELOPER_NAME}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Codename</Text>
            <Text style={styles.metaValue}>{PROJECT_CODENAME}</Text>
          </View>
        </View>

        {/* Decorative Footer + Logout */}
        <View style={styles.footer}>
          <View style={styles.footerLine} />
          <Text style={styles.footerText}>MADE WITH INTENT</Text>
          <Pressable
            accessibilityRole="button"
            style={styles.logoutButton}
            onPress={() => {
              clearCurrentGuest();
              router.replace('/');
            }}
            hitSlop={10}
          >
            <Text style={styles.logoutLabel}>Logout</Text>
          </Pressable>
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
    paddingVertical: 24,
    paddingHorizontal: 28,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandAccent: {
    width: 4,
    height: 24,
    backgroundColor: THEME_RED,
  },
  brandMark: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 3,
    color: THEME_BLACK,
  },
  content: {
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  divider: {
    height: 1,
    backgroundColor: THEME_GRAY,
    marginVertical: 32,
  },
  
  // Quote Styles
  quoteContainer: {
    marginTop: 20,
  },
  quoteText: {
    fontSize: 32,
    fontWeight: '700',
    color: THEME_BLACK,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  quoteAuthor: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: THEME_RED,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Manifesto Styles
  manifestoSection: {
    gap: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A1A1AA', // Light gray label
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  manifestoText: {
    fontSize: 16,
    color: '#52525B', // Dark gray text
    lineHeight: 26,
    fontWeight: '400',
  },

  // Meta Styles
  metaSection: {
    gap: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FAFAFA',
  },
  metaKey: {
    fontSize: 14,
    color: '#71717A',
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 14,
    color: THEME_BLACK,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },

  // Footer
  footer: {
    marginTop: 60,
    alignItems: 'center',
    opacity: 1,
    gap: 16,
  },
  footerLine: {
    width: 40,
    height: 4,
    backgroundColor: '#000',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  logoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: THEME_RED,
  },
  logoutLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});