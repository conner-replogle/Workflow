import { useWorkoutStore } from "@/lib/useWorkout";
import { IconSymbol } from "../ui/IconSymbol";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { AddIcon, CheckCircleIcon, CloseCircleIcon, Icon, RemoveIcon, TrashIcon } from "../ui/icon";
import { HStack } from "../ui/hstack";
import { VStack } from "../ui/vstack";
import { TextInput, TouchableOpacity, View } from "react-native";
import { Input, InputField } from "../ui/input";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Gesture, GestureDetector, GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
import { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import Reanimated from "react-native-reanimated";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import React from "react";
export function WorkoutExerciseCard({
  exercise,
  index,
}: {
  exercise: WorkoutExercise;
  index: number;
}) {
  const addSet = useWorkoutStore((state) => state.addSet);
  const removeSet = useWorkoutStore((state) => state.removeSet);
  const removeExercise = useWorkoutStore((state) => state.removeExercise);

  const updateSet = useWorkoutStore(
    (state) => state.updateSet
  );
  const panGesture = Gesture.Pan();
  return (
    <Card size="md" variant="elevated" className="m-3">
        <HStack  className=" p-4 justify-between border-b border-background-20">
            <Heading size="md" >
            {exercise.template.name}
            </Heading>
            <TouchableOpacity onPress={() => removeExercise(index)}>

            <Icon as={RemoveIcon} size="md" />
            </TouchableOpacity>
        </HStack>
        <VStack className="w-full gap-1 ">
          <HStack className="w-full justify-between p-2">
            <Text className="w-1/6">#</Text>
            <Text className="w-2/6 pr-1 text-center">Reps</Text>
            <Text className="w-2/6 pl-1 text-center">Weight (lbs)</Text>
            <TouchableOpacity className="w-1/6" onPress={() => addSet(index)}>
            <Icon as={AddIcon} size="md"  className="ml-auto" />
            </TouchableOpacity>
          </HStack>

          {exercise.sets.map((set, setIndex) => (

          <GestureHandlerRootView key={setIndex} className="w-full">             
            <ReanimatedSwipeable
              friction={2}
              overshootRight={false}
              enableTrackpadTwoFingerGesture
              renderRightActions={(p,a) => RightAction(p,a ,() => removeSet(index, setIndex))}
              >
            <HStack key={setIndex} className={`w-full  items-center p-2 ${set.completed ? "bg-green-400" : ""}  rounded-md`} >
              <Text className="w-1/6">{setIndex + 1}</Text>

              <View className="w-2/6 pr-1">
              <TextInput
                // onChangeText={onChangeNumber}
                onChangeText={(text) => {
                  const reps = parseInt(text);
                  if (!isNaN(reps) &&  reps < 9999) {
                    updateSet(index, setIndex, {
                      ...set,
                      reps: reps,
                    });
                  }else{
                    updateSet(index, setIndex, {
                      ...set,
                      reps: undefined,
                    });
                  }
                }}
                value={set.reps?.toString() ?? ""}
                className="w-full border-solid border-2 border-primary-0 p-1 rounded-lg text-center text-primary-900"
                keyboardType="numeric"
              />
              </View>
              <View className="w-2/6 pl-1">
              <TextInput
                // onChangeText={onChangeNumber}
                onChangeText={(text) => {
                  const weight = parseFloat(text);
                  if (!isNaN(weight) && weight < 9999) {
                    updateSet(index, setIndex, {
                      ...set,
                      weight: weight,
                    });
                  }else{
                    updateSet(index, setIndex, {
                      ...set,
                      weight: undefined,
                    });
                  }
                }}
                value={(set.weight?.toString() ?? "")}
                className="w-full border-solid border-2 border-primary-0 py-1 rounded-lg text-center text-primary-900"
                keyboardType="numeric"
              />
              </View>
              <TouchableOpacity className="w-1/6" onPress={() => updateSet(index, setIndex, {
                ...set,
                completed: !set.completed,
              })}>
                {
                  !set.completed ? (
                    <Icon className="ml-auto" as={CheckCircleIcon} size="md" />
                  ) : (
                    <Icon className="ml-auto" as={CloseCircleIcon} size="md" />
                  )
                }
              </TouchableOpacity>
            </HStack>
            </ReanimatedSwipeable>
            </GestureHandlerRootView>
          ))}
        </VStack>
    </Card>
  );

}

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>, onPress: () => void) {
  const styleAnimation = useAnimatedStyle(() => {

    return {
      transform: [{ translateX: drag.value + 100 }],
    };
  });

  return (
    <Reanimated.View style={styleAnimation} className="bg-red-500 rounded-l-lg w-[100px] flex flex-row items-center justify-center">
      <TouchableOpacity onPress={onPress} >
        <Icon as={TrashIcon} size="md" />
      </TouchableOpacity>
    </Reanimated.View>
  );
}
