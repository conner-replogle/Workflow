import { StyleSheet, Image, Platform, View, TouchableOpacity, ScrollView, TextStyle, ViewStyle, ImageStyle } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkoutStore } from '@/lib/useWorkout';
import { Center } from "@/components/ui/center"
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { WorkoutClockTime } from '@/components/workout/WorkoutTimeClock';
import { Icon, EditIcon, AddIcon, CloseIcon, RemoveIcon, InfoIcon, ChevronDownIcon, ChevronUpIcon, CalendarDaysIcon } from "@/components/ui/icon"
import React, { useState, useMemo, useEffect } from 'react';
import { ModalBackdrop, Modal,ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { useApiStore } from '@/lib/useApi';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { router } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import Style  from '@/lib/workoutHistoryStyle';
// Placeholder workout history data




const theme = {
  primary: '#000000',
  secondary: '#3a444d',
  cardBackground: '#000000',
  background: '#000000',
  textPrimary: '#f0f0f0',
  textSecondary: '#e0e0e0',
  divider: '#f0f0f0',
  error: '#000000',
  success: '#000000',
}


export default function WorkoutHistory() {
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const workouts = useApiStore((state) => state.workouts);
  const getWorkouts = useApiStore((state) => state.getAllWorkouts);

  useEffect(() => {
    getWorkouts().catch((err) => {
      if (err) {
        console.log("Error fetching workouts:", err);
      }
    });
  }, []);

  // Filter workouts based on selected date
  const filteredWorkouts = useMemo(() => {
    if (!selectedDate || !workouts.length) {
      return workouts;
    }
    
    // Convert selected date to same format as workout dates for comparison
    return workouts.filter(workout => {
      if (!workout.startTime) return false;
      const workoutDate = new Date(workout.startTime).toISOString().split('T')[0];
      return workoutDate === selectedDate;
    });
  }, [selectedDate, workouts]);

  // Generate marked dates for calendar
  const markedDates = useMemo(() => {
    const dates: {[key: string]: any} = {};
    
    // Add dots for days with workouts
    workouts.forEach(workout => {
      if (workout.startTime) {
        const dateString = new Date(workout.startTime).toISOString().split('T')[0];
        dates[dateString] = {
          marked: true,
          dotColor: '#ffffff'
        };
      }
    });
    
    // Highlight selected date
    if (selectedDate) {
      dates[selectedDate] = {
        ...dates[selectedDate],
        selected: true,
        selectedColor: '#D60000',
      };
    }
    
    return dates;
  }, [selectedDate, workouts]);

  // Handle date selection
  const handleDateSelect = (date: DateData) => {
    setSelectedDate(date.dateString);
  };

  // Clear date filter
  const clearDateFilter = () => {
    setSelectedDate(null);
  };

  // Calculate workout duration in MM:SS format
  const getWorkoutDuration = (start: Date, end: Date) => {
    if (!start || !end) return "00:00";
    
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationMs = endTime - startTime;
    
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Calculate total metrics for a workout
  const getWorkoutSummary = (exercises: any[]) => {
    if (!exercises || !exercises.length) {
      return {
        totalWeight: 0,
        totalSets: 0,
        totalReps: 0,
        exerciseCount: 0
      };
    }
    
    let totalWeight = 0;
    let totalSets = 0;
    let totalReps = 0;
    
    exercises.forEach(exercise => {
      const sets = exercise.sets || [];
      totalSets += sets.length;
      
      sets.forEach((set: any) => {
        totalReps += set.reps || 0;
        totalWeight += (set.reps || 0) * (set.weight || 0);
      });
    });
    
    return {
      totalWeight,
      totalSets,
      totalReps,
      exerciseCount: exercises.length
    };
  };

  // Toggle workout expansion
  const viewWorkoutDetail = (workoutId: string) => {
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
  };

  // Format date for display
  const formatDateForDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };
  console.log("Filtered Workouts: ", filteredWorkouts);

  return (
    <SafeAreaView style={Style.container}>
      <VStack space="md" className="p-4 flex-1">
        <HStack className="justify-between items-center">
          <Heading className="text-3xl font-bold">Workout History</Heading>
          <TouchableOpacity 
            onPress={() => setShowCalendar(!showCalendar)}
            style={Style.calendarButton}
          >
            <Icon as={CalendarDaysIcon} size="md" color={theme.primary} />
          </TouchableOpacity>
        </HStack>
        
        {/* Calendar Section */}
        {showCalendar && (
          <Card size="md" variant="outline" style={Style.calendarCard}>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={markedDates}
              style={Style.calendar}
              theme={{
                backgroundColor: theme.cardBackground,
                calendarBackground: theme.cardBackground,
                textSectionTitleColor: theme.textPrimary,
                selectedDayBackgroundColor: '#ff0000',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#ffffff',
                dayTextColor: theme.textPrimary,
                textDisabledColor: theme.textSecondary,
                dotColor: '#5166cf',
                selectedDotColor: '#5166cf',
                arrowColor: '#ffffff',
                monthTextColor: theme.textPrimary,
                indicatorColor: '#ff0000',
                textDayFontWeight: '400',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 14,
              }}
            />
          </Card>
        )}
        
        {/* Date Filter Indicator */}
        {selectedDate && (
          <HStack className="items-center justify-between mb-2">
            <Text style={Style.filterText}>
              Showing workouts for: {new Date(selectedDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                timeZone: 'UTC'
              })}
            </Text>
            <TouchableOpacity onPress={clearDateFilter}>
              <Text style={Style.clearFilterText}>Clear Filter</Text>
            </TouchableOpacity>
          </HStack>
        )}
        
        {/* Workout History Cards */}
        <ScrollView style={Style.scrollView}>
          {filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((workout,i) => {
              const summary = getWorkoutSummary(workout.exercises);
              const workoutId = workout.id
              
              return (
                <Card 
                  key={workoutId} 
                  size="lg" 
                  variant="filled"
                  style={Style.workoutCard}
                >
                  <TouchableOpacity onPress={() => viewWorkoutDetail(workoutId)}>
                    <VStack space="sm">
                      {/* Header - Always visible */}
                      <HStack className="justify-between items-center">
                        <VStack>
                          <Text style={Style.dateText}>{formatDateForDisplay(new Date(workout.startTime))}</Text>
                          <Text style={Style.durationText}>
                            {getWorkoutDuration(workout.startTime, workout.endTime ?? new Date())}
                          </Text>
                        </VStack>
                        <Icon 
                          as={expandedWorkout === workoutId ? ChevronUpIcon : ChevronDownIcon} 
                          size="md"
                          color={theme.textPrimary}
                        />
                      </HStack>
                      
                      {/* Expanded Details */}
                      {expandedWorkout === workoutId && (
                        <VStack className="mt-2">
                          <Divider style={Style.divider} />
                          
                          {/* Exercises */}
                          {workout.exercises && workout.exercises.map((exercise, index) => (
                            <WorkoutExerciseHistoryCard 
                              key={`${workoutId}-ex-${index}`} 
                              exercise={exercise} 
                            />
                          ))}
                          
                          {/* Summary Section */}
                          <Card style={Style.summaryCard}>
                            <Heading size="sm" style={Style.summaryTitle}>Workout Summary</Heading>
                            <HStack style={Style.summaryRow}>
                              <VStack style={Style.summaryColumn}>
                                <Text style={Style.summaryLabel}>Exercises</Text>
                                <Text style={Style.summaryValue}>{summary.exerciseCount}</Text>
                              </VStack>
                              <VStack style={Style.summaryColumn}>
                                <Text style={Style.summaryLabel}>Sets</Text>
                                <Text style={Style.summaryValue}>{summary.totalSets}</Text>
                              </VStack>
                              <VStack style={Style.summaryColumn}>
                                <Text style={Style.summaryLabel}>Reps</Text>
                                <Text style={Style.summaryValue}>{summary.totalReps}</Text>
                              </VStack>
                              <VStack style={Style.summaryColumn}>
                                <Text style={Style.summaryLabel}>Weight</Text>
                                <Text style={Style.summaryValue}>{summary.totalWeight} lbs</Text>
                              </VStack>
                            </HStack>
                          </Card>
                        </VStack>
                      )}
                    </VStack>
                  </TouchableOpacity>
                </Card>
              );
            })
          ) : (
            <Center className="py-10">
              <Text style={Style.emptyText}>
                {workouts.length === 0 
                  ? "No workout history found. Start a new workout to track your progress!"
                  : `No workouts found for ${selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    timeZone: 'UTC'
                  }) : 'selected date'}.`
                }
              </Text>
            </Center>
          )}
        </ScrollView>
      </VStack>
    </SafeAreaView>
  );
}

// Component to display each exercise in the history
function WorkoutExerciseHistoryCard({ exercise }: { exercise: any }) {
  const [expanded, setExpanded] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const exercises = useApiStore(state => state.exercises);
  
  // Get the exercise name from the template ID
  useEffect(() => {
    if (exercise.templateID && exercises.length > 0) {
      const template = exercises.find(ex => ex.id === exercise.templateID);
      if (template) {
        setExerciseName(template.name);
      }
    }
  }, [exercise.templateID, exercises]);
  
  const totalWeight = (exercise.sets || []).reduce((total: number, set: any) => {
    return total + ((set.reps || 0) * (set.weight || 0));
  }, 0);
  
  const totalReps = (exercise.sets || []).reduce((total: number, set: any) => {
    return total + (set.reps || 0);
  }, 0);
  
  return (
    <Card style={Style.exerciseCard} variant="outline">
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <HStack className="justify-between items-center">
          <Text style={Style.exerciseName}>{exerciseName || `Exercise #${exercise.templateID}`}</Text>
          <Icon 
            as={expanded ? ChevronUpIcon : ChevronDownIcon} 
            size="sm" 
            color={theme.textPrimary}
          />
        </HStack>
        
        <HStack className="justify-between mt-1">
          <Text style={Style.exerciseDetails}>
            {(exercise.sets || []).length} sets · {totalReps} reps
          </Text>
          <Text style={Style.exerciseWeight}>{totalWeight} lbs</Text>
        </HStack>
        
        {expanded && (
          <VStack className="mt-3">
            <Divider style={Style.divider} />
            <HStack style={Style.tableHeader}>
              <Text style={[Style.tableHeaderText, { width: '25%' }]}>#</Text>
              <Text style={[Style.tableHeaderText, { width: '35%', textAlign: 'center' }]}>Reps</Text>
              <Text style={[Style.tableHeaderText, { width: '40%', textAlign: 'center' }]}>Weight (lbs)</Text>
            </HStack>
            {(exercise.sets || []).map((set: any, index: number) => (
              <HStack key={index} style={Style.tableRow}>
                <Text style={[Style.tableCell, { width: '25%' }]}>{index + 1}</Text>
                <Text style={[Style.tableCell, { width: '35%', textAlign: 'center' }]}>{set.reps || 0}</Text>
                <Text style={[Style.tableCell, { width: '40%', textAlign: 'center' }]}>{set.weight || 0}</Text>
              </HStack>
            ))}
          </VStack>
        )}
      </TouchableOpacity>
    </Card>
  );
}
