import { StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  tone?: 'green' | 'yellow' | 'red';
};

const colors = {
  green: '#22c55e',
  yellow: '#f59e0b',
  red: '#ef4444'
};

export function StatusPill({ label, tone = 'green' }: Props) {
  return (
    <View style={[styles.root, { borderColor: colors[tone] }]}>
      <View style={[styles.dot, { backgroundColor: colors[tone] }]} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  text: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  }
});
