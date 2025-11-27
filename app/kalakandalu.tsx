import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

// --- THEME CONSTANTS ---
const THEME_RED = '#E62020';
const THEME_BLACK = '#09090B';
const THEME_GRAY = '#F4F4F5';
const THEME_DARK_CARD = '#18181B';
const SCREEN_WIDTH = Dimensions.get('window').width;

// --- MOCK DATA (FUNNY MOMENTS) ---
const INITIAL_MOMENTS = [
  {
    id: 1,
    title: "3AM Maggi Disaster",
    desc: "Who knew induction stoves were this fast? 💀",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=600&auto=format&fit=crop",
    likes: 42,
    height: 200,
  },
  {
    id: 2,
    title: "The 'Focus' Face",
    desc: "Coding since 12 hours. Soul has left the body.",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop",
    likes: 128,
    height: 260,
  },
  {
    id: 3,
    title: "FIFA Rage Quit",
    desc: "Controller survived. TV almost didn't.",
    image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=600&auto=format&fit=crop",
    likes: 85,
    height: 180,
  },
  {
    id: 4,
    title: "Sleeping Tetris",
    desc: "4 people, 1 sofa. Physics defied.",
    image: "https://images.unsplash.com/photo-1525253013412-55c1a69a5738?q=80&w=600&auto=format&fit=crop",
    likes: 210,
    height: 240,
  },
  {
    id: 5,
    title: "Balcony Vibes",
    desc: "Trying to be aesthetic but spillin' tea everywhere.",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600&auto=format&fit=crop",
    likes: 56,
    height: 220,
  },
  {
    id: 6,
    title: "Laundry Mountain",
    desc: "It's not a pile, it's a structural art piece.",
    image: "https://images.unsplash.com/photo-1563293868-b3917d598687?q=80&w=600&auto=format&fit=crop",
    likes: 99,
    height: 190,
  },
];

export default function KalakandaluScreen() {
  const [moments, setMoments] = useState(INITIAL_MOMENTS);

  // Separate into two columns for Masonry layout
  const leftColumn = moments.filter((_, i) => i % 2 === 0);
  const rightColumn = moments.filter((_, i) => i % 2 !== 0);

  const handleLike = (id) => {
    setMoments(prev => prev.map(m => 
      m.id === id ? { ...m, likes: m.likes + 1 } : m
    ));
  };

  const handleUpload = () => {
    Alert.alert("Upload Moment", "Camera module would open here to capture the chaos.");
  };

  const MomentCard = ({ item }) => (
    <Pressable 
      style={styles.cardContainer} 
      onPress={() => handleLike(item.id)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={[styles.cardImage, { height: item.height }]} 
        resizeMode="cover"
      />
      
      {/* Gradient Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.cardOverlay}
      >
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>
        
        <View style={styles.cardFooter}>
          <View style={styles.likeBadge}>
            <MaterialCommunityIcons name="fire" size={14} color={THEME_RED} />
            <Text style={styles.likeText}>{item.likes} LOLs</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <View style={styles.brandAccent} />
          <Text style={styles.brandMark}>KALAKANDALU</Text>
        </View>
        <Pressable style={styles.uploadBtn} onPress={handleUpload}>
          <MaterialCommunityIcons name="camera-plus" size={22} color="#FFF" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Hall of Chaos</Text>
          <Text style={styles.heroSub}>
            The unscripted, unfiltered, and absolutely hilarious moments of Suite 305-B.
          </Text>
        </View>

        {/* MASONRY GRID */}
        <View style={styles.masonryContainer}>
          {/* Left Column */}
          <View style={styles.column}>
            {leftColumn.map(item => <MomentCard key={item.id} item={item} />)}
          </View>
          
          {/* Right Column */}
          <View style={styles.column}>
            {rightColumn.map(item => <MomentCard key={item.id} item={item} />)}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Tap a card to drop a LOL • Keep it candid</Text>
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
  uploadBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME_BLACK,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME_RED,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  content: {
    paddingBottom: 40,
  },

  // HERO
  heroSection: {
    padding: 24,
    paddingBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME_BLACK,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSub: {
    fontSize: 15,
    color: '#71717A',
    lineHeight: 22,
  },

  // MASONRY LAYOUT
  masonryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  column: {
    flex: 1,
    gap: 12,
  },

  // CARD
  cardContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: THEME_GRAY,
  },
  cardImage: {
    width: '100%',
    // Height is dynamic via props
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingTop: 40,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardDesc: {
    color: '#E4E4E7',
    fontSize: 11,
    marginBottom: 8,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    backdropFilter: 'blur(10px)', // iOS only effect usually
  },
  likeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },

  // FOOTER
  footer: {
    marginTop: 40,
    alignItems: 'center',
    opacity: 0.5,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#A1A1AA',
    letterSpacing: 1,
  },
});