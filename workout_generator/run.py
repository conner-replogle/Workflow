import sys
import json
import numpy as np
import tensorflow as tf

# Load model and embeddings
model = tf.keras.models.load_model("workout_model.keras")
with open("workout_embeddings.json", "r") as f:
    workout_embeddings = json.load(f)

def predict_next_exercise(previous_exercises):
    input_data = np.eye(len(workout_embeddings))[previous_exercises]
    pred = model.predict(np.array([input_data]), verbose=0)
    predicted_index = int(np.argmax(pred[0]))
    return predicted_index

if __name__ == "__main__":
    # Read previous exercises from stdin as JSON array
    previous_exercises = json.loads(sys.stdin.read())
    results = []
    for _ in range(2):
        next_idx = predict_next_exercise(previous_exercises)
        results.append(next_idx)
        previous_exercises = previous_exercises[1:] + [next_idx]
    print(json.dumps(results))


