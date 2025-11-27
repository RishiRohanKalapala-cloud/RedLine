import { ReactNode } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useRouter } from 'expo-router';

type InfoPageProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

type InfoBlockProps = {
  title: string;
  body: string;
  bullets?: string[];
  footer?: string;
};

export function InfoPage({ title, description, children }: InfoPageProps) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
        <Text style={styles.headerText} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>{description}</Text>
        {children}
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Redline footer</Text>
      </View>
    </SafeAreaView>
  );
}

export function InfoBlock({ title, body, bullets, footer }: InfoBlockProps) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      <Text style={styles.blockBody}>{body}</Text>
      {bullets && (
        <View style={styles.blockList}>
          {bullets.map((item) => (
            <Text key={item} style={styles.blockListItem}>
              • {item}
            </Text>
          ))}
        </View>
      )}
      {footer ? <Text style={styles.blockFooter}>{footer}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#d6001c',
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 12,
  },
  backIcon: {
    color: '#000',
    fontSize: 18,
    marginRight: 4,
  },
  backLabel: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  headerSpacer: {
    width: 48,
  },
  content: {
    padding: 24,
    gap: 16,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  description: {
    color: '#000',
    lineHeight: 22,
  },
  block: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    padding: 18,
    gap: 8,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  blockBody: {
    color: '#4b5563',
    lineHeight: 22,
  },
  blockList: {
    gap: 4,
  },
  blockListItem: {
    color: '#111827',
  },
  blockFooter: {
    color: '#6b7280',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footer: {
    backgroundColor: '#d6001c',
    paddingVertical: 18,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  footerText: {
    color: '#000',
    fontWeight: '500',
  },
});

