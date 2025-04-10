import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware'
interface WorkoutState {
    workout:  Workout | null,
    start: () => void,
    addExercise: (exercise: Exercise) => void,
    removeExercise: (index: number) => void,
  }


// Define the store
export const useWorkoutStore = create<WorkoutState>()(
    devtools(
        persist((set) => ({
    workout: null as Workout | null,
    
    start : () => {
        set((state) => ({
            workout: {
                ...state.workout,
                name: defaultWorkoutName(),
                startTime: new Date(),
                exercises: [],
            },
        }));
    },
    addExercise: (exercise: Exercise) => {
        set((state) => {
            if (!state.workout) {
                return state;
            }
            return ({
                workout: {
                    ...state.workout,
                    exercises: [...(state.workout?.exercises || []), {
                        id: exercise.id,
                        template: exercise,
                        sets: [],
                    }],
                }
            })
        });
    },
    removeExercise: (index: number) => {
        
        set((state) => {
            if (!state.workout) {
                return state;
            }
            return ({
                workout: {
                    ...state.workout,
                    exercises: (state.workout?.exercises || []).filter((_, i) => i !== index),
                }
            })
        });
    },




    }),{ name: 'activeWorkout' },
    )));


function defaultWorkoutName() {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return `Workout ${formattedDate}`;
}

