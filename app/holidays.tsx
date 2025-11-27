import { useEffect, useState } from 'react';
import {
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

// --- HOLIDAY DATA 2026 ---
const HOLIDAYS = [
  { id: 1, title: "New Year Day", date: "2026-01-01", day: "Thursday" },
  { id: 2, title: "Bhogi", date: "2026-01-13", day: "Tuesday" },
  { id: 3, title: "Sankranti / Pongal", date: "2026-01-14", day: "Wednesday" },
  { id: 4, title: "Kanuma", date: "2026-01-15", day: "Thursday" },
  { id: 5, title: "Republic Day", date: "2026-01-26", day: "Monday" },
  { id: 6, title: "Maha Shivaratri", date: "2026-02-15", day: "Sunday" },
  { id: 7, title: "Holi", date: "2026-03-03", day: "Tuesday" },
  { id: 8, title: "Eid-ul-Fitr (Ramzan)", date: "2026-03-20", day: "Friday" },
  { id: 9, title: "Ugadi", date: "2026-03-21", day: "Saturday" },
  { id: 10, title: "Sri Rama Navami", date: "2026-03-27", day: "Friday" },
  { id: 11, title: "Good Friday", date: "2026-04-03", day: "Friday" },
  { id: 12, title: "Babu Jagjivan Ram B'day", date: "2026-04-05", day: "Sunday" },
  { id: 13, title: "Dr. B.R. Ambedkar B'day", date: "2026-04-14", day: "Tuesday" },
  { id: 14, title: "Eid-ul-Azha (Bakrid)", date: "2026-05-28", day: "Thursday" },
  { id: 15, title: "Moharam", date: "2026-06-17", day: "Wednesday" },
  { id: 16, title: "Bonalu", date: "2026-07-13", day: "Monday" },
  { id: 17, title: "Independence Day", date: "2026-08-15", day: "Saturday" },
  { id: 18, title: "Eid Milad-un-Nabi", date: "2026-08-26", day: "Wednesday" },
  { id: 19, title: "Sri Krishna Ashtami", date: "2026-09-04", day: "Friday" },
  { id: 20, title: "Vinayaka Chavithi", date: "2026-09-15", day: "Tuesday" },
  { id: 21, title: "Gandhi Jayanthi", date: "2026-10-02", day: "Friday" },
  { id: 22, title: "Bathukamma Start", date: "2026-10-09", day: "Friday" },
  { id: 23, title: "Vijaya Dasami", date: "2026-10-20", day: "Tuesday" },
  { id: 24, title: "Deepavali", date: "2026-11-08", day: "Sunday" },
  { id: 25, title: "Christmas", date: "2026-12-25", day: "Friday" },
];

export default function HolidaysScreen() {
  const [upcoming, setUpcoming] = useState([]);
  const [sortedHolidays, setSortedHolidays] = useState([]);

  useEffect(() => {
    // Current date logic
    // Note: Since real date is likely 2024/25, all 2026 holidays are 'future'.
    // If you want to simulate being IN 2026, uncomment the line below:
    // const today = new Date("2026-01-02"); 
    const today = new Date(); 

    // Filter holidays that are in the future
    const future = HOLIDAYS.filter(h => new Date(h.date) >= today);
    
    // If we are in 2024/25, essentially all are upcoming. 
    // We take the first 2 as "Immediate Upcoming" highlights.
    setUpcoming(future.slice(0, 2));
    setSortedHolidays(HOLIDAYS);
  }, []);

  // Helper: Format date string (2026-01-01) to Display (01 JAN)
  const formatDayMonth = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    return { day, month };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <View style={styles.brandAccent} />
          <Text style={styles.brandMark}>CALENDAR 2026</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* SECTION 1: UPCOMING (Highlights) */}
        {upcoming.length > 0 && (
          <View style={styles.upcomingSection}>
            <Text style={styles.sectionTitle}>Up Next</Text>
            <View style={styles.highlightRow}>
              {upcoming.map((holiday, index) => {
                const { day, month } = formatDayMonth(holiday.date);
                return (
                  <View key={holiday.id} style={styles.highlightCard}>
                    <View style={styles.highlightDate}>
                      <Text style={styles.hlDay}>{day}</Text>
                      <Text style={styles.hlMonth}>{month}</Text>
                    </View>
                    <View>
                      <Text style={styles.hlTitle} numberOfLines={2}>{holiday.title}</Text>
                      <Text style={styles.hlWeekday}>{holiday.day}</Text>
                    </View>
                    {index === 0 && (
                      <View style={styles.nextBadge}>
                        <Text style={styles.nextBadgeText}>SOON</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.divider} />

        {/* SECTION 2: FULL LIST */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Full Schedule</Text>
          
          <View style={styles.table}>
            {sortedHolidays.map((holiday) => {
               const { day, month } = formatDayMonth(holiday.date);
               // Check if Sunday
               const isSunday = holiday.day === 'Sunday';
               
               return (
                <View key={holiday.id} style={styles.row}>
                  {/* Date Column */}
                  <View style={styles.dateCol}>
                    <Text style={styles.dateText}>{day}</Text>
                    <Text style={styles.monthText}>{month}</Text>
                  </View>

                  {/* Divider Line */}
                  <View style={styles.verticalLine} />

                  {/* Info Column */}
                  <View style={styles.infoCol}>
                    <Text style={styles.holidayTitle}>{holiday.title}</Text>
                    <Text style={[styles.holidayDay, isSunday && styles.sundayText]}>
                      {holiday.day}
                    </Text>
                  </View>
                </View>
               );
            })}
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Redline Residence • 2026 Planner</Text>
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
    letterSpacing: 2,
    color: THEME_BLACK,
  },
  content: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A1A1AA',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    paddingHorizontal: 28,
  },

  // --- UPCOMING HIGHLIGHTS ---
  upcomingSection: {
    marginBottom: 8,
  },
  highlightRow: {
    paddingHorizontal: 28,
    gap: 12,
  },
  highlightCard: {
    backgroundColor: THEME_DARK_CARD,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  highlightDate: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hlDay: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  hlMonth: {
    color: THEME_RED,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  hlTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    maxWidth: 200,
  },
  hlWeekday: {
    color: '#A1A1AA',
    fontSize: 13,
    marginTop: 2,
  },
  nextBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: THEME_RED,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
  },
  nextBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  divider: {
    height: 8,
    backgroundColor: THEME_GRAY,
    marginVertical: 24,
  },

  // --- LIST SECTION ---
  listSection: {
    marginTop: 8,
  },
  table: {
    paddingHorizontal: 28,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F5',
    alignItems: 'center',
  },
  dateCol: {
    width: 50,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_BLACK,
    fontVariant: ['tabular-nums'],
  },
  monthText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A1A1AA',
    textTransform: 'uppercase',
  },
  verticalLine: {
    width: 2,
    height: '80%',
    backgroundColor: '#F4F4F5',
    marginHorizontal: 16,
    borderRadius: 1,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  holidayTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME_BLACK,
    marginBottom: 2,
  },
  holidayDay: {
    fontSize: 13,
    color: '#71717A',
  },
  sundayText: {
    color: THEME_RED, // Highlight Sundays if needed
    fontWeight: '500',
  },

  // --- FOOTER ---
  footer: {
    marginTop: 40,
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