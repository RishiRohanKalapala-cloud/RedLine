import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking // Required for PhonePe
  ,
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

// --- INITIAL DATA ---
const INITIAL_EXPENSES = [
  { id: 1, title: 'Midnight Biryani', amount: 1250, payer: 'Bunny', date: 'Today' },
  { id: 2, title: 'Uber to Airport', amount: 850, payer: 'Maria', date: 'Yesterday' },
];

export default function ExpenseTrackerScreen() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Ledger Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('Me');

  // Splitter State
  const [splitTotal, setSplitTotal] = useState('');
  const [splitPeople, setSplitPeople] = useState('');

  // Calculations
  const totalSpend = expenses.reduce((sum, item) => sum + item.amount, 0);
  const splitAmount = Math.round(totalSpend / 4); 

  // Splitter Calculation
  const perHead = (parseFloat(splitTotal) && parseInt(splitPeople)) 
    ? (parseFloat(splitTotal) / parseInt(splitPeople)) 
    : 0;

  // --- ACTIONS ---

  const handleAddExpense = () => {
    if (!title || !amount) {
      Alert.alert("Missing Info", "Please enter a description and amount.");
      return;
    }
    const newExpense = {
      id: Date.now(),
      title,
      amount: parseFloat(amount),
      payer,
      date: 'Just now'
    };
    setExpenses([newExpense, ...expenses]);
    setTitle('');
    setAmount('');
    setModalVisible(false);
  };

  const openPhonePe = async () => {
    // PhonePe URI Scheme
    const phonePeUrl = 'phonepe://'; 
    const upiUrl = 'upi://pay'; // Fallback to generic UPI chooser

    try {
      // Check if PhonePe is installed
      const supported = await Linking.canOpenURL(phonePeUrl);

      if (supported) {
        await Linking.openURL(phonePeUrl);
      } else {
        // Fallback: Try opening generic UPI or warn user
        const upiSupported = await Linking.canOpenURL(upiUrl);
        if (upiSupported) {
          await Linking.openURL(upiUrl);
        } else {
          Alert.alert("App Not Found", "PhonePe is not installed on this device.");
        }
      }
    } catch (err) {
      Alert.alert("Error", "Could not open payment app.");
    }
  };

  const formatCurrency = (val) => {
    return '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <View style={styles.brandAccent} />
          <Text style={styles.brandMark}>EXPENSE LEDGER</Text>
        </View>
        <Pressable style={styles.exportBtn} onPress={() => Alert.alert('Export', 'Generating CSV...')}>
          <MaterialCommunityIcons name="export-variant" size={20} color={THEME_BLACK} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* HERO CARD (TOTALS) */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <Text style={styles.heroLabel}>TOTAL SUITE SPEND</Text>
            <MaterialCommunityIcons name="wallet-outline" size={24} color="#FFF" />
          </View>
          <Text style={styles.bigTotal}>{formatCurrency(totalSpend)}</Text>
          <View style={styles.divider} />
          <View style={styles.splitRow}>
            <View>
              <Text style={styles.splitLabel}>LEDGER PER HEAD (Est. 4)</Text>
              <Text style={styles.splitValue}>{formatCurrency(splitAmount)}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>SETTLING SUNDAY</Text>
            </View>
          </View>
        </View>

        {/* --- NEW SECTION: QUICK SPLITTER --- */}
        <View style={styles.splitterSection}>
          <Text style={styles.sectionTitle}>Quick Splitter</Text>
          <View style={styles.splitterCard}>
            
            {/* Inputs Row */}
            <View style={styles.splitterInputs}>
              <View style={styles.splitInputGroup}>
                <Text style={styles.label}>TOTAL AMOUNT</Text>
                <TextInput
                  style={styles.splitInput}
                  placeholder="₹0"
                  placeholderTextColor="#A1A1AA"
                  keyboardType="numeric"
                  value={splitTotal}
                  onChangeText={setSplitTotal}
                />
              </View>
              <View style={styles.splitInputGroup}>
                <Text style={styles.label}>PEOPLE</Text>
                <TextInput
                  style={styles.splitInput}
                  placeholder="0"
                  placeholderTextColor="#A1A1AA"
                  keyboardType="numeric"
                  value={splitPeople}
                  onChangeText={setSplitPeople}
                />
              </View>
            </View>

            {/* Result */}
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>SHARE PER PERSON</Text>
              <Text style={styles.resultValue}>{formatCurrency(perHead)}</Text>
            </View>

            {/* PhonePe Button */}
            <Pressable 
              style={({pressed}) => [styles.phonePeBtn, pressed && styles.phonePeBtnPressed]}
              onPress={openPhonePe}
            >
              <MaterialCommunityIcons name="cellphone-check" size={20} color="#FFF" />
              <Text style={styles.phonePeText}>GO TO PHONEPE</Text>
            </Pressable>

          </View>
        </View>

        {/* ACTION BUTTON */}
        <Pressable 
          style={({pressed}) => [styles.addBtn, pressed && styles.addBtnPressed]} 
          onPress={() => setModalVisible(true)}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
          <Text style={styles.addBtnText}>LOG NEW EXPENSE</Text>
        </Pressable>

        {/* LEDGER LIST */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          
          {expenses.length === 0 ? (
            <Text style={styles.emptyText}>No expenses logged yet.</Text>
          ) : (
            expenses.map((item) => (
              <View key={item.id} style={styles.transactionCard}>
                <View style={styles.iconBox}>
                  <Text style={styles.payerInitial}>{item.payer.charAt(0)}</Text>
                </View>
                
                <View style={styles.transDetails}>
                  <Text style={styles.transTitle}>{item.title}</Text>
                  <Text style={styles.transMeta}>Paid by {item.payer} • {item.date}</Text>
                </View>

                <Text style={styles.transAmount}>{formatCurrency(item.amount)}</Text>
              </View>
            ))
          )}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Redline Finance • Syncs automatically</Text>
        </View>

      </ScrollView>

      {/* ADD EXPENSE MODAL */}
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
              <Text style={styles.modalTitle}>New Expense</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={THEME_BLACK} />
              </Pressable>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>DESCRIPTION</Text>
              <TextInput 
                style={styles.input} 
                placeholder="What was this for?" 
                placeholderTextColor="#A1A1AA"
                value={title}
                onChangeText={setTitle}
                autoFocus
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>AMOUNT (₹)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="0.00" 
                placeholderTextColor="#A1A1AA"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>PAID BY</Text>
              <View style={styles.payerRow}>
                {['Me', 'Bunny', 'Maria', 'Fund'].map((p) => (
                  <Pressable 
                    key={p} 
                    style={[styles.payerChip, payer === p && styles.payerChipActive]}
                    onPress={() => setPayer(p)}
                  >
                    <Text style={[styles.payerText, payer === p && styles.payerTextActive]}>{p}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable style={styles.saveBtn} onPress={handleAddExpense}>
              <Text style={styles.saveBtnText}>ADD TO LEDGER</Text>
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
  exportBtn: {
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
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroLabel: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  bigTotal: {
    color: '#FFF',
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 20,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  splitLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  splitValue: {
    color: '#E4E4E7',
    fontSize: 18,
    fontWeight: '700',
  },
  statusBadge: {
    backgroundColor: 'rgba(230, 32, 32, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(230, 32, 32, 0.3)',
  },
  statusText: {
    color: THEME_RED,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // SPLITTER SECTION
  splitterSection: {
    marginBottom: 24,
  },
  splitterCard: {
    backgroundColor: THEME_GRAY,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME_BORDER,
  },
  splitterInputs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  splitInputGroup: {
    flex: 1,
  },
  splitInput: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: THEME_BLACK,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#71717A',
  },
  resultValue: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME_RED,
  },
  phonePeBtn: {
    backgroundColor: '#5f259f', // PhonePe brand color (Purple)
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  phonePeBtnPressed: {
    backgroundColor: '#4a1d7c',
  },
  phonePeText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
  },

  // ACTION BTN
  addBtn: {
    backgroundColor: THEME_BLACK,
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
    shadowColor: THEME_BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnPressed: {
    backgroundColor: THEME_RED,
  },
  addBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },

  // LIST
  listSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_BLACK,
    marginBottom: 8,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME_GRAY,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  payerInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_BLACK,
  },
  transDetails: {
    flex: 1,
  },
  transTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_BLACK,
    marginBottom: 4,
  },
  transMeta: {
    fontSize: 12,
    color: '#71717A',
  },
  transAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME_BLACK,
  },
  emptyText: {
    color: '#A1A1AA',
    fontStyle: 'italic',
    marginTop: 8,
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

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME_BLACK,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A1A1AA',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: THEME_GRAY,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '500',
    color: THEME_BLACK,
  },
  payerRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  payerChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: THEME_GRAY,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  payerChipActive: {
    backgroundColor: '#FFF',
    borderColor: THEME_RED,
  },
  payerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717A',
  },
  payerTextActive: {
    color: THEME_RED,
  },
  saveBtn: {
    backgroundColor: THEME_RED,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  saveBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
});