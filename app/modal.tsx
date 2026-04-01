import { AppTabFooter } from '@/components/app-tab-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function ModalScreen() {
  return (
    <View style={styles.root}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">This is a modal</ThemedText>
        <Link href="/" dismissTo style={styles.link}>
          <ThemedText type="link">Go to home screen</ThemedText>
        </Link>
      </ThemedView>
      <AppTabFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
