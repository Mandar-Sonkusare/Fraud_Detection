# HateBERT Model Training

This directory contains scripts for fine-tuning the HateBERT model to detect harmful content based on the HARMFUL_KEYWORDS defined in the contentAnalyzer.ts file.

## Overview

The `train_hatebert.py` script fine-tunes the pre-trained HateBERT model to recognize patterns of harmful content beyond the explicit keywords. This allows the model to predict harmful content even for words not explicitly listed in the HARMFUL_KEYWORDS array.

## Requirements

Install the required Python packages:

```bash
pip install -r requirements.txt
```

### Compatibility Notes

If you encounter an error related to Keras 3 compatibility with Transformers, make sure you have installed the backwards-compatible tf-keras package:

```bash
pip install tf-keras>=2.12.0
```

This is required because the Transformers library currently doesn't support Keras 3. The tf-keras package provides a backwards-compatible version that works with Transformers.

## Usage

### Basic Training

To train the model with default parameters:

```bash
python train_hatebert.py
```

### Advanced Options

The script supports various command-line arguments:

```bash
python train_hatebert.py --num_examples 20000 --batch_size 32 --num_epochs 5 --learning_rate 1e-5 --output_dir ./my_fine_tuned_model --test
```

Available options:
- `--num_examples`: Number of training examples to generate (default: 10000)
- `--batch_size`: Batch size for training (default: 16)
- `--num_epochs`: Number of training epochs (default: 3)
- `--learning_rate`: Learning rate for training (default: 2e-5)
- `--output_dir`: Directory to save the fine-tuned model (default: ./hatebert_fine_tuned)
- `--model_name`: Name of the pre-trained model (default: GroNLP/hateBERT)
- `--test`: Run evaluation on test texts after training

## How It Works

1. The script generates a synthetic dataset of harmful and non-harmful content examples based on the HARMFUL_KEYWORDS.
2. It uses templates to create realistic examples of harmful content with various patterns.
3. The pre-trained HateBERT model is fine-tuned on this dataset.
4. The fine-tuned model can then be used to predict whether new content is harmful, even if it doesn't contain explicit keywords.

## Integration with the Frontend

After training, the fine-tuned model can be used in the frontend by:

1. Exporting the model to a format compatible with the frontend (e.g., ONNX)
2. Updating the contentAnalyzer.ts file to use the fine-tuned model
3. The model will provide more accurate predictions for content that doesn't contain explicit keywords

## Notes

- Training the model requires significant computational resources, especially for large datasets.
- The quality of the synthetic dataset affects the model's performance.
- Consider using a GPU for faster training. 