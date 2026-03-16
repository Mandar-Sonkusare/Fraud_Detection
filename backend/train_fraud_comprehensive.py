#!/usr/bin/env python3
"""
Train fraud detection models using comprehensive synthetic fraud dataset.
Generates realistic fraud patterns across multiple categories.
"""

import os
import json
import pickle
import logging
import argparse
import pandas as pd
import numpy as np
from typing import Dict, List

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

def generate_comprehensive_fraud_dataset(num_samples: int = 100000):
    """
    Generate comprehensive fraud detection dataset with realistic patterns.
    
    Categories:
    - Normal (50%): Legitimate messages
    - Suspicious (20%): Spam, mild phishing
    - Fraudulent (30%): Phishing, smishing, financial scams, fake giveaways
    """
    logger.info(f"Generating comprehensive fraud dataset with {num_samples} samples...")
    
    texts = []
    labels = []
    fraud_types = []
    
    # Calculate distribution
    num_normal = int(num_samples * 0.50)
    num_suspicious = int(num_samples * 0.20)
    num_fraudulent = num_samples - num_normal - num_suspicious
    
    # === NORMAL MESSAGES (50%) ===
    normal_templates = [
        "Thanks for your order! Your package will arrive in 3-5 business days.",
        "Your appointment is confirmed for {date} at {time}. See you then!",
        "Welcome to our service! We're glad to have you.",
        "Your subscription has been renewed successfully. Thank you!",
        "Meeting reminder: Team sync tomorrow at {time}.",
        "Your payment of ${amount} has been processed successfully.",
        "Thank you for contacting us. A representative will respond within 24 hours.",
        "Your account statement for {month} is now available.",
        "Delivery update: Your package is out for delivery today.",
        "Your reservation at {place} is confirmed for {date}.",
        "Newsletter: Check out our latest updates and features.",
        "Your feedback has been received. Thank you for helping us improve!",
        "Reminder: Your membership expires on {date}. Renew anytime.",
        "Your document has been successfully uploaded.",
        "System maintenance scheduled for {date}. Services may be briefly unavailable.",
        "Your profile has been updated successfully.",
        "Thank you for your purchase! Receipt attached.",
        "Your request has been submitted and is being processed.",
        "Welcome back! It's been a while since your last visit.",
        "Your order #{number} has been shipped. Track it here: [link]",
    ]
    
    for i in range(num_normal):
        template = np.random.choice(normal_templates)
        text = template.format(
            date=np.random.choice(["Monday", "Tuesday", "next week", "March 20"]),
            time=np.random.choice(["10:00 AM", "2:30 PM", "9:00 AM"]),
            amount=np.random.choice(["29.99", "49.99", "99.99", "15.00"]),
            month=np.random.choice(["January", "February", "March"]),
            place=np.random.choice(["Restaurant ABC", "Hotel XYZ", "Spa Center"]),
            number=np.random.randint(1000, 9999)
        )
        texts.append(text)
        labels.append(0)  # Normal
        fraud_types.append('legitimate')
    
    # === SUSPICIOUS MESSAGES (20%) - Spam ===
    spam_templates = [
        "SALE! Up to 70% off everything! Limited time only. Shop now!",
        "You've been selected for a special offer. Click here to claim.",
        "Congratulations! You may be eligible for a discount. Learn more.",
        "Hot deals this week! Don't miss out on amazing savings.",
        "Subscribe to our newsletter for exclusive offers and updates.",
        "Try our new product risk-free for 30 days. Order now!",
        "Flash sale ending soon! Grab your favorites before they're gone.",
        "Join thousands of satisfied customers. Sign up today!",
        "Limited stock available. Order now while supplies last!",
        "Special promotion just for you! Check out our latest deals.",
        "Earn rewards with every purchase. Join our loyalty program!",
        "New arrivals just in! Browse our latest collection.",
        "Don't miss this opportunity! Offer expires soon.",
        "Get notified about our best deals. Subscribe now!",
        "Clearance sale! Everything must go. Shop the sale now!",
    ]
    
    for i in range(num_suspicious):
        template = np.random.choice(spam_templates)
        texts.append(template)
        labels.append(1)  # Suspicious
        fraud_types.append('spam')
    
    # === FRAUDULENT MESSAGES (30%) ===
    # Split fraudulent into subcategories
    num_phishing = int(num_fraudulent * 0.40)  # 40% phishing
    num_smishing = int(num_fraudulent * 0.20)  # 20% smishing
    num_financial = int(num_fraudulent * 0.25)  # 25% financial scams
    num_giveaway = num_fraudulent - num_phishing - num_smishing - num_financial  # 15% fake giveaways
    
    # PHISHING (Email-style)
    phishing_templates = [
        "URGENT: Your {service} account has been suspended. Verify your identity immediately: {link}",
        "Security Alert: Unusual activity detected on your account. Click here to secure it: {link}",
        "Action Required: Your {service} password will expire in 24 hours. Update now: {link}",
        "Your account has been locked due to suspicious activity. Restore access: {link}",
        "Important: Confirm your email address to continue using {service}: {link}",
        "We detected an unauthorized login attempt. Secure your account now: {link}",
        "Your payment method needs verification. Update your information: {link}",
        "Account Verification Required: Click here to verify your {service} account: {link}",
        "Your {service} account will be closed unless you verify your information: {link}",
        "Security Notice: Update your security settings immediately: {link}",
        "Suspicious transaction detected. Confirm this was you: {link}",
        "Your account has been compromised. Reset your password now: {link}",
        "Verify your identity to prevent account suspension: {link}",
        "Important security update required for your {service} account: {link}",
        "Your account access has been limited. Restore full access: {link}",
    ]
    
    for i in range(num_phishing):
        template = np.random.choice(phishing_templates)
        text = template.format(
            service=np.random.choice(["PayPal", "Amazon", "Netflix", "Microsoft", "Apple", "Google", "Bank"]),
            link=np.random.choice(["bit.ly/secure", "tinyurl.com/verify", "secure-login.com", "account-verify.net"])
        )
        texts.append(text)
        labels.append(2)  # Fraudulent
        fraud_types.append('phishing')
    
    # SMISHING (SMS-style)
    smishing_templates = [
        "Your package delivery failed. Reschedule here: {link} Reply STOP to opt out",
        "{bank} Alert: Suspicious charge of ${amount}. If not you, reply YES or call {phone}",
        "Your {service} account has been locked. Text UNLOCK to {phone} to restore access",
        "URGENT: Your card ending in {digits} has been blocked. Call {phone} immediately",
        "You have a pending refund of ${amount}. Claim it here: {link}",
        "Your {bank} account requires verification. Reply with your PIN or call {phone}",
        "Package delivery attempted. Confirm address: {link} or call {phone}",
        "Your account will be closed. Text VERIFY to {phone} to prevent this",
        "Security alert from {bank}. Unusual activity detected. Call {phone} now",
        "Your payment of ${amount} failed. Update payment method: {link}",
    ]
    
    for i in range(num_smishing):
        template = np.random.choice(smishing_templates)
        text = template.format(
            bank=np.random.choice(["Chase", "Bank of America", "Wells Fargo", "Citibank"]),
            service=np.random.choice(["PayPal", "Venmo", "Cash App", "Zelle"]),
            amount=np.random.choice(["500", "1000", "250", "750"]),
            phone=np.random.choice(["1-800-555-0100", "1-888-555-0200", "1-877-555-0300"]),
            digits=np.random.randint(1000, 9999),
            link=np.random.choice(["bit.ly/pkg", "track-package.com", "delivery-update.net"])
        )
        texts.append(text)
        labels.append(2)  # Fraudulent
        fraud_types.append('smishing')
    
    # FINANCIAL SCAMS
    financial_templates = [
        "Investment opportunity: Turn ${amount} into ${amount2} in just {days} days. Guaranteed returns!",
        "Make ${amount} per day working from home. No experience needed. Start now!",
        "Exclusive crypto investment: {percent}% monthly returns. Limited spots available!",
        "Double your Bitcoin in 24 hours. Send to this address and receive 2x back guaranteed!",
        "Forex trading signals with {percent}% accuracy. Join {number} successful traders!",
        "Get rich quick! Our system generates ${amount} daily on autopilot. Join now!",
        "Binary options trading: ${amount} minimum investment, ${amount2} potential profit!",
        "Passive income opportunity: Earn ${amount} monthly with zero effort required!",
        "MLM opportunity: Be your own boss. Unlimited earning potential. Join our team!",
        "Cryptocurrency mining: Invest ${amount}, earn ${amount2} monthly. Risk-free!",
        "Stock market secret: Turn ${amount} into ${amount2} using our proven method!",
        "Real estate investment: {percent}% annual returns guaranteed. Invest today!",
        "Online casino system: Win ${amount} daily using our foolproof strategy!",
        "Day trading course: Make ${amount} per day. {number} students already profiting!",
        "Pyramid scheme disguised as business: Recruit {number} people, earn ${amount}!",
    ]
    
    for i in range(num_financial):
        template = np.random.choice(financial_templates)
        text = template.format(
            amount=np.random.choice(["100", "500", "1000", "250"]),
            amount2=np.random.choice(["5000", "10000", "50000", "100000"]),
            days=np.random.choice(["7", "14", "30", "60"]),
            percent=np.random.choice(["200", "500", "1000", "95", "99"]),
            number=np.random.choice(["1000", "5000", "10000", "50000"])
        )
        texts.append(text)
        labels.append(2)  # Fraudulent
        fraud_types.append('financial_scam')
    
    # FAKE GIVEAWAYS
    giveaway_templates = [
        "Congratulations! You've won a ${amount} {prize}! Claim your prize here: {link}",
        "You've been selected as our {number}th visitor! Click to claim your FREE {prize}!",
        "WINNER ALERT: You won {prize} worth ${amount}! Claim now: {link}",
        "Lottery Winner: Your ticket won ${amount}! Verify your identity to claim: {link}",
        "FREE {prize} Giveaway! You're a winner! Just pay ${shipping} shipping: {link}",
        "Congratulations! You won our {prize} contest! Claim within 24 hours: {link}",
        "You've inherited ${amount} from a distant relative. Claim here: {link}",
        "Prize notification: You won {prize}! Pay ${fee} processing fee to claim: {link}",
        "Lucky winner! Get your FREE {prize} now! Limited time offer: {link}",
        "You've been chosen for a {prize} giveaway! Click to claim: {link}",
        "CONGRATULATIONS! You won ${amount} cash prize! Verify to receive: {link}",
        "Winner selected: You get a FREE {prize}! Just cover ${shipping} shipping: {link}",
        "Your entry won! Claim your {prize} worth ${amount} now: {link}",
        "Prize Alert: You won our sweepstakes! {prize} is yours! Claim: {link}",
        "You're today's lucky winner! FREE {prize}! Click here: {link}",
    ]
    
    for i in range(num_giveaway):
        template = np.random.choice(giveaway_templates)
        text = template.format(
            amount=np.random.choice(["1000", "5000", "10000", "50000", "100000"]),
            prize=np.random.choice(["iPhone 15", "MacBook Pro", "iPad", "gift card", "vacation package", "car"]),
            link=np.random.choice(["claim-prize.com", "winner-alert.net", "free-gift.org"]),
            number=np.random.choice(["100", "1000", "10000", "1000000"]),
            shipping=np.random.choice(["9.99", "19.99", "29.99"]),
            fee=np.random.choice(["50", "100", "200"])
        )
        texts.append(text)
        labels.append(2)  # Fraudulent
        fraud_types.append('fake_giveaway')
    
    # Shuffle dataset
    indices = np.random.permutation(len(texts))
    texts = [texts[i] for i in indices]
    labels = [labels[i] for i in indices]
    fraud_types = [fraud_types[i] for i in indices]
    
    df = pd.DataFrame({
        'text': texts,
        'label': labels,
        'fraud_type': fraud_types
    })
    
    logger.info(f"\nDataset distribution:")
    logger.info(f"  Normal (0): {sum(df['label'] == 0)} ({sum(df['label'] == 0)/len(df)*100:.1f}%)")
    logger.info(f"  Suspicious (1): {sum(df['label'] == 1)} ({sum(df['label'] == 1)/len(df)*100:.1f}%)")
    logger.info(f"  Fraudulent (2): {sum(df['label'] == 2)} ({sum(df['label'] == 2)/len(df)*100:.1f}%)")
    
    logger.info(f"\nFraud type distribution:")
    for fraud_type in df['fraud_type'].unique():
        count = sum(df['fraud_type'] == fraud_type)
        logger.info(f"  {fraud_type}: {count} ({count/len(df)*100:.1f}%)")
    
    return df

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
        "dataset": "Comprehensive Synthetic Fraud Dataset",
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
    parser = argparse.ArgumentParser(description="Train fraud detection models with comprehensive synthetic dataset")
    parser.add_argument("--num_samples", type=int, default=100000,
                        help="Number of samples to generate")
    parser.add_argument("--mlp_epochs", type=int, default=10,
                        help="Number of epochs for MLP training")
    parser.add_argument("--output_dir", type=str, default="./fraud_detection_classifier",
                        help="Directory to save trained models")
    args = parser.parse_args()
    
    # Generate dataset
    df = generate_comprehensive_fraud_dataset(num_samples=args.num_samples)
    
    # Build models
    models = build_models()
    
    # Train and save
    train_and_save(models, df, output_dir=args.output_dir, mlp_epochs=args.mlp_epochs)

if __name__ == "__main__":
    main()
