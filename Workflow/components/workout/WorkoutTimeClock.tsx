import React, { useEffect, useState } from 'react';
import { Text } from '../ui/text';

export function WorkoutClockTime({ startingTime ,stop}: { startingTime: Date ,stop : boolean}) {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        if (stop){
            const now = new Date();
            const diffInSeconds = Math.floor((now.getTime() - startingTime.getTime()) / 1000);
            setElapsedTime(diffInSeconds);
            return;
        }
        const interval = setInterval(() => {
            const now = new Date();
            const diffInSeconds = Math.floor((now.getTime() - startingTime.getTime()) / 1000);
            setElapsedTime(diffInSeconds);
        }, 1000);

        return () => clearInterval(interval); // Cleanup on component unmount
    }, [startingTime,stop]);

    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;

    return (
        <Text>
            {minutes}:{seconds.toString().padStart(2, '0')}
        </Text>
    );
}