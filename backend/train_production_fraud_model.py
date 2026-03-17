#!/usr/bin/env python3
"""
Production Fraud Detection Model Training
Uses real-world SMS spam dataset + enhanced rule-based detection
"""

import os
import json
import pickle
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import LinearSVC
from sklearn.naive_bayes import MultinomialNB
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score

print("="*70)
print("Production Fraud Detection Model Training")
print("="*70)

# Download and load SMS Spam Collection dataset
print("\nDownloading SMS Spam Collection dataset...")
url = "https://raw.githubusercontent.com/mohitgupta-omg/Kaggle-SMS-Spam-Collection-Dataset-/master/spam.csv"

try:
    df = pd.read_csv(url, encoding='latin-1')
    # Clean up columns
    df = df[['v1', 'v2']]
    df.columns = ['label', 'text']
    
    # Map labels: ham=0 (normal), spam=2 (fraudulent)
    df['label'] = df['label'].map({'ham': 0, 'spam': 2})
    
    print(f"✓ Loaded {len(df)} SMS messages")
    print(f"  Ham (normal): {sum(df['label'] == 0)}")
    print(f"  Spam (fraudulent): {sum(df['label'] == 2)}")
    
except Exception as e:
    print(f"Error loading dataset: {e}")
    print("Trying alternative source...")
    
    # Alternative: UCI ML Repository
    url2 = "https://archive.ics.uci.edu/ml/machine-learning-databases/00228/smsspamcollection.zip"
    import urllib.request
    import zipfile
    
    urllib.request.urlretrieve(url2, "spam.zip")
    with zipfile.ZipFile("spam.zip", 'r') as zip_ref:
        zip_ref.extractall(".")
    
    df = pd.read_csv("SMSSpamCollection", sep='\t', names=['label', 'text'])
    df['label'] = df['label'].map({'ham': 0, 'spam': 2})
    os.remove("spam.zip")
    os.remove("SMSSpamCollection")
    
    print(f"✓ Loaded {len(df)} SMS messages from alternative source")

# Create suspicious class (label=1) from borderline cases
print("\nCreating suspicious class...")

suspicious_patterns = {
    'urgency': ['limited time', 'act now', 'hurry', 'expires', 'today only', 'last chance'],
    'money': ['free', 'win', 'prize', 'cash', 'discount', 'save', '£', '$'],
    'action': ['click', 'call now', 'text', 'reply', 'claim', 'redeem'],
    'marketing': ['offer', 'deal', 'sale', 'promotion', 'special']
}

def classify_suspicious(text):
    """Identify suspicious messages (aggressive marketing, borderline spam)"""
    text_lower = str(text).lower()
    
    # Count pattern matches
    urgency_count = sum(1 for p in suspicious_patterns['urgency'] if p in text_lower)
    money_count = sum(1 for p in suspicious_patterns['money'] if p in text_lower)
    action_count = sum(1 for p in suspicious_patterns['action'] if p in text_lower)
    marketing_count = sum(1 for p in suspicious_patterns['marketing'] if p in text_lower)
    
    total_score = urgency_count + money_count + action_count + marketing_count
    
    # Strong fraud indicators
    fraud_indicators = ['password', 'account', 'verify', 'suspended', 'urgent', 'bank', 'credit card']
    has_fraud = any(ind in text_lower for ind in fraud_indicators)
    
    # Suspicious: has marketing/urgency but not strong fraud
    if total_score >= 3 and not has_fraud:
        return True
    return False

# Reclassify some spam as suspicious
suspicious_data = []
remaining_spam = []

for _, row in df[df['label'] == 2].iterrows():
    if classify_suspicious(row['text']):
        suspicious_data.append({'text': row['text'], 'label': 1})
    else:
        remaining_spam.append({'text': row['text'], 'label': 2})

suspicious_df = pd.DataFrame(suspicious_data)
remaining_spam_df = pd.DataFrame(remaining_spam)
normal_df = df[df['label'] == 0]

print(f"Created {len(suspicious_df)} suspicious samples from spam")
print(f"Remaining fraudulent: {len(remaining_spam_df)}")
print(f"Normal: {len(normal_df)}")

# Combine all classes
final_df = pd.concat([normal_df, suspicious_df, remaining_spam_df], ignore_index=True)
final_df = final_df.sample(frac=1, random_state=42).reset_index(drop=True)

print(f"\nFinal dataset:")
print(f"  Normal (0): {sum(final_df['label'] == 0)}")
print(f"  Suspicious (1): {sum(final_df['label'] == 1)}")
print(f"  Fraudulent (2): {sum(final_df['label'] == 2)}")
print(f"  Total: {len(final_df)}")

# Split data
print("\nSplitting data (80% train, 20% test)...")
X_train, X_test, y_train, y_test = train_test_split(
    final_df['text'], final_df['label'],
    test_size=0.2, random_state=42, stratify=final_df['label']
)

print(f"Train: {len(X_train)}, Test: {len(X_test)}")

# Vectorization
print("\nVectorizing text with TF-IDF...")
vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2),
    min_df=2,
    max_df=0.95,
    sublinear_tf=True,
    strip_accents='unicode',
    lowercase=True
)

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

print(f"Feature matrix shape: {X_train_vec.shape}")

# Train models
print("\n" + "="*70)
print("Training Models")
print("="*70)

models = {
    'logreg': LogisticRegression(C=1.0, max_iter=1000, class_weight='balanced', random_state=42),
    'svm': LinearSVC(C=0.5, class_weight='balanced', max_iter=2000, random_state=42),
    'random_forest': RandomForestClassifier(n_estimators=200, max_depth=50, class_weight='balanced', random_state=42, n_jobs=-1),
    'grad_boost': GradientBoostingClassifier(n_estimators=100, max_depth=5, random_state=42),
    'naive_bayes': MultinomialNB(alpha=0.1),
    'mlp': MLPClassifier(hidden_layer_sizes=(256, 128), max_iter=50, random_state=42, early_stopping=True)
}

results = {}
best_model = None
best_f1 = 0

for name, clf in models.items():
    print(f"\n[{name.upper()}]")
    print("Training...", end=" ")
    clf.fit(X_train_vec, y_train)
    print("✓")
    
    # Predictions
    y_pred_train = clf.predict(X_train_vec)
    y_pred_test = clf.predict(X_test_vec)
    
    # Metrics
    train_acc = accuracy_score(y_train, y_pred_train)
    test_acc = accuracy_score(y_test, y_pred_test)
    test_f1 = f1_score(y_test, y_pred_test, average='weighted')
    
    print(f"Train Accuracy: {train_acc:.4f}")
    print(f"Test Accuracy:  {test_acc:.4f}")
    print(f"Test F1 Score:  {test_f1:.4f}")
    
    # Detailed report
    report = classification_report(
        y_test, y_pred_test,
        target_names=['normal', 'suspicious', 'fraudulent'],
        output_dict=True,
        zero_division=0
    )
    cm = confusion_matrix(y_test, y_pred_test).tolist()
    
    results[name] = {
        'train_accuracy': float(train_acc),
        'test_accuracy': float(test_acc),
        'f1_score': float(test_f1),
        'report': report,
        'confusion_matrix': cm
    }
    
    if test_f1 > best_f1:
        best_f1 = test_f1
        best_model = name

# Save models
output_dir = './fraud_detection_classifier'
os.makedirs(output_dir, exist_ok=True)

print(f"\n" + "="*70)
print(f"Saving models to {output_dir}...")
print("="*70)

with open(os.path.join(output_dir, 'vectorizer.pkl'), 'wb') as f:
    pickle.dump(vectorizer, f)
print("✓ Saved vectorizer")

for name, clf in models.items():
    with open(os.path.join(output_dir, f'model_{name}.pkl'), 'wb') as f:
        pickle.dump(clf, f)
    print(f"✓ Saved {name}")

# Save metrics
model_info = {
    'best_model': best_model,
    'test_accuracy': results[best_model]['test_accuracy'],
    'f1_score': results[best_model]['f1_score'],
    'all_results': results,
    'dataset_info': {
        'total_samples': len(final_df),
        'train_samples': len(X_train),
        'test_samples': len(X_test),
        'normal': int(sum(final_df['label'] == 0)),
        'suspicious': int(sum(final_df['label'] == 1)),
        'fraudulent': int(sum(final_df['label'] == 2)),
        'source': 'SMS Spam Collection Dataset'
    }
}

with open(os.path.join(output_dir, 'model_info.json'), 'w') as f:
    json.dump(model_info, f, indent=2)

with open(os.path.join(output_dir, 'metrics.json'), 'w') as f:
    json.dump(results, f, indent=2)

print("✓ Saved metrics")

# Print final summary
print("\n" + "="*70)
print("TRAINING COMPLETE")
print("="*70)
print(f"Best Model: {best_model.upper()}")
print(f"Test Accuracy: {results[best_model]['test_accuracy']:.4f}")
print(f"F1 Score: {results[best_model]['f1_score']:.4f}")
print("="*70)
print("\nClassification Report (Best Model):")
print(classification_report(
    y_test, 
    models[best_model].predict(X_test_vec),
    target_names=['normal', 'suspicious', 'fraudulent'],
    zero_division=0
))
print("="*70)
