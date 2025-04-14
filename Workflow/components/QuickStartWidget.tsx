import { Card } from "./ui/card";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";
import { AddIcon, ArrowRightIcon, CheckCircleIcon, CloseCircleIcon, CloseIcon, Icon, RemoveIcon, TrashIcon } from "./ui/icon";
import { HStack } from "./ui/hstack";
import { VStack } from "./ui/vstack";
import { Button, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { Box } from "./ui/box";
import { ModalBackdrop, Modal,ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { router, useRouter } from "expo-router";
import React from 'react';
import { useHomeScreenStore } from "@/lib/homescreen";
import { useWorkoutStore } from "@/lib/useWorkout";
import { useApiStore } from "@/lib/useApi";


export function QuickStart() {
    const [showEditQuickStart, setShowEdit] = React.useState(false);
    const [editingButtonId, setEditingButtonId] = React.useState<string | null>(null);

    const quickButtons = useHomeScreenStore((state) => state.quickButtons);
    const updateQuickButtonName = useHomeScreenStore((state) => state.updateQuickButtonName);
    const updateQuickButtonExercises = useHomeScreenStore((state) => state.updateQuickButtonExercises);

    const currentEditingButton = React.useMemo(() => {
        return quickButtons.find(button => button.id === editingButtonId);
    }, [quickButtons, editingButtonId]);

    const [selectedExercises, setSelectedExercises] = React.useState<Exercise[]>([]);
    const [currentName, setCurrentName] = React.useState('Custom QuickStart');

    const [showConfirmation, setShowConfirmation] = React.useState(false);
    const [pendingButtonId, setPendingButtonId] = React.useState<string | null>(null);

    const exercises = useApiStore((state) => state.exercises);

    const activeWorkout = useWorkoutStore((state) => state.workout);

    const handleLongPress = (buttonId: string) => {
        const buttonToEdit = quickButtons.find(b => b.id === buttonId);
        if (buttonToEdit) {
            setEditingButtonId(buttonId);
            setSelectedExercises(buttonToEdit.exercises);
            setCurrentName(buttonToEdit.name);
            setShowEdit(true);
        }
    };

    const handleCloseModal = () => {
        setShowEdit(false);
        setEditingButtonId(null);
        setSelectedExercises([]);
        setCurrentName('');
    };

    const handleSaveChanges = () => {
        if (editingButtonId) {
            updateQuickButtonName(editingButtonId, currentName);
            updateQuickButtonExercises(editingButtonId, selectedExercises);
            handleCloseModal();
        }
    };

    const handlePress = (buttonId: string) => {
        if (activeWorkout) {
            setPendingButtonId(buttonId);
            setShowConfirmation(true);
        } else {
            startNewWorkout(buttonId);
        }
    };

    const startNewWorkout = (buttonId: string) => {

        router.push('/workout');
        useWorkoutStore.getState().start();
        for (const exercise of quickButtons[parseInt(buttonId)].exercises) {
            useWorkoutStore.getState().addExercise(exercise);
        }

    };

    return (
        <>
      <VStack className="p-4">
        <Heading className="text-2xl font-bold">Quick Start</Heading>
            <TouchableOpacity className="bg-violet-600 p-4 rounded-md my-4" onPress={() => router.push('/workout')}>
                <Text className="text-lg font-bold text-center">Start a New Workout</Text>
            </TouchableOpacity>
            <HStack className="justify-between mt-2">
                {quickButtons.map((button) => (
                    <TouchableOpacity
                        key={button.id}
                        style={styles.button}
                        onLongPress={() => handleLongPress(button.id)}
                        onPress={() => 

                            handlePress(button.id)}
                    >
                        <Text className="text-white font-bold">{button.name}</Text>
                    </TouchableOpacity>
                ))}
            </HStack>
       
      </VStack>

      <Modal 
        isOpen={showEditQuickStart} 
        onClose={handleCloseModal}
        size="full"
      >
      <ModalBackdrop />
      <ModalContent>
          <ModalHeader>
            <Heading size="md" className="text-typography-950">Edit: {currentEditingButton?.name ?? 'Quick Start'}</Heading>
          </ModalHeader>
          <ModalCloseButton onPress={handleCloseModal}>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
          <ModalBody>
              <TextInput
                  value={currentName}
                  onChangeText={setCurrentName}
                  placeholder="Button Name"
                  style={styles.textInput}
              />
              {exercises.map((exercise) => (
                  <TouchableOpacity
                      key={exercise.id}
                      className="flex-row items-center justify-between p-4 border-b border-gray-200"
                      onPress={() => {
                          setSelectedExercises((prev) => {
                              if (prev.some((ex) => ex.id === exercise.id)) {
                                  return prev.filter((ex) => ex.id !== exercise.id);
                              } else {
                                  return [...prev, exercise];
                              }
                          });
                      }}
                  >
                      <Text className="text-typography-900">{exercise.name}</Text>
                      {selectedExercises.some((ex) => ex.id === exercise.id) ?
                          <Icon as={RemoveIcon} size="md" /> :
                          <Icon as={AddIcon} size="md" />}
                  </TouchableOpacity>
              ))}
          </ModalBody>
      </ModalContent>
      <ModalFooter>
        <Button title="Save" onPress={handleSaveChanges} />
        <Button title="Cancel" onPress={handleCloseModal} color="grey"/>
      </ModalFooter>
  </Modal>


    <Modal
            isOpen={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            size="full"
        >
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader className="justify-center">
                    <Heading size="md" className="text-typography-950">Workout in Progress</Heading>
                </ModalHeader>
                <ModalCloseButton onPress={() => setShowConfirmation(false)}>
                    <Icon
                        as={CloseIcon}
                        size="md"
                        className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
                    />
                </ModalCloseButton>
                <ModalBody>
                    <Text className="text-typography-900">
                        You already have an active workout in progress. What would you like to do?
                    </Text>
                </ModalBody>
                <ModalFooter className="justify-center">
                    <TouchableOpacity
                        style={{backgroundColor: '#5166cf', padding: 10, borderRadius: 5}}
                        onPress={() => {
                            setShowConfirmation(false);
                            router.push('/workout');
                        }}
                    >
                        <Text style={styles.buttonText}>
                        Go to Current Workout
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{backgroundColor: '#fc4c5d', padding: 10, borderRadius: 5}}
                        onPress={() => {
                            setShowConfirmation(false);
                            if (pendingButtonId) {
                                startNewWorkout(pendingButtonId);
                                setPendingButtonId(null);
                            }
                        }}
                    >
                        <Text style={styles.buttonText}>
                        Start New Workout!
                        </Text>
                    </TouchableOpacity>
                </ModalFooter>
            </ModalContent>
        </Modal>
        

  </>
  );

}

const styles = StyleSheet.create({
    button: {
      backgroundColor: '#5166cf',
      width: '30%',
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      marginHorizontal: '1.5%',
    },
    textInput: {
      borderWidth: 1,
      borderColor: 'white',
      padding: 10,
      borderRadius: 5,
      fontSize: 16,
      marginBottom: 20,
      color: 'white',

    },
    buttonText: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
    }
  });