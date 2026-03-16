#!/usr/bin/env python3
"""
Train fraud detection models for social media content classification.
Classes: Normal (0), Suspicious (1), Fraudulent (2)
"""

import os
import json
import pickle
import logging
import argparse
import pandas as pd
import numpy as np

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Fraud detection keywords and patterns
FRAUD_KEYWORDS = {
    "phishing": [
        "verify your account", "suspended account", "click here immediately",
        "urgent action required", "confirm your identity", "update your information",
        "your account will be closed", "unauthorized login attempt", "security breach",
        "verify your email", "confirm your password", "account verification",
        "suspicious activity detected", "login from new device", "protect your account"
    ],
    "impersonation": [
        "official bank", "customer care", "support team", "verified account",
        "this is your bank", "we are contacting you from", "bank representative",
        "customer service", "official support", "trusted partner", "authorized dealer"
    ],
    "scam": [
        "free money", "get rich quick", "guaranteed returns", "no risk investment",
        "limited time offer", "act now", "exclusive opportunity", "you have won",
        "claim your prize", "inheritance", "lottery winner", "congratulations you won",
        "claim your reward", "free gift", "no purchase necessary", "winner selected"
    ],
    "financial_fraud": [
        "send money", "wire transfer", "bitcoin", "cryptocurrency investment",
        "double your money", "investment opportunity", "trading signals",
        "forex trading", "binary options", "pyramid scheme", "ponzi scheme",
        "multi-level marketing", "mlm opportunity", "passive income"
    ],
    "fake_giveaway": [
        "free iphone", "free ipad", "free laptop", "giveaway", "contest winner",
        "retweet to win", "share to win", "like and share", "tag friends to win"
    ]
}

NORMAL_PATTERNS = [
    "thanks for following", "great to connect", "looking forward to",
    "have a great day", "nice to meet you", "thanks for sharing",
    "interesting article", "good morning", "good evening", "happy birthday",
    "congratulations on", "well done", "keep up the good work"
]

def generate_fraud_dataset(num_examples: int = 10000):
    """Generate synthetic fraud detection dataset"""
    texts = []
    labels = []
    
    # Generate fraudulent examples (class 2)
    fraud_templates = [
        "URGENT: Your {bank} account has been suspended. Click here to verify: {link}",
        "Congratulations! You have won ${amount} in our lottery. Claim your prize now: {link}",
        "Official {bank} Customer Care: We detected suspicious activity. Verify your account: {link}",
        "FREE MONEY! Double your investment in 24 hours. No risk, guaranteed returns. Sign up: {link}",
        "Limited time offer! Get rich quick with our exclusive investment opportunity. Act now!",
        "Your {platform} account will be closed in 24 hours. Click here to prevent closure: {link}",
        "You have been selected for a free {item}. Claim now: {link}",
        "Official {company} Support: Your account needs verification. Click here: {link}",
        "Investment opportunity: Turn ${amount} into ${amount2} in just 7 days. Guaranteed!",
        "Your payment method has expired. Update now to avoid service interruption: {link}",
        "Security alert: Unauthorized login detected. Secure your account: {link}",
        "You've won! Claim your prize worth ${amount}. Click here: {link}",
        "Official message from {bank}: Verify your identity to continue using our services: {link}",
        "Get rich quick! Join our exclusive trading program. Minimum investment: ${amount}",
        "Your {service} subscription is about to expire. Renew now: {link}"
    ]
    
    fraud_count = int(num_examples * 0.3)  # 30% fraudulent
    for i in range(fraud_count):
        template = np.random.choice(fraud_templates)
        text = template.format(
            bank=np.random.choice(["Bank of America", "Chase", "Wells Fargo", "Citibank"]),
            link=np.random.choice(["bit.ly/fake", "tinyurl.com/scam", "goo.gl/fraud"]),
            amount=np.random.choice(["1000", "5000", "10000", "50000"]),
            amount2=np.random.choice(["2000", "10000", "20000", "100000"]),
            platform=np.random.choice(["PayPal", "Amazon", "eBay", "Netflix"]),
            item=np.random.choice(["iPhone", "iPad", "MacBook", "cash prize"]),
            company=np.random.choice(["Microsoft", "Apple", "Google", "Amazon"]),
            service=np.random.choice(["Netflix", "Spotify", "Amazon Prime"])
        )
        texts.append(text)
        labels.append(2)  # Fraudulent
    
    # Generate suspicious examples (class 1)
    suspicious_templates = [
        "Check out this amazing opportunity to make money online",
        "I found this great investment platform, seems legit",
        "Has anyone tried this new trading app? Looks interesting",
        "Free cryptocurrency giveaway happening now",
        "This looks like a good deal, but I'm not sure",
        "Received a message about winning something, is this real?",
        "Someone contacted me claiming to be from my bank",
        "Is this investment opportunity too good to be true?",
        "Got an email about account verification, seems suspicious",
        "Free money offer, but I'm skeptical about it"
    ]
    
    suspicious_count = int(num_examples * 0.2)  # 20% suspicious
    for i in range(suspicious_count):
        template = np.random.choice(suspicious_templates)
        texts.append(template)
        labels.append(1)  # Suspicious
    
    # Generate normal examples (class 0)
    normal_templates = [
        "Thanks for following! Looking forward to connecting with you.",
        "Great article about technology trends. Very informative!",
        "Happy birthday! Hope you have an amazing day.",
        "Just finished reading an interesting book. Highly recommend it.",
        "Beautiful weather today. Perfect for a walk in the park.",
        "Excited to announce my new project launching next month.",
        "Grateful for all the support from my followers. Thank you!",
        "Sharing some thoughts on the latest industry developments.",
        "Had a great meeting today. Productive discussions all around.",
        "Weekend plans: spending time with family and friends.",
        "New blog post is live! Check it out if you're interested.",
        "Appreciate all the feedback. Keep it coming!",
        "Working on something exciting. Stay tuned for updates.",
        "Enjoyed the conference. Learned a lot from the speakers.",
        "Coffee and coding. Perfect way to start the day."
    ]
    
    normal_count = num_examples - fraud_count - suspicious_count  # 50% normal
    for i in range(normal_count):
        template = np.random.choice(normal_templates)
        texts.append(template)
        labels.append(0)  # Normal
    
    # Shuffle the dataset
    indices = np.random.permutation(len(texts))
    texts = [texts[i] for i in indices]
    labels = [labels[i] for i in indices]
    
    df = pd.DataFrame({"text": texts, "label": labels})
    return df

def build_models(mlp_epochs: int = 10):
    """Build fraud detection models"""
    models = {
        "logreg": LogisticRegression(
            C=1.0, 
            max_iter=1000, 
            class_weight='balanced', 
            solver='lbfgs',
            random_state=42
        ),
        "svm": LinearSVC(class_weight='balanced', multi_class='ovr'),
        "random_forest": RandomForestClassifier(
            n_estimators=300, 
            n_jobs=1, 
            class_weight='balanced',
            random_state=42
        ),
        "grad_boost": GradientBoostingClassifier(),
        "naive_bayes": MultinomialNB(),
        "mlp": MLPClassifier(
            hidden_layer_sizes=(512, 128), 
            activation='relu', 
            solver='adam', 
            batch_size=256, 
            learning_rate_init=1e-3, 
            max_iter=1, 
            warm_start=True
        )
    }
    return models

def train_and_save(models, df, output_dir: str, mlp_epochs: int = 10):
    """Train models and save them"""
    X_train, X_val, y_train, y_val = train_test_split(
        df["text"], df["label"], test_size=0.3, random_state=42, stratify=df["label"]
    )
    
    # TF-IDF vectorization
    vectorizer = TfidfVectorizer(
        max_features=20000, 
        ngram_range=(1, 2), 
        sublinear_tf=True,
        min_df=2,
        max_df=0.95
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_val_vec = vectorizer.transform(X_val)
    
    results = {}
    
    for name, clf in models.items():
        logger.info(f"Training {name}...")
        
        if name == "mlp":
            logger.info(f"Training MLP for {mlp_epochs} epochs...")
            for epoch in range(mlp_epochs):
                clf.max_iter = 1
                clf.fit(X_train_vec, y_train)
                train_acc = clf.score(X_train_vec, y_train)
                val_acc = clf.score(X_val_vec, y_val)
                logger.info(f"MLP epoch {epoch + 1}/{mlp_epochs} - train_acc={train_acc:.4f} val_acc={val_acc:.4f}")
        else:
            clf.fit(X_train_vec, y_train)
        
        y_pred = clf.predict(X_val_vec)
        acc = accuracy_score(y_val, y_pred)
        f1 = f1_score(y_val, y_pred, average='weighted')
        
        report = classification_report(
            y_val, 
            y_pred, 
            target_names=["normal", "suspicious", "fraudulent"], 
            output_dict=True
        )
        cm = confusion_matrix(y_val, y_pred).tolist()
        
        logger.info(f"Model {name} accuracy: {acc:.4f}, F1: {f1:.4f}")
        results[name] = {
            "report": report,
            "confusion_matrix": cm,
            "accuracy": float(acc),
            "f1_score": float(f1)
        }
    
    # Save models
    os.makedirs(output_dir, exist_ok=True)
    
    with open(os.path.join(output_dir, "vectorizer.pkl"), "wb") as f:
        pickle.dump(vectorizer, f)
    
    for name, clf in models.items():
        with open(os.path.join(output_dir, f"model_{name}.pkl"), "wb") as f:
            pickle.dump(clf, f)
    
    # Save metrics and model info
    best_model = max(results.items(), key=lambda x: x[1]["f1_score"])
    model_info = {
        "best_model": best_model[0],
        "accuracy": best_model[1]["accuracy"],
        "f1_score": best_model[1]["f1_score"],
        "all_results": results
    }
    
    with open(os.path.join(output_dir, "model_info.json"), "w") as f:
        json.dump(model_info, f, indent=2)
    
    with open(os.path.join(output_dir, "metrics.json"), "w") as f:
        json.dump(results, f, indent=2)
    
    logger.info(f"Saved models and metrics to {output_dir}")
    logger.info(f"Best model: {best_model[0]} with F1 score: {best_model[1]['f1_score']:.4f}")

def main():
    parser = argparse.ArgumentParser(description="Train fraud detection models")
    parser.add_argument("--num_examples", type=int, default=10000)
    parser.add_argument("--mlp_epochs", type=int, default=10)
    parser.add_argument("--output_dir", type=str, default="./fraud_detection_classifier")
    args = parser.parse_args()
    
    logger.info(f"Generating fraud detection dataset with {args.num_examples} examples...")
    df = generate_fraud_dataset(num_examples=args.num_examples)
    
    logger.info(f"Dataset distribution:")
    logger.info(f"  Normal: {sum(df['label'] == 0)}")
    logger.info(f"  Suspicious: {sum(df['label'] == 1)}")
    logger.info(f"  Fraudulent: {sum(df['label'] == 2)}")
    
    models = build_models(mlp_epochs=args.mlp_epochs)
    train_and_save(models, df, output_dir=args.output_dir, mlp_epochs=args.mlp_epochs)

if __name__ == "__main__":
    main()
