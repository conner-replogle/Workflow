import { Image, StyleSheet, Platform, ScrollView , View} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Heading } from '@/components/ui/heading';
import { WorkoutHistoryCard } from '@/components/WorkoutHistoryWidget';
import { Divider } from '@/components/ui/divider';
import { QuickStart } from '@/components/QuickStartWidget';
export default function HomeScreen() {
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
});