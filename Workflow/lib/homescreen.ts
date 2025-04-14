import { create } from "zustand"
import {devtools, persist} from "zustand/middleware"

type QuickButton = {
    id: string,
    name: string,
    exercises: Exercise[],
}



interface HomeScreenState  {
    quickButtons: QuickButton[],
    updateQuickButtonName: (id: string, name: string) => void,
    updateQuickButtonExercises: (id: string, exercises: Exercise[]) => void,
    setQuickButtons: (quickButtons: QuickButton[]) => void,
}

export const useHomeScreenStore = create<HomeScreenState>()(
    devtools(
        persist((set) => ({
            quickButtons:[
                {id: '1', name: 'Custom QuickStart', exercises: []},
                {id: '2', name: 'Custom QuickStart', exercises: []},
                {id: '3', name: 'Custom QuickStart', exercises: []},
            ] as QuickButton[],
            
            updateQuickButtonName: (id: string, name: string) => {
                set((state) => ({
                    quickButtons: state.quickButtons.map(button =>
                        button.id === id ? { ...button, name } : button
                    )
                }))
            },
            updateQuickButtonExercises: (id: string, exercises: Exercise[]) => {
                set((state) => ({
                    quickButtons: state.quickButtons.map(button =>
                        button.id === id ? { ...button, exercises } : button
                    )
                }))
            },
            setQuickButtons: (quickButtons: QuickButton[]) => {
                set({quickButtons})
            },
        }),{name: 'homescreen'},
    )));