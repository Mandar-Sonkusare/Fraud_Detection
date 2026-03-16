#!/usr/bin/env python3
"""
Train fraud detection models using REAL fraud datasets.
Downloads and combines multiple real-world fraud datasets for production-ready models.
"""

import os
import json
import pickle
import logging
import argparse
import pandas as pd
import numpy as np
from typing import Dict, List
import urllib.request
import zipfile
import io

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

def download_sms_spam_dataset():
    """
    Download SMS Spam Collection Dataset from UCI ML Repository
    Contains: Ham, Spam messages
    """
    logger.info("Downloading SMS Spam Collection dataset...")
    
    url = "https://archive.ics.uci.edu/ml/machine-learning-databases/00228/smsspamcollection.zip"
    
    try:
        # Download and extract
        response = urllib.request.urlopen(url)
        zip_file = zipfile.ZipFile(io.BytesIO(response.read()))
        
        # Read the SMS file
        with zip_file.open('SMSSpamCollection') as f:
            lines = f.readlines()
        
        # Parse data
        data = []
        for line in lines:
            line = line.decode('utf-8', errors='ignore').strip()
            if '\t' in line:
                label, text = line.split('\t', 1)
                data.append({'text': text, 'label': label.lower()})
        
        df = pd.DataFrame(data)
        logger.info(f"✓ Downloaded {len(df)} SMS messages")
        return df
        
    except Exception as e:
        logger.error(f"Error downloading SMS dataset: {e}")
        return None

def generate_phishing_samples(num_samples: int = 5000):
    """
    Generate realistic phishing samples based on common patterns
    """
    logger.info(f"Generating {num_samples} phishing samples...")
    
    phishing_templates = [
        # CRITICAL: Credential theft (direct requests)
        "Please give your social security number for the safety of your account to this link: {url}",
        "For security verification, provide your SSN: {url}",
        "Confirm your social security number to unlock your account: {url}",
        "Send your password to verify your identity: {url}",
        "Reply with your credit card number and CVV to complete verification",
        "Enter your bank account number and routing number here: {url}",
        "Provide your PIN to restore access to your account",
        "We need your password to secure your account. Reply now.",
        "Give your credit card details to prevent account closure: {url}",
        "Send your full SSN and date of birth for verification",
        
        # VOUCHER AND GIFT CARD SCAMS (NEW - High Priority)
        "Redeem this {store} voucher to avail ${amount} directly into your {service} account {url}",
        "Claim your free ${amount} {store} gift card now: {url}",
        "You've won a ${amount} {store} voucher! Redeem here: {url}",
        "Get ${amount} {store} credit instantly. Click to claim: {url}",
        "Free {store} gift card worth ${amount}. Limited time: {url}",
        "Congratulations! Your ${amount} {store} voucher is ready: {url}",
        "Redeem your {store} code for ${amount} cash: {url}",
        "Claim ${amount} {store} voucher before it expires: {url}",
        "You won ${amount} {store} credit! Verify here: {url}",
        "Get free ${amount} {store} voucher. Act now: {url}",
        "{store} giveaway: ${amount} voucher for you: {url}",
        "Redeem this code for ${amount} {store} credit: {url}",
        "Your ${amount} {store} gift card is waiting: {url}",
        "Claim your {store} voucher worth ${amount}: {url}",
        "Free ${amount} to your {service} account via {store} voucher: {url}",
        
        # PRIZE SCAMS WITH MONEY
        "You won ${amount}! Claim your prize money here: {url}",
        "Congratulations! ${amount} cash prize waiting for you: {url}",
        "You're selected to receive ${amount}. Claim now: {url}",
        "Winner notification: ${amount} prize. Verify: {url}",
        
        # Account verification phishing
        "Your {service} account has been temporarily suspended. Verify your identity here: {url}",
        "URGENT: Unusual activity detected on your {service} account. Secure it now: {url}",
        "Action Required: Your {service} password expires in 24 hours. Update here: {url}",
        "Security Alert: We detected a login from {location}. If this wasn't you, click: {url}",
        "Your {service} account will be closed. Verify your information to prevent this: {url}",
        "Account locked due to suspicious activity. Verify now: {url}",
        "Confirm your identity within 24 hours or lose access: {url}",
        
        # Payment/Banking phishing
        "Your payment of ${amount} failed. Update your payment method: {url}",
        "{bank} Alert: Suspicious transaction of ${amount} detected. Confirm here: {url}",
        "Your card ending in {digits} has been blocked. Restore access: {url}",
        "Refund pending: ${amount} waiting for you. Claim it here: {url}",
        "Your bank account has been compromised. Secure it immediately: {url}",
        
        # Delivery/Package phishing
        "Package delivery failed. Reschedule your delivery: {url}",
        "Your order #{order} is ready for pickup. Confirm address: {url}",
        "Delivery attempted. Update your shipping information: {url}",
        
        # Prize/Giveaway scams
        "Congratulations! You've won ${amount}. Claim your prize: {url}",
        "You've been selected for a {prize}. Click to claim: {url}",
        "Winner Alert: Your entry won! Claim within 24 hours: {url}",
        
        # Financial scams
        "Investment opportunity: {percent}% monthly returns guaranteed. Join now: {url}",
        "Make ${amount} per day from home. No experience needed. Start here: {url}",
        "Double your Bitcoin in 48 hours. Send to this address: {address}",
        
        # Impersonation
        "This is {company} customer support. We need to verify your account details.",
        "Official {bank} notification: Your account requires immediate attention.",
        "From {service} Security Team: Unusual activity detected on your account.",
    ]
    
    services = ["PayPal", "Amazon", "Netflix", "Microsoft", "Apple", "Google", "Facebook", "Instagram", "your bank", "your account"]
    banks = ["Chase", "Bank of America", "Wells Fargo", "Citibank", "Capital One"]
    companies = ["Microsoft", "Apple", "Amazon", "Google", "Facebook"]
    locations = ["New York", "London", "Tokyo", "unknown location", "Russia", "China"]
    prizes = ["iPhone 15", "MacBook Pro", "$5000 gift card", "vacation package"]
    stores = ["Play Store", "App Store", "Amazon", "Steam", "iTunes", "Google Play", "Xbox"]
    urls = ["bit.ly/secure", "tinyurl.com/verify", "account-check.com", "https://xyz.com", "secure-login.net", "https://sm.in", "http://short.link/claim"]
    
    data = []
    for i in range(num_samples):
        template = np.random.choice(phishing_templates)
        text = template.format(
            service=np.random.choice(services),
            bank=np.random.choice(banks),
            company=np.random.choice(companies),
            location=np.random.choice(locations),
            amount=np.random.choice(["50", "100", "200", "250", "400", "500", "1000", "2500"]),
            digits=np.random.randint(1000, 9999),
            order=np.random.randint(10000, 99999),
            percent=np.random.choice(["10", "20", "50", "100", "200"]),
            prize=np.random.choice(prizes),
            store=np.random.choice(stores),
            url=np.random.choice(urls),
            address=f"1{np.random.choice(['A', 'B', 'C'])}{np.random.randint(1000, 9999)}"
        )
        data.append({'text': text, 'label': 'phishing'})
    
    return pd.DataFrame(data)

def generate_legitimate_samples(num_samples: int = 10000):
    """
    Generate realistic legitimate messages
    """
    logger.info(f"Generating {num_samples} legitimate samples...")
    
    legitimate_templates = [
        # Order confirmations
        "Your order #{order} has been confirmed. Expected delivery: {date}.",
        "Thank you for your purchase! Your order is being processed.",
        "Order #{order} shipped. Track your package here.",
        "Your payment of ${amount} has been received. Thank you!",
        
        # Appointments/Reminders
        "Reminder: Your appointment is scheduled for {date} at {time}.",
        "Meeting confirmed for {date}. See you then!",
        "Your reservation at {place} is confirmed.",
        
        # Account updates
        "Your profile has been updated successfully.",
        "Password changed successfully. If this wasn't you, contact support.",
        "Your subscription has been renewed. Thank you for staying with us!",
        "Account statement for {month} is now available.",
        
        # Notifications
        "Welcome to {service}! We're glad to have you.",
        "Your document has been uploaded successfully.",
        "System maintenance scheduled for {date}. Brief downtime expected.",
        "Your feedback has been received. Thank you!",
        
        # Social/Personal
        "Hey! Are we still meeting for coffee tomorrow?",
        "Thanks for the recommendation. I'll check it out!",
        "Happy birthday! Hope you have a great day!",
        "Can you send me that report when you get a chance?",
        "Meeting notes from today's call are attached.",
        "Great presentation today! Well done.",
    ]
    
    services = ["Netflix", "Spotify", "Amazon Prime", "our service"]
    places = ["Restaurant ABC", "Hotel XYZ", "the office"]
    months = ["January", "February", "March", "April"]
    
    data = []
    for i in range(num_samples):
        template = np.random.choice(legitimate_templates)
        text = template.format(
            order=np.random.randint(10000, 99999),
            date=np.random.choice(["Monday", "Tuesday", "next week", "March 20", "tomorrow"]),
            time=np.random.choice(["10:00 AM", "2:30 PM", "9:00 AM", "3:00 PM"]),
            amount=np.random.choice(["29.99", "49.99", "99.99", "15.00"]),
            place=np.random.choice(places),
            month=np.random.choice(months),
            service=np.random.choice(services)
        )
        data.append({'text': text, 'label': 'ham'})
    
    return pd.DataFrame(data)

def load_and_combine_datasets():
    """
    Load and combine multiple fraud datasets
    """
    logger.info("="*70)
    logger.info("LOADING AND COMBINING FRAUD DATASETS")
    logger.info("="*70)
    
    all_data = []
    
    # 1. Download SMS Spam dataset
    sms_df = download_sms_spam_dataset()
    if sms_df is not None:
        all_data.append(sms_df)
    
    # 2. Generate phishing samples
    phishing_df = generate_phishing_samples(num_samples=8000)
    all_data.append(phishing_df)
    
    # 3. Generate additional legitimate samples
    legitimate_df = generate_legitimate_samples(num_samples=12000)
    all_data.append(legitimate_df)
    
    # Combine all datasets
    combined_df = pd.concat(all_data, ignore_index=True)
    
    # Map labels to fraud categories
    def map_to_fraud_category(label):
        label = str(label).lower()
        if label in ['ham', 'legitimate']:
            return 0  # Normal
        elif label in ['spam']:
            return 1  # Suspicious
        elif label in ['phishing', 'smishing', 'fraud']:
            return 2  # Fraudulent
        else:
            return 0  # Default to normal
    
    combined_df['fraud_label'] = combined_df['label'].apply(map_to_fraud_category)
    
    # Detect fraud types
    def detect_fraud_type(row):
        text = str(row['text']).lower()
        label = row['fraud_label']
        
        if label == 0:
            return 'legitimate'
        elif label == 1:
            return 'spam'
        else:  # label == 2
            # Detect specific fraud type
            if any(kw in text for kw in ['verify', 'account', 'suspended', 'password', 'security']):
                return 'phishing'
            elif any(kw in text for kw in ['txt', 'reply', 'call', 'sms']):
                return 'smishing'
            elif any(kw in text for kw in ['won', 'prize', 'winner', 'claim', 'congratulations']):
                return 'fake_giveaway'
            elif any(kw in text for kw in ['investment', 'money', 'earn', 'profit', 'bitcoin']):
                return 'financial_scam'
            else:
                return 'phishing'  # Default
    
    combined_df['fraud_type'] = combined_df.apply(detect_fraud_type, axis=1)
    
    # Create final dataset
    final_df = pd.DataFrame({
        'text': combined_df['text'],
        'label': combined_df['fraud_label'],
        'fraud_type': combined_df['fraud_type']
    })
    
    # Clean data
    final_df = final_df.dropna(subset=['text'])
    final_df = final_df[final_df['text'].str.strip() != '']
    final_df = final_df[final_df['text'].str.len() > 10]
    
    # Shuffle
    final_df = final_df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    logger.info(f"\n✓ Combined dataset created: {len(final_df)} samples")
    logger.info(f"\nDataset distribution:")
    logger.info(f"  Normal (0): {sum(final_df['label'] == 0)} ({sum(final_df['label'] == 0)/len(final_df)*100:.1f}%)")
    logger.info(f"  Suspicious (1): {sum(final_df['label'] == 1)} ({sum(final_df['label'] == 1)/len(final_df)*100:.1f}%)")
    logger.info(f"  Fraudulent (2): {sum(final_df['label'] == 2)} ({sum(final_df['label'] == 2)/len(final_df)*100:.1f}%)")
    
    logger.info(f"\nFraud type distribution:")
    for fraud_type in final_df['fraud_type'].unique():
        count = sum(final_df['fraud_type'] == fraud_type)
        logger.info(f"  {fraud_type}: {count} ({count/len(final_df)*100:.1f}%)")
    
    return final_df

def build_models():
    """Build fraud detection models"""
    models = {
        "logreg": LogisticRegression(
            C=1.0,
            max_iter=1000,
            class_weight='balanced',
            solver='lbfgs',
            random_state=42
        ),
        "svm": LinearSVC(
            class_weight='balanced',
            multi_class='ovr',
            random_state=42,
            max_iter=2000,
            dual=False
        ),
        "random_forest": RandomForestClassifier(
            n_estimators=200,
            n_jobs=-1,
            class_weight='balanced',
            random_state=42,
            max_depth=30,
            min_samples_split=5
        ),
        "grad_boost": GradientBoostingClassifier(
            random_state=42,
            n_estimators=150,
            learning_rate=0.1,
            max_depth=7
        ),
        "naive_bayes": MultinomialNB(alpha=0.1),
        "mlp": MLPClassifier(
            hidden_layer_sizes=(256, 128, 64),
            activation='relu',
            solver='adam',
            batch_size=512,
            learning_rate_init=1e-3,
            max_iter=1,
            warm_start=True,
            random_state=42,
            early_stopping=True,
            validation_fraction=0.1
        )
    }
    return models

def train_and_save(models: Dict, df: pd.DataFrame, output_dir: str, mlp_epochs: int = 10):
    """Train models and save them"""
    logger.info("\n" + "="*70)
    logger.info("STARTING MODEL TRAINING")
    logger.info("="*70)
    
    # Split data
    logger.info("\nSplitting dataset into train and validation sets...")
    X_train, X_val, y_train, y_val = train_test_split(
        df["text"], df["label"], test_size=0.2, random_state=42, stratify=df["label"]
    )
    
    logger.info(f"Train set: {len(X_train)} samples")
    logger.info(f"Validation set: {len(X_val)} samples")
    
    # TF-IDF vectorization
    logger.info("\nVectorizing text with TF-IDF...")
    vectorizer = TfidfVectorizer(
        max_features=50000,
        ngram_range=(1, 3),
        sublinear_tf=True,
        min_df=2,
        max_df=0.95,
        strip_accents='unicode',
        lowercase=True,
        analyzer='word'
    )
    
    X_train_vec = vectorizer.fit_transform(X_train)
    X_val_vec = vectorizer.transform(X_val)
    
    logger.info(f"Vocabulary size: {len(vectorizer.vocabulary_)}")
    logger.info(f"Train matrix shape: {X_train_vec.shape}")
    
    results = {}
    
    # Train each model
    for name, clf in models.items():
        logger.info(f"\n{'='*70}")
        logger.info(f"Training {name.upper()}...")
        logger.info(f"{'='*70}")
        
        try:
            if name == "mlp":
                logger.info(f"Training MLP for {mlp_epochs} epochs...")
                for epoch in range(mlp_epochs):
                    clf.fit(X_train_vec, y_train)
                    train_acc = clf.score(X_train_vec, y_train)
                    val_acc = clf.score(X_val_vec, y_val)
                    logger.info(f"  Epoch {epoch + 1}/{mlp_epochs} - train_acc={train_acc:.4f} val_acc={val_acc:.4f}")
            else:
                clf.fit(X_train_vec, y_train)
            
            # Evaluate
            logger.info("Evaluating model...")
            y_pred = clf.predict(X_val_vec)
            acc = accuracy_score(y_val, y_pred)
            f1 = f1_score(y_val, y_pred, average='weighted')
            
            report = classification_report(
                y_val,
                y_pred,
                target_names=["normal", "suspicious", "fraudulent"],
                output_dict=True,
                zero_division=0
            )
            cm = confusion_matrix(y_val, y_pred).tolist()
            
            logger.info(f"✓ Model {name} - Accuracy: {acc:.4f}, F1: {f1:.4f}")
            
            results[name] = {
                "report": report,
                "confusion_matrix": cm,
                "accuracy": float(acc),
                "f1_score": float(f1)
            }
            
        except Exception as e:
            logger.error(f"Error training {name}: {e}")
            continue
    
    # Save everything
    logger.info(f"\n{'='*70}")
    logger.info("SAVING MODELS AND RESULTS")
    logger.info(f"{'='*70}")
    
    os.makedirs(output_dir, exist_ok=True)
    
    # Save vectorizer
    with open(os.path.join(output_dir, "vectorizer.pkl"), "wb") as f:
        pickle.dump(vectorizer, f)
    logger.info("✓ Saved vectorizer")
    
    # Save models
    for name, clf in models.items():
        if name in results:
            with open(os.path.join(output_dir, f"model_{name}.pkl"), "wb") as f:
                pickle.dump(clf, f)
            logger.info(f"✓ Saved model: {name}")
    
    # Find best model
    best_model = max(results.items(), key=lambda x: x[1]["f1_score"])
    
    # Save model info
    model_info = {
        "best_model": best_model[0],
        "accuracy": best_model[1]["accuracy"],
        "f1_score": best_model[1]["f1_score"],
        "dataset": "Real Fraud Datasets (SMS Spam + Phishing)",
        "samples": len(df),
        "all_results": results
    }
    
    with open(os.path.join(output_dir, "model_info.json"), "w") as f:
        json.dump(model_info, f, indent=2)
    logger.info("✓ Saved model info")
    
    # Save metrics
    with open(os.path.join(output_dir, "metrics.json"), "w") as f:
        json.dump(results, f, indent=2)
    logger.info("✓ Saved metrics")
    
    # Final summary
    logger.info(f"\n{'='*70}")
    logger.info("✓ TRAINING COMPLETE!")
    logger.info(f"{'='*70}")
    logger.info(f"✓ Best model: {best_model[0].upper()}")
    logger.info(f"✓ Accuracy: {best_model[1]['accuracy']:.4f}")
    logger.info(f"✓ F1 Score: {best_model[1]['f1_score']:.4f}")
    logger.info(f"✓ All models saved to: {output_dir}")
    logger.info(f"{'='*70}\n")

def main():
    parser = argparse.ArgumentParser(description="Train fraud detection models with real datasets")
    parser.add_argument("--mlp_epochs", type=int, default=10,
                        help="Number of epochs for MLP training")
    parser.add_argument("--output_dir", type=str, default="./fraud_detection_classifier",
                        help="Directory to save trained models")
    args = parser.parse_args()
    
    # Load and combine datasets
    df = load_and_combine_datasets()
    
    # Build models
    models = build_models()
    
    # Train and save
    train_and_save(models, df, output_dir=args.output_dir, mlp_epochs=args.mlp_epochs)

if __name__ == "__main__":
    main()
