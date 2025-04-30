package server

import "time"

type Workout struct {
	ID        string            `gorm:"primaryKey" json:"id"`
	StartTime time.Time         `json:"startTime"`
	EndTime   time.Time         `json:"endTime"`
	Name      string            `json:"name"`
	Exercises []WorkoutExercise `gorm:"foreignKey:WorkoutID" json:"exercises"`
}

type Exercise struct {
	ID          int    `gorm:"primaryKey" json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type WorkoutExercise struct {
	ID         int           `gorm:"primaryKey" json:"id"`
	WorkoutID  string        `json:"workoutId"`
	TemplateID int           `json:"templateId"`
	Template   Exercise      `gorm:"foreignKey:TemplateID" json:"template"`
	Sets       []ExerciseSet `gorm:"foreignKey:WorkoutExerciseID" json:"sets"`
}

type ExerciseSet struct {
	ID                string `gorm:"primaryKey" json:"id"`
	WorkoutExerciseID int    `json:"workoutExerciseId"`
	Weight            int    `json:"weight"`
	Reps              int    `json:"reps"`
}
