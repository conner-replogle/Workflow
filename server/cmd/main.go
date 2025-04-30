package main

import (
	"bytes"
	"encoding/json"
	"log"
	"log/slog"
	"net/http"
	"os"
	"os/exec"
	"server"

	"time"

	"github.com/lmittmann/tint"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func initDatabase() {
	var err error
	db, err = gorm.Open(sqlite.Open("workout.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Migrate the schema
	err = db.AutoMigrate(&server.Exercise{}, &server.Workout{})
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
		var existingExercise server.Exercise
		if err := db.Where("name = ?", exercise).First(&existingExercise).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				// Create a new exercise if it doesn't exist
				newExercise := server.Exercise{
					Name: exercise,
				}
				if err := db.Create(&newExercise).Error; err != nil {
					log.Printf("Failed to create exercise %s: %v", exercise, err)
				}
			} else {
				log.Printf("Failed to query exercise %s: %v", exercise, err)
			}
		} else {
			//update the existing exercise
			existingExercise.Description = exercise
			existingExercise.Name = exercise
			err := db.UpdateColumns(&existingExercise).Error
			if err != nil {
				slog.Error("Failed to update exercise:", "error", err, "exercise", existingExercise)
			}
			slog.Debug("Updated exercise:", "exercises", existingExercise)
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
	slog.Debug("Received previous exercises:", "prev", previousExercises)

	// Ensure previousExercises is length 5, pad with zeros at the beginning if needed
	if len(previousExercises) < 5 {
		padded := make([]int, 5)
		copy(padded[5-len(previousExercises):], previousExercises)
		previousExercises = padded
	} else if len(previousExercises) > 5 {
		previousExercises = previousExercises[len(previousExercises)-5:]
	}

	// Prepare input for Python script
	input, err := json.Marshal(previousExercises)
	if err != nil {
		slog.Error("Failed to marshal input for python script:", "error", err)
		http.Error(w, "Failed to prepare input", http.StatusInternalServerError)
		return
	}

	// Call Python script
	pyPath := "run.py"
	cmd := exec.Command("python", pyPath)
	cmd.Stdin = bytes.NewReader(input)
	cmd.Stderr = os.Stderr
	cmd.Dir = "../workout_generator" // Set working directory
	var out bytes.Buffer
	cmd.Stdout = &out
	if err := cmd.Run(); err != nil {
		slog.Error("Failed to run python model:", "error", err, "output", out.String())
		http.Error(w, "Failed to run model", http.StatusInternalServerError)
		return
	}
	slog.Debug("Python script output:", "out", out.String())
	w.Header().Set("Content-Type", "application/json")
	w.Write(out.Bytes())
}

func getAllExercises(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	slog.Debug("Fetching all exercises")

	var exercises []server.Exercise
	db.Find(&exercises)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(exercises)
}

func storeWorkoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var workout server.Workout
	if err := json.NewDecoder(r.Body).Decode(&workout); err != nil {
		slog.Error("Failed to decode workout:", "error", err)
		http.Error(w, "Invalid workout data", http.StatusBadRequest)
		return
	}
	if err := db.Create(&workout).Error; err != nil {
		slog.Error("Failed to store workout:", "error", err)
		http.Error(w, "Failed to store workout", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(workout)
}

func getAllWorkoutsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	slog.Debug("Fetching all workouts")

	var workouts []server.Workout
	if err := db.Preload("Exercises.Sets").Preload("Exercises.Template").Find(&workouts).Error; err != nil {
		slog.Error("Failed to fetch workouts:", "error", err)
		http.Error(w, "Failed to fetch workouts", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(workouts)
}

func main() {
	w := os.Stderr
	// set global logger with custom options
	slog.SetDefault(slog.New(
		tint.NewHandler(w, &tint.Options{
			Level:      slog.LevelDebug,
			TimeFormat: time.Kitchen,
		}),
	))
	//Setup DB
	initDatabase()

	// Setup handlers
	http.HandleFunc("/api/exercises/suggested", suggestExercisesHandler)
	http.HandleFunc("/api/exercises", getAllExercises)
	http.HandleFunc("/api/workouts", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			storeWorkoutHandler(w, r)
		case http.MethodGet:
			getAllWorkoutsHandler(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Start the server
	port := ":8080"
	println("Server is running on http://localhost" + port)
	if err := http.ListenAndServe(port, nil); err != nil {
		panic(err)
	}
}
