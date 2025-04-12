package main

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Exercise struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Name        string `json:"name"`
	Description string `json:"description"`
}


type WorkoutExercise struct {
	ID         uint     `json:"id" gorm:"primaryKey"`
	WorkoutID  uint     `json:"workout_id"`
	Workout     Workout `json:"workout" gorm:"foreignKey:WorkoutID"`
	ExerciseID uint     `json:"exercise_id"`
	Exercise   Exercise `json:"exercise" gorm:"foreignKey:ExerciseID"`
}

type Workout struct {
	ID         uint     `json:"id" gorm:"primaryKey"`
	Name       string   `json:"name"`

}

var db *gorm.DB

func initDatabase() {
	var err error
	db, err = gorm.Open(sqlite.Open("workout.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Migrate the schema
	err = db.AutoMigrate(&Exercise{}, &Workout{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Seed the database with some exercises
	db.Create(&Exercise{Name: "Push-ups", Description: "A basic upper body strength exercise."})
	db.Create(&Exercise{Name: "Squats", Description: "A lower body exercise to strengthen legs and glutes."})
	db.Create(&Exercise{Name: "Plank", Description: "A core exercise to improve stability and strength."})
}

func suggestExercisesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var exercises []Exercise
	db.Find(&exercises)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(exercises)
}

func main() {
	initDatabase()

	http.HandleFunc("/api/suggest_exercises", suggestExercisesHandler)

	port := ":8080"
	println("Server is running on http://localhost" + port)
	if err := http.ListenAndServe(port, nil); err != nil {
		panic(err)
	}
}
