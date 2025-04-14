package main

import (
	"encoding/json"
	"log"
	"log/slog"
	"net/http"
	"os"

	"github.com/conner-replogle/Workflow/server"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Exercise struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Name        string `json:"name" gorm:"unique"`
	Description string `json:"description"`
}

type WorkoutExercise struct {
	ID         uint     `json:"id" gorm:"primaryKey"`
	WorkoutID  uint     `json:"workout_id"`
	Workout    Workout  `json:"workout" gorm:"foreignKey:WorkoutID"`
	ExerciseID uint     `json:"exercise_id"`
	Exercise   Exercise `json:"exercise" gorm:"foreignKey:ExerciseID"`
}

type Workout struct {
	ID   uint   `json:"id" gorm:"primaryKey"`
	Name string `json:"name"`
}

var db *gorm.DB

var model *server.Model

func initModel() {
	modelPath := "../workout_generator/output/keras"
	file, err := os.Open("../workout_generator/workout_embeddings.json")
	if err != nil {
		log.Fatal("Failed to open workout_embeddings.json:", err)
	}
	defer file.Close()

	var exercises []string
	if err := json.NewDecoder(file).Decode(&exercises); err != nil {
		log.Fatal("Failed to decode workout_embeddings.json:", err)
	}

	m, err := server.NewModel(modelPath, len(exercises))
	if err != nil {
		log.Fatal("Failed to load model:", err)
	}
	model = m
	slog.Debug("Model loaded successfully")
}

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
	//load ../workout_generator/workout_embeddings.json and load it into the database
	// Load workout_embeddings.json
	file, err := os.Open("../workout_generator/workout_embeddings.json")
	if err != nil {
		log.Fatal("Failed to open workout_embeddings.json:", err)
	}
	defer file.Close()

	var exercises []string
	if err := json.NewDecoder(file).Decode(&exercises); err != nil {
		log.Fatal("Failed to decode workout_embeddings.json:", err)
	}

	// Store exercises in the database
	for id, exercise := range exercises {
		if id == 0 {
			continue
		}
		// Check if the exercise already exists
		var existingExercise Exercise
		if err := db.Where("name = ?", exercise).First(&existingExercise).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				// Create a new exercise if it doesn't exist
				newExercise := Exercise{
					Name: exercise,
				}
				if err := db.Create(&newExercise).Error; err != nil {
					log.Printf("Failed to create exercise %s: %v", exercise, err)
				}
			} else {
				log.Printf("Failed to query exercise %s: %v", exercise, err)
			}
		} else {
			slog.Debug("Exercise already exists:", existingExercise)
			existingExercise.Description = exercise
			existingExercise.Name = exercise
			err := db.UpdateColumns(&existingExercise).Error
			if err != nil {
				slog.Error("Failed to update exercise:", "error", err, "exercise", existingExercise)
			}
			slog.Debug("Updated exercise:", existingExercise)
		}
	}
}

func suggestExercisesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	prev_exercises := r.URL.Query().Get("previous")
	var previousExercises []int
	if err := json.Unmarshal([]byte(prev_exercises), &previousExercises); err != nil {
		slog.Error("Failed to unmarshal previous exercises:", "error", err, "data", prev_exercises)
		http.Error(w, "Invalid previous exercises", http.StatusBadRequest)
		return
	}
	slog.Debug("Received previous exercises:", previousExercises)
	//run model

	predictions, err := model.Predict(previousExercises)
	if err != nil {
		slog.Error("Model prediction failed:", "error", err)
		http.Error(w, "Model prediction failed", http.StatusInternalServerError)
		return
	}
	slog.Debug("Model prediction completed")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(predictions)

}

func getAllExercises(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	slog.Debug("Fetching all exercises")

	var exercises []Exercise
	db.Find(&exercises)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(exercises)
}

func main() {
	initDatabase()
	initModel()

	http.HandleFunc("/api/exercises/suggested", suggestExercisesHandler)
	http.HandleFunc("/api/exercises", getAllExercises)

	port := ":8080"
	println("Server is running on http://localhost" + port)
	if err := http.ListenAndServe(port, nil); err != nil {
		panic(err)
	}
}
