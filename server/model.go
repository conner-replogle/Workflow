package server

import (
	"fmt"
	"log/slog"

	tf "github.com/galeone/tensorflow/tensorflow/go"
	tg "github.com/galeone/tfgo"
)

type Model struct {
	model          *tg.Model
	embedding_size int
}

func NewModel(modelPath string, embedding_size int) (*Model, error) {
	model := tg.LoadModel(modelPath, []string{"serve"}, nil)
	if model == nil {
		return nil, fmt.Errorf("failed to load model from path: %s", modelPath)
	}
	return &Model{model: model, embedding_size: embedding_size}, nil
}

func (m *Model) Predict(input []int) (int, error) {
	// Load workout embeddings from a JSON file
	slog.Info("Running prediction with input:", "input", input)
	// Convert input to one-hot encoded tensor
	numClasses := m.embedding_size
	oneHotInput := make([][]float32, 5)
	for i := range 5 {
		oneHotRow := make([]float32, numClasses)
		idx := input[i]

		if idx >= 0 && idx < numClasses {
			oneHotRow[idx] = 1.0
		}
		oneHotInput[i] = oneHotRow

	}
	slog.Info("One-hot encoded input:", "oneHotInput", oneHotInput)

	tensor, err := tf.NewTensor(oneHotInput)
	if err != nil {
		return -1, fmt.Errorf("failed to create tensor: %v", err)
	}

	// Run the model prediction
	results := m.model.Exec([]tf.Output{
		m.model.Op("StatefulPartitionedCall", 0),
	}, map[tf.Output]*tf.Tensor{
		m.model.Op("serving_default_inputs", 0): tensor,
	})

	// Extract predictions
	if len(results) == 0 {
		return -1, fmt.Errorf("no results returned from model")
	}

	predictions := results[0].Value().([][]float32)
	if len(predictions) == 0 {
		return -1, fmt.Errorf("empty predictions returned from model")
	}

	// Find the index of the maximum value in the predictions
	predictedIndex := 0
	maxValue := float32(0)
	for i, value := range predictions[0] {
		if value > maxValue {
			maxValue = value
			predictedIndex = i
		}
	}

	// Map the predicted index to the corresponding exercise
	if predictedIndex >= 0 && predictedIndex < m.embedding_size {
		return predictedIndex, nil
	}

	return -1, fmt.Errorf("predicted index out of range")
}
