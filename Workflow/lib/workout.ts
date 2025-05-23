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
    templateID?: number;
    template: Exercise;
    sets: ExerciseSet[];
}

type ExerciseSet = {
    id?: string;
    weight?: number;
    reps?: number;
    completed?: boolean;
}


type User = {
    id: string;
    name: string;
    age: number;
    height: number;
    weight: number;
    email: string;
    token: string;

}
