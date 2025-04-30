import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { useApiStore } from '@/lib/useApi';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import {Text} from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AuthGate({ children }: { children: React.ReactNode }) {
  const user = useApiStore((state) => state.user);
  const login = useApiStore((state) => state.login);
  const signUp = useApiStore((state) => state.signUp);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Heading className="text-3xl font-bold mb-4">{mode === 'login' ? 'Login' : 'Sign Up'}</Heading>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
          >
            <InputField placeholder="Email" onChangeText={setEmail}/>
          </Input>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
          >
            <InputField placeholder="passoword" type='password'  onChangeText={setPassword}/>
          </Input>
          {error && <Text >{error}</Text>}
          <Button
            onPress={async () => {
              setError(null);
              setLoading(true);
              try {
                if (mode === 'login') {
                  await login(email, password);
                } else {
                  await signUp(email, password);
                }
              } catch (e: any) {
                setError(e.message || 'An error occurred');
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            <Text>{loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}</Text>
          </Button>
          <Text style={{ marginTop: 16 }}>
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </Text>
          <Button
            onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}

          >
            <Text>{mode === 'login' ? 'Sign Up' : 'Login'}</Text>
          </Button>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const getAllExercises = useApiStore((state) => state.getAllExercises);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  useEffect(() => {
    getAllExercises();
  }, [getAllExercises]);


  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode="dark">
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView>
          <AuthGate>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </AuthGate>
        </GestureHandlerRootView>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
