import { Card } from "./ui/card";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";
import { AddIcon, ArrowRightIcon, CheckCircleIcon, CloseCircleIcon, Icon, RemoveIcon, TrashIcon } from "./ui/icon";
import { HStack } from "./ui/hstack";
import { VStack } from "./ui/vstack";
import { Button, TextInput, TouchableOpacity, View } from "react-native";
import { Box } from "./ui/box";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useApiStore } from "@/lib/useApi";
// Placeholder for most recent workout data


export function WorkoutHistoryCard() {
  const router = useRouter();
  const workouts = useApiStore((state) => state.workouts);
  const getWorkouts = useApiStore((state) => state.getAllWorkouts);
  const recentWorkout = workouts[workouts.length - 1];
  const exercises = useApiStore((state) => state.exercises);
  useEffect(() => {
    getWorkouts().catch((err) => {
      if (err) {
        console.log("Error fetching workouts:", err);
      }
    });
  }, []);

  if (recentWorkout == undefined) {
    return <Text>No recent workouts found</Text>;
  }
  const totalWeight = (recentWorkout.exercises || []).reduce((total: number, exercise: any) => {
    return total + ((exercise.sets || []).reduce((setTotal: number, set: any) => {
      return setTotal + ((set.reps || 0) * (set.weight || 0));
    }, 0));
  }, 0);
  const workoutDate = recentWorkout.startTime ? new Date(recentWorkout.startTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : 'No date available';
  // Format relative time (e.g., "2 days ago")
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const dates = new Date(recentWorkout.startTime);
    const diffInDays = Math.floor((now.getTime() - dates.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    return `${diffInDays} days ago`;
  };
  
  // Calculate workout duration
  const getDuration = (start: Date, end: Date) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime.getTime() - startTime.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const handleCardPress = () => {
    router.push('/workout_history');
  };

  return (
    <VStack className="p-4">
      <HStack className="justify-between mb-4">
        <Heading className="text-2xl font-bold">Workout History</Heading>
        <WorkoutHistoryRouteButton />
      </HStack>
      
      <TouchableOpacity onPress={handleCardPress}>
        <Card size="lg" variant="filled">
          <VStack space="sm">
            <HStack className="justify-between">
              <Text className="text-lg font-bold">{workoutDate}</Text>
              <Text className="text-sm">{getRelativeTime(recentWorkout.startTime)}</Text>
            </HStack>
            
            <HStack className="justify-between">
              <Text className="text-md">{getDuration(recentWorkout.startTime, recentWorkout.endTime || new Date())}</Text>
              <Text className="text-sm">{totalWeight} lbs</Text>
            </HStack>
            
            
          </VStack>
        </Card>
      </TouchableOpacity>
    </VStack>
  );
}

function WorkoutHistoryRouteButton() {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push('/workout_history')}>
      <Icon className="p-4 ml-4" as={ArrowRightIcon} size="xl" />
    </TouchableOpacity>
  );
}