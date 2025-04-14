import { useEffect, useState } from "react";
import { useApiStore } from "./useApi";

export function useSuggestedExercises(previous: Exercise[]){
    const [suggestedExercises, setSuggestedExercises] = useState<Exercise[]>([]);
    const exercises = useApiStore((state) => state.exercises);
  
    
   useEffect(() => {
        // let path = `http://localhost:8080/api/exercises/suggested?previous=${encodeURI(JSON.stringify(previous.map((a)=>a.id!)))}`
        // fetch(path, {
          
        // })
        // .then((response) => {   
            
        //     if (!response.ok) {
        //         console.log('Response status:', response.status);
        //         console.log('Response status text:', response.statusText);

        //         throw new Error(`Network response was not ok ${path}`,);
        //     }
        //     return response.json();
        // }
        // )
        // .then((data) => {
        //     console.log('Suggested exercises:', data);
        //     setSuggestedExercises(data);
        // }
        // )
        // .catch((error) => {
        //     console.error('Error fetching suggested exercises:', error);
        // }
        // );
    }, [ exercises, previous]);
    
    return suggestedExercises;

}