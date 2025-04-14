import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useWorkoutStore } from '@/lib/useWorkout';
import Workout from '../workout';


describe('ActiveWorkout Component', () => {
  it('renders "No Active Workout" when there is no active workout', () => {
   

    render(<Workout />);

    expect(screen.getByText('No Active Workout')).toBeTruthy();
    expect(screen.getByText('StartWorkout')).toBeTruthy();
  });

  it('renders the active workout with exercises', () => {
    

    render(<Workout />);

    expect(screen.getByText('Morning Workout')).toBeTruthy();
    expect(screen.getByText('Push Up')).toBeTruthy();
    expect(screen.getByText('Pull Up')).toBeTruthy();
  });

  it('renders "No Exercises Added" when there are no exercises', () => {
    

    render(<Workout />);

    expect(screen.getByText('Morning Workout')).toBeTruthy();
    expect(screen.getByText('No Exercises Added')).toBeTruthy();
  });
});