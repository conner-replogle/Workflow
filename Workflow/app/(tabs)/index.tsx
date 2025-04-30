import { Image, StyleSheet, Platform, ScrollView , View, TextInput, Text } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Heading } from '@/components/ui/heading';
import { WorkoutHistoryCard } from '@/components/WorkoutHistoryWidget';
import { Divider } from '@/components/ui/divider';
import { QuickStart } from '@/components/QuickStartWidget';
import { useApiStore } from '@/lib/useApi';
import { useEffect, useState } from 'react';
import { ButtonText,Button } from '@/components/ui/button';

export default function HomeScreen() {
  const workouts = useApiStore((state) => state.workouts);
  const getWorkouts = useApiStore((state) => state.getAllWorkouts);
  const getAllExercises = useApiStore((state) => state.getAllExercises);
  const user = useApiStore((state) => state.user);
  const logout = useApiStore((state) => state.logout)

  useEffect(() => {
    getWorkouts();
      
    getAllExercises();

  }
  , []);
  


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.homeContainer}>
        <ScrollView style={{padding: 10}}>
          <View className='flex-row items-center justify-between'>
          <Heading className="text-4xl font-bold ">Home</Heading>
          <Button onPress={() => {
            logout()
          }}>
            <ButtonText>Logout</ButtonText>
          </Button>
          </View>
          
          <Divider className="my-4"/>
          <Text className="text-2xl font-bold text-gray-500">Hello, {user?.name}</Text>

            <QuickStart />
          <Divider className="my-4"/>
            <WorkoutHistoryCard />
          <Divider className="my-4"/>

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