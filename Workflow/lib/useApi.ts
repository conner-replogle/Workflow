import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
interface ApiState {
    workouts: Workout[];
    exercises: Exercise[];
    user: User | null;
    authToken: string | null;

    login: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string,name: string) => Promise<void>;
    logout: () => Promise<void>;

    getAllWorkouts: () => Promise<void>;
    saveWorkout: (workout: Workout) => Promise<void>;
    getAllExercises: () => Promise<void>;

}
const API_URL = 'http://localhost:8080';


// Define the store
export const useApiStore = create<ApiState>()(devtools(
    persist(
   (set, get) => ({
    exercises: [],
    user: null,
    authToken: null,
    workouts: [],
    getAllExercises: async () => {
        console.log('Fetching exercises...');
        const response = await fetch(`${API_URL}/api/exercises`);
        if (!response.ok) {
            console.error('Network response was not ok', response.statusText);
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        set({ exercises: data });
    },

    getAllWorkouts: async () => {
        console.log('Fetching workouts...');
        const authToken = get().authToken;
        const response = await fetch(`${API_URL}/api/workouts`, {
            headers: {
                ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            },
        });
        if (!response.ok) {
            console.error('Network response was not ok', response.statusText);
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        set({ workouts: data });
    },
    saveWorkout: async (workout: Workout) => { 
        console.log('Saving workout...');
        const authToken = get().authToken;
        workout.exercises.forEach((a) =>{
            a.templateID = a.template.id
        })
        const response = await fetch(`${API_URL}/api/workouts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            },
            body: JSON.stringify(workout),
        });
        if (!response.ok) {
            console.error('Network response was not ok', response.statusText);
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Saved workout:', data);
        set((state) => ({
            workouts: [...state.workouts, data],
        }));
    },

    login: async (email: string, password: string) => {
        console.log('Logging in...');
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            console.error('Network response was not ok', response.statusText);
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Logged in:', data);
        set({ user: data });
    },
    signUp: async (email: string, password: string,name: string) => {
        console.log('Signing up...');
        const response = await fetch(`${API_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password ,name}),
        });
        if (!response.ok) {
            console.error('Network response was not ok', response.statusText);
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Signed up:', data);
        set({ user: data });
    }
    ,
    logout: async () => {
        
        set({ user: null });
    }
    }),{ name: 'account' ,  storage:createJSONStorage(()=> AsyncStorage), })),

);


