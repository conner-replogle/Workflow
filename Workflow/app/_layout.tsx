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
import { Button, ButtonText } from '@/components/ui/button';
import {Text} from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AuthGate({ children }: { children: React.ReactNode }) {
  const user = useApiStore((state) => state.user);
  const login = useApiStore((state) => state.login);
  const signUp = useApiStore((state) => state.signUp);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age , setAge] = useState(18);
  const [height , setHeight] = useState(170);
  const [weight , setWeight] = useState(70);

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <VStack space='sm' className='justify-center items-center' >
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
          {
            mode === 'signup' && (
              <>
              <Input
                variant="outline"
                size="md"
                isDisabled={false}
                isInvalid={false}
                isReadOnly={false}
              >
                <InputField placeholder="Age" onChangeText={(text) => setAge(parseInt(text))}/>
              </Input>
              <Input
                variant="outline"
                size="md"
                isDisabled={false}
                isInvalid={false}
                isReadOnly={false}
              >
                <InputField placeholder="Height" onChangeText={(text) => setHeight(parseInt(text))}/>
              </Input>
              <Input
                variant="outline"
                size="md"
                isDisabled={false}
                isInvalid={false}
                isReadOnly={false}
              >
                <InputField placeholder="Weight" onChangeText={(text) => setWeight(parseInt(text))}/>
              </Input>
              </>
            )
          }
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
            <ButtonText>{loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}</ButtonText>
          </Button>
          <Text >
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </Text>
          <Button
            onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
            variant='link'
          >
            <ButtonText>{mode === 'login' ? 'Sign Up' : 'Login'}</ButtonText>
          </Button>
          </VStack>
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

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);



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
