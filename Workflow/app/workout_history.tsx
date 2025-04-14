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
import React from 'react';
import { ModalBackdrop, Modal,ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { useApiStore } from '@/lib/useApi';

export default function WorkoutHistory() {
  return (
    <View className="flex-1 p-4">
      <Text>Workout History</Text>
    </View>
  );
}