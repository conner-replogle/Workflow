import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware'
interface WorkoutState {
    workout:  Workout | null,
    start: () => void,
    addSet: (index: number) => void,
    removeSet: (index: number, setIndex: number) => void,
    addExercise: (exercise: Exercise) => void,
    removeExercise: (index: number) => void,
    updateSet: (index: number, setIndex: number, set: ExerciseSet) => void,
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

    updateSet: (index: number, setIndex: number, exSet: ExerciseSet) => {
        set((state) => {
            if (!state.workout) {
                return state;
            }
            const exercise = state.workout.exercises[index];
            if (!exercise) {
                return state;
            }
            return ({
                workout: {
                    ...state.workout,
                    exercises: state.workout.exercises.map((ex, i) => {
                        if (i === index) {
                            return {
                                ...ex,
                                sets: ex.sets.map((s, j) => {
                                    if (j === setIndex) {
                                        return exSet;
                                    }
                                    return s;
                                }),
                            }
                        }
                        return ex;
                    }),
                }
            })
        });
    },
    removeSet: (index: number, setIndex: number) => {
        set((state) => {
            if (!state.workout) {
                return state;
            }
            const exercise = state.workout.exercises[index];
            if (!exercise) {
                return state;
            }
            return ({
                workout: {
                    ...state.workout,
                    exercises: state.workout.exercises.map((ex, i) => {
                        if (i === index) {
                            return {
                                ...ex,
                                sets: ex.sets.filter((_, j) => j !== setIndex),
                            }
                        }
                        return ex;
                    }),
                }
            })
        });
    }
    ,
    addSet: (index: number) => {
        set((state) => {
            if (!state.workout) {
                return state;
            }
            const exercise = state.workout.exercises[index];
            if (!exercise) {
                return state;
            }
            return ({
                workout: {
                    ...state.workout,
                    exercises: state.workout.exercises.map((ex, i) => {
                        if (i === index) {
                            return {
                                ...ex,
                                sets: [...ex.sets, {
                                
                                    reps: 0,
                                    weight: 0,
                                }],
                            }
                        }
                        return ex;
                    }),
                }
            })
        });
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

