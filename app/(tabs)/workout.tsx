import { StyleSheet, Image, Platform, View, TouchableOpacity } from 'react-native';

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
import { Icon, EditIcon, AddIcon, CloseIcon, RemoveIcon } from "@/components/ui/icon"
import React from 'react';
import { ModalBackdrop, Modal,ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { exercises } from '@/lib/hardCodedExercisies';


import {
  Table,
  TableHeader,
  TableFooter,
  TableBody,
  TableHead,
  TableData,
  TableRow,
  TableCaption,
} from "@/components/ui/table"
import { WorkoutExerciseCard } from '@/components/workout/WorkoutExerciseCard';
export default function Workout() {
  const workoutActive = useWorkoutStore((state) => state.workout);
  const startWorkout = useWorkoutStore((state) => state.start);
  return (
    <SafeAreaView>
    {
      workoutActive ? (
        <ActiveWorkout />
      ) : (
        <Center>
          <Heading>No Active Workout</Heading>
          <Button onPress={()=> startWorkout()} size="md" variant="solid" action="primary">
            <ButtonText>StartWorkout</ButtonText>
          </Button>
        </Center>
      )

    }
    </SafeAreaView>
  );
}

function ActiveWorkout(){
  const workoutActive = useWorkoutStore((state) => state.workout);

  if (!workoutActive) {
    return null;
  }

  return (
    <Box className="justify-start w-full h-full">
      <VStack space="md" reversed={false}>
        <View>
          <Heading>{workoutActive?.name}</Heading>
          <WorkoutClockTime startingTime={workoutActive?.startTime} />
        </View>
        {
          workoutActive?.exercises.map((exercise, index) => (
            <WorkoutExerciseCard
              key={index}
              exercise={exercise}
              index={index}
            />
          ))
        }
        {
          workoutActive.exercises.length === 0 && (
            <Center>
              <Text>No Exercises Added</Text>
            </Center>
          )
        }
        
      </VStack>
      <AddExercise />
    
    </Box>
  );
}


function AddExercise(){
  const [showAddExercise, setShowExercise] = React.useState(false)
  const [selectedExercises,setSelectedExercises]  = React.useState<Exercise[]>([])
  const addExercise = useWorkoutStore((state) => state.addExercise);

  return (
    <>
    <TouchableOpacity
    className='absolute bottom-20 right-10 bg-background-100 rounded-full w-16 h-16 items-center justify-center shadow-lg'
    onPress={() => {
      setShowExercise(true)
    }}
  >
    <Icon
      as={AddIcon}
      size="lg"/>
  </TouchableOpacity>

  <Modal
    isOpen={showAddExercise}
    onClose={() => {
      setShowExercise(false)
    }}
    size="full"
  >
    <ModalBackdrop />
    <ModalContent>
      <ModalHeader>
        <Heading size="md" className="text-typography-950">
          Add an Exercise
        </Heading>
        <ModalCloseButton>
          <Icon
            as={CloseIcon}
            size="md"
            className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
          />
        </ModalCloseButton>
      </ModalHeader>
      <ModalBody>
        {
          exercises.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              className="flex-row items-center justify-between p-4 border-b border-background-200"
              onPress={() => {
                setSelectedExercises((prev) => {
                  if (prev.some((ex) => ex.id === exercise.id)) {
                    return prev.filter((ex) => ex.id !== exercise.id);
                  } else {
                    return [...prev, exercise];
                  }
                }
                );
              }}
            >
              <Text className="text-typography-900">{exercise.name}</Text>
              {
                selectedExercises.some((ex) => ex.id === exercise.id) ?
                <Icon as={RemoveIcon} size="md" />:
                <Icon as={AddIcon} size="md" />}
            </TouchableOpacity>
          ))
        }
        
      </ModalBody>
      <ModalFooter>
        <Button
          variant="outline"
          action="secondary"
          onPress={() => {
            setShowExercise(false)
          }}
        >
          <ButtonText>Cancel</ButtonText>
        </Button>
        <Button
      
        disabled={selectedExercises.length === 0}
          onPress={() => {
            for (const exercise of selectedExercises) {
              // Add the selected exercise to the workout
              addExercise(exercise);
            }
            setShowExercise(false)
            setSelectedExercises([]);
          }}
        >
          <ButtonText>Add {selectedExercises.length} Exercises</ButtonText>
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  </>
  )
}
