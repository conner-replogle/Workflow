type Workout = {
    id?: string;
    startTime: Date;
    endTime?: Date;
    name: string;
    exercises: WorkoutExercise[];

}

type Exercise = {
    id?: number;
    name: string;
    description: string;
}


type WorkoutExercise = {
    id?: number;
    template: Exercise;
    sets: ExerciseSet[];
}

type ExerciseSet = {
    id?: string;
    weight?: number;
    reps?: number;
    completed?: boolean;
}
