package server

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email    string `gorm:"unique" json:"email"`
	Password string `json:"password"` // Store hashed password!
}

type Workout struct {
	gorm.Model
	UserID    uint              `json:"userId"`
	StartTime time.Time         `json:"startTime"`
	EndTime   time.Time         `json:"endTime"`
	Name      string            `json:"name"`
	Exercises []WorkoutExercise `json:"exercises" gorm:"serializer:json"`
}

type Exercise struct {
	ID          int    `gorm:"primaryKey" json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type WorkoutExercise struct {
	TemplateID int           `json:"templateID"`
	Sets       []ExerciseSet `json:"sets"`
}

type ExerciseSet struct {
	WorkoutExerciseID int `json:"workoutExerciseId"`
	Weight            int `json:"weight"`
	Reps              int `json:"reps"`
}
