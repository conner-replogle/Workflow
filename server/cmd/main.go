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

	"strconv"

	"github.com/lmittmann/tint"
	"golang.org/x/crypto/bcrypt"
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
	err = db.AutoMigrate(&server.User{}, &server.Exercise{}, &server.Workout{})
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

// --- Auth helpers ---

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func getUserIDFromRequest(r *http.Request) (uint, error) {
	cookie, err := r.Cookie("session_id")
	if err != nil {
		return 0, err
	}
	userID, err := strconv.ParseUint(cookie.Value, 10, 64)
	if err != nil {
		return 0, err
	}
	return uint(userID), nil
}

// --- Auth Handlers ---

func signupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	if req.Email == "" || req.Password == "" {
		http.Error(w, "email and password required", http.StatusBadRequest)
		return
	}
	hashed, err := hashPassword(req.Password)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}
	user := server.User{Email: req.Email, Password: hashed}
	if err := db.Create(&user).Error; err != nil {
		http.Error(w, "email already exists", http.StatusConflict)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{"id": user.ID, "email": user.Email})
	slog.Debug("User signed up", "userID", user.ID, "email", user.Email)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	var user server.User
	if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}
	if !checkPasswordHash(req.Password, user.Password) {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}
	// Set session cookie (just user ID for demo; use JWT or secure session in production)
	http.SetCookie(w, &http.Cookie{
		Name:     "session_id",
		Value:    strconv.FormatUint(uint64(user.ID), 10),
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
	json.NewEncoder(w).Encode(map[string]interface{}{"id": user.ID, "email": user.Email})
	slog.Debug("User logged in", "userID", user.ID, "email", user.Email)
}

// --- Workout Handlers (with user scoping) ---

func storeWorkoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	userID, err := getUserIDFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	var workout server.Workout
	if err := json.NewDecoder(r.Body).Decode(&workout); err != nil {
		slog.Error("Failed to decode workout:", "error", err)
		http.Error(w, "Invalid workout data", http.StatusBadRequest)
		return
	}
	workout.UserID = userID
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
	userID, err := getUserIDFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	slog.Debug("Fetching all workouts for user", "userID", userID)

	var workouts []server.Workout
	if err := db.Where("user_id = ?", userID).Find(&workouts).Error; err != nil {
		slog.Error("Failed to fetch workouts:", "error", err)
		http.Error(w, "Failed to fetch workouts", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(workouts)
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
	http.HandleFunc("/api/auth/signup", signupHandler)
	http.HandleFunc("/api/auth/login", loginHandler)
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
