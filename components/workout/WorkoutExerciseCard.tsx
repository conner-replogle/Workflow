import { useWorkoutStore } from "@/lib/useWorkout";
import { Table, TableBody, TableData, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { IconSymbol } from "../ui/IconSymbol";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Icon, RemoveIcon } from "../ui/icon";
import { HStack } from "../ui/hstack";

export function WorkoutExerciseCard({
  exercise,
  index,
}: {
  exercise: WorkoutExercise;
  index: number;
}) {
  const removeExercise = useWorkoutStore((state) => state.removeExercise);
  return (
    <Card size="md" variant="elevated" className="m-3">
        <HStack  className=" p-4 justify-between border-b border-background-20">
            <Heading size="md" >
            {exercise.template.name}
            </Heading>
            <Icon as={RemoveIcon} size="md" />
        </HStack>
        <Table className="w-full">
        <TableHeader>
            <TableRow>
                <TableHead>Index</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Reps</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
            <TableData>1</TableData>
            <TableData>100lbs</TableData>
            <TableData>4</TableData>
            </TableRow>
            <TableRow>
            <TableData>1</TableData>
            <TableData>100lbs</TableData>
            <TableData>4</TableData>
            </TableRow>
            <TableRow>
            <TableData>1</TableData>
            <TableData>100lbs</TableData>
            <TableData>4</TableData>
            </TableRow>
            <TableRow>
            <TableData>1</TableData>
            <TableData>100lbs</TableData>
            <TableData>4</TableData>
            </TableRow>
            
            
        </TableBody>
        <TableFooter>
            <TableRow>
            <TableHead>Total</TableHead>
            <TableHead>48</TableHead>
            <TableHead>$770</TableHead>
            </TableRow>
        </TableFooter>
        </Table>

    </Card>
  );

} 