import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
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
const RAPID_API_KEY = ""; // Enter Key if you have one

// --- THEME CONSTANTS ---
const THEME_RED = '#E62020';
const THEME_BLACK = '#09090B';
const THEME_GRAY = '#F4F4F5';
const THEME_DARK_CARD = '#18181B';
const THEME_BORDER = '#E4E4E7';
const SCREEN_WIDTH = Dimensions.get('window').width;

// --- TOP MNC DATA (Official Portals) ---
const TOP_MNCS = [
  { id: 'google', name: 'Google', domain: 'google.com', url: 'https://careers.google.com' },
  { id: 'microsoft', name: 'Microsoft', domain: 'microsoft.com', url: 'https://careers.microsoft.com' },
  { id: 'cognizant', name: 'Cognizant', domain: 'cognizant.com', url: 'https://careers.cognizant.com' },
  { id: 'swiggy', name: 'Swiggy', domain: 'swiggy.com', url: 'https://www.swiggy.com/careers' },
  { id: 'zomato', name: 'Zomato', domain: 'zomato.com', url: 'https://www.zomato.com/careers' },
  { id: 'linkedin', name: 'LinkedIn', domain: 'linkedin.com', url: 'https://www.linkedin.com/jobs' },
  { id: 'amazon', name: 'Amazon', domain: 'amazon.com', url: 'https://www.amazon.jobs/' },
  { id: 'tcs', name: 'Tata (TCS)', domain: 'tcs.com', url: 'https://www.tcs.com/careers' },
  { id: 'infosys', name: 'Infosys', domain: 'infosys.com', url: 'https://www.infosys.com/careers.html' },
  { id: 'accenture', name: 'Accenture', domain: 'accenture.com', url: 'https://www.accenture.com/in-en/careers' },
  { id: 'qualcomm', name: 'Qualcomm', domain: 'qualcomm.com', url: 'https://qualcomm.com/company/careers' },
  { id: 'capgemini', name: 'Capgemini', domain: 'capgemini.com', url: 'https://www.capgemini.com/in-en/careers/' },
  { id: 'deloitte', name: 'Deloitte', domain: 'deloitte.com', url: 'https://www2.deloitte.com/ui/en/careers.html' },
  { id: 'virtusa', name: 'Virtusa', domain: 'virtusa.com', url: 'https://www.virtusa.com/careers' },
];

// --- MOCK JOBS (Fallback) ---
const MOCK_JOBS = [
  {
    job_id: '1',
    job_title: 'Senior React Native Engineer',
    employer_name: 'TechFlow',
    employer_logo: 'https://logo.clearbit.com/techflow.com',
    job_city: 'Hyderabad',
    job_is_remote: true,
    job_employment_type: 'FULLTIME',
    job_apply_link: 'https://linkedin.com',
    job_posted_at_datetime_utc: '2023-11-25T12:00:00.000Z'
  },
  {
    job_id: '2',
    job_title: 'Frontend Developer (SDE-II)',
    employer_name: 'Swiggy',
    employer_logo: 'https://logo.clearbit.com/swiggy.com',
    job_city: 'Bangalore',
    job_is_remote: false,
    job_employment_type: 'FULLTIME',
    job_apply_link: 'https://swiggy.com/careers',
    job_posted_at_datetime_utc: '2023-11-24T09:30:00.000Z'
  },
];

export default function JobDebblataScreen() {
  const [activeTab, setActiveTab] = useState('mnc'); // 'mnc' | 'search' | 'pipeline'
  const [query, setQuery] = useState('React Native Developer');
  const [location, setLocation] = useState('India');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [pipeline, setPipeline] = useState([]);

  // --- ACTIONS ---
  
  const handleSearch = async () => {
    setLoading(true);
    setJobs([]);

    if (!RAPID_API_KEY) {
      setTimeout(() => {
        setJobs(MOCK_JOBS);
        setLoading(false);
      }, 1500);
      return;
    }

    try {
      const response = await fetch(`https://jsearch.p.rapidapi.com/search?query=${query} in ${location}&num_pages=1`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPID_API_KEY,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
      });
      const data = await response.json();
      setJobs(data.data || MOCK_JOBS);
    } catch (error) {
      setJobs(MOCK_JOBS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'search' && jobs.length === 0) {
      handleSearch();
    }
  }, [activeTab]);

  const addToPipeline = (job) => {
    const exists = pipeline.find(j => j.job_id === job.job_id);
    if (exists) {
      Alert.alert("Already Tracked", "This job is already in your pipeline.");
      return;
    }
    const newJob = { ...job, status: 'Applied', date_added: new Date().toLocaleDateString() };
    setPipeline([newJob, ...pipeline]);
    Alert.alert("Added to Pipeline", "Good luck! Track status in the Pipeline tab.");
  };

  const openLink = (url) => {
    Linking.openURL(url).catch(() => Alert.alert("Error", "Cannot open link"));
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Today' : `${days}d ago`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <View style={styles.brandAccent} />
          <Text style={styles.brandMark}>JOB DEBBLATA</Text>
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.statsLabel}>PIPELINE</Text>
          <Text style={styles.statsValue}>{pipeline.length}</Text>
        </View>
      </View>

      {/* TABS */}
      <View style={styles.tabContainer}>
        <Pressable 
          style={[styles.tab, activeTab === 'mnc' && styles.tabActive]} 
          onPress={() => setActiveTab('mnc')}
        >
          <Text style={[styles.tabText, activeTab === 'mnc' && styles.tabTextActive]}>Top MNCs</Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, activeTab === 'search' && styles.tabActive]} 
          onPress={() => setActiveTab('search')}
        >
          <Text style={[styles.tabText, activeTab === 'search' && styles.tabTextActive]}>Search</Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, activeTab === 'pipeline' && styles.tabActive]} 
          onPress={() => setActiveTab('pipeline')}
        >
          <Text style={[styles.tabText, activeTab === 'pipeline' && styles.tabTextActive]}>Pipeline</Text>
        </Pressable>
      </View>

      {/* --- TAB: TOP MNCs --- */}
      {activeTab === 'mnc' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Official Career Portals</Text>
            <Text style={styles.sectionSub}>Direct links to major hiring hubs.</Text>
          </View>
          
          <View style={styles.mncGrid}>
            {TOP_MNCS.map((company) => (
              <Pressable 
                key={company.id} 
                style={({pressed}) => [styles.mncCard, pressed && styles.mncCardPressed]}
                onPress={() => openLink(company.url)}
              >
                <View style={styles.logoContainer}>
                  <Image 
                    source={{ uri: `https://logo.clearbit.com/${company.domain}` }} 
                    style={styles.logoImage}
                    resizeMode="contain"
                    defaultSource={{ uri: 'https://via.placeholder.com/60.png?text=Logo' }}
                  />
                </View>
                <Text style={styles.mncName}>{company.name}</Text>
                <View style={styles.visitBadge}>
                  <Text style={styles.visitText}>VISIT CAREERS</Text>
                  <MaterialCommunityIcons name="arrow-right" size={12} color={THEME_RED} />
                </View>
              </Pressable>
            ))}
          </View>
          <View style={styles.footerSpacer} />
        </ScrollView>
      )}

      {/* --- TAB: SEARCH --- */}
      {activeTab === 'search' && (
        <>
          <View style={styles.searchSection}>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="briefcase-search-outline" size={20} color="#A1A1AA" />
                <TextInput
                  style={styles.input}
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Role (e.g. React Native)"
                  placeholderTextColor="#A1A1AA"
                />
              </View>
              <View style={[styles.inputWrapper, { flex: 0.6 }]}>
                <MaterialCommunityIcons name="map-marker-outline" size={20} color="#A1A1AA" />
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Loc"
                  placeholderTextColor="#A1A1AA"
                />
              </View>
            </View>
            <Pressable style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>SEARCH OPPORTUNITIES</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.centerBox}>
                <ActivityIndicator size="large" color={THEME_RED} />
                <Text style={styles.loadingText}>Fetching Opportunities...</Text>
              </View>
            ) : (
              jobs.map((job) => (
                <View key={job.job_id} style={styles.jobCard}>
                  <View style={styles.jobHeader}>
                    {/* Dynamic Logo */}
                    <Image 
                      source={{ uri: job.employer_logo || `https://logo.clearbit.com/${job.employer_name?.replace(/\s+/g, '')}.com` }} 
                      style={styles.jobLogo}
                    />
                    <View style={styles.jobInfo}>
                      <Text style={styles.jobTitle} numberOfLines={1}>{job.job_title}</Text>
                      <Text style={styles.companyName}>{job.employer_name}</Text>
                    </View>
                    <Text style={styles.timeAgo}>{getTimeAgo(job.job_posted_at_datetime_utc)}</Text>
                  </View>

                  <View style={styles.tagRow}>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>{job.job_city || 'Remote'}</Text>
                    </View>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>{job.job_employment_type}</Text>
                    </View>
                  </View>

                  <View style={styles.actionRow}>
                    <Pressable style={styles.applyButton} onPress={() => addToPipeline(job)}>
                      <Text style={styles.applyButtonText}>Track Application</Text>
                    </Pressable>
                    <Pressable style={styles.linkButton} onPress={() => openLink(job.job_apply_link)}>
                      <MaterialCommunityIcons name="open-in-new" size={20} color={THEME_BLACK} />
                    </Pressable>
                  </View>
                </View>
              ))
            )}
            <View style={styles.footerSpacer} />
          </ScrollView>
        </>
      )}

      {/* --- TAB: PIPELINE --- */}
      {activeTab === 'pipeline' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {pipeline.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="clipboard-list-outline" size={48} color="#D4D4D8" />
              <Text style={styles.emptyTitle}>Pipeline Empty</Text>
              <Text style={styles.emptySub}>Apply to jobs or visit MNC portals to fill this up.</Text>
            </View>
          ) : (
            pipeline.map((job) => (
              <View key={job.job_id} style={styles.pipelineCard}>
                <View style={styles.pipelineHeader}>
                  <Text style={styles.jobTitle}>{job.job_title}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{job.status}</Text>
                  </View>
                </View>
                <Text style={styles.companyName}>{job.employer_name}</Text>
                
                <View style={styles.divider} />
                
                <View style={styles.pipelineFooter}>
                  <Text style={styles.pipelineDate}>Added: {job.date_added}</Text>
                  <Pressable onPress={() => openLink(job.job_apply_link)}>
                    <Text style={styles.pipelineLink}>View Description</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

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
  statsContainer: {
    alignItems: 'flex-end',
  },
  statsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A1A1AA',
  },
  statsValue: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME_RED,
  },

  // TABS
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
    marginBottom: 8, // Reduced slightly as requested spacer is in content
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: THEME_GRAY,
  },
  tabActive: {
    backgroundColor: THEME_BLACK,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#71717A',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },

  // CONTENT
  content: {
    paddingHorizontal: 24,
    paddingTop: 24, // Added PADDING here to separate filter/tabs from content
    paddingBottom: 40,
  },

  // MNC GRID
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_BLACK,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: '#71717A',
  },
  mncGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  mncCard: {
    width: (SCREEN_WIDTH - 64) / 2, // 2 Column Grid
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME_BORDER,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 8,
  },
  mncCardPressed: {
    backgroundColor: '#FAFAFA',
    borderColor: THEME_RED,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  mncName: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME_BLACK,
    marginBottom: 12,
    textAlign: 'center',
  },
  visitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  visitText: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME_RED,
  },

  // SEARCH SECTION
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 4, // Reduced to rely on content padding for spacing
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_GRAY,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: THEME_BLACK,
  },
  searchButton: {
    backgroundColor: THEME_RED,
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME_RED,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },

  centerBox: {
    marginTop: 60,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600',
  },

  // JOB CARD
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME_BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  jobLogo: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F4F4F5',
  },
  jobInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME_BLACK,
    marginBottom: 2,
  },
  companyName: {
    fontSize: 13,
    color: '#71717A',
    fontWeight: '500',
  },
  timeAgo: {
    fontSize: 11,
    color: '#A1A1AA',
    fontWeight: '600',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: THEME_GRAY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    color: '#52525B',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  applyButton: {
    flex: 1,
    backgroundColor: THEME_BLACK,
    borderRadius: 10,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  linkButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // PIPELINE CARD
  pipelineCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: THEME_RED,
  },
  pipelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  statusText: {
    color: THEME_RED,
    fontSize: 10,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E4E4E7',
    marginVertical: 12,
  },
  pipelineFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pipelineDate: {
    fontSize: 11,
    color: '#A1A1AA',
  },
  pipelineLink: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME_BLACK,
    textDecorationLine: 'underline',
  },

  // EMPTY STATE
  emptyState: {
    marginTop: 60,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_BLACK,
  },
  emptySub: {
    color: '#A1A1AA',
    textAlign: 'center',
    maxWidth: 200,
  },
  footerSpacer: {
    height: 40,
  }
});