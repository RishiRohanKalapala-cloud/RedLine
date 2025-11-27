import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
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

export default function TodoTrackerScreen() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([
    { id: 1, text: 'Check in to Suite 305-B', completed: true },
    { id: 2, text: 'Connect to Redline Wi-Fi', completed: false },
    { id: 3, text: 'Review pantry stock', completed: false },
  ]);

  // Calculate Progress
  const total = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const progress = total === 0 ? 0 : (completedCount / total) * 100;

  // Add New Task
  const handleAddTask = () => {
    if (!task.trim()) return;
    
    // Animate list update
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    const newTodo = {
      id: Date.now(),
      text: task.trim(),
      completed: false,
    };
    
    // Add to top of list
    setTodos([newTodo, ...todos]);
    setTask('');
    Keyboard.dismiss();
  };

  // Toggle Completion
  const toggleTodo = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTodos(todos.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  // Delete Task
  const deleteTodo = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTodos(todos.filter(t => t.id !== id));
  };

  // Sort: Active first, Completed last
  const sortedTodos = [...todos].sort((a, b) => Number(a.completed) - Number(b.completed));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <View style={styles.brandAccent} />
            <Text style={styles.brandMark}>TASK LOG</Text>
          </View>
          <Text style={styles.countBadge}>{completedCount}/{total} DONE</Text>
        </View>

        {/* PROGRESS BAR */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* TASK LIST */}
          {sortedTodos.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>All Clear</Text>
              <Text style={styles.emptySubtitle}>
                No tasks pending. Enjoy your stay at Redline.
              </Text>
            </View>
          ) : (
            sortedTodos.map((item) => (
              <View 
                key={item.id} 
                style={[
                  styles.card, 
                  item.completed && styles.cardCompleted
                ]}
              >
                <Pressable 
                  style={styles.checkboxContainer}
                  onPress={() => toggleTodo(item.id)}
                  hitSlop={10}
                >
                  <View style={[
                    styles.checkbox, 
                    item.completed && styles.checkboxChecked
                  ]}>
                    {item.completed && <View style={styles.checkmark} />}
                  </View>
                </Pressable>

                <View style={styles.textContainer}>
                  <Text style={[
                    styles.taskText, 
                    item.completed && styles.taskTextCompleted
                  ]}>
                    {item.text}
                  </Text>
                </View>

                <Pressable 
                  onPress={() => deleteTodo(item.id)}
                  style={styles.deleteButton}
                  hitSlop={10}
                >
                  <Text style={styles.deleteText}>×</Text>
                </Pressable>
              </View>
            ))
          )}
        </ScrollView>

        {/* INPUT AREA */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Add new task..."
            placeholderTextColor="#A1A1AA"
            value={task}
            onChangeText={setTask}
            onSubmitEditing={handleAddTask}
            returnKeyType="done"
          />
          <Pressable 
            style={[styles.addButton, !task.trim() && styles.addButtonDisabled]} 
            onPress={handleAddTask}
            disabled={!task.trim()}
          >
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>

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
  
  // HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
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
    fontSize: 12,
    fontWeight: '700',
    color: THEME_BLACK,
    fontVariant: ['tabular-nums'],
  },

  // PROGRESS BAR
  progressContainer: {
    height: 4,
    width: '100%',
    backgroundColor: THEME_GRAY,
  },
  progressBar: {
    height: '100%',
    backgroundColor: THEME_RED,
  },

  // CONTENT
  content: {
    padding: 24,
    paddingBottom: 100, // Space for input area
  },

  // CARD
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME_GRAY,
  },
  cardCompleted: {
    opacity: 0.5,
  },
  
  // CHECKBOX
  checkboxContainer: {
    paddingRight: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: THEME_BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: THEME_RED,
    borderColor: THEME_RED,
  },
  checkmark: {
    width: 10,
    height: 10,
    backgroundColor: '#FFF',
    borderRadius: 5,
  },

  // TEXT
  textContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: THEME_BLACK,
    fontWeight: '500',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#A1A1AA',
  },

  // DELETE
  deleteButton: {
    paddingLeft: 16,
  },
  deleteText: {
    fontSize: 24,
    color: '#D4D4D8',
    fontWeight: '300',
    marginTop: -4,
  },

  // EMPTY STATE
  emptyState: {
    marginTop: 60,
    alignItems: 'center',
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

  // INPUT SECTION
  inputSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: THEME_GRAY,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: THEME_GRAY,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: THEME_BLACK,
  },
  addButton: {
    width: 50,
    backgroundColor: THEME_BLACK,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#E4E4E7',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '400',
    marginTop: -2,
  },
});