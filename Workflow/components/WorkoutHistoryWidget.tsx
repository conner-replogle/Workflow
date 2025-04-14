import { Card } from "./ui/card";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";
import { AddIcon, ArrowRightIcon, CheckCircleIcon, CloseCircleIcon, Icon, RemoveIcon, TrashIcon } from "./ui/icon";
import { HStack } from "./ui/hstack";
import { VStack } from "./ui/vstack";
import { Button, TextInput, TouchableOpacity, View } from "react-native";
import { Box } from "./ui/box";
import { useRouter } from "expo-router";


export function WorkoutHistoryCard() {
  return (
    <VStack className="p-4">
      <HStack className="justify-between mb-4">
        <Heading className="text-2xl font-bold">Workout History</Heading>
        <WorkoutHistoryRouteButton />
      </HStack>
        <Card size="lg" variant="filled" >
          <VStack>
          <View className="flex-row gap-2 justify-between">
            <Text className="text-lg">Date</Text>
            <Text className="text-sm">Time ago?</Text>
          </View>
          <View className="flex-row gap-2 justify-between">
            <Text className="text-sm">Time</Text>
            <Text className="text-sm">Weight</Text>
          </View>
          </VStack>
        </Card>
  
    </VStack>
  );
}

function WorkoutHistoryRouteButton() {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push('/workout')}>
      <Icon className="p-4 ml-4" as={ArrowRightIcon} size="xl" />
    </TouchableOpacity>
  );
}