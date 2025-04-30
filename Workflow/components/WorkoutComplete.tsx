

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogBackdrop,
} from "@/components/ui/alert-dialog"
import { Text } from "./ui/text";

import { useApiStore } from "@/lib/useApi";
import { useWorkoutStore } from "@/lib/useWorkout";
import { Heading } from "./ui/heading";
import { Button, ButtonText } from "./ui/button";

export function CompleteWorkoutDialog({active, onClose}:{active: boolean,onClose: () => void}) {
    const workout = useWorkoutStore((state) => state.workout);
    const finishWorkout = useApiStore((state) => state.saveWorkout);
    if (workout === null) {
        return null;
    }
    return (
        <AlertDialog isOpen={active} onClose={onClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Do you want to save this workout?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">
              This workout will be saved to your history. 
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter className="">
            <Button
              variant="outline"
              action="secondary"
              onPress={onClose}
              size="sm"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button size="sm" onPress={()=>{
                finishWorkout(workout).then((err) => {
                    
                    onClose()

                }).catch((err) => {
                    console.log(err);
                    onClose();
                }
                )
            }}>
              <ButtonText>Save</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  