import { AppTabFooter } from '@/components/app-tab-footer';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={() => <AppTabFooter />}
      screenOptions={{
        title: 'Irregular verbs',
        headerShown: false,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="donate" options={{ title: 'Donate' }} />
    </Tabs>
  );
}
