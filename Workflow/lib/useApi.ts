import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware'
interface ApiState {
    apiUrl: string;
    setApiUrl: (url: string) => void;
    resetApiUrl: () => void;

    exercises: Exercise[];

    getAllExercises: () => void;

}


// Define the store
export const useApiStore = create<ApiState>()(
   (set) => ({
    apiUrl: 'http://',
    setApiUrl: (url) => set({ apiUrl: url }),
    resetApiUrl: () => set({ apiUrl: 'https://api.example.com' }),

    exercises: [],
    getAllExercises: async () => {
        console.log('Fetching exercises...');
        const response = await fetch('http://localhost:8080/api/exercises');
        if (!response.ok) {
            console.error('Network response was not ok', response.statusText);
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched exercises:', data);
        set({ exercises: data });
    },




})
);


