#!/usr/bin/env python3
"""
Fine-tune DistilBERT for fraud/scam detection.
Uses real SMS spam dataset + augmented scam examples.
Labels: 0=normal, 1=suspicious, 2=fraudulent
"""

import os, json, torch, time
import pandas as pd
import numpy as np
from torch.utils.data import Dataset, DataLoader
from transformers import (
    DistilBertTokenizerFast,
    DistilBertForSequenceClassification,
    get_linear_schedule_with_warmup
)
from torch.optim import AdamW
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, f1_score
from tqdm import tqdm

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Device: {DEVICE}")
print("="*70)

# ─────────────────────────────────────────────
# 1. BUILD DATASET
# ─────────────────────────────────────────────
print("Loading SMS Spam Collection dataset...")
url = "https://raw.githubusercontent.com/mohitgupta-omg/Kaggle-SMS-Spam-Collection-Dataset-/master/spam.csv"
df = pd.read_csv(url, encoding='latin-1')[['v1','v2']]
df.columns = ['split_label', 'text']

# ham=0 (normal), spam=2 (fraudulent) initially
df['label'] = df['split_label'].map({'ham': 0, 'spam': 2})
print(f"  Loaded {len(df)} SMS messages  (ham={sum(df['label']==0)}, spam={sum(df['label']==2)})")

# ─────────────────────────────────────────────
# 2. AUGMENT WITH DIVERSE SCAM EXAMPLES
#    These cover patterns NOT in the SMS dataset
#    (crypto scams, IRS, romance, tech support)
# ─────────────────────────────────────────────
print("Adding augmented scam examples...")

FRAUDULENT_EXTRA = [
    # Crypto scams – various celebrities & coins
    "BREAKING: Elon Musk is giving away 5000 BTC! Send 0.1 BTC to wallet 1A1zP1eP5QGefi2DMPTfTL and receive 2 BTC back instantly!",
    "Bill Gates Bitcoin giveaway! Send 0.5 BTC to bc1qxy2kgdygjrsqtzq2n0yrf and get 5 BTC back. Hurry!",
    "Taylor Swift ETH giveaway! Send 0.2 ETH to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb and receive 10 ETH!",
    "Snoop Dogg DOGE giveaway! Send 5000 DOGE to DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L and receive 50000 DOGE!",
    "Jeff Bezos crypto event! Send any amount of BTC to wallet 3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy and get 3x back!",
    "OFFICIAL: Warren Buffett is doubling all crypto! Send ETH to 0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B now!",
    "Mark Zuckerberg BTC giveaway! Send 1 BTC to wallet 1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2 get 10 BTC back!",
    "Crypto giveaway! Send 0.1 ETH to 0x1234567890abcdef and receive 1 ETH back. Limited time offer!",
    "URGENT: Crypto airdrop! Send 100 USDT to wallet address and receive 1000 USDT back instantly!",
    "Bitcoin doubler! Send any BTC amount to 1BoatSLRHtKNngkdXEeobR76b53LETtpyT and get 2x back!",

    # IRS / government scams
    "FINAL WARNING from IRS: You owe $5000 in back taxes. Call 1-800-555-0199 immediately or face arrest within 24 hours.",
    "IRS NOTICE: Your SSN has been suspended due to suspicious activity. Call 1-877-555-0188 now.",
    "Treasury Department: Your tax ID flagged for fraud. You owe $8500 in penalties. Call 1-888-555-0123 or face prosecution.",
    "Social Security Administration: Your SSN is suspended. Call 1-800-555-0177 immediately to avoid legal action.",
    "FBI ALERT: Your bank account is under investigation. Call 1-877-555-0199 to clear your name immediately.",
    "FINAL NOTICE: IRS has issued a warrant for your arrest. Pay $3200 now to avoid prosecution. Call 1-800-555-0155.",

    # Credential theft / phishing
    "URGENT: Your Chase bank account has been suspended. Verify your SSN immediately: bit.ly/chase-verify",
    "Security Alert: Provide your social security number to restore access: tinyurl.com/restore-access",
    "Your Bank of America account will be closed. Confirm your credit card number and CVV: bit.ly/boa-confirm",
    "Wells Fargo: Unauthorized transaction detected. Enter your PIN and routing number: secure-wf.tk/verify",
    "PayPal Security: Your account needs verification. Provide your password here: bit.ly/paypal-secure",
    "Netflix: Your payment failed. Update your credit card details now: tinyurl.com/netflix-update",
    "Amazon: Suspicious login detected. Verify your account by entering your password: bit.ly/amz-verify",

    # Romance / inheritance scams
    "Hello dear, I am Princess Amara from Dubai. My father left me $45 million but I need help transferring it. I will give you 30% if you provide your bank account details.",
    "My name is Dr. Sarah Williams from London. My late husband left $15 million in a Nigerian bank. I need a trustworthy person. You get 40%. Send your bank details.",
    "I am a US soldier in Syria. I found $25 million and need your help to transfer it. You will receive 35%. Please provide your account information urgently.",
    "Dear friend, I am barrister James Brown. My client died without a will leaving $80 million. You share the same surname. Send your bank details to claim.",

    # Tech support scams
    "MICROSOFT SECURITY ALERT: Your computer has been infected with Zeus Trojan. Call our certified technicians at 1-800-555-0199 NOW. Do not turn off your computer.",
    "Apple Support: Your iPhone has been compromised. Call 1-877-555-0188 immediately to prevent data loss.",
    "Google Security Warning: Your account has been hacked. Call 1-888-555-0123 for immediate assistance.",
    "VIRUS DETECTED on your device! Call Microsoft Support at 1-800-555-0177 immediately to remove the threat.",

    # Prize / lottery scams
    "CONGRATULATIONS! You have been selected as the winner of a brand new Tesla Model 3! Claim your prize: bit.ly/tesla-winner",
    "You won $50000 in the international lottery! Claim your prize before it expires: tinyurl.com/lottery-claim",
    "WINNER ALERT: You have been chosen to receive $25000 cash prize. Verify your identity: bit.ly/prize-verify",
    "Lucky winner! You have won an iPhone 15 Pro. Claim now before midnight: tinyurl.com/iphone-winner",
]

SUSPICIOUS_EXTRA = [
    "LIMITED STOCK! Only 3 items left. Order now to avoid disappointment. Free shipping today only!",
    "FLASH SALE: 90% OFF everything! Hurry, sale ends in 2 hours! Don't miss out!",
    "MEGA BLOWOUT SALE! 95% OFF! Only 2 hours left! Stock running out FAST! Order NOW!",
    "Last chance! Only 5 spots left in our exclusive program. Act now before it's too late!",
    "Want to earn $15000 per month working from home? Join our exclusive team! No experience needed!",
    "Be your own boss! Earn $10000 per week! Message me to learn more about this opportunity!",
    "Financial freedom is possible! Join our network and earn $5000 monthly passive income!",
    "You won't BELIEVE what happens next! Click here to find out the shocking truth!",
    "Doctors HATE this one simple trick! Discover the secret they don't want you to know!",
    "This will SHOCK you! Click to see what everyone is talking about right now!",
    "I found this investment platform that seems legit. Anyone tried it? Looks interesting.",
    "Has anyone heard of this trading app? Looks interesting but not sure if it's real.",
    "Got an email about winning something. Is this real? Seems too good to be true.",
    "Someone contacted me claiming to be from my bank. Should I respond to them?",
    "Your trial ends in 1 hour! Subscribe NOW to keep your premium features active!",
    "Special offer: 50% off if you act in the next 60 minutes! Don't miss this deal!",
]

NORMAL_EXTRA = [
    "Thanks for following! Looking forward to connecting with you.",
    "Great article about technology trends. Very informative read!",
    "Happy birthday! Hope you have an amazing day celebrating.",
    "Just finished reading an interesting book. Highly recommend it to everyone.",
    "Beautiful weather today. Perfect for a walk in the park with the family.",
    "Excited to announce my new project launching next month. Stay tuned!",
    "Grateful for all the support from my followers. Thank you so much!",
    "Weekend plans: spending quality time with family and friends.",
    "Your Amazon order #123456 has shipped! Expected delivery Monday. Track at amazon.com",
    "Reminder: Your dentist appointment with Dr. Johnson is tomorrow at 3 PM.",
    "Hi Sarah, following up on our meeting yesterday. I've attached the Q4 report.",
    "The project timeline looks good. Let's schedule a call next week to discuss.",
    "Just finished an amazing workout at the gym. Feeling energized and ready!",
    "New blog post is live! Check it out if you're interested in tech trends.",
    "Had a great meeting today. Productive discussions all around the table.",
    "Coffee and coding. Perfect way to start a Monday morning!",
    "Your Walmart order #789456 has been delivered to your front door.",
    "Meeting scheduled for tomorrow at 2 PM. See you then, looking forward to it.",
    "The weather forecast shows sunny skies this weekend. Great for outdoor activities.",
    "Congratulations on your promotion! Well deserved after all your hard work.",
]

# Build augmented dataframe
aug_rows = (
    [(t, 2) for t in FRAUDULENT_EXTRA] +
    [(t, 1) for t in SUSPICIOUS_EXTRA] +
    [(t, 0) for t in NORMAL_EXTRA]
)
aug_df = pd.DataFrame(aug_rows, columns=['text', 'label'])

# Reclassify some SMS spam as suspicious (borderline marketing)
suspicious_keywords = ['limited time','act now','hurry','expires','today only',
                       'last chance','free gift','win','prize','cash','discount']
fraud_keywords = ['password','ssn','bank account','credit card','cvv','verify','suspended']

new_labels = []
for _, row in df.iterrows():
    if row['label'] == 2:
        t = row['text'].lower()
        sus_score = sum(1 for k in suspicious_keywords if k in t)
        fraud_score = sum(1 for k in fraud_keywords if k in t)
        if sus_score >= 2 and fraud_score == 0:
            new_labels.append(1)
        else:
            new_labels.append(2)
    else:
        new_labels.append(row['label'])

df['label'] = new_labels

# Combine
final_df = pd.concat([df[['text','label']], aug_df], ignore_index=True)
final_df = final_df.sample(frac=1, random_state=42).reset_index(drop=True)

print(f"\nFinal dataset:")
print(f"  Normal (0):     {sum(final_df['label']==0)}")
print(f"  Suspicious (1): {sum(final_df['label']==1)}")
print(f"  Fraudulent (2): {sum(final_df['label']==2)}")
print(f"  Total:          {len(final_df)}")

# ─────────────────────────────────────────────
# 3. TOKENIZE
# ─────────────────────────────────────────────
print("\nLoading DistilBERT tokenizer...")
MODEL_NAME = "distilbert-base-uncased"
tokenizer = DistilBertTokenizerFast.from_pretrained(MODEL_NAME)

X_train, X_test, y_train, y_test = train_test_split(
    final_df['text'].tolist(), final_df['label'].tolist(),
    test_size=0.2, random_state=42, stratify=final_df['label']
)
print(f"Train: {len(X_train)}, Test: {len(X_test)}")

class FraudDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=128):
        self.encodings = tokenizer(texts, truncation=True, padding=True, max_length=max_len)
        self.labels = labels

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        item = {k: torch.tensor(v[idx]) for k, v in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item

train_dataset = FraudDataset(X_train, y_train, tokenizer)
test_dataset  = FraudDataset(X_test,  y_test,  tokenizer)

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
test_loader  = DataLoader(test_dataset,  batch_size=64, shuffle=False)

# ─────────────────────────────────────────────
# 4. FINE-TUNE DISTILBERT
# ─────────────────────────────────────────────
print("\nLoading DistilBERT model (3 classes)...")
model = DistilBertForSequenceClassification.from_pretrained(
    MODEL_NAME,
    num_labels=3,
    id2label={0: "normal", 1: "suspicious", 2: "fraudulent"},
    label2id={"normal": 0, "suspicious": 1, "fraudulent": 2}
)
model.to(DEVICE)

EPOCHS = 5
optimizer = AdamW(model.parameters(), lr=2e-5, weight_decay=0.01)
total_steps = len(train_loader) * EPOCHS
scheduler = get_linear_schedule_with_warmup(optimizer, num_warmup_steps=total_steps//10, num_training_steps=total_steps)

print(f"\nTraining for {EPOCHS} epochs on {DEVICE}...")
print("="*70)

best_f1 = 0
for epoch in range(EPOCHS):
    # Train
    model.train()
    total_loss = 0
    train_bar = tqdm(train_loader, desc=f"Epoch {epoch+1}/{EPOCHS} [Train]", unit="batch",
                     bar_format="{l_bar}{bar:30}{r_bar}")
    for batch in train_bar:
        optimizer.zero_grad()
        input_ids      = batch['input_ids'].to(DEVICE)
        attention_mask = batch['attention_mask'].to(DEVICE)
        labels         = batch['labels'].to(DEVICE)

        outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
        loss = outputs.loss
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
        scheduler.step()
        total_loss += loss.item()
        train_bar.set_postfix(loss=f"{loss.item():.4f}")

    avg_loss = total_loss / len(train_loader)

    # Evaluate
    model.eval()
    all_preds, all_labels = [], []
    eval_bar = tqdm(test_loader, desc=f"Epoch {epoch+1}/{EPOCHS} [Eval] ", unit="batch",
                    bar_format="{l_bar}{bar:30}{r_bar}")
    with torch.no_grad():
        for batch in eval_bar:
            input_ids      = batch['input_ids'].to(DEVICE)
            attention_mask = batch['attention_mask'].to(DEVICE)
            labels         = batch['labels'].to(DEVICE)
            outputs = model(input_ids=input_ids, attention_mask=attention_mask)
            preds = torch.argmax(outputs.logits, dim=1)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

    acc = accuracy_score(all_labels, all_preds)
    f1  = f1_score(all_labels, all_preds, average='weighted')
    print(f"\n  → Epoch {epoch+1} Summary | Loss: {avg_loss:.4f} | Acc: {acc:.4f} | F1: {f1:.4f}")

    if f1 > best_f1:
        best_f1 = f1
        model.save_pretrained("./bert_fraud_classifier")
        tokenizer.save_pretrained("./bert_fraud_classifier")
        print(f"  ✓ New best model saved (F1={f1:.4f})\n")

# ─────────────────────────────────────────────
# 5. FINAL EVALUATION
# ─────────────────────────────────────────────
print("\n" + "="*70)
print("FINAL EVALUATION")
print("="*70)
print(classification_report(all_labels, all_preds, target_names=['normal','suspicious','fraudulent']))

# Save model info
info = {
    "model_name": "distilbert-base-uncased (fine-tuned)",
    "best_f1": best_f1,
    "final_accuracy": accuracy_score(all_labels, all_preds),
    "dataset": {
        "total": len(final_df),
        "normal": int(sum(final_df['label']==0)),
        "suspicious": int(sum(final_df['label']==1)),
        "fraudulent": int(sum(final_df['label']==2)),
    }
}
with open("./bert_fraud_classifier/model_info.json", "w") as f:
    json.dump(info, f, indent=2)

print(f"\nBest F1: {best_f1:.4f}")
print("Model saved to ./bert_fraud_classifier")
print("="*70)
