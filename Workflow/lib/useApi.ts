import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware'
interface ApiState {


    exercises: Exercise[];

    getAllExercises: () => void;

}
const API_URL = 'http://localhost:8080';


// Define the store
export const useApiStore = create<ApiState>()(
   (set) => ({

    exercises: [],
    getAllExercises: async () => {
        console.log('Fetching exercises...');
        const response = await fetch(`${API_URL}/api/exercises`);
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


