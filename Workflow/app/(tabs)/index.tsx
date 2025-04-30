import { Image, StyleSheet, Platform, ScrollView , View, TextInput, Button, Text } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Heading } from '@/components/ui/heading';
import { WorkoutHistoryCard } from '@/components/WorkoutHistoryWidget';
import { Divider } from '@/components/ui/divider';
import { QuickStart } from '@/components/QuickStartWidget';
import { useApiStore } from '@/lib/useApi';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const workouts = useApiStore((state) => state.workouts);
  const getWorkouts = useApiStore((state) => state.getAllWorkouts);
  useEffect(() => {
    getWorkouts().catch((err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  , []);
  


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.homeContainer}>
        <ScrollView style={{padding: 10}}>
          <Heading className="text-4xl font-bold ">Home</Heading>
          <Divider className="my-4"/>
            <QuickStart />
          <Divider className="my-4"/>
            <WorkoutHistoryCard />
          <Divider className="my-4"/>
          {
            workouts.map((workout) => {
              return (
                <ThemedView key={workout.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <ThemedText className="text-lg font-bold">{workout.name}</ThemedText>
                </ThemedView>
              );
            })
          }
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  homeContainer: {
    flex: 1,
    paddingTop: 10,
  },
  input: {
    width: 250,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
});