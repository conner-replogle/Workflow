import { StyleSheet, Image, Platform, View, TouchableOpacity, ScrollView } from 'react-native';

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
import { Icon, EditIcon, AddIcon, CloseIcon, RemoveIcon, InfoIcon } from "@/components/ui/icon"
import React, { useMemo } from 'react';
import { ModalBackdrop, Modal,ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';


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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Divider } from '@/components/ui/divider';
import { useApiStore } from '@/lib/useApi';
import { useSuggestedExercises } from '@/lib/suggested';
import { CompleteWorkoutDialog } from '@/components/WorkoutComplete';
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
  const finishWorkout = useWorkoutStore((state) => state.finish);
  const clearWOrkout = useWorkoutStore((state) => state.clear);

  if (!workoutActive) {
    return null;
  }
  console.log(workoutActive)

  return (
    <Box className="justify-start w-full h-full">
      <View  className='p-4 h-full gap-3'>
        <View >
          <Heading>{workoutActive.name}</Heading>

            <WorkoutClockTime startingTime={workoutActive.startTime} stop={workoutActive.endTime ? true : false} />
          
        </View>
        <ScrollView contentInset={{ bottom: 200 }} >
        {
                  

          workoutActive?.exercises.map((exercise, index) => (
            <>
            <WorkoutExerciseCard
            
              key={`exercise-${index}`}
              exercise={exercise}
              index={index}
            />
            <Divider className="my-2" />
            </>
          ))
       
        }

        {
          workoutActive.exercises.length === 0 && (
            <Center key="no-exercises">
              <Text>No Exercises Added</Text>
            </Center>
          )
        }
            <Button
          onPress={() => {
            finishWorkout();

          }}
          size="lg"
          variant="solid"
          action="primary"
        >
          <ButtonText>Finish Workout</ButtonText>
        </Button>
        </ScrollView>
    </View>
        

      <CompleteWorkoutDialog active={workoutActive.endTime != null} onClose={()=>{
        clearWOrkout();
      }}  />
      <AddExercise previous={workoutActive.exercises.map((v) => v.template)} />
    
    </Box>

  );
}


function AddExercise({previous}: {previous: Exercise[]}) {
  const [showAddExercise, setShowExercise] = React.useState(false)
  const [selectedExercises,setSelectedExercises]  = React.useState<Exercise[]>([])
  const addExercise = useWorkoutStore((state) => state.addExercise);
  const exercises = useApiStore((state) => state.exercises);
  const previousIDs = useMemo(() => {
    return previous.map((v) => v.id!);
  }, [previous]);
  const suggested = useSuggestedExercises(previousIDs);
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
    size="lg"
  >
    <ModalBackdrop />
    <ModalContent className='max-h-[60%]'>
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
      
      <ModalBody >
      <Divider/>

      
          <View className='min-h-32'>
          {
             suggested.map((exercise: Exercise) => (
              <TouchableOpacity
                key={exercise.id}
                className="flex-row items-center justify-between p-4 "
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
                <Text className=" text-violet-500">{exercise.name}</Text>
  
                {
                  selectedExercises.some((ex) => ex.id === exercise.id) ?
                  <Icon as={RemoveIcon} size="md" />:
                  <Icon as={AddIcon} size="md" />}
              </TouchableOpacity>
            ))
          
        }
        </View>
        <Divider/>
        {
          exercises.map((exercise,index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center justify-between p-4"
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
