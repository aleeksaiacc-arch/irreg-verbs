import { AppTabFooter } from "@/components/app-tab-footer";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function AuthLayout() {
  return (
    <View style={styles.root}>
      <View style={styles.stack}>
        <Stack
          screenOptions={{ headerShown: false, title: "Irregular verbs" }}
        >
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
        </Stack>
      </View>
      <AppTabFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  stack: {
    flex: 1,
  },
});
