import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../index';
import { Heading } from '@/components/ui/heading';
import { QuickStart } from '@/components/QuickStartWidget';
import { WorkoutHistoryCard } from '@/components/WorkoutHistoryWidget';
import { Divider } from '@/components/ui/divider';

describe('HomeScreen', () => {
  it('renders the HomeScreen component correctly', () => {
    const { getByText, getAllByTestId } = render(<HomeScreen />);

    // Check if the heading is rendered
    expect(getByText('Home')).toBeTruthy();

    // Check if the QuickStart component is rendered
    expect(getAllByTestId('QuickStart')).toHaveLength(1);

    // Check if the WorkoutHistoryCard component is rendered
    expect(getAllByTestId('WorkoutHistoryCard')).toHaveLength(1);

    // Check if the Divider components are rendered
    expect(getAllByTestId('Divider')).toHaveLength(3);
  });

  it('renders the layout with proper styles', () => {
    const { getByTestId } = render(<HomeScreen />);

    // Check if the SafeAreaView is styled correctly
    const safeAreaView = getByTestId('SafeAreaView');
    expect(safeAreaView.props.style).toEqual(
      expect.arrayContaining([{ flex: 1, paddingTop: 10 }])
    );
  });
});