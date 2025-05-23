import { useEffect, useState } from "react";
import { useApiStore } from "./useApi";

export function useSuggestedExercises(previous: number[]){
    const [suggestedExercises, setSuggestedExercises] = useState<Exercise[]>([]);
    const exercises = useApiStore((state) => state.exercises);
  
    
    useEffect(() => {
        let path = `http://localhost:8080/api/exercises/suggested?previous=${encodeURI(JSON.stringify(previous))}`
        fetch(path, {
            
        })
        .then((response) => {   
            
            if (!response.ok) {
                console.log('Response status:', response.status);
                console.log('Response status text:', response.statusText);

                throw new Error(`Network response was not ok ${path}`,);
            }
            return response.json();
        }
        )
        .then((data: number[]) => {
            console.log('Suggested exercises:', data);
            let sug = data.map((id) => {
                const exercise = exercises.find((exercise) => exercise.id === id);
                
                if (exercise) {
                    return exercise;
                } else {
                    return exercises[0]
                }
                
            }
            );
            setSuggestedExercises(sug);
        }
        )
        .catch((error) => {
            console.error('Error fetching suggested exercises:', error);
        }
        );
    },[previous, exercises]);

    
    return suggestedExercises;

}